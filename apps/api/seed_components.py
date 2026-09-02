"""
SolarPV Tensor — Component Seeder v2
Uses pvlib CEC database for both panels and inverters (real data, thousands of records).
Batteries use a curated list — no open database equivalent exists.
Safe to run multiple times — skips existing records.

Run: python seed_components.py
"""

import os
import sys
import math
import psycopg2
import pvlib
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(dotenv_path=Path(__file__).parent / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in .env")
    sys.exit(1)

try:
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    print("Connected.\n")
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)


def row_exists(table: str, manufacturer: str, model: str) -> bool:
    cur.execute(
        f"SELECT 1 FROM {table} WHERE manufacturer=%s AND model=%s LIMIT 1",
        (manufacturer, model)
    )
    return cur.fetchone() is not None


def table_count(table: str) -> int:
    cur.execute(f"SELECT COUNT(*) FROM {table}")
    return cur.fetchone()[0]


# ─────────────────────────────────────────────────────────────
# PANELS — pvlib CEC database
# Target: well-known manufacturers, 50W–600W, positive efficiency
# ─────────────────────────────────────────────────────────────
TARGET_PANEL_MANUFACTURERS = [
    "Canadian Solar", "SunPower", "LG", "Jinko Solar",
    "Trina Solar", "Hanwha Q CELLS", "Yingli", "Sharp",
    "Kyocera", "REC Group", "Panasonic", "Silfab",
    "LONGi", "JA Solar", "Risen Energy", "Astronergy",
    "Phono Solar", "Suntech", "Mission Solar", "Heliene",
]


def seed_panels(limit_per_manufacturer: int = 15):
    print("─── Solar Panels (pvlib CEC) ───────────────────")
    before = table_count("solar_panels")
    print(f"  Existing: {before}")

    try:
        cec = pvlib.pvsystem.retrieve_sam("CECMod")
    except Exception as e:
        print(f"  ERROR loading pvlib CEC modules: {e}")
        return

    inserted = skipped = failed = 0
    mfr_counts: dict = {}

    for model, row in cec.T.iterrows():
        raw_mfr = str(row.get("Manufacturer", ""))
        matched = next(
            (m for m in TARGET_PANEL_MANUFACTURERS
             if m.lower() in raw_mfr.lower()),
            None
        )
        if not matched:
            continue

        mfr_counts.setdefault(matched, 0)
        if mfr_counts[matched] >= limit_per_manufacturer:
            continue

        if row_exists("solar_panels", raw_mfr, str(model)):
            skipped += 1
            mfr_counts[matched] += 1
            continue

        try:
            pmax = float(row.get("STC") or 0)
            voc  = float(row.get("V_oc_ref") or 0)
            isc  = float(row.get("I_sc_ref") or 0)
            vmp  = float(row.get("V_mp_ref") or 0)
            imp  = float(row.get("I_mp_ref") or 0)
            area = float(row.get("A_c") or 0)
            tc   = float(row.get("alpha_sc") or 0)

            if pmax <= 0 or voc <= 0 or isc <= 0:
                failed += 1
                continue

            # Filter to realistic power range
            if not (50 <= pmax <= 700):
                failed += 1
                continue

            eff = round((pmax / (area * 1000)) * 100, 2) if area > 0 else 0
            if eff <= 0:
                failed += 1
                continue

            cur.execute("""
                INSERT INTO solar_panels
                  (manufacturer, model, pmax_w, voc_v, isc_a,
                   vmp_v, imp_a, efficiency_pct, temp_coeff_pmax)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """, (
                raw_mfr, str(model),
                round(pmax,2), round(voc,2), round(isc,2),
                round(vmp,2), round(imp,2), eff, round(tc,5)
            ))
            inserted += 1
            mfr_counts[matched] += 1

        except Exception:
            failed += 1
            conn.rollback()

    conn.commit()
    print(f"  Inserted: {inserted} | Skipped: {skipped} | Failed: {failed}")
    print(f"  Total now: {table_count('solar_panels')}\n")


