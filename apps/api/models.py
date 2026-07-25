from sqlalchemy import Column, String, Float, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database import Base
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime

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

class WireGauge(Base):
    __tablename__ = "wire_gauges"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    awg = Column(String)
    mm2 = Column(Float)
    max_ampacity_a = Column(Integer)
    resistance_ohm_per_m = Column(Float)
    common_use = Column(String)

class Project(Base):
    __tablename__ = "projects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    user_label = Column(String)
    location = Column(String)
    appliances = Column(JSONB)
    sizing_result = Column(JSONB)
    simulation_result = Column(JSONB)
    components = Column(JSONB)
    wires = Column(JSONB)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)