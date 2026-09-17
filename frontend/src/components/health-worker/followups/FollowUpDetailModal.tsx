import React from 'react';
import {
  X,
  User,
  CheckCircle2,
  RefreshCw,
  Ban,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { FollowUp } from '../../../types/followup';
import { FollowUpStatusBadge } from './FollowUpStatusBadge';

interface Props {
  followUp: FollowUp | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenComplete: (followUp: FollowUp) => void;
  onOpenReschedule: (followUp: FollowUp) => void;
  onCancel: (followUpId: string) => Promise<void>;
}

export const FollowUpDetailModal: React.FC<Props> = ({
  followUp,
  isOpen,
  onClose,
  onOpenComplete,
  onOpenReschedule,
  onCancel,
}) => {
  if (!isOpen || !followUp) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="followup-detail-title"
    >
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {followUp.followUpId}
            </span>
            <h3 id="followup-detail-title" className="text-sm font-bold text-slate-900">
              Follow-up Details
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

        {/* Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          {/* Status Bar */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="text-3xs font-semibold text-slate-400 uppercase tracking-wider block">
                Target Date
              </span>
              <span className="font-bold text-slate-800 text-xs">
                {followUp.date} at {followUp.time}
              </span>
            </div>
            <div>
              <span className="text-3xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Status
              </span>
              <FollowUpStatusBadge status={followUp.status} />
            </div>
          </div>

          {/* Patient Details */}
          <div className="p-3.5 border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" /> Patient
              </span>
              <Link
                to={`/doctor/patients/${followUp.patientId}`}
                className="text-2xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-0.5"
              >
                Patient Record <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-2xs text-slate-400 block">Name</span>
                <span className="font-bold text-slate-900 text-xs">{followUp.patientName}</span>
              </div>
              <div>
                <span className="text-2xs text-slate-400 block">Patient ID</span>
                <span className="font-mono text-teal-800 text-xs">{followUp.patientId}</span>
              </div>
            </div>
          </div>

          {/* Clinical Follow-up Details */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
            <div>
              <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">
                Reason for Follow-up
              </span>
              <p className="text-xs font-semibold text-slate-900">{followUp.reason}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
              <div>
                <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block">
                  Follow-up Mode
                </span>
                <span className="font-medium text-slate-800 text-xs mt-0.5 block">
                  {(followUp.mode || 'VISIT').replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block">
                  Assigned Doctor
                </span>
                <span className="font-medium text-slate-800 text-xs mt-0.5 block">
                  {followUp.doctorName || 'Attending Physician'}
                </span>
              </div>
            </div>

            {followUp.notes && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">
                  Clinical Instructions / Notes
                </span>
                <p className="text-2xs text-slate-700 leading-relaxed">{followUp.notes}</p>
              </div>
            )}
          </div>

          {/* Completion Info (if completed) */}
          {followUp.status === 'COMPLETED' && (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-2">
              <span className="text-2xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Completion Record
              </span>
              <div className="space-y-1 text-2xs text-emerald-900">
                <div>
                  <span className="font-semibold">Patient Attended: </span>
                  {followUp.patientAttended !== false ? 'Yes' : 'No'}
                </div>
                <div>
                  <span className="font-semibold">Outcome: </span>
                  {followUp.completionOutcome || 'Reviewed & concluded'}
                </div>
                {followUp.completionNotes && (
                  <div>
                    <span className="font-semibold">Notes: </span>
                    {followUp.completionNotes}
                  </div>
                )}
                {followUp.completedAt && (
                  <div className="text-3xs text-emerald-700 pt-1">
                    Completed on: {new Date(followUp.completedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reschedule Trace (if rescheduled) */}
          {followUp.rescheduledFromId && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-2xs text-amber-900">
              <span className="font-semibold">Rescheduled from: </span>
              <span className="font-mono">{followUp.rescheduledFromId}</span>
            </div>
          )}

          {/* Meta Info */}
          <div className="text-3xs text-slate-400 flex items-center justify-between pt-1">
            <span>Created by: {followUp.healthWorkerId}</span>
            <span>Recorded: {new Date(followUp.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            {followUp.status !== 'CANCELLED' && followUp.status !== 'COMPLETED' && (
              <button
                type="button"
                onClick={() => onCancel(followUp.followUpId)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 hover:bg-rose-50 rounded-md border border-rose-200 transition-colors"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {followUp.status !== 'COMPLETED' && followUp.status !== 'CANCELLED' && (
              <>
                <button
                  type="button"
                  onClick={() => onOpenReschedule(followUp)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reschedule</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenComplete(followUp)}
                  className="inline-flex items-center space-x-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md shadow-2xs transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Complete</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
