import math

def recommend_panels(panels: list, required_array_w: float, panel_count: int):
    scored = []
    for p in panels:
        if p["pmax_w"] <= 0:
            continue
        count = math.ceil(required_array_w / p["pmax_w"]) if required_array_w > 0 else 1
        total_w = count * p["pmax_w"]
        oversize_pct = (total_w - required_array_w) / required_array_w * 100 if required_array_w > 0 else 0
        efficiency = p.get("efficiency_pct") or 0
        score = oversize_pct - (efficiency * 2)
        scored.append({**p, "recommended_count": count,
                       "total_array_w": total_w,
                       "oversize_pct": round(oversize_pct, 1),
                       "score": round(score, 2)})
    return sorted(scored, key=lambda x: x["score"])[:5]


def recommend_batteries(batteries: list, required_ah: float, system_voltage: int):
    matched = [b for b in batteries if b.get("voltage_v") == system_voltage]
    if not matched:
        matched = batteries
    scored = []
    for b in matched:
        if not b.get("capacity_ah") or b["capacity_ah"] <= 0:
            continue
        count = math.ceil(required_ah / b["capacity_ah"])
        total_ah = count * b["capacity_ah"]
        excess_pct = (total_ah - required_ah) / required_ah * 100
        cycle_score = b.get("cycle_life") or 0
        score = excess_pct - (cycle_score / 100)
        scored.append({**b, "recommended_count": count,
                       "total_ah": total_ah,
                       "excess_pct": round(excess_pct, 1),
                       "score": round(score, 2)})
    return sorted(scored, key=lambda x: x["score"])[:5]


def recommend_inverter(inverters: list, peak_load_w: float):
    min_rating = peak_load_w * 1.2
    suitable = [i for i in inverters if i.get("power_rating_w", 0) >= min_rating]
    return sorted(suitable, key=lambda x: x["power_rating_w"])[:5]


def recommend_wire_gauges(wire_table: list, system_specs: dict):
    runs = {
        "pv_string": {
            "current_a": system_specs.get("isc_a", 10) * 1.25,
            "length_m": system_specs.get("pv_run_m", 5),
            "label": "PV string to charge controller",
        },
        "battery": {
            "current_a": system_specs.get("battery_current_a", 50),
            "length_m": system_specs.get("battery_run_m", 2),
            "label": "Battery bank to inverter",
        },
        "ac_output": {
            "current_a": system_specs.get("ac_current_a", 20),
            "length_m": system_specs.get("ac_run_m", 10),
            "label": "Inverter to load panel",
        },
    }
    results = {}
    for key, run in runs.items():
        for wire in sorted(wire_table, key=lambda w: w["mm2"]):
            vdrop = 2 * run["length_m"] * run["current_a"] * wire["resistance_ohm_per_m"]
            vdrop_pct = (vdrop / system_specs.get("system_voltage", 12)) * 100
            if run["current_a"] <= wire["max_ampacity_a"] and vdrop_pct <= 3.0:
                results[key] = {**wire, "run": run["label"],
                                "voltage_drop_pct": round(vdrop_pct, 2)}
                break
    return results


TOOL_CHECKLIST = [
    {"tool": "Wire stripper", "reason": "Strip insulation from all cable ends"},
    {"tool": "Crimping tool", "reason": "Attach lugs and ferrules to wire ends"},
    {"tool": "Multimeter", "reason": "Verify voltage, current, and continuity"},
    {"tool": "MC4 connector tool", "reason": "Connect solar panel cables"},
    {"tool": "Torque wrench", "reason": "Tighten terminal bolts to rated torque"},
    {"tool": "Cable ties and staples", "reason": "Secure wire runs to structure"},
    {"tool": "Conduit and fittings", "reason": "Protect outdoor cable runs"},
    {"tool": "Fuse holder and fuses", "reason": "Overcurrent protection on each run"},
    {"tool": "Label maker", "reason": "Mark all wires, fuses, and terminals"},
    {"tool": "Safety gloves and goggles", "reason": "Personal protection during installation"},
]

def generate_tool_checklist():
    return TOOL_CHECKLIST


