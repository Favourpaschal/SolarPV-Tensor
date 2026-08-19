# apps/api/tests/test_calculations.py
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.calculations import (
    calculate_load, get_peak_sun_hours,
    calculate_panel_array, calculate_battery_bank
)
from schemas import LoadSurveyRequest, Appliance

def test_load_calculation():
    req = LoadSurveyRequest(appliances=[
        Appliance(name="LED bulb", watts=10, hours_per_day=6, quantity=4),
        Appliance(name="Fridge", watts=150, hours_per_day=24, quantity=1),
    ])
    result = calculate_load(req)
    assert result.daily_wh == 3840.0
    assert result.peak_load_w == 190.0
    assert result.appliance_count == 2

def test_peak_sun_hours_known_city():
    assert get_peak_sun_hours("abuja") == 5.5
    assert get_peak_sun_hours("lagos") == 4.8
    assert get_peak_sun_hours("kano") == 6.2

def test_peak_sun_hours_unknown_city():
    assert get_peak_sun_hours("enugu") == 5.0

def test_panel_array_sizing():
    result = calculate_panel_array(
        daily_wh=4000, psh=5.5, panel_pmax_w=400
    )
    assert result["panel_count"] >= 2
    assert result["total_array_w"] >= result["required_array_w"]

def test_battery_bank_sizing():
    result = calculate_battery_bank(
        daily_wh=4000, autonomy_days=1,
        system_voltage=12, dod=0.8,
        battery_capacity_ah=100
    )
    assert result["battery_count"] >= 1
    assert result["total_capacity_ah"] >= result["required_ah"]