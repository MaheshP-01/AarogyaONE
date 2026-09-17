import { apiClient } from './api';
import {
  TriageFormData,
  SavedTriageAssessment,
  TRIAGE_STORAGE_KEY,
} from '../types/triage';
import { RegisteredPatientResult } from '../types/registration';

// ---------------------------------------------------------------------------
// Patient search — reads from localStorage (existing pattern)
// ---------------------------------------------------------------------------

export const searchLocalPatients = (query: string): RegisteredPatientResult[] => {
  try {
    const stored = localStorage.getItem('ruralcare_local_patients');
    if (!stored) return [];
    const patients: RegisteredPatientResult[] = JSON.parse(stored);
    if (!query || query.trim().length < 1) return patients;

    const q = query.toLowerCase().trim();
    return patients.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.patientId.toLowerCase().includes(q) ||
        (p.mobileNumber && p.mobileNumber.includes(q)) ||
        p.village.toLowerCase().includes(q)
    );
  } catch {
    return [];
  }
};

export const getAllLocalPatients = (): RegisteredPatientResult[] => {
  try {
    const stored = localStorage.getItem('ruralcare_local_patients');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// ---------------------------------------------------------------------------
// Submit triage assessment to backend
// Falls back to localStorage if backend unavailable
// ---------------------------------------------------------------------------

export interface TriageSubmitPayload {
  formData: TriageFormData;
  existingConditions: string[];
}

export interface TriageApiResponse {
  status: 'success' | 'error';
  data?: SavedTriageAssessment;
  message?: string;
  code?: string;
}

export const submitTriageAssessment = async (
  payload: TriageSubmitPayload
): Promise<SavedTriageAssessment> => {
  const { formData, existingConditions } = payload;

  // Build numeric vitals object (skip empty strings)
  const vitals: Record<string, number> = {};
  if (formData.vitals.temperature)
    vitals.temperature = parseFloat(formData.vitals.temperature);
  if (formData.vitals.heartRate)
    vitals.heartRate = parseInt(formData.vitals.heartRate, 10);
  if (formData.vitals.bpSystolic)
    vitals.bpSystolic = parseInt(formData.vitals.bpSystolic, 10);
  if (formData.vitals.bpDiastolic)
    vitals.bpDiastolic = parseInt(formData.vitals.bpDiastolic, 10);
  if (formData.vitals.spo2) vitals.spo2 = parseFloat(formData.vitals.spo2);
  if (formData.vitals.respiratoryRate)
    vitals.respiratoryRate = parseInt(formData.vitals.respiratoryRate, 10);

  const requestBody = {
    patientId: formData.selectedPatientId,
    healthWorkerId: 'HW-SUNITA-001', // placeholder until auth is implemented
    chiefComplaint: formData.chiefComplaint,
    symptoms: formData.symptoms,
    symptomDuration: formData.symptomDuration || undefined,
    vitals,
    additionalInfo: {
      knownAllergies: formData.knownAllergies || undefined,
      currentMedications: formData.currentMedications || undefined,
      relevantHistory: formData.relevantHistory || undefined,
    },
    existingConditions,
  };

  try {
    const response = await apiClient.post<TriageApiResponse>(
      '/triage',
      requestBody
    );

    if (response.data.status === 'success' && response.data.data) {
      const assessment = response.data.data;
      // Also cache in localStorage for offline access
      saveTriageToLocalStorage(assessment);
      return assessment;
    }

    throw new Error(response.data.message || 'Unexpected response from server.');
  } catch (err: any) {
    // If backend not reachable, use AI service directly is NOT allowed (arch decision)
    // Instead, store locally with pending_sync flag
    if (
      err?.code === 'ECONNREFUSED' ||
      err?.code === 'ERR_NETWORK' ||
      err?.response?.status === 503 ||
      !err?.response
    ) {
      // Check if it was an AI service error specifically
      if (err?.response?.data?.code === 'AI_SERVICE_UNAVAILABLE') {
        throw new Error(
          'AI assessment service is temporarily unavailable. Please retry in a moment.'
        );
      }

      // Backend fully unreachable — save offline
      return saveTriageOffline(requestBody);
    }

    // Re-throw other errors
    throw new Error(
      err?.response?.data?.message ||
        err?.message ||
        'Unable to save triage assessment. Please try again.'
    );
  }
};

// ---------------------------------------------------------------------------
// Offline storage helpers
// ---------------------------------------------------------------------------

const saveTriageToLocalStorage = (assessment: SavedTriageAssessment): void => {
  try {
    const stored = localStorage.getItem(TRIAGE_STORAGE_KEY);
    const existing: SavedTriageAssessment[] = stored ? JSON.parse(stored) : [];
    // Replace if already exists (by assessmentId)
    const filtered = existing.filter(
      (a) => a.assessmentId !== assessment.assessmentId
    );
    localStorage.setItem(
      TRIAGE_STORAGE_KEY,
      JSON.stringify([assessment, ...filtered])
    );
  } catch {
    // localStorage full or unavailable — non-critical
  }
};

const saveTriageOffline = (
  requestBody: Record<string, any>
): SavedTriageAssessment => {
  const year = new Date().getFullYear();
  const assessmentId = `TR-${year}-OFFLINE-${Date.now().toString().slice(-4)}`;

  // Create a basic offline record — AI result will be null until synced
  const offlineAssessment: SavedTriageAssessment & { syncStatus: string } = {
    assessmentId,
    patientId: requestBody.patientId,
    riskLevel: 'MODERATE', // Conservative placeholder
    priority: 'PRIORITY',
    summary:
      'Assessment saved offline. AI analysis will be completed when connectivity is restored.',
    indicators: [],
    recommendedNextStep: 'Retry assessment when connectivity is available.',
    missingInformation: ['AI assessment pending sync'],
    emergencyFlag: false,
    disclaimer:
      'Decision-support information based on reported symptoms and available vitals. Not a diagnosis.',
    savedToDb: false,
    createdAt: new Date().toISOString(),
    syncStatus: 'pending_sync',
  };

  try {
    const stored = localStorage.getItem(TRIAGE_STORAGE_KEY);
    const existing = stored ? JSON.parse(stored) : [];
    localStorage.setItem(
      TRIAGE_STORAGE_KEY,
      JSON.stringify([offlineAssessment, ...existing])
    );
  } catch {
    // Non-critical
  }

  return offlineAssessment;
};

// ---------------------------------------------------------------------------
// Get saved triage assessments from localStorage
// ---------------------------------------------------------------------------

export const getLocalTriageHistory = (
  patientId?: string
): SavedTriageAssessment[] => {
  try {
    const stored = localStorage.getItem(TRIAGE_STORAGE_KEY);
    if (!stored) return [];
    const all: SavedTriageAssessment[] = JSON.parse(stored);
    if (patientId) return all.filter((a) => a.patientId === patientId);
    return all;
  } catch {
    return [];
  }
};

// ---------------------------------------------------------------------------
// Check AI service health (via backend proxy)
// ---------------------------------------------------------------------------

export const checkAiServiceStatus = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/triage/ai-health', { timeout: 4000 });
    return response.data?.aiService === 'online';
  } catch {
    return false;
  }
};
