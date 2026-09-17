import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { FollowUp, FollowUpCompletionData } from '../../../types/followup';

interface Props {
  followUp: FollowUp;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (followUpId: string, completionData: FollowUpCompletionData) => Promise<void>;
}

export const CompleteFollowUpModal: React.FC<Props> = ({
  followUp,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [patientAttended, setPatientAttended] = useState(true);
  const [outcome, setOutcome] = useState('Symptoms resolved / Improved');
  const [customOutcome, setCustomOutcome] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOutcome = outcome === 'Other' ? customOutcome.trim() : outcome;
    if (!finalOutcome) {
      setError('Please specify the follow-up outcome.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onConfirm(followUp.followUpId, {
        patientAttended,
        completionOutcome: finalOutcome,
        completionNotes: notes.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to complete follow-up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="complete-modal-title"
    >
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-teal-700">
            <CheckCircle2 className="w-5 h-5" />
            <h3 id="complete-modal-title" className="text-sm font-bold text-slate-900">
              Complete Follow-up
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

          {/* Follow-up Summary Banner */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1 text-slate-600">
            <div>
              <span className="font-semibold text-slate-700">Patient: </span>
              {followUp.patientName} ({followUp.patientId})
            </div>
            <div>
              <span className="font-semibold text-slate-700">Reason: </span>
              {followUp.reason}
            </div>
            <div>
              <span className="font-semibold text-slate-700">Scheduled: </span>
              {followUp.date} at {followUp.time} ({(followUp.mode || 'VISIT').replace('_', ' ')})
            </div>
          </div>

          {/* Patient Attended? Yes / No */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Patient attended? <span className="text-rose-600">*</span>
            </label>
            <div className="flex items-center space-x-3">
              <label
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md border cursor-pointer transition-all ${
                  patientAttended
                    ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="attended"
                  checked={patientAttended}
                  onChange={() => setPatientAttended(true)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span>Yes</span>
              </label>

              <label
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md border cursor-pointer transition-all ${
                  !patientAttended
                    ? 'border-rose-600 bg-rose-50 text-rose-900 font-semibold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="attended"
                  checked={!patientAttended}
                  onChange={() => setPatientAttended(false)}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {/* Outcome */}
          <div>
            <label
              htmlFor="completion-outcome"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Clinical Outcome <span className="text-rose-600">*</span>
            </label>
            <select
              id="completion-outcome"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-teal-600 focus:bg-white text-slate-800"
            >
              <option value="Symptoms resolved / Improved">Symptoms resolved / Improved</option>
              <option value="Condition stable on medication">Condition stable on medication</option>
              <option value="Referred for diagnostic tests">Referred for diagnostic tests</option>
              <option value="Referred to secondary facility">Referred to secondary facility</option>
              <option value="Medication adjusted by doctor">Medication adjusted by doctor</option>
              <option value="Other">Other outcome...</option>
            </select>
          </div>

          {outcome === 'Other' && (
            <div>
              <input
                type="text"
                value={customOutcome}
                onChange={(e) => setCustomOutcome(e.target.value)}
                placeholder="Describe specific outcome..."
                className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-teal-600 focus:bg-white"
                autoFocus
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label
              htmlFor="completion-notes"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Follow-up Notes / Observations
            </label>
            <textarea
              id="completion-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record patient vitals, medication adherence, health-worker advice given..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-teal-600 focus:bg-white resize-none"
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
              {isSubmitting ? 'Saving...' : 'Complete Follow-up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
