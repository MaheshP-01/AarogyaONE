export type TriageRiskLevel = 'HIGH' | 'MODERATE' | 'LOW';
export type TriagePriority = 'URGENT' | 'PRIORITY' | 'ROUTINE';
export type QueueStatus = 'waiting' | 'in_consultation' | 'completed' | 'referred';
export type ReferralStatus = 'Pending' | 'Accepted' | 'In Transit' | 'Completed';
export type FollowUpMode = 'In-person' | 'Teleconsultation' | 'Health-worker follow-up';

export interface ClinicalVitals {
  temperature: string; // e.g. "102°F"
  heartRate: string;   // e.g. "98 bpm"
  bloodPressure: string; // e.g. "138/88 mmHg"
  spo2: string;        // e.g. "91%"
  respiratoryRate: string; // e.g. "24 /min"
  recordedAt: string;
  recordedBy: string;
}

export interface AITriageAssessment {
  riskLevel: TriageRiskLevel;
  priority: TriagePriority;
  reportedIndicators: string[];
  aiSummary: string;
  recommendedNextStep: string;
  potentialMissingInfo?: string;
  disclaimer: string;
}

export interface PatientEmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface ClinicalPatient {
  id: string; // RC-2026-004821
  fullName: string;
  age: number | string;
  gender: 'Male' | 'Female' | 'Other';
  preferredLanguage: 'en' | 'mr' | 'hi';
  village: string;
  taluka: string;
  district: string;
  phone: string;
  emergencyContact: PatientEmergencyContact;
  allergies: string[];
  existingConditions: string[];
  currentMedications: string[];
  abhaId?: string;
  registeredDate: string;
}

export interface ConsultationQueueItem {
  id: string; // CQ-101
  tokenNumber: string; // P-021
  patientId: string;
  patientName: string;
  age: number | string;
  gender: string;
  village: string;
  taluka: string;
  district: string;
  chiefComplaint: string;
  symptomsDuration: string;
  symptomsList: string[];
  riskLevel: TriageRiskLevel;
  priority: TriagePriority;
  waitingTime: string; // "18 min"
  status: QueueStatus;
  assignedDoctor: string;
  vitals: ClinicalVitals;
  triage: AITriageAssessment;
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string; // "500 mg"
  frequency: string; // "1-0-1"
  duration: string; // "3 days"
  instructions: string; // "After meals"
}

export interface ClinicalTimelineEvent {
  id: string;
  date: string;
  type: 'Consultation' | 'Visit' | 'Lab Report' | 'Prescription' | 'Referral';
  title: string;
  facility: string;
  doctorOrWorker: string;
  details: string;
  badge?: string;
  attachments?: string[];
}

export interface ReferralRecord {
  id: string; // RC-REF-2026-1048
  patientId: string;
  patientName: string;
  patientAge: number | string;
  patientGender: string;
  priority: 'Routine' | 'Urgent' | 'Emergency';
  requiredSpecialty: string;
  destinationFacility: string;
  facilityType: string;
  destinationLocation: string;
  reason: string;
  clinicalNotes: string;
  createdBy: string;
  createdAt: string;
  status: ReferralStatus;
}

export interface FollowUpRecord {
  id: string; // FU-2026-081
  patientId: string;
  patientName: string;
  patientAge: number | string;
  patientGender?: string;
  patientVillage: string;
  patientPhone?: string;
  reason: string;
  instructions?: string;
  date: string;
  time: string;
  mode: FollowUpMode;
  status: 'Scheduled' | 'Completed' | 'Missed';
  doctorName: string;
}

export interface ConsultationRecord {
  id: string;
  patientId: string;
  patientName?: string;
  doctorName: string;
  facility: string;
  timestamp?: string;
  dateTime?: string;
  durationMinutes?: number;
  chiefComplaint: string;
  symptomsAndNotes?: string;
  symptomsNotes?: string;
  clinicalObservations: string;
  doctorAssessment: string;
  treatmentPlan: string;
  prescriptions: PrescriptionItem[];
  referralId?: string;
  followUpId?: string;
  status: 'draft' | 'completed';
}

export interface DoctorKpiSummary {
  todayQueueCount: number;
  urgentCount: number;
  teleconsultCount: number;
  pendingReferralsCount: number;
  todayFollowUpsCount: number;
}
