// ---------------------------------------------------------------------------
// Follow-up Types for RuralCare Connect
// ---------------------------------------------------------------------------

export type FollowUpStatus =
  | 'UPCOMING'
  | 'DUE'
  | 'COMPLETED'
  | 'MISSED'
  | 'CANCELLED';

export type FollowUpMode =
  | 'IN_PERSON'
  | 'TELECONSULTATION'
  | 'HW_VISIT';

export interface FollowUp {
  followUpId: string;
  patientId: string;
  patientName: string;
  healthWorkerId: string;
  doctorId?: string;
  doctorName?: string;
  relatedConsultationId?: string;
  relatedTriageId?: string;
  relatedAppointmentId?: string;
  date: string;           // YYYY-MM-DD
  time: string;           // e.g. "11:00 AM" or "11:00"
  mode: FollowUpMode;
  reason: string;
  notes?: string;
  status: FollowUpStatus;
  completionNotes?: string;
  completionOutcome?: string;
  patientAttended?: boolean;
  completedAt?: string;
  rescheduledFromId?: string;
  createdAt: string;
  updatedAt: string;
  syncStatus?: 'synced' | 'local_only';
}

export interface FollowUpFormData {
  selectedPatientId: string;
  selectedPatientName: string;
  relatedConsultationId?: string;
  relatedTriageId?: string;
  reason: string;
  date: string;
  time: string;
  mode: FollowUpMode;
  doctorId?: string;
  doctorName?: string;
  notes?: string;
}

export interface FollowUpCompletionData {
  patientAttended: boolean;
  completionOutcome: string;
  completionNotes: string;
}

export const FOLLOWUP_STORAGE_KEY = 'ruralcare_followups';