# ─────────────────────────────────────────────────────────────
# INVERTERS — pvlib CEC inverter database
# This replaces the entire manual inverter list
# ─────────────────────────────────────────────────────────────
TARGET_INVERTER_MANUFACTURERS = [
    "Victron Energy", "SMA", "Fronius", "Growatt",
    "Huawei", "SolarEdge", "Schneider Electric",
    "Deye", "Goodwe", "SRNE", "Sungrow", "ABB",
    "Enphase", "Delta", "Ginlong",
]


def classify_inverter_type(name: str) -> str:
    """Infer inverter type from model name."""
    name_lower = name.lower()
    if any(w in name_lower for w in ["hybrid", "multi", "quattro", "xw", "spf"]):
        return "hybrid"
    if any(w in name_lower for w in ["island", "off", "phoenix", "sw ", "ml"]):
        return "off-grid"
    return "string"


def seed_inverters(limit_per_manufacturer: int = 15):
    print("─── Inverters (pvlib CEC) ──────────────────────")
    before = table_count("inverters")
    print(f"  Existing: {before}")

    try:
        # pvlib CEC inverter database — thousands of real models
        cec = pvlib.pvsystem.retrieve_sam("CECInverter")
    except Exception as e:
        print(f"  ERROR loading pvlib CEC inverters: {e}")
        return

    inserted = skipped = failed = 0
    mfr_counts: dict = {}

    for model, row in cec.T.iterrows():
        raw_name = str(model)

        # Identify manufacturer from model string
        matched = next(
            (m for m in TARGET_INVERTER_MANUFACTURERS
             if m.lower() in raw_name.lower()),
            None
        )
        if not matched:
            continue

        mfr_counts.setdefault(matched, 0)
        if mfr_counts[matched] >= limit_per_manufacturer:
            continue

        if row_exists("inverters", matched, raw_name):
            skipped += 1
            mfr_counts[matched] += 1
            continue

        try:
            # pvlib CEC inverter fields
            paco   = float(row.get("Paco") or 0)    # AC output power W
            pdco   = float(row.get("Pdco") or 0)    # DC input power W
            vdco   = float(row.get("Vdco") or 0)    # DC input voltage
            vac    = float(row.get("Vac") or 0)     # AC output voltage

            if paco <= 0 or vdco <= 0:
                failed += 1
                continue

            # Filter to realistic single-phase residential/commercial range
            if not (500 <= paco <= 15000):
                failed += 1
                continue

            # Derive efficiency from AC/DC power ratio
            efficiency = round((paco / pdco) * 100, 1) if pdco > 0 else 94.0
            if not (70 <= efficiency <= 99.5):
                efficiency = 94.0

            # Derive voltage range — CEC doesn't always provide min/max directly
            mppt_low = float(row.get("Mppt_low") or vdco * 0.7)
            mppt_high = float(row.get("Mppt_high") or vdco * 1.3)

            # AC voltage — default to 220 for African market if not 120/240
            output_v = 220 if vac not in (120, 240) else int(vac)

            inv_type = classify_inverter_type(raw_name)

            cur.execute("""
                INSERT INTO inverters
                  (manufacturer, model, power_rating_w, efficiency_pct,
                   min_input_v, max_input_v, output_voltage_v, inverter_type)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
            """, (
                matched, raw_name,
                round(paco, 0), efficiency,
                round(mppt_low, 1), round(mppt_high, 1),
                output_v, inv_type
            ))
            inserted += 1
            mfr_counts[matched] += 1

        except Exception as e:
            failed += 1
            conn.rollback()

    conn.commit()
    print(f"  Inserted: {inserted} | Skipped: {skipped} | Failed: {failed}")
    print(f"  Total now: {table_count('inverters')}\n")


