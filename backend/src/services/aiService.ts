import axios from 'axios';
import { config } from '../config/env';

/**
 * Internal AI service client for calling the FastAPI triage microservice.
 * API keys and internal service URLs are kept server-side only.
 */
const aiAxios = axios.create({
  baseURL: config.aiServiceUrl,
  timeout: 15000, // 15s — rule-based engine should be fast; allow buffer for cold start
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AiTriageRequest {
  patientId: string;
  chiefComplaint: string;
  symptoms: string;
  symptomDuration?: string;
  vitals: {
    temperature?: number;
    heartRate?: number;
    bpSystolic?: number;
    bpDiastolic?: number;
    spo2?: number;
    respiratoryRate?: number;
  };
  knownAllergies?: string;
  currentMedications?: string;
  relevantHistory?: string;
  existingConditions?: string[];
}

export interface AiTriageResponse {
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  priority: 'ROUTINE' | 'PRIORITY' | 'URGENT';
  summary: string;
  indicators: string[];
  recommendedNextStep: string;
  missingInformation: string[];
  emergencyFlag: boolean;
  disclaimer: string;
}

/**
 * Send triage assessment data to FastAPI AI service.
 * Returns structured triage result.
 * Throws on network/timeout/service error — caller handles gracefully.
 */
export const callAiTriage = async (
  request: AiTriageRequest
): Promise<AiTriageResponse> => {
  const response = await aiAxios.post<AiTriageResponse>(
    '/api/v1/triage/assess',
    request
  );
  return response.data;
};

/**
 * Check if the AI service is reachable.
 */
export const checkAiServiceHealth = async (): Promise<boolean> => {
  try {
    await aiAxios.get('/health', { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
};
