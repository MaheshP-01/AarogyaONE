from pydantic import BaseModel, Field
from typing import Optional, List

class HealthResponse(BaseModel):
    status: str = Field(default="ok", description="Service status indicator")
    service: str = Field(default="ai-service", description="Service identifier")


# ---------------------------------------------------------------------------
# Triage Request & Response Schemas
# ---------------------------------------------------------------------------

class VitalsData(BaseModel):
    temperature: Optional[float] = Field(None, description="Body temperature in °F")
    heartRate: Optional[int] = Field(None, description="Heart rate in bpm")
    bpSystolic: Optional[int] = Field(None, description="Blood pressure systolic mmHg")
    bpDiastolic: Optional[int] = Field(None, description="Blood pressure diastolic mmHg")
    spo2: Optional[float] = Field(None, description="Oxygen saturation %")
    respiratoryRate: Optional[int] = Field(None, description="Respiratory rate breaths/min")


class TriageRequest(BaseModel):
    patientId: str = Field(..., description="Patient identifier")
    chiefComplaint: str = Field(..., description="Primary reason for visit")
    symptoms: str = Field(..., description="Reported symptoms")
    symptomDuration: Optional[str] = Field(None, description="How long symptoms present")
    vitals: VitalsData = Field(default_factory=VitalsData)
    knownAllergies: Optional[str] = None
    currentMedications: Optional[str] = None
    relevantHistory: Optional[str] = None
    existingConditions: Optional[List[str]] = Field(default_factory=list)


class TriageResponse(BaseModel):
    riskLevel: str = Field(..., description="LOW | MODERATE | HIGH")
    priority: str = Field(..., description="ROUTINE | PRIORITY | URGENT")
    summary: str = Field(..., description="Clinical summary for healthcare professional")
    indicators: List[str] = Field(default_factory=list, description="Key risk indicators identified")
    recommendedNextStep: str = Field(..., description="Suggested next clinical action")
    missingInformation: List[str] = Field(default_factory=list, description="Useful data that was not provided")
    emergencyFlag: bool = Field(default=False, description="True if immediate professional evaluation indicated")
    disclaimer: str = Field(
        default="Decision-support information based on reported symptoms and available vitals. Not a diagnosis.",
        description="Mandatory clinical disclaimer"
    )
