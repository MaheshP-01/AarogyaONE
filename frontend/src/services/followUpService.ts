import { apiClient } from './api';
import {
  FollowUp,
  FollowUpFormData,
  FollowUpStatus,
  FollowUpCompletionData,
  FOLLOWUP_STORAGE_KEY,
} from '../types/followup';
import { getBaselineFollowUps, getTodayIST } from './clinicalDemoData';
import { doctorMockService } from './doctorMockService';
import { ClinicalTimelineEvent } from '../types/doctor';

// ---------------------------------------------------------------------------
// LocalStorage helpers
// ---------------------------------------------------------------------------

export const getStoredFollowUps = (): FollowUp[] => {
  try {
    const raw = localStorage.getItem(FOLLOWUP_STORAGE_KEY);
    let items: FollowUp[] = [];
    if (!raw) {
      items = getBaselineFollowUps();
      localStorage.setItem(FOLLOWUP_STORAGE_KEY, JSON.stringify(items));
    } else {
      items = JSON.parse(raw);
    }

    // Auto-update status based on today's date
    const today = getTodayIST();
    let hasChanges = false;

    items = items.map((f) => {
      if (f.status === 'UPCOMING' && f.date === today) {
        hasChanges = true;
        return { ...f, status: 'DUE' as FollowUpStatus };
      }
      if ((f.status === 'UPCOMING' || f.status === 'DUE') && f.date < today) {
        hasChanges = true;
        return { ...f, status: 'MISSED' as FollowUpStatus };
      }
      return f;
    });

    if (hasChanges) {
      localStorage.setItem(FOLLOWUP_STORAGE_KEY, JSON.stringify(items));
    }

    return items;
  } catch (err) {
    console.warn('Failed to read stored follow-ups:', err);
    return getBaselineFollowUps();
  }
};

export const saveStoredFollowUps = (followUps: FollowUp[]): void => {
  try {
    localStorage.setItem(FOLLOWUP_STORAGE_KEY, JSON.stringify(followUps));
  } catch (err) {
    console.warn('Failed to persist follow-ups:', err);
  }
};

// ---------------------------------------------------------------------------
// Add timeline event for patient
// ---------------------------------------------------------------------------
export const addFollowUpTimelineEvent = (
  followUp: FollowUp,
  action: 'scheduled' | 'completed' | 'rescheduled'
): void => {
  try {
    const timeline = doctorMockService.getPatientTimeline(followUp.patientId);
    let title = 'Follow-up Scheduled';
    let details = `Follow-up on ${followUp.date} via ${followUp.mode.replace('_', ' ')}: ${followUp.reason}`;
    let badge: string = followUp.status;

    if (action === 'completed') {
      title = 'Follow-up Completed';
      details = `Completed on ${followUp.date}. Outcome: ${followUp.completionOutcome || 'Reviewed'}. ${followUp.completionNotes || ''}`;
      badge = 'Completed';
    } else if (action === 'rescheduled') {
      title = 'Follow-up Rescheduled';
      details = `Rescheduled to ${followUp.date} at ${followUp.time}. Reason: ${followUp.reason}`;
      badge = 'Rescheduled';
    }

    const newEvent: ClinicalTimelineEvent = {
      id: `TL-${followUp.followUpId}-${Date.now()}`,
      date: followUp.date,
      type: 'Visit',
      title,
      facility: 'Shirpur Rural Health Center',
      doctorOrWorker: followUp.doctorName || 'Health Worker',
      details,
      badge,
    };
    timeline.unshift(newEvent);
  } catch (err) {
    console.warn('Failed to add follow-up timeline event:', err);
  }
};

// ---------------------------------------------------------------------------
// Service methods
// ---------------------------------------------------------------------------

export const getFollowUps = async (filters?: {
  status?: string;
  patientId?: string;
  doctorId?: string;
  date?: string;
}): Promise<FollowUp[]> => {
  const localItems = getStoredFollowUps();

  try {
    const params: Record<string, string> = {};
    if (filters?.status) params.status = filters.status;
    if (filters?.patientId) params.patientId = filters.patientId;
    if (filters?.doctorId) params.doctorId = filters.doctorId;
    if (filters?.date) params.date = filters.date;

    const res = await apiClient.get<{ status: string; data: FollowUp[] }>('/followups', {
      params,
    });

    if (res.data?.status === 'success' && Array.isArray(res.data.data)) {
      const serverItems = res.data.data;
      const map = new Map<string, FollowUp>();
      localItems.forEach((item) => map.set(item.followUpId, item));
      serverItems.forEach((item) => map.set(item.followUpId, { ...item, syncStatus: 'synced' }));
      const merged = Array.from(map.values());
      saveStoredFollowUps(merged);
      return merged;
    }
  } catch {
    console.info('Backend follow-ups not reachable; using local cache.');
  }

  return localItems.filter((item) => {
    if (filters?.status && item.status !== filters.status) return false;
    if (filters?.patientId && item.patientId !== filters.patientId) return false;
    if (filters?.doctorId && item.doctorId !== filters.doctorId) return false;
    if (filters?.date && item.date !== filters.date) return false;
    return true;
  });
};

