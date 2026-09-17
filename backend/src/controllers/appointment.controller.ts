import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppointmentModel, AppointmentStatus } from '../models/Appointment.model';

// ---------------------------------------------------------------------------
// Helper: is DB connected
// ---------------------------------------------------------------------------
const isDbUp = () => mongoose.connection.readyState === 1;

// ---------------------------------------------------------------------------
// POST /api/appointments
// Create a new appointment with double-booking check
// ---------------------------------------------------------------------------
export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!isDbUp()) {
      res.status(503).json({
        status: 'error',
        message: 'Database unavailable. Appointment booking requires server connectivity to prevent double-booking.',
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
      facilityId,
      facilityName,
      triageId,
      date,
      time,
      mode,
      reason,
    } = req.body;

    // Basic validation
    if (!patientId || !patientName || !doctorId || !doctorName || !facilityId ||
        !facilityName || !date || !time || !mode || !reason) {
      res.status(400).json({
        status: 'error',
        message: 'Missing required fields: patientId, patientName, doctorId, doctorName, facilityId, facilityName, date, time, mode, reason.',
      });
      return;
    }

    // Double-booking check: same doctor, same date, same time, active status
    const conflictingStatuses: AppointmentStatus[] = [
      'SCHEDULED', 'CHECKED_IN', 'WAITING', 'IN_CONSULTATION',
    ];
    const existing = await AppointmentModel.findOne({
      doctorId,
      date,
      time,
      status: { $in: conflictingStatuses },
    }).lean();

    if (existing) {
      res.status(409).json({
        status: 'error',
        message: 'This time slot is no longer available. Please select another time.',
        code: 'SLOT_UNAVAILABLE',
      });
      return;
    }

    // Save
    const appointment = new AppointmentModel({
      patientId,
      patientName,
      healthWorkerId: healthWorkerId || 'HW-DEFAULT',
      doctorId,
      doctorName,
      facilityId,
      facilityName,
      triageId: triageId || undefined,
      date,
      time,
      mode,
      reason,
      status: 'SCHEDULED',
    });

    const saved = await appointment.save();

    res.status(201).json({
      status: 'success',
      data: saved,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// GET /api/appointments
// List appointments with optional filters: date, status, doctorId, patientId
// ---------------------------------------------------------------------------
export const getAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!isDbUp()) {
      res.status(503).json({ status: 'error', message: 'Database unavailable.' });
      return;
    }

    const { date, status, doctorId, patientId } = req.query;
    const query: Record<string, any> = {};

    if (date) query.date = date;
    if (status) query.status = status;
    if (doctorId) query.doctorId = doctorId;
    if (patientId) query.patientId = patientId;

    const appointments = await AppointmentModel.find(query)
      .sort({ date: 1, time: 1 })
      .lean();

    res.status(200).json({
      status: 'success',
      data: appointments,
      count: appointments.length,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// GET /api/appointments/:id
// ---------------------------------------------------------------------------
export const getAppointmentById = async (
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
    const appointment = await AppointmentModel.findOne({ appointmentId: id }).lean();

    if (!appointment) {
      res.status(404).json({
        status: 'error',
        message: `Appointment '${id}' not found.`,
      });
      return;
    }

    res.status(200).json({ status: 'success', data: appointment });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/appointments/:id/status
// Transition status: CHECKED_IN | WAITING | IN_CONSULTATION | COMPLETED | NO_SHOW
// ---------------------------------------------------------------------------
const VALID_STATUS_TRANSITIONS: Record<string, AppointmentStatus[]> = {
  SCHEDULED: ['CHECKED_IN', 'CANCELLED', 'NO_SHOW'],
  CHECKED_IN: ['WAITING', 'CANCELLED'],
  WAITING: ['IN_CONSULTATION', 'CANCELLED'],
  IN_CONSULTATION: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

export const updateAppointmentStatus = async (
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
    const { status } = req.body;

    const appointment = await AppointmentModel.findOne({ appointmentId: id });

    if (!appointment) {
      res.status(404).json({ status: 'error', message: `Appointment '${id}' not found.` });
      return;
    }

    const allowedTransitions = VALID_STATUS_TRANSITIONS[appointment.status] || [];
    if (!allowedTransitions.includes(status as AppointmentStatus)) {
      res.status(422).json({
        status: 'error',
        message: `Cannot transition from ${appointment.status} to ${status}.`,
      });
      return;
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({ status: 'success', data: appointment });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/appointments/:id/cancel
// Cancel with mandatory reason
// ---------------------------------------------------------------------------
export const cancelAppointment = async (
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
    const { cancelReason } = req.body;

    if (!cancelReason || !cancelReason.trim()) {
      res.status(400).json({
        status: 'error',
        message: 'Cancellation reason is required.',
      });
      return;
    }

    const appointment = await AppointmentModel.findOne({ appointmentId: id });

    if (!appointment) {
      res.status(404).json({ status: 'error', message: `Appointment '${id}' not found.` });
      return;
    }

    if (['COMPLETED', 'IN_CONSULTATION'].includes(appointment.status)) {
      res.status(422).json({
        status: 'error',
        message: 'Cannot cancel an appointment that is in consultation or already completed.',
      });
      return;
    }

    appointment.status = 'CANCELLED';
    appointment.cancelReason = cancelReason.trim();
    await appointment.save();

    res.status(200).json({ status: 'success', data: appointment });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// GET /api/patients/:patientId/appointments
// ---------------------------------------------------------------------------
export const getPatientAppointments = async (
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
    const appointments = await AppointmentModel.find({ patientId })
      .sort({ date: -1, time: -1 })
      .lean();

    res.status(200).json({
      status: 'success',
      data: appointments,
      count: appointments.length,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// GET /api/appointments/slots
// Return booked slots for a doctor on a given date
// ---------------------------------------------------------------------------
export const getBookedSlots = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!isDbUp()) {
      // If DB unavailable, return empty — frontend shows all slots as available
      res.status(200).json({ status: 'success', data: [] });
      return;
    }

    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      res.status(400).json({ status: 'error', message: 'doctorId and date are required.' });
      return;
    }

    const booked = await AppointmentModel.find({
      doctorId,
      date,
      status: { $in: ['SCHEDULED', 'CHECKED_IN', 'WAITING', 'IN_CONSULTATION'] },
    })
      .select('time -_id')
      .lean();

    res.status(200).json({
      status: 'success',
      data: booked.map((b) => b.time),
    });
  } catch (error) {
    next(error);
  }
};
