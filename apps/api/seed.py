import pvlib, os, psycopg2
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(dotenv_path=Path(__file__).parent / ".env")

conn = psycopg2.connect(os.getenv("DATABASE_URL"))
cur = conn.cursor()

panels = pvlib.pvsystem.retrieve_sam("CECMod")
count = 0

LIMIT = 200  # <-- change this to however many you want

for model, row in panels.T.iterrows():
    if count >= LIMIT:
        break
    try:
        cur.execute("""
            insert into solar_panels
              (manufacturer, model, pmax_w, voc_v, isc_a, vmp_v, imp_a, efficiency_pct)
            values (%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            str(row.get("Manufacturer", "")),
            str(model),
            float(row.get("STC", 0)),
            float(row.get("V_oc_ref", 0)),
            float(row.get("I_sc_ref", 0)),
            float(row.get("V_mp_ref", 0)),
            float(row.get("I_mp_ref", 0)),
            float(row.get("A_c", 0)),
        ))
        count += 1
    except Exception as e:
        continue

conn.commit()
cur.close()
conn.close()
print(f"Done — {count} panels seeded.")