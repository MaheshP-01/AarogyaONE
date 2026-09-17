import { Router } from 'express';

import { searchPatients } from '../controllers/patient.controller';
import { getPatientTriageHistory } from '../controllers/triage.controller';
import { getPatientAppointments } from '../controllers/appointment.controller';
import { getPatientFollowUps } from '../controllers/followup.controller';

const router = Router();

// GET /api/patients/search?q=<query>
router.get('/search', searchPatients);

// GET /api/patients/:patientId/triage — patient triage history
router.get('/:patientId/triage', getPatientTriageHistory);

// GET /api/patients/:patientId/appointments — patient appointments
router.get('/:patientId/appointments', getPatientAppointments);

// GET /api/patients/:patientId/followups — patient follow-ups
router.get('/:patientId/followups', getPatientFollowUps);

export default router;
