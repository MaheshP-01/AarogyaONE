import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { FollowUpModel, FollowUpStatus, FollowUpMode } from '../models/FollowUp.model';

// ---------------------------------------------------------------------------
// Helper: DB check
// ---------------------------------------------------------------------------
const isDbUp = () => mongoose.connection.readyState === 1;

// ---------------------------------------------------------------------------
// Helper: Get today's date in IST (YYYY-MM-DD)
// ---------------------------------------------------------------------------
const getTodayIST = (): string => {
  const now = new Date();
  // IST is UTC + 5:30
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  return istDate.toISOString().split('T')[0];
};

// ---------------------------------------------------------------------------
// POST /api/followups
// Schedule a new follow-up
// ---------------------------------------------------------------------------
export const createFollowUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!isDbUp()) {
      res.status(503).json({
        status: 'error',
        message: 'Database unavailable.',
        code: 'DB_UNAVAILABLE',
      });
      return;
    }

    const {
      patientId,
      patientName,
      healthWorkerId,
      doctorId,
      doctorName,
      relatedConsultationId,
      relatedTriageId,
      relatedAppointmentId,
      date,
      time,
      mode,
      reason,
      notes,
    } = req.body;

    if (!patientId || !patientName || !date || !time || !mode || !reason) {
      res.status(400).json({
        status: 'error',
        message: 'Missing required fields: patientId, patientName, date, time, mode, reason.',
      });
      return;
    }

    const today = getTodayIST();
    let initialStatus: FollowUpStatus = 'UPCOMING';
    if (date === today) {
      initialStatus = 'DUE';
    } else if (date < today) {
      initialStatus = 'MISSED';
    }

    const followUp = new FollowUpModel({
      patientId,
      patientName,
      healthWorkerId: healthWorkerId || 'HW-DEFAULT',
      doctorId: doctorId || undefined,
      doctorName: doctorName || undefined,
      relatedConsultationId: relatedConsultationId || undefined,
      relatedTriageId: relatedTriageId || undefined,
      relatedAppointmentId: relatedAppointmentId || undefined,
      date,
      time,
      mode: mode as FollowUpMode,
      reason,
      notes: notes || undefined,
      status: initialStatus,
    });

    const saved = await followUp.save();

    res.status(201).json({
      status: 'success',
      data: saved,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// GET /api/followups
// List follow-ups with auto-status evaluation (UPCOMING -> DUE/MISSED)
// ---------------------------------------------------------------------------
export const getFollowUps = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!isDbUp()) {
      res.status(503).json({ status: 'error', message: 'Database unavailable.' });
      return;
    }

    const { status, patientId, doctorId, date } = req.query;
    const query: Record<string, any> = {};

    if (patientId) query.patientId = patientId;
    if (doctorId) query.doctorId = doctorId;
    if (date) query.date = date;

    const today = getTodayIST();

    // Auto-update past uncompleted follow-ups to MISSED and today's to DUE
    await FollowUpModel.updateMany(
      {
        date: { $lt: today },
        status: { $in: ['UPCOMING', 'DUE'] },
      },
      { $set: { status: 'MISSED' } }
    );

    await FollowUpModel.updateMany(
      {
        date: today,
        status: 'UPCOMING',
      },
      { $set: { status: 'DUE' } }
    );

    if (status) {
      query.status = status;
    }

    const followUps = await FollowUpModel.find(query)
      .sort({ date: 1, time: 1 })
      .lean();

    res.status(200).json({
      status: 'success',
      data: followUps,
      count: followUps.length,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// GET /api/followups/:id
// ---------------------------------------------------------------------------
export const getFollowUpById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!isDbUp()) {
      res.status(503).json({ status: 'error', message: 'Database unavailable.' });
      return;
    }

    const { id } = req.params;
    const followUp = await FollowUpModel.findOne({ followUpId: id }).lean();

    if (!followUp) {
      res.status(404).json({
        status: 'error',
        message: `Follow-up '${id}' not found.`,
      });
      return;
    }

    res.status(200).json({ status: 'success', data: followUp });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/followups/:id/complete
// Complete follow-up with outcome notes
// ---------------------------------------------------------------------------
export const completeFollowUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!isDbUp()) {
      res.status(503).json({ status: 'error', message: 'Database unavailable.' });
      return;
    }

    const { id } = req.params;
    const { completionNotes, completionOutcome, patientAttended } = req.body;

    const followUp = await FollowUpModel.findOne({ followUpId: id });
    if (!followUp) {
      res.status(404).json({ status: 'error', message: `Follow-up '${id}' not found.` });
      return;
    }

    if (followUp.status === 'COMPLETED') {
      res.status(422).json({ status: 'error', message: 'Follow-up is already completed.' });
      return;
    }

    followUp.status = 'COMPLETED';
    followUp.completionNotes = completionNotes?.trim() || '';
    followUp.completionOutcome = completionOutcome?.trim() || 'Attended & reviewed';
    followUp.patientAttended = typeof patientAttended === 'boolean' ? patientAttended : true;
    followUp.completedAt = new Date();

    await followUp.save();

    res.status(200).json({ status: 'success', data: followUp });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// POST /api/followups/:id/reschedule
// Reschedule a missed or due follow-up
// ---------------------------------------------------------------------------
export const rescheduleFollowUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!isDbUp()) {
      res.status(503).json({ status: 'error', message: 'Database unavailable.' });
      return;
    }

    const { id } = req.params;
    const { newDate, newTime, reason } = req.body;

    if (!newDate || !newTime) {
      res.status(400).json({
        status: 'error',
        message: 'newDate and newTime are required.',
      });
      return;
    }

    const original = await FollowUpModel.findOne({ followUpId: id });
    if (!original) {
      res.status(404).json({ status: 'error', message: `Follow-up '${id}' not found.` });
      return;
    }

    // Mark original as rescheduled/cancelled
    original.notes = `${original.notes || ''} [Rescheduled to ${newDate} ${newTime}]`.trim();
    await original.save();

    const today = getTodayIST();
    const newStatus: FollowUpStatus = newDate === today ? 'DUE' : 'UPCOMING';

    // Create the new follow-up
    const newFollowUp = new FollowUpModel({
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
    });

    const saved = await newFollowUp.save();

    res.status(201).json({
      status: 'success',
      data: saved,
      previousFollowUpId: original.followUpId,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/followups/:id/status
// Update status (e.g. CANCELLED)
// ---------------------------------------------------------------------------
export const updateFollowUpStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!isDbUp()) {
      res.status(503).json({ status: 'error', message: 'Database unavailable.' });
      return;
    }

    const { id } = req.params;
    const { status, notes } = req.body;

    const followUp = await FollowUpModel.findOne({ followUpId: id });
    if (!followUp) {
      res.status(404).json({ status: 'error', message: `Follow-up '${id}' not found.` });
      return;
    }

    followUp.status = status;
    if (notes) {
      followUp.notes = notes;
    }
    await followUp.save();

    res.status(200).json({ status: 'success', data: followUp });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// GET /api/patients/:patientId/followups
// ---------------------------------------------------------------------------
export const getPatientFollowUps = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!isDbUp()) {
      res.status(503).json({ status: 'error', message: 'Database unavailable.' });
      return;
    }

    const { patientId } = req.params;
    const followUps = await FollowUpModel.find({ patientId })
      .sort({ date: -1, time: -1 })
      .lean();

    res.status(200).json({
      status: 'success',
      data: followUps,
      count: followUps.length,
    });
  } catch (error) {
    next(error);
  }
};
