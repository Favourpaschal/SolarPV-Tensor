from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import SolarPanel, Inverter, Battery, WireGauge
from schemas import LoadSurveyRequest
from services.calculations import (
    calculate_load, get_peak_sun_hours,
    calculate_panel_array, calculate_battery_bank
)
from services.recommendations import (
    recommend_panels, recommend_batteries, recommend_inverter,
    recommend_wire_gauges, generate_tool_checklist,
    generate_bom, run_alerts
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
    load_req = LoadSurveyRequest(appliances=req.appliances)
    load = calculate_load(load_req)
    psh = get_peak_sun_hours(req.location)

    panels_db = db.query(SolarPanel).limit(200).all()
    panels = [{c.name: getattr(p, c.name) for c in p.__table__.columns} for p in panels_db]
    panel_recs = recommend_panels(panels, load.daily_wh / (psh * 0.8), 0)
    best_panel = panel_recs[0] if panel_recs else None

    if not best_panel:
        return {"error": "No panels found — seed your component data first."}

    sizing = calculate_panel_array(load.daily_wh, psh, best_panel["pmax_w"])
    battery_sizing = calculate_battery_bank(
        load.daily_wh, req.autonomy_days, req.system_voltage, req.dod, 100
    )

    batteries_db = db.query(Battery).limit(100).all()
    batteries = [{c.name: getattr(b, c.name) for c in b.__table__.columns} for b in batteries_db]
    battery_recs = recommend_batteries(batteries, battery_sizing["required_ah"], req.system_voltage)

    inverters_db = db.query(Inverter).limit(100).all()
    inverters = [{c.name: getattr(i, c.name) for c in i.__table__.columns} for i in inverters_db]
    inverter_recs = recommend_inverter(inverters, load.peak_load_w)
    best_inverter = inverter_recs[0] if inverter_recs else {}

    wires_db = db.query(WireGauge).all()
    wire_table = [{c.name: getattr(w, c.name) for c in w.__table__.columns} for w in wires_db]
    wire_recs = recommend_wire_gauges(wire_table, {
        "system_voltage": req.system_voltage,
        "isc_a": best_panel.get("isc_a", 10),
        "pv_run_m": req.pv_run_m,
        "battery_run_m": req.battery_run_m,
        "ac_run_m": req.ac_run_m,
        "battery_current_a": battery_sizing["required_ah"] / 5,
        "ac_current_a": load.peak_load_w / 220,
    })

    best_battery = battery_recs[0] if battery_recs else {}
    bom = generate_bom(
        best_panel, sizing["panel_count"],
        best_battery, battery_sizing["battery_count"],
        best_inverter, wire_recs
    )
    alerts = run_alerts(
        load.daily_wh, load.peak_load_w,
        sizing["total_array_w"],
        battery_sizing["required_ah"] * req.system_voltage / 1000,
        best_inverter, req.system_voltage, req.location
    )

    return {
        "load": load,
        "peak_sun_hours": psh,
        "panel_array": sizing,
        "battery_bank": battery_sizing,
        "top_panels": panel_recs,
        "top_batteries": battery_recs,
        "top_inverters": inverter_recs,
        "wire_recommendations": wire_recs,
        "tool_checklist": generate_tool_checklist(),
        "bom": bom,
        "alerts": alerts,
    }