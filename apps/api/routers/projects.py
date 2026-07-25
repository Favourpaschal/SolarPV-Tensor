from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Project
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter(prefix="/projects", tags=["projects"])

class ProjectSaveRequest(BaseModel):
    name: str
    user_label: Optional[str] = None
    location: Optional[str] = None
    appliances: Optional[list] = None
    sizing_result: Optional[dict] = None
    simulation_result: Optional[dict] = None
    components: Optional[list] = None
    wires: Optional[list] = None

@router.post("/save")
def save_project(req: ProjectSaveRequest, db: Session = Depends(get_db)):
    project = Project(
        name=req.name,
        user_label=req.user_label,
        location=req.location,
        appliances=req.appliances,
        sizing_result=req.sizing_result,
        simulation_result=req.simulation_result,
        components=req.components,
        wires=req.wires,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return {
        "id": str(project.id),
        "name": project.name,
        "created_at": str(project.created_at),
    }

@router.get("/list")
def list_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).order_by(Project.created_at.desc()).limit(20).all()
    return [
        {
            "id": str(p.id),
            "name": p.name,
            "location": p.location,
            "created_at": str(p.created_at),
        }
        for p in projects
    ]

@router.get("/{project_id}")
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(
        Project.id == uuid.UUID(project_id)
    ).first()
    if not project:
        return {"error": "Project not found"}
    return {
        c.name: getattr(project, c.name)
        for c in project.__table__.columns
    }

@router.delete("/{project_id}")
def delete_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(
        Project.id == uuid.UUID(project_id)
    ).first()
    if not project:
        return {"error": "Project not found"}
    db.delete(project)
    db.commit()
    return {"deleted": project_id}