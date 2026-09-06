import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.models.schemas import HealthResponse
from app.api.routes import router as api_router

# Load environment variables
load_dotenv()

app = FastAPI(
  title="RuralCare Connect AI Service",
  description="AI decision support microservice for RuralCare Connect (SIH 2026)",
  version="0.1.0",
)

# CORS Middleware configuration
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# Direct health endpoint as specified in requirements
@app.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
  """
  Direct health check endpoint.
  Requirement: GET /health -> {"status": "ok", "service": "ai-service"}
  """
  return HealthResponse(status="ok", service="ai-service")

# Include API routers
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
  return {
    "name": "RuralCare Connect AI Service",
    "version": "0.1.0",
    "status": "online",
    "health_endpoint": "/health",
    "disclaimer": "AI is for clinical decision support only. Not a diagnostic system.",
  }

if __name__ == "__main__":
  import uvicorn
  port = int(os.getenv("AI_SERVICE_PORT", 8000))
  host = os.getenv("HOST", "0.0.0.0")
  uvicorn.run("app.main:app", host=host, port=port, reload=True)
