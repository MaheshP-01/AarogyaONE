import mongoose, { Document, Schema } from 'mongoose';

// ---------------------------------------------------------------------------
// Vitals sub-document
// ---------------------------------------------------------------------------
export interface IVitals {
  temperature?: number;   // °F
  heartRate?: number;     // bpm
  bpSystolic?: number;    // mmHg
  bpDiastolic?: number;   // mmHg
  spo2?: number;          // %
  respiratoryRate?: number; // breaths/min
}

const VitalsSchema = new Schema<IVitals>(
  {
    temperature: { type: Number, min: 85, max: 115 },
    heartRate: { type: Number, min: 20, max: 300 },
    bpSystolic: { type: Number, min: 50, max: 300 },
    bpDiastolic: { type: Number, min: 20, max: 200 },
    spo2: { type: Number, min: 50, max: 100 },
    respiratoryRate: { type: Number, min: 1, max: 80 },
  },
  { _id: false }
);

// ---------------------------------------------------------------------------
// Triage document interface
// ---------------------------------------------------------------------------
export interface ITriage extends Document {
  patientId: string;
  healthWorkerId: string;
  chiefComplaint: string;
  symptoms: string;
  symptomDuration?: string;
  vitals: IVitals;
  additionalInfo?: {
    knownAllergies?: string;
    currentMedications?: string;
    relevantHistory?: string;
  };
  // AI-generated fields
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  priority: 'ROUTINE' | 'PRIORITY' | 'URGENT';
  indicators: string[];
  aiSummary: string;
  recommendedNextStep: string;
  missingInformation: string[];
  emergencyFlag: boolean;
  // Assessment metadata
  assessmentId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Triage Schema
// ---------------------------------------------------------------------------
const TriageSchema = new Schema<ITriage>(
  {
    patientId: {
      type: String,
      required: [true, 'Patient ID is required'],
      trim: true,
      index: true,
    },
    healthWorkerId: {
      type: String,
      required: [true, 'Health worker ID is required'],
      trim: true,
    },
    chiefComplaint: {
      type: String,
      required: [true, 'Chief complaint is required'],
      trim: true,
      maxlength: [500, 'Chief complaint must not exceed 500 characters'],
    },
    symptoms: {
      type: String,
      required: [true, 'Symptoms are required'],
      trim: true,
      maxlength: [2000, 'Symptoms must not exceed 2000 characters'],
    },
    symptomDuration: {
      type: String,
      trim: true,
      maxlength: [100, 'Duration must not exceed 100 characters'],
    },
    vitals: {
      type: VitalsSchema,
      default: {},
    },
    additionalInfo: {
      knownAllergies: { type: String, trim: true },
      currentMedications: { type: String, trim: true },
      relevantHistory: { type: String, trim: true },
    },
    riskLevel: {
      type: String,
      enum: ['LOW', 'MODERATE', 'HIGH'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['ROUTINE', 'PRIORITY', 'URGENT'],
      required: true,
    },
    indicators: [{ type: String }],
    aiSummary: {
      type: String,
      required: true,
    },
    recommendedNextStep: {
      type: String,
      required: true,
    },
    missingInformation: [{ type: String }],
    emergencyFlag: {
      type: Boolean,
      default: false,
    },
    assessmentId: {
      type: String,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'triage_assessments',
  }
);

// ---------------------------------------------------------------------------
// Pre-save: generate human-readable assessment ID if not set
// ---------------------------------------------------------------------------
TriageSchema.pre('save', async function (next) {
  if (!this.assessmentId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Triage').countDocuments();
    this.assessmentId = `TR-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export const TriageModel = mongoose.model<ITriage>('Triage', TriageSchema);
