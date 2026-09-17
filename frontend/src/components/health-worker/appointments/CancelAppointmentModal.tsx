import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Appointment } from '../../../types/appointment';

interface Props {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (appointmentId: string, cancelReason: string) => Promise<void>;
}

export const CancelAppointmentModal: React.FC<Props> = ({
  appointment,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason for cancellation.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onConfirm(appointment.appointmentId, reason.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-modal-title"
    >
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-rose-700">
            <AlertCircle className="w-5 h-5" />
            <h3 id="cancel-modal-title" className="text-sm font-bold text-slate-900">
              Cancel Appointment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-xs text-slate-600 space-y-1">
            <div>
              <span className="font-semibold text-slate-700">Patient: </span>
              {appointment.patientName} ({appointment.patientId})
            </div>
            <div>
              <span className="font-semibold text-slate-700">Doctor: </span>
              {appointment.doctorName}
            </div>
            <div>
              <span className="font-semibold text-slate-700">Time: </span>
              {appointment.date} at {appointment.time} ({appointment.tokenNumber})
            </div>
          </div>

          <p className="text-xs text-slate-500">
            The appointment will not be deleted from historical records. Its status will be updated to{' '}
            <span className="font-semibold text-slate-700">CANCELLED</span>.
          </p>

          <div>
            <label
              htmlFor="cancel-reason"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Reason for Cancellation <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="cancel-reason"
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Patient called to reschedule, transported to emergency, unable to travel..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-teal-600 focus:bg-white resize-none"
              autoFocus
            />
            {error && <p className="text-2xs text-rose-600 mt-1 font-medium">{error}</p>}
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
            >
              Keep Appointment
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-md shadow-2xs transition-colors"
            >
              {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