export const createFollowUp = async (formData: FollowUpFormData): Promise<FollowUp> => {
  const localItems = getStoredFollowUps();
  const count = localItems.length + 1;
  const followUpId = `FU-2026-${String(count).padStart(5, '0')}`;
  const today = getTodayIST();

  let initialStatus: FollowUpStatus = 'UPCOMING';
  if (formData.date === today) {
    initialStatus = 'DUE';
  } else if (formData.date < today) {
    initialStatus = 'MISSED';
  }

  const newLocalFollowUp: FollowUp = {
    followUpId,
    patientId: formData.selectedPatientId,
    patientName: formData.selectedPatientName,
    healthWorkerId: 'HW-SUNITA-001',
    doctorId: formData.doctorId,
    doctorName: formData.doctorName,
    relatedConsultationId: formData.relatedConsultationId,
    relatedTriageId: formData.relatedTriageId,
    date: formData.date,
    time: formData.time,
    mode: formData.mode,
    reason: formData.reason,
    notes: formData.notes,
    status: initialStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    syncStatus: 'local_only',
  };

  try {
    const res = await apiClient.post<{ status: string; data: FollowUp }>('/followups', {
      patientId: formData.selectedPatientId,
      patientName: formData.selectedPatientName,
      healthWorkerId: 'HW-SUNITA-001',
      doctorId: formData.doctorId,
      doctorName: formData.doctorName,
      relatedConsultationId: formData.relatedConsultationId,
      relatedTriageId: formData.relatedTriageId,
      date: formData.date,
      time: formData.time,
      mode: formData.mode,
      reason: formData.reason,
      notes: formData.notes,
    });

    if (res.data?.status === 'success' && res.data.data) {
      const serverFollowUp: FollowUp = {
        ...res.data.data,
        syncStatus: 'synced',
      };
      const updated = [serverFollowUp, ...localItems];
      saveStoredFollowUps(updated);
      addFollowUpTimelineEvent(serverFollowUp, 'scheduled');
      return serverFollowUp;
    }
  } catch {
    console.info('Backend follow-up save failed, persisting locally.');
  }

  const updated = [newLocalFollowUp, ...localItems];
  saveStoredFollowUps(updated);
  addFollowUpTimelineEvent(newLocalFollowUp, 'scheduled');
  return newLocalFollowUp;
};

export const completeFollowUp = async (
  followUpId: string,
  completionData: FollowUpCompletionData
): Promise<FollowUp> => {
  const localItems = getStoredFollowUps();
  const index = localItems.findIndex((f) => f.followUpId === followUpId);
  if (index === -1) {
    throw new Error(`Follow-up '${followUpId}' not found.`);
  }

  localItems[index].status = 'COMPLETED';
  localItems[index].patientAttended = completionData.patientAttended;
  localItems[index].completionOutcome = completionData.completionOutcome;
  localItems[index].completionNotes = completionData.completionNotes;
  localItems[index].completedAt = new Date().toISOString();
  localItems[index].updatedAt = new Date().toISOString();

  saveStoredFollowUps(localItems);
  addFollowUpTimelineEvent(localItems[index], 'completed');

  try {
    await apiClient.patch(`/followups/${followUpId}/complete`, completionData);
  } catch {
    // offline
  }

  return localItems[index];
};

export const rescheduleFollowUp = async (
  followUpId: string,
  newDate: string,
  newTime: string,
  reason: string
): Promise<FollowUp> => {
  const localItems = getStoredFollowUps();
  const index = localItems.findIndex((f) => f.followUpId === followUpId);
  if (index === -1) {
    throw new Error(`Follow-up '${followUpId}' not found.`);
  }

  const original = localItems[index];
  original.notes = `${original.notes || ''} [Rescheduled to ${newDate} ${newTime}]`.trim();
  original.updatedAt = new Date().toISOString();

  const count = localItems.length + 1;
  const newFollowUpId = `FU-2026-${String(count).padStart(5, '0')}`;
  const today = getTodayIST();
  const newStatus: FollowUpStatus = newDate === today ? 'DUE' : 'UPCOMING';

  const newFollowUp: FollowUp = {
    followUpId: newFollowUpId,
    patientId: original.patientId,
    patientName: original.patientName,
    healthWorkerId: original.healthWorkerId,
    doctorId: original.doctorId,
    doctorName: original.doctorName,
    relatedConsultationId: original.relatedConsultationId,
    relatedTriageId: original.relatedTriageId,
    relatedAppointmentId: original.relatedAppointmentId,
    date: newDate,
    time: newTime,
    mode: original.mode,
    reason: reason || original.reason,
    notes: `Rescheduled from ${original.followUpId}`,
    status: newStatus,
    rescheduledFromId: original.followUpId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    syncStatus: 'local_only',
  };

  const updated = [newFollowUp, ...localItems];
  saveStoredFollowUps(updated);
  addFollowUpTimelineEvent(newFollowUp, 'rescheduled');

  try {
    await apiClient.post(`/followups/${followUpId}/reschedule`, {
      newDate,
      newTime,
      reason,
    });
  } catch {
    // offline
  }

  return newFollowUp;
};

export const updateFollowUpStatus = async (
  followUpId: string,
  status: FollowUpStatus,
  notes?: string
): Promise<FollowUp> => {
  const localItems = getStoredFollowUps();
  const index = localItems.findIndex((f) => f.followUpId === followUpId);
  if (index === -1) {
    throw new Error(`Follow-up '${followUpId}' not found.`);
  }

  localItems[index].status = status;
  if (notes) localItems[index].notes = notes;
  localItems[index].updatedAt = new Date().toISOString();

  saveStoredFollowUps(localItems);

  try {
    await apiClient.patch(`/followups/${followUpId}/status`, { status, notes });
  } catch {
    // offline
  }

  return localItems[index];
};
