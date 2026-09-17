import { Router } from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  getBookedSlots,
  getPatientAppointments,
} from '../controllers/appointment.controller';

const router = Router();

// GET /api/appointments/slots?doctorId=...&date=...
router.get('/slots', getBookedSlots);

// GET /api/appointments/patient/:patientId
router.get('/patient/:patientId', getPatientAppointments);

// GET /api/appointments
router.get('/', getAppointments);

// POST /api/appointments
router.post('/', createAppointment);

// GET /api/appointments/:id
router.get('/:id', getAppointmentById);

// PATCH /api/appointments/:id/status
router.patch('/:id/status', updateAppointmentStatus);

// PATCH /api/appointments/:id/cancel
router.patch('/:id/cancel', cancelAppointment);

export default router;
