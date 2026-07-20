# Simulate daily energy function
def simulate_daily_energy(
    total_array_w: float,
    daily_wh: float,
    battery_capacity_wh: float,
    psh: float,
    dod: float = 0.8,
):
    usable_capacity = battery_capacity_wh * dod
    soc_wh = usable_capacity * 0.5
    hourly_load_w = daily_wh / 24

    irradiance = [
        0, 0, 0, 0, 0, 0, 0, 0.1,
        0.3, 0.6, 0.85, 1.0, 1.0,
        0.95, 0.85, 0.7, 0.4, 0.15,
        0, 0, 0, 0, 0, 0,
    ]

    hours = []
    for h in range(24):
        generation_w = total_array_w * irradiance[h] * 0.8
        net_w = generation_w - hourly_load_w

        if net_w > 0:
            soc_wh = min(soc_wh + net_w, usable_capacity)
        else:
            soc_wh = max(soc_wh + net_w, 0)

        hours.append({
            "hour": h,
            "generation_w": round(generation_w, 1),
            "load_w": round(hourly_load_w, 1),
            "net_w": round(net_w, 1),
            "battery_soc_wh": round(soc_wh, 1),
            "battery_soc_pct": round(soc_wh / usable_capacity * 100, 1),
        })

    total_gen = sum(h["generation_w"] for h in hours)
    total_load = daily_wh
    surplus = max(0, total_gen - total_load)
    deficit = max(0, total_load - total_gen)

    return {
        "hours": hours,
        "total_generation_wh": round(total_gen, 1),
        "total_load_wh": round(total_load, 1),
        "surplus_wh": round(surplus, 1),
        "deficit_wh": round(deficit, 1),
        "self_sufficiency_pct": round(min(total_gen / total_load * 100, 100), 1),
    }

# Monthly Peak Sun Hours (PSH) yield
MONTHLY_PSH_FACTORS = {
    "abuja": [0.85, 0.90, 0.92, 0.88, 0.80, 0.72,
              0.68, 0.70, 0.75, 0.82, 0.88, 0.87],
    "lagos": [0.82, 0.85, 0.80, 0.75, 0.68, 0.60,
              0.55, 0.58, 0.62, 0.72, 0.80, 0.83],
    "kano":  [0.90, 0.92, 0.95, 0.93, 0.88, 0.85,
              0.82, 0.83, 0.87, 0.92, 0.93, 0.91],
    "port harcourt": [0.78, 0.80, 0.75, 0.68, 0.60, 0.52,
                      0.48, 0.50, 0.55, 0.65, 0.75, 0.78],
}

MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun",
               "Jul","Aug","Sep","Oct","Nov","Dec"]

DAYS_IN_MONTH = [31,28,31,30,31,30,31,31,30,31,30,31]


def forecast_monthly_yield(
    total_array_w: float,
    base_psh: float,
    location: str,
    derate: float = 0.8,
):
    factors = MONTHLY_PSH_FACTORS.get(location.lower(), [1.0] * 12)
    months = []
    for i, factor in enumerate(factors):
        psh = base_psh * factor
        daily_kwh = total_array_w * psh * derate / 1000
        monthly_kwh = daily_kwh * DAYS_IN_MONTH[i]
        months.append({
            "month": MONTH_NAMES[i],
            "psh": round(psh, 2),
            "daily_kwh": round(daily_kwh, 2),
            "monthly_kwh": round(monthly_kwh, 1),
        })

    annual_kwh = sum(m["monthly_kwh"] for m in months)
    return {
        "months": months,
        "annual_kwh": round(annual_kwh, 1),
        "best_month": max(months, key=lambda m: m["monthly_kwh"])["month"],
        "worst_month": min(months, key=lambda m: m["monthly_kwh"])["month"],
    }

# Battery SOC simulation function
def simulate_battery_soc(
    total_array_w: float,
    daily_wh: float,
    battery_capacity_wh: float,
    psh: float,
    days: int = 7,
    dod: float = 0.8,
):
    usable_capacity = battery_capacity_wh * dod
    soc_wh = usable_capacity
    result = []

    for day in range(1, days + 1):
        irradiance_factor = 0.30 if day == 3 else 1.0
        generation_wh = total_array_w * psh * 0.8 * irradiance_factor
        net_wh = generation_wh - daily_wh
        soc_wh = max(0, min(soc_wh + net_wh, usable_capacity))
        soc_pct = soc_wh / usable_capacity * 100

        result.append({
            "day": day,
            "label": f"Day {day}" + (" (cloudy)" if day == 3 else ""),
            "generation_wh": round(generation_wh, 1),
            "load_wh": round(daily_wh, 1),
            "net_wh": round(net_wh, 1),
            "soc_wh": round(soc_wh, 1),
            "soc_pct": round(soc_pct, 1),
            "status": (
                "critical" if soc_pct < 20 else
                "low" if soc_pct < 40 else
                "good"
            ),
        })

    return {
        "days": result,
        "min_soc_pct": round(min(d["soc_pct"] for d in result), 1),
        "cloudy_day_recovery": result[3]["soc_pct"] if days >= 4 else None,
    }

# Estimate shading loss function
def estimate_shading_loss(
    total_array_w: float,
    shading_pct: float,
    panel_count: int,
    shaded_panel_count: int = 0,
):
    if shaded_panel_count > 0:
        string_loss_factor = shaded_panel_count / panel_count
        effective_loss_pct = min(shading_pct + (string_loss_factor * 30), 80)
    else:
        effective_loss_pct = shading_pct

    power_lost_w = total_array_w * (effective_loss_pct / 100)
    power_after_shading_w = total_array_w - power_lost_w

    return {
        "shading_pct_input": shading_pct,
        "effective_loss_pct": round(effective_loss_pct, 1),
        "power_lost_w": round(power_lost_w, 1),
        "power_after_shading_w": round(power_after_shading_w, 1),
        "recommendation": (
            "Install bypass diodes on shaded panels" if shaded_panel_count > 0
            else "Reposition panels to avoid shading" if shading_pct > 10
            else "Shading loss is within acceptable range"
        ),
    }


def detect_faults(
    wires: list,
    total_array_w: float,
    battery_capacity_wh: float,
    inverter_rating_w: float,
    peak_load_w: float,
    system_voltage: int,
):
    faults = []

    for wire in wires:
        current = wire.get("current_a", 0)
        ampacity = wire.get("max_ampacity_a", 0)
        if ampacity and current > ampacity:
            faults.append({
                "severity": "critical",
                "type": "OVERCURRENT",
                "message": f"Wire on {wire.get('run','?')} carries {current}A but is rated for {ampacity}A — fire risk.",
            })
        vdrop = wire.get("voltage_drop_pct", 0)
        if vdrop > 3:
            faults.append({
                "severity": "warning",
                "type": "VOLTAGE_DROP",
                "message": f"Voltage drop on {wire.get('run','?')} is {vdrop}% — above 3% limit. Use larger cable.",
            })

    if inverter_rating_w < peak_load_w:
        faults.append({
            "severity": "critical",
            "type": "INVERTER_OVERLOAD",
            "message": f"Peak load ({peak_load_w}W) exceeds inverter rating ({inverter_rating_w}W) — inverter will shut down.",
        })

    if battery_capacity_wh / system_voltage < 100 and total_array_w > 500:
        faults.append({
            "severity": "warning",
            "type": "BATTERY_UNDERSIZED",
            "message": "Battery bank may be too small for the array size — excess solar energy will be wasted.",
        })

    return {
        "faults": faults,
        "has_critical": any(f["severity"] == "critical" for f in faults),
        "fault_count": len(faults),
    }
