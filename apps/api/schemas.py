from pydantic import BaseModel
from typing import List

class Appliance(BaseModel):
    name: str
    watts: float
    hours_per_day: float
    quantity: int = 1

class LoadSurveyRequest(BaseModel):
    appliances: List[Appliance]

class LoadSurveyResult(BaseModel):
    daily_wh: float
    peak_load_w: float
    appliance_count: int