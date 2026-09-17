import { apiClient } from './api';
import {
  Appointment,
  AppointmentFormData,
  AppointmentStatus,
  APPOINTMENT_STORAGE_KEY,
} from '../types/appointment';
import { getBaselineAppointments, getTodayIST } from './clinicalDemoData';
import { doctorMockService } from './doctorMockService';
import { ConsultationQueueItem, ClinicalTimelineEvent } from '../types/doctor';

// ---------------------------------------------------------------------------
// LocalStorage helpers
// ---------------------------------------------------------------------------

export const getStoredAppointments = (): Appointment[] => {
  try {
    const raw = localStorage.getItem(APPOINTMENT_STORAGE_KEY);
    if (!raw) {
      const baseline = getBaselineAppointments();
      localStorage.setItem(APPOINTMENT_STORAGE_KEY, JSON.stringify(baseline));
      return baseline;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to read stored appointments:', err);
    return getBaselineAppointments();
  }
};

export const saveStoredAppointments = (appointments: Appointment[]): void => {
  try {
    localStorage.setItem(APPOINTMENT_STORAGE_KEY, JSON.stringify(appointments));
  } catch (err) {
    console.warn('Failed to persist appointments:', err);
  }
};

// ---------------------------------------------------------------------------
// Sync appointment to Doctor Consultation Queue
// ---------------------------------------------------------------------------
export const syncAppointmentToDoctorQueue = (appointment: Appointment): void => {
  try {
    const patient = doctorMockService.getPatient(appointment.patientId);
    const existingQueue = doctorMockService.getQueue('all');
    const existingIdx = existingQueue.findIndex(
      (q) => q.patientId === appointment.patientId || q.tokenNumber === appointment.tokenNumber
    );

    const queueItem: ConsultationQueueItem = {
      id: `CQ-${appointment.appointmentId.replace('APT-', '')}`,
      tokenNumber: appointment.tokenNumber,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      age: patient?.age || 45,
      gender: patient?.gender || 'Other',
      village: patient?.village || 'Local Village',
      taluka: patient?.taluka || 'Local Taluka',
      district: patient?.district || 'Dhule',
      chiefComplaint: appointment.reason,
      symptomsDuration: '1-3 days',
      symptomsList: [appointment.reason],
      riskLevel: 'MODERATE',
      priority: appointment.mode === 'TELECONSULTATION' ? 'PRIORITY' : 'ROUTINE',
      waitingTime: '5 min',
      status: 'waiting',
      assignedDoctor: appointment.doctorName,
      vitals: {
        temperature: '98.6°F',
        heartRate: '78 bpm',
        bloodPressure: '120/80 mmHg',
        spo2: '98%',
        respiratoryRate: '18 /min',
        recordedAt: 'Just now',
        recordedBy: 'Health Worker',
      },
      triage: {
        riskLevel: 'MODERATE',
        priority: 'PRIORITY',
        reportedIndicators: ['Scheduled Consultation', appointment.mode],
        aiSummary: `Appointment booked for ${appointment.reason}. Scheduled with ${appointment.doctorName}.`,
        recommendedNextStep: 'Conduct physician consultation.',
        disclaimer: 'Decision-support information based on reported symptoms and available vitals. Not a diagnosis.',
      },
    };

    if (existingIdx >= 0) {
      existingQueue[existingIdx] = queueItem;
    } else {
      existingQueue.unshift(queueItem);
    }
  } catch (err) {
    console.warn('Failed to sync appointment to doctor queue:', err);
  }
};

// ---------------------------------------------------------------------------
// Add timeline event for patient
// ---------------------------------------------------------------------------
export const addAppointmentTimelineEvent = (appointment: Appointment): void => {
  try {
    const timeline = doctorMockService.getPatientTimeline(appointment.patientId);
    const newEvent: ClinicalTimelineEvent = {
      id: `TL-${appointment.appointmentId}`,
      date: appointment.date,
      type: 'Consultation',
      title: `Scheduled Consultation (${appointment.mode.replace('_', ' ')})`,
      facility: appointment.facilityName || 'Primary Health Centre',
      doctorOrWorker: appointment.doctorName,
      details: `Booked appointment for: ${appointment.reason}. Token: ${appointment.tokenNumber}. Status: ${appointment.status}`,
      badge: appointment.status,
    };
    timeline.unshift(newEvent);
  } catch (err) {
    console.warn('Failed to add appointment timeline event:', err);
  }
};

// ---------------------------------------------------------------------------
// API and Local-First Service methods
// ---------------------------------------------------------------------------

export const getAppointments = async (filters?: {
  date?: string;
  status?: string;
  doctorId?: string;
  patientId?: string;
}): Promise<Appointment[]> => {
  // Always get local items as basis
  const localItems = getStoredAppointments();

  try {
    const params: Record<string, string> = {};
    if (filters?.date) params.date = filters.date;
    if (filters?.status) params.status = filters.status;
    if (filters?.doctorId) params.doctorId = filters.doctorId;
    if (filters?.patientId) params.patientId = filters.patientId;

    const res = await apiClient.get<{ status: string; data: Appointment[] }>('/appointments', {
      params,
    });

    if (res.data?.status === 'success' && Array.isArray(res.data.data)) {
      const serverItems = res.data.data;
      // Merge server items with local items (server wins on same appointmentId)
      const map = new Map<string, Appointment>();
      localItems.forEach((item) => map.set(item.appointmentId, item));
      serverItems.forEach((item) => map.set(item.appointmentId, { ...item, syncStatus: 'synced' }));
      const merged = Array.from(map.values());
      saveStoredAppointments(merged);
      return merged;
    }
  } catch (err) {
    console.info('Backend appointments not reachable; using local cache.');
  }

  // Filter local items if filters provided
  return localItems.filter((item) => {
    if (filters?.date && item.date !== filters.date) return false;
    if (filters?.status && item.status !== filters.status) return false;
    if (filters?.doctorId && item.doctorId !== filters.doctorId) return false;
    if (filters?.patientId && item.patientId !== filters.patientId) return false;
    return true;
  });
};

export const getBookedSlots = async (doctorId: string, date: string): Promise<string[]> => {
  const localAppointments = getStoredAppointments();
  const activeStatuses: AppointmentStatus[] = [
    'SCHEDULED',
    'CHECKED_IN',
    'WAITING',
    'IN_CONSULTATION',
  ];

  const localBooked = localAppointments
    .filter((a) => a.doctorId === doctorId && a.date === date && activeStatuses.includes(a.status))
    .map((a) => a.time);

  try {
    const res = await apiClient.get<{ status: string; data: string[] }>('/appointments/slots', {
      params: { doctorId, date },
    });
    if (res.data?.status === 'success' && Array.isArray(res.data.data)) {
      const combined = Array.from(new Set([...localBooked, ...res.data.data]));
      return combined;
    }
  } catch {
    // backend unavailable, return local slots
  }

  return localBooked;
};

export const createAppointment = async (formData: AppointmentFormData): Promise<Appointment> => {
  const localAppointments = getStoredAppointments();

  // 1. Double-booking check: verify doctor + date + time is not already booked
  const activeStatuses: AppointmentStatus[] = [
    'SCHEDULED',
    'CHECKED_IN',
    'WAITING',
    'IN_CONSULTATION',
  ];
  const localConflict = localAppointments.find(
    (a) =>
      a.doctorId === formData.doctorId &&
      a.date === formData.date &&
      a.time === formData.time &&
      activeStatuses.includes(a.status)
  );

  if (localConflict) {
    throw new Error('This time slot is no longer available. Please select another time.');
  }

  // Generate fallback IDs
  const count = localAppointments.length + 1;
  const newAppointmentId = `APT-2026-${String(count).padStart(5, '0')}`;
  const todayStr = getTodayIST();
  const todayCount = localAppointments.filter((a) => a.date === todayStr).length + 1;
  const tokenNumber = `P-${String(todayCount).padStart(3, '0')}`;

  const newLocalAppointment: Appointment = {
    appointmentId: newAppointmentId,
    patientId: formData.selectedPatientId,
    patientName: formData.selectedPatientName,
    healthWorkerId: 'HW-SUNITA-001',
    doctorId: formData.doctorId,
    doctorName: formData.doctorName,
    facilityId: formData.facilityId,
    facilityName: formData.facilityName,
    triageId: formData.triageId || undefined,
    date: formData.date,
    time: formData.time,
    mode: formData.mode,
    reason: formData.reason,
    tokenNumber,
    status: 'SCHEDULED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    syncStatus: 'local_only',
  };

  try {
    const res = await apiClient.post<{ status: string; data: Appointment }>('/appointments', {
      patientId: formData.selectedPatientId,
      patientName: formData.selectedPatientName,
      healthWorkerId: 'HW-SUNITA-001',
      doctorId: formData.doctorId,
      doctorName: formData.doctorName,
      facilityId: formData.facilityId,
      facilityName: formData.facilityName,
      triageId: formData.triageId,
      date: formData.date,
      time: formData.time,
      mode: formData.mode,
      reason: formData.reason,
    });

    if (res.data?.status === 'success' && res.data.data) {
      const serverAppointment: Appointment = {
        ...res.data.data,
        syncStatus: 'synced',
      };
      const updated = [serverAppointment, ...localAppointments];
      saveStoredAppointments(updated);
      addAppointmentTimelineEvent(serverAppointment);
      return serverAppointment;
    }
  } catch (err: any) {
    if (err.response?.status === 409) {
      throw new Error(err.response.data?.message || 'This time slot is no longer available. Please select another time.');
    }
    console.info('Backend appointment save failed, preserving in local storage.');
  }

  // Save locally
  const updated = [newLocalAppointment, ...localAppointments];
  saveStoredAppointments(updated);
  addAppointmentTimelineEvent(newLocalAppointment);
  return newLocalAppointment;
};

export const updateAppointmentStatus = async (
  appointmentId: string,
  newStatus: AppointmentStatus
): Promise<Appointment> => {
  const localAppointments = getStoredAppointments();
  const index = localAppointments.findIndex((a) => a.appointmentId === appointmentId);
  if (index === -1) {
    throw new Error(`Appointment '${appointmentId}' not found.`);
  }

  localAppointments[index].status = newStatus;
  localAppointments[index].updatedAt = new Date().toISOString();

  // If moved to WAITING, also sync to doctor consultation queue!
  if (newStatus === 'WAITING') {
    syncAppointmentToDoctorQueue(localAppointments[index]);
  }

  saveStoredAppointments(localAppointments);

  try {
    await apiClient.patch(`/appointments/${appointmentId}/status`, {
      status: newStatus,
    });
  } catch {
    // offline or backend issue
  }

  return localAppointments[index];
};

export const cancelAppointment = async (
  appointmentId: string,
  cancelReason: string
): Promise<Appointment> => {
  if (!cancelReason || !cancelReason.trim()) {
    throw new Error('Cancellation reason is required.');
  }

  const localAppointments = getStoredAppointments();
  const index = localAppointments.findIndex((a) => a.appointmentId === appointmentId);
  if (index === -1) {
    throw new Error(`Appointment '${appointmentId}' not found.`);
  }

  localAppointments[index].status = 'CANCELLED';
  localAppointments[index].cancelReason = cancelReason.trim();
  localAppointments[index].updatedAt = new Date().toISOString();

  saveStoredAppointments(localAppointments);

  try {
    await apiClient.patch(`/appointments/${appointmentId}/cancel`, {
      cancelReason,
    });
  } catch {
    // offline
  }

  return localAppointments[index];
};
