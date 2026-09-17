import { Request, Response, NextFunction } from 'express';
import { TriageModel } from '../models/Triage.model';
import { callAiTriage, checkAiServiceHealth, AiTriageRequest } from '../services/aiService';
import mongoose from 'mongoose';

// ---------------------------------------------------------------------------
// POST /api/triage
// Submit a triage assessment — calls AI service then saves to DB
// ---------------------------------------------------------------------------
export const createTriageAssessment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      patientId,
      healthWorkerId,
      chiefComplaint,
      symptoms,
      symptomDuration,
      vitals = {},
      additionalInfo = {},
      existingConditions = [],
    } = req.body;

    // Basic validation
    if (!patientId || !chiefComplaint || !symptoms) {
      res.status(400).json({
        status: 'error',
        message: 'patientId, chiefComplaint, and symptoms are required.',
      });
      return;
    }

    // Call AI triage service
    const aiRequest: AiTriageRequest = {
      patientId,
      chiefComplaint,
      symptoms,
      symptomDuration,
      vitals,
      knownAllergies: additionalInfo.knownAllergies,
      currentMedications: additionalInfo.currentMedications,
      relevantHistory: additionalInfo.relevantHistory,
      existingConditions,
    };

    let aiResult;
    try {
      aiResult = await callAiTriage(aiRequest);
    } catch (aiError) {
      // AI service unavailable — do not fabricate result
      const isTimeout =
        (aiError as any)?.code === 'ECONNABORTED' ||
        (aiError as any)?.code === 'ETIMEDOUT';
      const isUnreachable =
        (aiError as any)?.code === 'ECONNREFUSED' ||
        (aiError as any)?.code === 'ENOTFOUND';

      res.status(503).json({
        status: 'error',
        message: isTimeout
          ? 'AI assessment timed out. Please retry.'
          : isUnreachable
          ? 'AI assessment service is currently unavailable. Please retry shortly.'
          : 'AI assessment could not be completed. Please retry.',
        code: 'AI_SERVICE_UNAVAILABLE',
      });
      return;
    }

    // Validate AI response enums (defensive)
    const validRiskLevels = ['LOW', 'MODERATE', 'HIGH'];
    const validPriorities = ['ROUTINE', 'PRIORITY', 'URGENT'];
    if (
      !validRiskLevels.includes(aiResult.riskLevel) ||
      !validPriorities.includes(aiResult.priority)
    ) {
      res.status(500).json({
        status: 'error',
        message: 'Received an unexpected response from AI service. Please retry.',
        code: 'AI_INVALID_RESPONSE',
      });
      return;
    }

    // Save to MongoDB
    let savedAssessment;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const triageDoc = new TriageModel({
        patientId,
        healthWorkerId: healthWorkerId || 'HW-DEFAULT',
        chiefComplaint,
        symptoms,
        symptomDuration,
        vitals,
        additionalInfo,
        riskLevel: aiResult.riskLevel,
        priority: aiResult.priority,
        indicators: aiResult.indicators,
        aiSummary: aiResult.summary,
        recommendedNextStep: aiResult.recommendedNextStep,
        missingInformation: aiResult.missingInformation,
        emergencyFlag: aiResult.emergencyFlag,
      });

      savedAssessment = await triageDoc.save();
    }

    // Build response
    const year = new Date().getFullYear();
    const assessmentId =
      savedAssessment?.assessmentId ||
      `TR-${year}-${String(Date.now()).slice(-4)}`;

    res.status(201).json({
      status: 'success',
      data: {
        assessmentId,
        patientId,
        riskLevel: aiResult.riskLevel,
        priority: aiResult.priority,
        summary: aiResult.summary,
        indicators: aiResult.indicators,
        recommendedNextStep: aiResult.recommendedNextStep,
        missingInformation: aiResult.missingInformation,
        emergencyFlag: aiResult.emergencyFlag,
        disclaimer: aiResult.disclaimer,
        savedToDb: !!savedAssessment,
        createdAt: savedAssessment?.createdAt || new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// GET /api/triage/:id
// Fetch a single triage assessment by assessmentId
// ---------------------------------------------------------------------------
export const getTriageAssessment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      res.status(503).json({
        status: 'error',
        message: 'Database is unavailable. Assessment history requires connectivity.',
      });
      return;
    }

    const assessment = await TriageModel.findOne({ assessmentId: id }).lean();
    if (!assessment) {
      res.status(404).json({
        status: 'error',
        message: `Triage assessment '${id}' not found.`,
      });
      return;
    }

    res.status(200).json({ status: 'success', data: assessment });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// GET /api/patients/:patientId/triage
// Fetch all triage assessments for a patient
// ---------------------------------------------------------------------------
export const getPatientTriageHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { patientId } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      res.status(503).json({
        status: 'error',
        message: 'Database is unavailable.',
      });
      return;
    }

    const assessments = await TriageModel.find({ patientId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      status: 'success',
      data: assessments,
      count: assessments.length,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// GET /api/triage/ai-health
// Check if AI service is reachable (for frontend to show status)
// ---------------------------------------------------------------------------
export const checkAiHealth = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isHealthy = await checkAiServiceHealth();
    res.status(200).json({
      status: 'success',
      aiService: isHealthy ? 'online' : 'unavailable',
    });
  } catch (error) {
    next(error);
  }
};
