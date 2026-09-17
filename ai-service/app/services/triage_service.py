"""
ArogyaOne — Clinical Decision-Support Triage Engine
====================================================

This module implements a RULE-BASED clinical decision-support system.
It is NOT a diagnostic system. It does NOT name diseases, prescribe
medications, or replace qualified clinical judgment.

Purpose: Assist health workers in prioritizing cases and surfacing
risk indicators for review by a qualified healthcare professional.

All outputs are templated. No generative AI / LLM is used in this
module. A future Gemini API integration stub is provided at the bottom
of this file for activation once an API key is configured.
"""

from typing import List, Optional, Tuple
from app.models.schemas import TriageRequest, TriageResponse, VitalsData


# ---------------------------------------------------------------------------
# Clinical reference range constants (WHO / standard medical references)
# ---------------------------------------------------------------------------

TEMP_LOW_NORMAL = 97.0      # °F
TEMP_HIGH_NORMAL = 99.5     # °F
TEMP_FEVER = 100.4           # °F
TEMP_HIGH_FEVER = 102.0      # °F
TEMP_VERY_HIGH_FEVER = 104.0 # °F

HR_LOW = 60                  # bpm
HR_HIGH = 100                # bpm
HR_TACHYCARDIA = 110         # bpm
HR_SEVERE_TACHY = 130        # bpm
HR_BRADYCARDIA = 50          # bpm

SPO2_NORMAL = 95.0           # %
SPO2_MILD_LOW = 92.0         # %
SPO2_CRITICAL = 90.0         # %

BP_SYS_LOW = 90              # mmHg
BP_SYS_NORMAL_HIGH = 140     # mmHg
BP_SYS_STAGE2 = 160          # mmHg
BP_DIA_NORMAL_HIGH = 90      # mmHg

RR_LOW = 12                  # breaths/min
RR_HIGH = 20                 # breaths/min
RR_ELEVATED = 24             # breaths/min
RR_SEVERE = 30               # breaths/min


# ---------------------------------------------------------------------------
# High-risk symptom keyword sets
# ---------------------------------------------------------------------------

EMERGENCY_KEYWORDS = {
    "chest pain", "chest tightness", "unconscious", "unresponsive",
    "cannot breathe", "can't breathe", "not breathing", "severe difficulty breathing",
    "severe breathlessness", "stroke", "paralysis", "seizure", "convulsion",
    "coughing blood", "haemoptysis", "hemoptysis", "severe bleeding",
    "loss of consciousness", "collapsed", "collapse",
}

HIGH_RISK_KEYWORDS = {
    "difficulty breathing", "breathing difficulty", "breathlessness", "dyspnea",
    "shortness of breath", "short of breath", "wheezing", "severe cough",
    "persistent cough", "high fever", "very high fever", "confusion",
    "disoriented", "altered consciousness", "severe headache", "stiff neck",
    "rash", "bluish lips", "cyanosis", "rapid breathing",
}

MODERATE_RISK_KEYWORDS = {
    "fever", "cough", "vomiting", "diarrhea", "stomach pain", "abdominal pain",
    "body aches", "fatigue", "weakness", "dizziness", "nausea",
    "chills", "sore throat", "ear pain", "joint pain", "back pain",
    "swelling", "edema",
}

LOW_RISK_KEYWORDS = {
    "runny nose", "cold", "mild headache", "minor cough", "sneezing",
    "mild fever", "skin rash", "itching", "mild pain",
}


# ---------------------------------------------------------------------------
# Helper: vital sign assessment
# ---------------------------------------------------------------------------

