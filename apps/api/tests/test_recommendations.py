# apps/api/tests/test_recommendations.py
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.recommendations import (
    recommend_panels, recommend_batteries,
    recommend_inverter, run_alerts, generate_tool_checklist
)

MOCK_PANELS = [
    {"pmax_w": 400, "manufacturer": "TestCo", "model": "A400",
     "efficiency_pct": 20, "isc_a": 10, "voc_v": 48},
    {"pmax_w": 300, "manufacturer": "TestCo", "model": "A300",
     "efficiency_pct": 18, "isc_a": 8, "voc_v": 40},
]

MOCK_BATTERIES = [
    {"capacity_ah": 100, "voltage_v": 12, "manufacturer": "BattCo",
     "model": "B100", "cycle_life": 2000},
    {"capacity_ah": 200, "voltage_v": 12, "manufacturer": "BattCo",
     "model": "B200", "cycle_life": 3000},
]

MOCK_INVERTERS = [
    {"power_rating_w": 1000, "manufacturer": "InvCo", "model": "I1000", "efficiency_pct": 95},
    {"power_rating_w": 2000, "manufacturer": "InvCo", "model": "I2000", "efficiency_pct": 96},
    {"power_rating_w": 3000, "manufacturer": "InvCo", "model": "I3000", "efficiency_pct": 97},
]

def test_recommend_panels_returns_sorted():
    recs = recommend_panels(MOCK_PANELS, 800, 2)
    assert len(recs) <= 5
    assert recs[0]["pmax_w"] in [300, 400]

def test_recommend_batteries_matches_voltage():
    recs = recommend_batteries(MOCK_BATTERIES, 300, 12)
    assert all(b["voltage_v"] == 12 for b in recs)

def test_recommend_inverter_safety_margin():
    recs = recommend_inverter(MOCK_INVERTERS, 800)
    for inv in recs:
        assert inv["power_rating_w"] >= 800 * 1.2

def test_run_alerts_undersized_array():
    alerts = run_alerts(
        daily_wh=5000, peak_load_w=500,
        total_array_w=1000, total_kwh=3,
        inverter={"power_rating_w": 1000},
        system_voltage=12, location="abuja"
    )
    codes = [a["code"] for a in alerts]
    assert "ARRAY_UNDERSIZED" in codes

def test_run_alerts_inverter_undersized():
    alerts = run_alerts(
        daily_wh=3000, peak_load_w=1500,
        total_array_w=2000, total_kwh=5,
        inverter={"power_rating_w": 1000},
        system_voltage=12, location="abuja"
    )
    codes = [a["code"] for a in alerts]
    assert "INVERTER_UNDERSIZED" in codes

def test_tool_checklist_not_empty():
    checklist = generate_tool_checklist()
    assert len(checklist) > 0
    assert all("tool" in t and "reason" in t for t in checklist)