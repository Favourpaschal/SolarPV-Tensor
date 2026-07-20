from fastapi import APIRouter
from pydantic import BaseModel
from services.simulation import (
    simulate_daily_energy,
    forecast_monthly_yield,
    simulate_battery_soc,
    estimate_shading_loss,
    detect_faults,
)
from services.calculations import get_peak_sun_hours

router = APIRouter(prefix="/simulate", tags=["simulation"])

class SimulationRequest(BaseModel):
    total_array_w: float
    daily_wh: float
    battery_capacity_wh: float
    location: str
    system_voltage: int = 12
    dod: float = 0.8
    shading_pct: float = 0
    shaded_panel_count: int = 0
    panel_count: int = 1
    inverter_rating_w: float = 1000
    peak_load_w: float = 500
    wire_runs: list = []

@router.post("/full")
def run_simulation(req: SimulationRequest):
    psh = get_peak_sun_hours(req.location)

    daily = simulate_daily_energy(
        req.total_array_w, req.daily_wh,
        req.battery_capacity_wh, psh, req.dod
    )
    monthly = forecast_monthly_yield(
        req.total_array_w, psh, req.location
    )
    soc = simulate_battery_soc(
        req.total_array_w, req.daily_wh,
        req.battery_capacity_wh, psh, days=7, dod=req.dod
    )
    shading = estimate_shading_loss(
        req.total_array_w, req.shading_pct,
        req.panel_count, req.shaded_panel_count
    )
    faults = detect_faults(
        req.wire_runs, req.total_array_w,
        req.battery_capacity_wh,
        req.inverter_rating_w, req.peak_load_w,
        req.system_voltage
    )

    return {
        "daily_simulation": daily,
        "monthly_forecast": monthly,
        "battery_soc": soc,
        "shading_analysis": shading,
        "fault_detection": faults,
        "summary": {
            "location": req.location,
            "peak_sun_hours": psh,
            "annual_yield_kwh": monthly["annual_kwh"],
            "self_sufficiency_pct": daily["self_sufficiency_pct"],
            "min_battery_soc_pct": soc["min_soc_pct"],
            "has_faults": faults["has_critical"],
        }
    }