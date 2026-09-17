import { Router } from 'express';
import {
  createFollowUp,
  getFollowUps,
  getFollowUpById,
  completeFollowUp,
  rescheduleFollowUp,
  updateFollowUpStatus,
  getPatientFollowUps,
} from '../controllers/followup.controller';

const router = Router();

// GET /api/followups/patient/:patientId
router.get('/patient/:patientId', getPatientFollowUps);

// GET /api/followups
router.get('/', getFollowUps);

// POST /api/followups
router.post('/', createFollowUp);

// GET /api/followups/:id
router.get('/:id', getFollowUpById);

// PATCH /api/followups/:id/complete
router.patch('/:id/complete', completeFollowUp);

// POST /api/followups/:id/reschedule
router.post('/:id/reschedule', rescheduleFollowUp);

// PATCH /api/followups/:id/status
router.patch('/:id/status', updateFollowUpStatus);

export default router;
