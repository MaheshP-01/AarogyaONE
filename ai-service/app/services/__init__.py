"""
Services package for ArogyaOne AI Decision Support.

Modules:
  - triage_service: Rule-based clinical decision-support triage engine.
    This is a DECISION-SUPPORT tool only. Not a diagnostic system.
"""

from app.services.triage_service import perform_triage

__all__ = ["perform_triage"]
