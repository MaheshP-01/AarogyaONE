from fastapi import APIRouter, HTTPException
from app.models.schemas import HealthResponse, TriageRequest, TriageResponse
from app.services.triage_service import perform_triage

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Health check endpoint for the AI microservice.
    Returns:
        HealthResponse: {"status": "ok", "service": "ai-service"}
    """
    return HealthResponse(status="ok", service="ai-service")


@router.post("/triage/assess", response_model=TriageResponse)
async def assess_triage(request: TriageRequest) -> TriageResponse:
    """
    AI-assisted clinical decision-support triage assessment.

    IMPORTANT: This endpoint is a DECISION-SUPPORT tool only.
    It does NOT diagnose diseases, prescribe medications,
    or replace qualified clinical judgment.

    Args:
        request: TriageRequest with patient symptoms, vitals, and context.

    Returns:
        TriageResponse: Structured triage result with risk level, priority,
                        clinical summary, and recommended next step.
    """
    try:
        result = perform_triage(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Triage assessment failed: {str(e)}"
        )
