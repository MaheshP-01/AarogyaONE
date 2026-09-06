import { Request, Response } from 'express';

/**
 * Health check controller for backend service
 * GET /api/health
 */
export const getHealth = (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    service: 'backend',
  });
};