def assess_vitals(vitals: VitalsData) -> Tuple[int, List[str], List[str], bool]:
    """
    Returns (risk_score, indicators, missing_info, emergency_flag).
    risk_score: 0 = normal, 1 = mild concern, 2 = moderate, 3 = high, 4 = critical
    """
    risk_score = 0
    indicators: List[str] = []
    missing_info: List[str] = []
    emergency_flag = False

    # Track which vitals were provided
    provided = []

    # --- Temperature ---
    if vitals.temperature is not None:
        provided.append("temperature")
        t = vitals.temperature
        if t >= TEMP_VERY_HIGH_FEVER:
            risk_score += 4
            indicators.append(f"Very high temperature ({t:.1f}°F)")
            emergency_flag = True
        elif t >= TEMP_HIGH_FEVER:
            risk_score += 3
            indicators.append(f"High temperature / fever ({t:.1f}°F)")
        elif t >= TEMP_FEVER:
            risk_score += 2
            indicators.append(f"Elevated temperature ({t:.1f}°F)")
        elif t < TEMP_LOW_NORMAL:
            risk_score += 2
            indicators.append(f"Low temperature ({t:.1f}°F)")

    # --- SpO2 ---
    if vitals.spo2 is not None:
        provided.append("spo2")
        s = vitals.spo2
        if s < SPO2_CRITICAL:
            risk_score += 4
            indicators.append(f"Critically low oxygen saturation ({s:.0f}%)")
            emergency_flag = True
        elif s < SPO2_MILD_LOW:
            risk_score += 3
            indicators.append(f"Low oxygen saturation ({s:.0f}%)")
        elif s < SPO2_NORMAL:
            risk_score += 1
            indicators.append(f"Borderline oxygen saturation ({s:.0f}%)")
    else:
        missing_info.append("Oxygen saturation (SpO2)")

    # --- Heart Rate ---
    if vitals.heartRate is not None:
        provided.append("heartRate")
        hr = vitals.heartRate
        if hr >= HR_SEVERE_TACHY or hr <= HR_BRADYCARDIA:
            risk_score += 3
            label = "Very rapid heart rate" if hr >= HR_SEVERE_TACHY else "Very slow heart rate"
            indicators.append(f"{label} ({hr} bpm)")
            emergency_flag = True
        elif hr >= HR_TACHYCARDIA:
            risk_score += 2
            indicators.append(f"Elevated heart rate ({hr} bpm)")
        elif hr > HR_HIGH:
            risk_score += 1
            indicators.append(f"Mildly elevated heart rate ({hr} bpm)")
    else:
        missing_info.append("Heart rate")

    # --- Blood Pressure ---
    if vitals.bpSystolic is not None and vitals.bpDiastolic is not None:
        provided.append("bloodPressure")
        sys_bp = vitals.bpSystolic
        dia_bp = vitals.bpDiastolic
        if sys_bp >= BP_SYS_STAGE2 or dia_bp >= 100:
            risk_score += 3
            indicators.append(f"Significantly elevated blood pressure ({sys_bp}/{dia_bp} mmHg)")
        elif sys_bp >= BP_SYS_NORMAL_HIGH or dia_bp >= BP_DIA_NORMAL_HIGH:
            risk_score += 1
            indicators.append(f"Elevated blood pressure ({sys_bp}/{dia_bp} mmHg)")
        elif sys_bp < BP_SYS_LOW:
            risk_score += 3
            indicators.append(f"Low blood pressure ({sys_bp}/{dia_bp} mmHg)")
            emergency_flag = True
    else:
        if vitals.bpSystolic is None and vitals.bpDiastolic is None:
            missing_info.append("Blood pressure")

    # --- Respiratory Rate ---
    if vitals.respiratoryRate is not None:
        provided.append("respiratoryRate")
        rr = vitals.respiratoryRate
        if rr >= RR_SEVERE:
            risk_score += 3
            indicators.append(f"Severe tachypnoea / rapid breathing ({rr} breaths/min)")
            emergency_flag = True
        elif rr >= RR_ELEVATED:
            risk_score += 2
            indicators.append(f"Elevated respiratory rate ({rr} breaths/min)")
        elif rr < RR_LOW:
            risk_score += 2
            indicators.append(f"Low respiratory rate ({rr} breaths/min)")
    else:
        missing_info.append("Respiratory rate")

    # If very few vitals provided, flag as missing
    if len(provided) == 0:
        missing_info.append("No vital signs recorded")

    return risk_score, indicators, missing_info, emergency_flag


# ---------------------------------------------------------------------------
# Helper: symptom assessment
# ---------------------------------------------------------------------------

def assess_symptoms(symptoms_text: str, chief_complaint: str) -> Tuple[int, List[str], bool]:
    """
    Returns (risk_score, symptom_indicators, emergency_flag).
    """
    combined = (symptoms_text + " " + chief_complaint).lower()
    risk_score = 0
    symptom_indicators: List[str] = []
    emergency_flag = False

    for keyword in EMERGENCY_KEYWORDS:
        if keyword in combined:
            risk_score += 5
            emergency_flag = True
            symptom_indicators.append(_format_indicator(keyword))

    for keyword in HIGH_RISK_KEYWORDS:
        if keyword in combined and _format_indicator(keyword) not in symptom_indicators:
            risk_score += 3
            symptom_indicators.append(_format_indicator(keyword))

    for keyword in MODERATE_RISK_KEYWORDS:
        if keyword in combined and _format_indicator(keyword) not in symptom_indicators:
            risk_score += 1
            symptom_indicators.append(_format_indicator(keyword))

    return risk_score, symptom_indicators, emergency_flag


def _format_indicator(keyword: str) -> str:
    return keyword.title()


# ---------------------------------------------------------------------------
# Helper: check missing clinical information
# ---------------------------------------------------------------------------

def check_missing_clinical_info(
    symptom_duration: Optional[str],
    missing_vitals: List[str],
) -> List[str]:
    missing = list(missing_vitals)
    if not symptom_duration or symptom_duration.strip() == "":
        missing.append("Symptom duration")
    return missing


# ---------------------------------------------------------------------------
# Helper: derive risk level and priority from total score
# ---------------------------------------------------------------------------

def derive_risk_and_priority(
    total_score: int,
    emergency_flag: bool,
) -> Tuple[str, str]:
    if emergency_flag or total_score >= 8:
        return "HIGH", "URGENT"
    elif total_score >= 4:
        return "MODERATE", "PRIORITY"
    else:
        return "LOW", "ROUTINE"


