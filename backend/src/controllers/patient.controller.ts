

import { Request, Response, NextFunction } from 'express';
import { TriageModel } from '../models/Triage.model';
import mongoose from 'mongoose';

// ---------------------------------------------------------------------------
// GET /api/patients/search
// Search patients by name, ID, or phone (from MongoDB if available)
// ---------------------------------------------------------------------------
export const searchPatients = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { q } = req.query;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      // Database not available — frontend should fall back to localStorage search
      res.status(503).json({
        status: 'error',
        message: 'Database unavailable. Use local patient registry.',
        code: 'DB_UNAVAILABLE',
      });
      return;
    }

    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      res.status(400).json({
        status: 'error',
        message: 'Search query must be at least 2 characters.',
      });
      return;
    }

    // Note: patients are stored in localStorage (frontend-only) in this MVP.
    // This endpoint is a placeholder for future server-side patient storage.
    // When patients are synced to backend, this query will search them.
    res.status(200).json({
      status: 'success',
      data: [],
      message: 'Patient search will be available once backend patient sync is configured.',
    });
  } catch (error) {
    next(error);
  }
};