def generate_bom(panel, panel_count, battery, battery_count, inverter, wire_recommendations):
    PRICES = {
        "panel_per_w": 0.30,
        "battery_per_ah": 1.20,
        "inverter_per_w": 0.25,
        "wire_per_m": 2.50,
        "fuse_each": 5.0,
        "mc4_pair": 3.0,
        "conduit_per_m": 1.50,
        "misc": 50.0,
    }
    items = []
    items.append({
        "item": f"Solar panel — {panel.get('manufacturer')} {panel.get('model')}",
        "qty": panel_count, "unit": "unit",
        "unit_price_usd": round(panel.get("pmax_w", 0) * PRICES["panel_per_w"], 2),
        "total_usd": round(panel_count * panel.get("pmax_w", 0) * PRICES["panel_per_w"], 2),
    })
    items.append({
        "item": f"Battery — {battery.get('manufacturer','?')} {battery.get('model','?')}",
        "qty": battery_count, "unit": "unit",
        "unit_price_usd": round(battery.get("capacity_ah", 0) * PRICES["battery_per_ah"], 2),
        "total_usd": round(battery_count * battery.get("capacity_ah", 0) * PRICES["battery_per_ah"], 2),
    })
    items.append({
        "item": f"Inverter — {inverter.get('manufacturer','?')} {inverter.get('model','?')}",
        "qty": 1, "unit": "unit",
        "unit_price_usd": round(inverter.get("power_rating_w", 0) * PRICES["inverter_per_w"], 2),
        "total_usd": round(inverter.get("power_rating_w", 0) * PRICES["inverter_per_w"], 2),
    })
    for key, wire in wire_recommendations.items():
        items.append({
            "item": f"Cable {wire.get('awg','?')} AWG — {wire.get('run','')}",
            "qty": 20, "unit": "m",
            "unit_price_usd": PRICES["wire_per_m"],
            "total_usd": 20 * PRICES["wire_per_m"],
        })
    items.append({"item": "MC4 connectors", "qty": panel_count * 2,
                  "unit": "pair", "unit_price_usd": PRICES["mc4_pair"],
                  "total_usd": panel_count * 2 * PRICES["mc4_pair"]})
    items.append({"item": "Fuses and holders", "qty": 4, "unit": "unit",
                  "unit_price_usd": PRICES["fuse_each"], "total_usd": 4 * PRICES["fuse_each"]})
    items.append({"item": "Conduit and fittings", "qty": 15, "unit": "m",
                  "unit_price_usd": PRICES["conduit_per_m"], "total_usd": 15 * PRICES["conduit_per_m"]})
    items.append({"item": "Miscellaneous (terminals, ties, labels)", "qty": 1,
                  "unit": "lot", "unit_price_usd": PRICES["misc"], "total_usd": PRICES["misc"]})
    total = round(sum(i["total_usd"] for i in items), 2)
    return {"items": items, "total_usd": total}


def run_alerts(daily_wh, peak_load_w, total_array_w, total_kwh,
               inverter, system_voltage, location):
    alerts = []
    if total_array_w < daily_wh * 0.9:
        alerts.append({"level": "error", "code": "ARRAY_UNDERSIZED",
            "message": f"Solar array ({total_array_w}W) may not cover daily load of {daily_wh}Wh — add more panels or reduce load."})
    if total_array_w > daily_wh * 2.5:
        alerts.append({"level": "warning", "code": "ARRAY_OVERSIZED",
            "message": f"Array is oversized ({total_array_w}W for {daily_wh}Wh/day) — consider reducing panel count."})
    inverter_rating = inverter.get("power_rating_w", 0)
    if inverter_rating < peak_load_w:
        alerts.append({"level": "error", "code": "INVERTER_UNDERSIZED",
            "message": f"Inverter ({inverter_rating}W) cannot handle peak load of {peak_load_w}W."})
    if system_voltage == 12 and total_array_w > 1500:
        alerts.append({"level": "warning", "code": "VOLTAGE_TOO_LOW",
            "message": "Systems above 1500W work better at 24V or 48V — consider upgrading system voltage."})
    if location.lower() in ["lagos", "port harcourt"] and total_array_w < daily_wh * 1.2:
        alerts.append({"level": "warning", "code": "LOW_IRRADIANCE_LOCATION",
            "message": f"{location.title()} has lower peak sun hours — add 20% more panel capacity."})
    return alerts