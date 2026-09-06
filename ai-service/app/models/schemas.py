from pydantic import BaseModel, Field

class HealthResponse(BaseModel):
    status: str = Field(default="ok", description="Service status indicator")
    service: str = Field(default="ai-service", description="Service identifier")