# ─────────────────────────────────────────────────────────────
# BATTERIES — curated (no open database equivalent exists)
# Chemistry-first — covers every type used in Nigerian solar market
# ─────────────────────────────────────────────────────────────
BATTERIES = [
    # (manufacturer, model, chemistry, voltage_v, capacity_ah,
    #  energy_kwh, dod_pct, cycle_life, weight_kg)

    # Trojan — most widely used FLA in off-grid solar globally
    ("Trojan", "T-105",      "Flooded Lead Acid", 6,  225, 1.35, 0.50, 750,  28.0),
    ("Trojan", "T-105 RE",   "Flooded Lead Acid", 6,  225, 1.35, 0.50, 900,  28.0),
    ("Trojan", "T-145",      "Flooded Lead Acid", 6,  260, 1.56, 0.50, 750,  33.0),
    ("Trojan", "27TMX",      "Flooded Lead Acid", 12, 100, 1.20, 0.50, 650,  25.0),
    ("Trojan", "31-AGM",     "AGM",               12, 100, 1.20, 0.80, 750,  27.0),
    ("Trojan", "SCS200",     "AGM",               12, 200, 2.40, 0.80, 700,  55.0),

    # Victron — widely available in Nigeria, LiFePO4 and AGM
    ("Victron Energy", "AGM 12V/220Ah",              "AGM",    12, 220, 2.64, 0.80, 500,  65.0),
    ("Victron Energy", "AGM Super Cycle 12V/170Ah",  "AGM",    12, 170, 2.04, 0.80, 1000, 52.0),
    ("Victron Energy", "LiFePO4 12.8V/100Ah",        "LiFePO4", 12, 100, 1.28, 0.80, 2000, 14.0),
    ("Victron Energy", "LiFePO4 12.8V/200Ah",        "LiFePO4", 12, 200, 2.56, 0.80, 2000, 24.0),
    ("Victron Energy", "LiFePO4 24V/200Ah",          "LiFePO4", 24, 200, 4.80, 0.80, 2000, 45.0),
    ("Victron Energy", "LiFePO4 48V/100Ah",          "LiFePO4", 48, 100, 4.80, 0.80, 2000, 26.0),

    # Luminous — dominant brand in Nigerian and Indian market
    ("Luminous", "LPTT12150H",        "Tubular",  12, 150, 1.80, 0.50, 1500, 52.0),
    ("Luminous", "LPTT12200L",        "Tubular",  12, 200, 2.40, 0.50, 1500, 62.0),
    ("Luminous", "RC 25000",          "Tubular",  12, 200, 2.40, 0.50, 1500, 60.0),
    ("Luminous", "Li-ON 1250 100Ah",  "LiFePO4",  12, 100, 1.28, 0.80, 3000, 12.0),

    # Felicity Solar — strong Nigerian market presence
    ("Felicity Solar", "FLB12-100AH",       "AGM",     12, 100, 1.20, 0.80, 800,  28.0),
    ("Felicity Solar", "FLB12-200AH",       "AGM",     12, 200, 2.40, 0.80, 800,  52.0),
    ("Felicity Solar", "LIFEPO4 12V/100Ah", "LiFePO4", 12, 100, 1.28, 0.80, 4000, 11.0),
    ("Felicity Solar", "LIFEPO4 12V/200Ah", "LiFePO4", 12, 200, 2.56, 0.80, 4000, 21.0),
    ("Felicity Solar", "LIFEPO4 48V/100Ah", "LiFePO4", 48, 100, 4.80, 0.80, 4000, 35.0),

    # Pylontech — popular lithium stack for 48V systems
    ("Pylontech", "US2000 48V/50Ah",  "LiFePO4", 48, 50,  2.40, 0.80, 6000, 24.0),
    ("Pylontech", "US3000 48V/74Ah",  "LiFePO4", 48, 74,  3.55, 0.80, 6000, 32.0),
    ("Pylontech", "US5000 48V/100Ah", "LiFePO4", 48, 100, 4.80, 0.80, 6000, 42.0),

    # CATL — increasingly common in Nigeria
    ("CATL", "LiFePO4 12V/100Ah", "LiFePO4", 12, 100, 1.28, 0.80, 3000, 12.0),
    ("CATL", "LiFePO4 12V/200Ah", "LiFePO4", 12, 200, 2.56, 0.80, 3000, 23.0),
    ("CATL", "LiFePO4 48V/100Ah", "LiFePO4", 48, 100, 4.80, 0.80, 3000, 36.0),
    ("CATL", "LiFePO4 48V/200Ah", "LiFePO4", 48, 200, 9.60, 0.80, 3000, 70.0),

    # Ritar — affordable AGM widely available
    ("Ritar", "RA12-100", "AGM", 12, 100, 1.20, 0.80, 700, 28.5),
    ("Ritar", "RA12-150", "AGM", 12, 150, 1.80, 0.80, 700, 41.0),
    ("Ritar", "RA12-200", "AGM", 12, 200, 2.40, 0.80, 700, 53.0),

    # Rolls — long-life FLA for professional installs
    ("Rolls", "S-290", "Flooded Lead Acid", 6, 290, 1.74, 0.50, 1500, 42.0),
    ("Rolls", "S-460", "Flooded Lead Acid", 6, 460, 2.76, 0.50, 1500, 60.0),
    ("Rolls", "4000 Series 12V-200Ah", "Flooded Lead Acid", 12, 200, 2.40, 0.50, 1500, 58.0),
]


