import React, { useState } from 'react';
import { X, AlertCircle, RefreshCw } from 'lucide-react';
import { FollowUp } from '../../../types/followup';
import { AVAILABLE_TIME_SLOTS, getTodayIST } from '../../../services/clinicalDemoData';

interface Props {
  followUp: FollowUp;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    followUpId: string,
    newDate: string,
    newTime: string,
    reason: string
  ) => Promise<void>;
}

export const RescheduleFollowUpModal: React.FC<Props> = ({
  followUp,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [newDate, setNewDate] = useState(getTodayIST());
  const [newTime, setNewTime] = useState('11:00 AM');
  const [reason, setReason] = useState(
    followUp.status === 'MISSED'
      ? 'Rescheduled missed follow-up'
      : 'Patient requested reschedule'
  );
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) {
      setError('Please choose a new follow-up date.');
      return;
    }
    if (!newTime) {
      setError('Please choose a time slot.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onConfirm(followUp.followUpId, newDate, newTime, reason.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to reschedule follow-up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reschedule-modal-title"
    >
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-teal-700">
            <RefreshCw className="w-5 h-5" />
            <h3 id="reschedule-modal-title" className="text-sm font-bold text-slate-900">
              Reschedule Follow-up
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Original Record Banner */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1 text-slate-600">
            <div>
              <span className="font-semibold text-slate-700">Patient: </span>
              {followUp.patientName} ({followUp.patientId})
            </div>
            <div>
              <span className="font-semibold text-slate-700">Original Date: </span>
              {followUp.date} at {followUp.time}
            </div>
            <div>
              <span className="font-semibold text-slate-700">Status: </span>
              <span className="font-semibold text-rose-700">{followUp.status}</span>
            </div>
          </div>

          <p className="text-2xs text-slate-500">
            The historical follow-up record will be preserved. A new linked follow-up will be scheduled for the patient.
          </p>

          {/* New Date */}
          <div>
            <label
              htmlFor="new-date"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              New Follow-up Date <span className="text-rose-600">*</span>
            </label>
            <input
              id="new-date"
              type="date"
              min={getTodayIST()}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-teal-600 focus:bg-white"
            />
          </div>

          {/* New Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select New Time Slot <span className="text-rose-600">*</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {AVAILABLE_TIME_SLOTS.map((slot) => {
                const isSelected = newTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setNewTime(slot)}
                    className={`p-2 rounded text-2xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-800'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reschedule Reason */}
          <div>
            <label
              htmlFor="reschedule-reason"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Reschedule Note / Reason
            </label>
            <input
              id="reschedule-reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Patient missed previous slot; rescheduled for home visit..."
              className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-teal-600 focus:bg-white"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-md shadow-2xs transition-colors"
            >
              {isSubmitting ? 'Rescheduling...' : 'Reschedule Follow-up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
