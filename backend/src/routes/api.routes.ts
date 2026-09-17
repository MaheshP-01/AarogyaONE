import { Router } from 'express';
import healthRoutes from './health.routes';
import triageRoutes from './triage.routes';
import patientRoutes from './patient.routes';
import appointmentRoutes from './appointment.routes';
import followUpRoutes from './followup.routes';

const router = Router();

// Health check endpoint mounted at /api/health
router.use('/health', healthRoutes);

// Triage assessment endpoints mounted at /api/triage
router.use('/triage', triageRoutes);

// Patient endpoints mounted at /api/patients
router.use('/patients', patientRoutes);

// Appointment endpoints mounted at /api/appointments
router.use('/appointments', appointmentRoutes);

// Follow-up endpoints mounted at /api/followups
router.use('/followups', followUpRoutes);

export default router;
