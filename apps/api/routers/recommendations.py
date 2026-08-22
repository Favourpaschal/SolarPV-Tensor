from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import SolarPanel, Inverter, Battery, WireGauge
from schemas import LoadSurveyRequest
from services.calculations import (
    calculate_load,
    get_peak_sun_hours,
    calculate_panel_array,
    calculate_battery_bank,
    calculate_inverter_size,
)
from services.recommendations import (
    recommend_panels,
    recommend_batteries,
    recommend_inverter,
    recommend_wire_gauges,
    generate_tool_checklist,
    generate_bom,
    run_alerts,
)
from pydantic import BaseModel

router = APIRouter(prefix="/recommend", tags=["recommendations"])


class RecommendRequest(BaseModel):
    appliances: list[dict]
    location: str
    system_voltage: int = 12
    autonomy_days: float = 1
    dod: float = 0.8
    pv_run_m: float = 5
    battery_run_m: float = 2
    ac_run_m: float = 10


@router.post("/system")
def recommend_system(req: RecommendRequest, db: Session = Depends(get_db)):

    # Step 1 — calculate load from appliances
    load_req = LoadSurveyRequest(appliances=req.appliances)
    load = calculate_load(load_req)

    # Step 2 — get peak sun hours for location
    psh = get_peak_sun_hours(req.location)

    # Step 3 — fetch panels from DB and recommend best matches
    panels_db = db.query(SolarPanel).limit(200).all()
    panels = [
        {c.name: getattr(p, c.name) for c in p.__table__.columns}
        for p in panels_db
    ]
    required_array_w = load.daily_wh / (psh * 0.8)
    panel_recs = recommend_panels(panels, required_array_w, 0)
    best_panel = panel_recs[0] if panel_recs else None

    if not best_panel:
        return {
            "error": "No panels found in database — run seed.py first."
        }

    # Step 4 — size the panel array and battery bank
    sizing = calculate_panel_array(load.daily_wh, psh, best_panel["pmax_w"])
    battery_sizing = calculate_battery_bank(
        load.daily_wh,
        req.autonomy_days,
        req.system_voltage,
        req.dod,
        100,
    )

    # Step 5 — calculate inverter sizing from peak load
    inverter_sizing = calculate_inverter_size(load.peak_load_w)

    # Step 6 — fetch batteries from DB and recommend best matches
    batteries_db = db.query(Battery).limit(100).all()
    batteries = [
        {c.name: getattr(b, c.name) for c in b.__table__.columns}
        for b in batteries_db
    ]
    battery_recs = recommend_batteries(
        batteries,
        battery_sizing["required_ah"],
        req.system_voltage,
    )

    # Step 7 — fetch inverters from DB and recommend best matches
    inverters_db = db.query(Inverter).limit(100).all()
    inverters = [
        {c.name: getattr(i, c.name) for c in i.__table__.columns}
        for i in inverters_db
    ]
    inverter_recs = recommend_inverter(inverters, load.peak_load_w)
    best_inverter = inverter_recs[0] if inverter_recs else {}

    # Step 8 — recommend wire gauges for all three runs
    wires_db = db.query(WireGauge).all()
    wire_table = [
        {c.name: getattr(w, c.name) for c in w.__table__.columns}
        for w in wires_db
    ]
    wire_recs = recommend_wire_gauges(wire_table, {
        "system_voltage": req.system_voltage,
        "isc_a": best_panel.get("isc_a", 10),
        "pv_run_m": req.pv_run_m,
        "battery_run_m": req.battery_run_m,
        "ac_run_m": req.ac_run_m,
        # Correct — battery cable must handle full inverter draw current
        "battery_current_a": load.peak_load_w / req.system_voltage,
        # AC output current at Nigerian mains voltage
        "ac_current_a": load.peak_load_w / 220,
    })

    # Step 9 — generate bill of materials
    best_battery = battery_recs[0] if battery_recs else {}
    bom = generate_bom(
        best_panel,
        sizing["panel_count"],
        best_battery,
        battery_sizing["battery_count"],
        best_inverter,
        wire_recs,
    )

    # Step 10 — run system alerts
    alerts = run_alerts(
        daily_wh=load.daily_wh,
        peak_load_w=load.peak_load_w,
        total_array_w=sizing["total_array_w"],
        total_kwh=battery_sizing["required_ah"] * req.system_voltage / 1000,
        inverter=best_inverter,
        system_voltage=req.system_voltage,
        location=req.location,
    )

    return {
        "load": load,
        "peak_sun_hours": psh,
        "panel_array": sizing,
        "battery_bank": battery_sizing,
        "inverter_sizing": inverter_sizing,
        "top_panels": panel_recs,
        "top_batteries": battery_recs,
        "top_inverters": inverter_recs,
        "wire_recommendations": wire_recs,
        "tool_checklist": generate_tool_checklist(),
        "bom": bom,
        "alerts": alerts,
    }