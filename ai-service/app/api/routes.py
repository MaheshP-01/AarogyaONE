from fastapi import APIRouter
from app.models.schemas import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Health check endpoint for the AI microservice.
    Returns:
        HealthResponse: {"status": "ok", "service": "ai-service"}
    """
    return HealthResponse(status="ok", service="ai-service")
