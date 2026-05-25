# ============================================================
# CampusOS AI — AI Service Entry Point
# ============================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from config import config

from routers import risk, timetable, placement, assistant

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("\n" + "=" * 50)
    print("  🏫 CampusOS AI — Python AI Service Starting...")
    print("=" * 50)
    
    # We will load/train the model here in Sub-Phase 4.2
    
    yield
    # Shutdown logic
    print("Shutting down AI service...")

app = FastAPI(
    title="CampusOS AI Service",
    description="Intelligent API for Risk Prediction, Timetable, Skill Gap, and Assistant",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware (allows Node.js backend and local web testing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:4000", "http://localhost:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Mount Routers ---
app.include_router(risk.router, prefix="/predict/risk", tags=["Risk Prediction"])
app.include_router(timetable.router, prefix="/optimize/timetable", tags=["Timetable Optimizer"])
app.include_router(placement.router, prefix="/analyze/placement", tags=["Placement Analyzer"])
app.include_router(assistant.router, prefix="/assistant", tags=["AI Assistant"])

@app.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint for Node.js backend and monitoring."""
    return {
        "status": "ok",
        "service": "CampusOS AI",
        "version": "1.0.0",
        "model_loaded": False # Will be updated when model logic is added
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=config.PORT, reload=True)
