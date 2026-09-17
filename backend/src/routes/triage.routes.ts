
import { Router } from 'express';
import {
  createTriageAssessment,
  getTriageAssessment,
  getPatientTriageHistory,
  checkAiHealth,
} from '../controllers/triage.controller';

const router = Router();

// POST /api/triage — create a new triage assessment
router.post('/', createTriageAssessment);

// GET /api/triage/ai-health — check if AI service is reachable
router.get('/ai-health', checkAiHealth);

// GET /api/triage/:id — fetch a single triage assessment
router.get('/:id', getTriageAssessment);

export default router;
