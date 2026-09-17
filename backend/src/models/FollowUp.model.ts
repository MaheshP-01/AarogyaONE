import mongoose, { Document, Schema } from 'mongoose';

// ---------------------------------------------------------------------------
// Follow-up status and mode enums
// ---------------------------------------------------------------------------
export type FollowUpStatus =
  | 'UPCOMING'
  | 'DUE'
  | 'COMPLETED'
  | 'MISSED'
  | 'CANCELLED';

export type FollowUpMode =
  | 'IN_PERSON'
  | 'TELECONSULTATION'
  | 'HW_VISIT';

// ---------------------------------------------------------------------------
// FollowUp document interface
// ---------------------------------------------------------------------------
export interface IFollowUp extends Document {
  followUpId: string;
  patientId: string;
  patientName: string;
  healthWorkerId: string;
  doctorId?: string;
  doctorName?: string;
  relatedConsultationId?: string;
  relatedTriageId?: string;
  relatedAppointmentId?: string;
  date: string;           // YYYY-MM-DD
  time: string;           // HH:MM
  mode: FollowUpMode;
  reason: string;
  notes?: string;
  status: FollowUpStatus;
  // Completion fields
  completionNotes?: string;
  completionOutcome?: string;
  patientAttended?: boolean;
  completedAt?: Date;
  // Reschedule tracking
  rescheduledFromId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const FollowUpSchema = new Schema<IFollowUp>(
  {
    followUpId: {
      type: String,
      unique: true,
      index: true,
    },
    patientId: {
      type: String,
      required: [true, 'Patient ID is required'],
      index: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    healthWorkerId: {
      type: String,
      required: true,
      trim: true,
    },
    doctorId: {
      type: String,
      trim: true,
    },
    doctorName: {
      type: String,
      trim: true,
    },
    relatedConsultationId: {
      type: String,
      trim: true,
    },
    relatedTriageId: {
      type: String,
      trim: true,
    },
    relatedAppointmentId: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
      index: true,
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
      match: [/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'],
    },
    mode: {
      type: String,
      enum: ['IN_PERSON', 'TELECONSULTATION', 'HW_VISIT'],
      required: true,
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      maxlength: 500,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['UPCOMING', 'DUE', 'COMPLETED', 'MISSED', 'CANCELLED'],
      default: 'UPCOMING',
      index: true,
    },
    completionNotes: { type: String, trim: true },
    completionOutcome: { type: String, trim: true },
    patientAttended: { type: Boolean },
    completedAt: { type: Date },
    rescheduledFromId: { type: String, trim: true },
  },
  {
    timestamps: true,
    collection: 'follow_ups',
  }
);

// Pre-save: auto-generate followUpId
FollowUpSchema.pre('save', async function (next) {
  if (!this.followUpId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('FollowUp').countDocuments();
    this.followUpId = `FU-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

export const FollowUpModel = mongoose.model<IFollowUp>('FollowUp', FollowUpSchema);
