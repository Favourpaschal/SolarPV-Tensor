from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import components, calculations, recommendations, simulation

app = FastAPI(title="SolarPV Tensor API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(components.router)
app.include_router(calculations.router)
app.include_router(recommendations.router)
app.include_router(simulation.router)
# app.include_router(projects.router)

@app.get("/")
def health():
    return {"status": "ok", "app": "SolarPV Tensor API"}