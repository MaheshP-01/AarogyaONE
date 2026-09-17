import mongoose, { Document, Schema } from 'mongoose';

// ---------------------------------------------------------------------------
// Appointment status and mode enums
// ---------------------------------------------------------------------------
export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CHECKED_IN'
  | 'WAITING'
  | 'IN_CONSULTATION'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type ConsultationMode =
  | 'IN_PERSON'
  | 'TELECONSULTATION'
  | 'HW_ASSISTED';

// ---------------------------------------------------------------------------
// Appointment document interface
// ---------------------------------------------------------------------------
export interface IAppointment extends Document {
  appointmentId: string;
  patientId: string;
  patientName: string;
  healthWorkerId: string;
  doctorId: string;
  doctorName: string;
  facilityId: string;
  facilityName: string;
  triageId?: string;
  date: string;           // YYYY-MM-DD (IST)
  time: string;           // HH:MM (24-hour, IST)
  mode: ConsultationMode;
  reason: string;
  tokenNumber: string;
  status: AppointmentStatus;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const AppointmentSchema = new Schema<IAppointment>(
  {
    appointmentId: {
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
      required: [true, 'Doctor ID is required'],
      trim: true,
    },
    doctorName: {
      type: String,
      required: true,
      trim: true,
    },
    facilityId: {
      type: String,
      required: true,
      trim: true,
    },
    facilityName: {
      type: String,
      required: true,
      trim: true,
    },
    triageId: {
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
      enum: ['IN_PERSON', 'TELECONSULTATION', 'HW_ASSISTED'],
      required: true,
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      maxlength: 500,
    },
    tokenNumber: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'SCHEDULED',
        'CHECKED_IN',
        'WAITING',
        'IN_CONSULTATION',
        'COMPLETED',
        'CANCELLED',
        'NO_SHOW',
      ],
      default: 'SCHEDULED',
      index: true,
    },
    cancelReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'appointments',
  }
);

// Compound index for double-booking protection
AppointmentSchema.index({ doctorId: 1, date: 1, time: 1 });

// Pre-save: generate appointmentId and tokenNumber
AppointmentSchema.pre('save', async function (next) {
  if (!this.appointmentId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Appointment').countDocuments();
    this.appointmentId = `APT-${year}-${String(count + 1).padStart(5, '0')}`;
    // Token: P-001 format based on today's count
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCount = await mongoose
      .model('Appointment')
      .countDocuments({ date: todayStr });
    this.tokenNumber = `P-${String(todayCount + 1).padStart(3, '0')}`;
  }
  next();
});

export const AppointmentModel = mongoose.model<IAppointment>(
  'Appointment',
  AppointmentSchema
);