def seed_batteries():
    print("─── Batteries (curated) ────────────────────────")
    before = table_count("batteries")
    print(f"  Existing: {before}")

    inserted = skipped = failed = 0

    for row in BATTERIES:
        mfr, model, chem, volt, cap, energy, dod, cycles, weight = row

        if row_exists("batteries", mfr, model):
            skipped += 1
            continue

        try:
            cur.execute("""
                INSERT INTO batteries
                  (manufacturer, model, chemistry, voltage_v,
                   capacity_ah, energy_kwh, dod_pct, cycle_life, weight_kg)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """, (mfr, model, chem, volt, cap, energy, dod, cycles, weight))
            inserted += 1
        except Exception as e:
            failed += 1
            conn.rollback()
            print(f"  WARN: {mfr} {model} — {e}")

    conn.commit()
    print(f"  Inserted: {inserted} | Skipped: {skipped} | Failed: {failed}")
    print(f"  Total now: {table_count('batteries')}\n")


# ─────────────────────────────────────────────────────────────
# WIRE GAUGES — standard AWG reference table
# ─────────────────────────────────────────────────────────────
WIRE_GAUGES = [
    ("14 AWG", 2.5,  15,  0.00867,  "PV string, light loads"),
    ("12 AWG", 4.0,  20,  0.00530,  "PV string, battery runs"),
    ("10 AWG", 6.0,  30,  0.00333,  "Battery bank, medium loads"),
    ("8 AWG",  10.0, 50,  0.00209,  "Battery to inverter"),
    ("6 AWG",  16.0, 65,  0.00132,  "High current battery runs"),
    ("4 AWG",  25.0, 85,  0.000827, "Large inverter connections"),
    ("2 AWG",  35.0, 115, 0.000520, "Very large inverter connections"),
    ("1/0 AWG",50.0, 150, 0.000328, "Main battery cables"),
    ("2/0 AWG",70.0, 175, 0.000260, "High capacity main cables"),
    ("4/0 AWG",120.0,230, 0.000153, "Very high capacity main cables"),
]


def seed_wire_gauges():
    print("─── Wire Gauges ─────────────────────────────────")
    before = table_count("wire_gauges")
    print(f"  Existing: {before}")

    inserted = skipped = 0
    for awg, mm2, ampacity, resistance, use in WIRE_GAUGES:
        cur.execute("SELECT 1 FROM wire_gauges WHERE awg=%s LIMIT 1", (awg,))
        if cur.fetchone():
            skipped += 1
            continue
        try:
            cur.execute("""
                INSERT INTO wire_gauges
                  (awg, mm2, max_ampacity_a, resistance_ohm_per_m, common_use)
                VALUES (%s,%s,%s,%s,%s)
            """, (awg, mm2, ampacity, resistance, use))
            inserted += 1
        except Exception as e:
            conn.rollback()
            print(f"  WARN: {awg} — {e}")

    conn.commit()
    print(f"  Inserted: {inserted} | Skipped: {skipped}")
    print(f"  Total now: {table_count('wire_gauges')}\n")


# ─────────────────────────────────────────────────────────────
# Entry point
# ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    args = sys.argv[1:]
    run_all = len(args) == 0

    print("\n=== SolarPV Tensor — Component Seeder v2 ===\n")

    if run_all or "--panels-only" in args:
        seed_panels(limit_per_manufacturer=15)

    if run_all or "--inverters-only" in args:
        seed_inverters(limit_per_manufacturer=15)

    if run_all or "--batteries-only" in args:
        seed_batteries()

    if run_all:
        seed_wire_gauges()

    cur.close()
    conn.close()
    print("=== Done ===\n")