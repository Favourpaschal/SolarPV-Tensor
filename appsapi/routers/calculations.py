from fastapi import APIRouter
from schemas import LoadSurveyRequest, LoadSurveyResult
from services.calculations import (
    calculate_load, get_peak_sun_hours,
    calculate_panel_array, calculate_battery_bank
)
from pydantic import BaseModel

router = APIRouter(prefix="/calculate", tags=["calculations"])

@router.post("/load", response_model=LoadSurveyResult)
def post_load(payload: LoadSurveyRequest):
    return calculate_load(payload)

class SystemSizingRequest(BaseModel):
    appliances: list[dict]
    location: str
    panel_pmax_w: float
    system_voltage: int = 12
    autonomy_days: float = 1
    dod: float = 0.8
    battery_capacity_ah: float = 100

@router.post("/system")
def post_system_sizing(req: SystemSizingRequest):
    load_req = LoadSurveyRequest(appliances=req.appliances)
    load = calculate_load(load_req)
    psh = get_peak_sun_hours(req.location)
    panels = calculate_panel_array(load.daily_wh, psh, req.panel_pmax_w)
    battery = calculate_battery_bank(
        load.daily_wh, req.autonomy_days, req.system_voltage,
        req.dod, req.battery_capacity_ah
    )
    return {
        "load": load,
        "peak_sun_hours": psh,
        "panel_array": panels,
        "battery_bank": battery,
    }