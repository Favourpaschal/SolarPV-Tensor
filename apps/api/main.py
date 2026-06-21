from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import components
from routers import calculations

app = FastAPI(title="SolarPV Tensor", version="0.1.0")
app.include_router(components.router)
app.include_router(calculations.router)   

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "ok", "app": "SolarPv Tensor API"}