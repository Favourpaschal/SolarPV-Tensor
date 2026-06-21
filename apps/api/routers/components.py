from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models import SolarPanel, Inverter, Battery

router = APIRouter(prefix="/components", tags=["components"])

@router.get("/panels")
def get_panels(
    skip: int = 0,
    limit: int = Query(default=20, le=100),
    manufacturer: str = None,
    db: Session = Depends(get_db)
):
    q = db.query(SolarPanel)
    if manufacturer:
        q = q.filter(SolarPanel.manufacturer.ilike(f"%{manufacturer}%"))
    return q.offset(skip).limit(limit).all()

@router.get("/inverters")
def get_inverters(
    skip: int = 0, limit: int = 20,
    db: Session = Depends(get_db)
):
    return db.query(Inverter).offset(skip).limit(limit).all()

@router.get("/batteries")
def get_batteries(
    skip: int = 0, limit: int = 20,
    db: Session = Depends(get_db)
):
    return db.query(Battery).offset(skip).limit(limit).all()