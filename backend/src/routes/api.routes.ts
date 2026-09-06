import { Router } from 'express';
import healthRoutes from './health.routes';

const router = Router();

// Health check endpoint mounted at /api/health
router.use('/health', healthRoutes);

export default router;
