from sqlalchemy import Column, String, Float, Integer
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database import Base

class SolarPanel(Base):
    __tablename__ = "solar_panels"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    manufacturer = Column(String)
    model = Column(String)
    pmax_w = Column(Float)
    voc_v = Column(Float)
    isc_a = Column(Float)
    vmp_v = Column(Float)
    imp_a = Column(Float)
    efficiency_pct = Column(Float)

class Inverter(Base):
    __tablename__ = "inverters"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    manufacturer = Column(String)
    model = Column(String)
    power_rating_w = Column(Float)
    efficiency_pct = Column(Float)
    min_input_v = Column(Float)
    max_input_v = Column(Float)
    inverter_type = Column(String)

class Battery(Base):
    __tablename__ = "batteries"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    manufacturer = Column(String)
    model = Column(String)
    chemistry = Column(String)
    voltage_v = Column(Float)
    capacity_ah = Column(Float)
    energy_kwh = Column(Float)
    dod_pct = Column(Float)
    cycle_life = Column(Integer)