from schemas import LoadSurveyRequest, LoadSurveyResult
import math

def calculate_load(payload: LoadSurveyRequest) -> LoadSurveyResult:
    daily_wh = 0.0
    peak_w = 0.0
    for item in payload.appliances:
        daily_wh += item.watts * item.hours_per_day * item.quantity
        peak_w += item.watts * item.quantity
    return LoadSurveyResult(
        daily_wh=round(daily_wh, 2),
        peak_load_w=round(peak_w, 2),
        appliance_count=len(payload.appliances)
    )

peak_sun_hours = {
    "abuja": 5.5,
    "lagos": 4.8,
    "kano": 6.2,
    "port harcourt": 4.5,
    "ibadan": 5.0,
    "default": 5.0,
}

def get_peak_sun_hours(location: str) -> float:
    key = location.lower().strip()
    return peak_sun_hours.get(key, peak_sun_hours["default"])

# required_array_w = daily_wh / (peak_sun_hours × derate_factor) 
def calculate_panel_array(daily_wh: float, psh: float, panel_pmax_w: float, derate: float = 0.8):
    required_w = daily_wh / (psh * derate)
    panel_count = math.ceil(required_w / panel_pmax_w)
    return {
        "required_array_w": round(required_w, 2),
        "panel_count": panel_count,
        "total_array_w": panel_count * panel_pmax_w,
    }
# For example: required_w = 4100 / (5.5 × 0.8) = 931.8 W panel_count = ceil(931.8 / 400) = 3 panels total_array_w = 1200 W

# required_wh = (daily_wh × autonomy_days) / dod required_ah = required_wh / system_voltage
def calculate_battery_bank(daily_wh: float, autonomy_days: float,
                            system_voltage: int, dod: float,
                            battery_capacity_ah: float):
    required_wh = (daily_wh * autonomy_days) / dod
    required_ah = required_wh / system_voltage
    battery_count = math.ceil(required_ah / battery_capacity_ah)
    return {
        "required_ah": round(required_ah, 2),
        "battery_count": battery_count,
        "total_capacity_ah": battery_count * battery_capacity_ah,
    }
# For example: required_wh = (4100 × 1) / 0.9 = 4555.6 Wh required_ah = 4555.6 / 12 = 379.6 Ah battery_count = ceil(379.6 / 100) = 4 batteries

# voltage_drop_v = (2 × length_m × current_a × resistance_ohm_per_m) voltage_drop_pct = (voltage_drop_v / system_voltage) × 100
def recommend_wire_gauge(current_a: float, length_m: float,
                          system_voltage: int, wire_table: list,
                          max_drop_pct: float = 3.0):
    for wire in sorted(wire_table, key=lambda w: w["mm2"]):
        vdrop_v = 2 * length_m * current_a * wire["resistance_ohm_per_m"]
        vdrop_pct = (vdrop_v / system_voltage) * 100
        fits_current = current_a <= wire["max_ampacity_a"]
        fits_drop = vdrop_pct <= max_drop_pct
        if fits_current and fits_drop:
            return {**wire, "voltage_drop_pct": round(vdrop_pct, 2)}
    return None  # nothing in the table is sufficient