# ---------------------------------------------------------------------------
# Helper: build clinical summary
# ---------------------------------------------------------------------------

def build_summary(
    risk_level: str,
    priority: str,
    indicators: List[str],
    emergency_flag: bool,
    existing_conditions: List[str],
) -> Tuple[str, str]:
    """Returns (summary, recommended_next_step)."""

    indicator_count = len(indicators)
    has_conditions = existing_conditions and len(existing_conditions) > 0

    if emergency_flag or risk_level == "HIGH":
        if indicator_count > 0:
            indicator_text = f"including {indicators[0].lower()}" if indicator_count == 1 \
                else f"including {indicators[0].lower()} and {indicator_count - 1} additional indicator(s)"
        else:
            indicator_text = "including concerning vital signs or symptoms"

        conditions_note = ""
        if has_conditions:
            conditions_note = f" The patient has relevant medical history ({', '.join(existing_conditions)}) which warrants additional consideration."

        summary = (
            f"Reported symptoms and available vitals indicate elevated risk, {indicator_text}. "
            f"The pattern of findings warrants prompt clinical evaluation.{conditions_note}"
        )
        next_step = "Prompt physician evaluation is recommended. Ensure the patient remains monitored."

    elif risk_level == "MODERATE":
        summary = (
            "Reported symptoms and vitals indicate a moderate level of clinical concern. "
            "One or more indicators are outside normal ranges and should be reviewed by a qualified clinician."
        )
        next_step = "Clinical review by a physician or nurse practitioner is recommended in a timely manner."

    else:  # LOW
        summary = (
            "Reported symptoms and vitals are within or near normal ranges. "
            "No urgent indicators identified at this time. Routine care and monitoring are appropriate."
        )
        next_step = "Routine clinical review. Patient may be seen in the normal consultation queue."

    return summary, next_step


# ---------------------------------------------------------------------------
# Main triage assessment function
# ---------------------------------------------------------------------------

def perform_triage(request: TriageRequest) -> TriageResponse:
    """
    Clinical decision-support triage engine.
    
    IMPORTANT: This is a decision-support tool only.
    It does NOT diagnose diseases, prescribe medications,
    or replace qualified clinical judgment.
    """

    # Step 1: Assess vitals
    vital_score, vital_indicators, missing_vitals, vitals_emergency = assess_vitals(request.vitals)

    # Step 2: Assess symptoms
    symptom_score, symptom_indicators, symptoms_emergency = assess_symptoms(
        request.symptoms,
        request.chiefComplaint,
    )

    # Step 3: Combine indicators (deduplicate)
    all_indicators: List[str] = []
    seen = set()
    for ind in (symptom_indicators + vital_indicators):
        if ind.lower() not in seen:
            seen.add(ind.lower())
            all_indicators.append(ind)

    # Step 4: Combine scores and emergency flags
    total_score = vital_score + symptom_score
    emergency_flag = vitals_emergency or symptoms_emergency

    # Step 5: Derive risk level and priority
    risk_level, priority = derive_risk_and_priority(total_score, emergency_flag)

    # Step 6: Check missing information
    missing_info = check_missing_clinical_info(
        request.symptomDuration,
        missing_vitals,
    )

    # Step 7: Build clinical summary
    existing_conditions = request.existingConditions or []
    summary, recommended_next_step = build_summary(
        risk_level,
        priority,
        all_indicators,
        emergency_flag,
        existing_conditions,
    )

    return TriageResponse(
        riskLevel=risk_level,
        priority=priority,
        summary=summary,
        indicators=all_indicators[:8],  # Cap to top 8 indicators for clarity
        recommendedNextStep=recommended_next_step,
        missingInformation=missing_info,
        emergencyFlag=emergency_flag,
    )


# ---------------------------------------------------------------------------
# Future Gemini API Integration Stub (commented out)
# ---------------------------------------------------------------------------
#
# To activate LLM-enhanced triage, uncomment and configure the following:
#
# import google.generativeai as genai
# import os
#
# SYSTEM_PROMPT = """
# You are a clinical decision-support assistant, NOT a diagnostic system.
# Your role is to:
# - Analyze reported symptoms and available vital signs
# - Identify risk indicators
# - Prioritize cases for healthcare professionals
# - Generate a brief, factual clinical summary
# - Suggest appropriate next steps for clinical evaluation
# - Identify missing information that would aid assessment
#
# You MUST NOT:
# - Diagnose any disease or condition
# - Prescribe or suggest medications
# - Claim certainty about any clinical finding
# - Replace the judgment of a qualified healthcare professional
#
# Always respond in structured JSON matching the TriageResponse schema.
# """
#
# async def perform_triage_with_gemini(request: TriageRequest) -> TriageResponse:
#     api_key = os.getenv("GEMINI_API_KEY")
#     if not api_key:
#         return perform_triage(request)  # Fallback to rule-based
#     genai.configure(api_key=api_key)
#     model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=SYSTEM_PROMPT)
#     # ... build prompt from request, call model, parse JSON response
#     pass
