// ---------------------------------------------------------------------------
// Triage TypeScript Types
// Used across the Health Worker Digital Triage module
// ---------------------------------------------------------------------------

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';
export type TriagePriority = 'ROUTINE' | 'PRIORITY' | 'URGENT';

export interface VitalsData {
  temperature: string;    // °F (user input as string, converted on submit)
  heartRate: string;      // bpm
  bpSystolic: string;     // mmHg
  bpDiastolic: string;    // mmHg
  spo2: string;           // %
  respiratoryRate: string; // breaths/min
}

export interface TriageFormData {
  // Step 1: Patient
  selectedPatientId: string;

  // Step 2: Symptoms
  chiefComplaint: string;
  symptoms: string;
  symptomDuration: string;

  // Step 3: Vitals
  vitals: VitalsData;

  // Step 4: Additional Information
  knownAllergies: string;
  currentMedications: string;
  relevantHistory: string;
}

export interface TriageResult {
  riskLevel: RiskLevel;
  priority: TriagePriority;
  summary: string;
  indicators: string[];
  recommendedNextStep: string;
  missingInformation: string[];
  emergencyFlag: boolean;
  disclaimer: string;
}

export interface SavedTriageAssessment {
  assessmentId: string;
  patientId: string;
  riskLevel: RiskLevel;
  priority: TriagePriority;
  summary: string;
  indicators: string[];
  recommendedNextStep: string;
  missingInformation: string[];
  emergencyFlag: boolean;
  disclaimer: string;
  savedToDb: boolean;
  createdAt: string;
}

// Vitals validation errors
export interface VitalsErrors {
  temperature?: string;
  heartRate?: string;
  bpSystolic?: string;
  bpDiastolic?: string;
  spo2?: string;
  respiratoryRate?: string;
}

// Clinical reference ranges for UI validation
export const VITALS_RANGES = {
  temperature: { min: 85, max: 115, label: 'Temperature (°F)' },
  heartRate: { min: 20, max: 300, label: 'Heart Rate (bpm)' },
  bpSystolic: { min: 50, max: 300, label: 'BP Systolic (mmHg)' },
  bpDiastolic: { min: 20, max: 200, label: 'BP Diastolic (mmHg)' },
  spo2: { min: 50, max: 100, label: 'SpO2 (%)' },
  respiratoryRate: { min: 1, max: 80, label: 'Respiratory Rate (breaths/min)' },
} as const;

// Triage step type for state machine
export type TriageStep =
  | 'select_patient'
  | 'symptoms'
  | 'vitals'
  | 'additional_info'
  | 'review'
  | 'submitting'
  | 'result'
  | 'saving'
  | 'success';

// LocalStorage key for offline triage persistence
export const TRIAGE_STORAGE_KEY = 'ruralcare_triage_assessments';
