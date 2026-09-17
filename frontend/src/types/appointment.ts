// ---------------------------------------------------------------------------
// Appointment Types for RuralCare Connect
// ---------------------------------------------------------------------------

export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CHECKED_IN'
  | 'WAITING'
  | 'IN_CONSULTATION'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type ConsultationMode =
  | 'IN_PERSON'
  | 'TELECONSULTATION'
  | 'HW_ASSISTED';

export interface DoctorOption {
  id: string;
  name: string;
  specialty: string;
  facilityId: string;
  facilityName: string;
  availability: string;
}

export interface FacilityOption {
  id: string;
  name: string;
  type: string;
  location: string;
}

export interface Appointment {
  appointmentId: string;
  patientId: string;
  patientName: string;
  healthWorkerId: string;
  doctorId: string;
  doctorName: string;
  facilityId: string;
  facilityName?: string;
  triageId?: string;
  date: string;           // YYYY-MM-DD
  time: string;           // e.g. "10:30 AM" or "10:30"
  mode: ConsultationMode;
  reason: string;
  tokenNumber: string;    // e.g. "P-027"
  status: AppointmentStatus;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
  syncStatus?: 'synced' | 'local_only';
}

export interface AppointmentFormData {
  selectedPatientId: string;
  selectedPatientName: string;
  facilityId: string;
  facilityName: string;
  doctorId: string;
  doctorName: string;
  mode: ConsultationMode;
  date: string;
  time: string;
  reason: string;
  triageId?: string;
}

export const APPOINTMENT_STORAGE_KEY = 'ruralcare_appointments';
