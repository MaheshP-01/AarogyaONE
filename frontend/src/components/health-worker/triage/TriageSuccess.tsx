import React from 'react';
import { CheckCircle, RotateCcw, FileText } from 'lucide-react';
import { SavedTriageAssessment } from '../../../types/triage';
import { RiskBadge } from './RiskBadge';

interface TriageSuccessProps {
  assessment: SavedTriageAssessment;
  patientName: string;
  onStartNew: () => void;
  onViewRecord?: () => void;
}

export const TriageSuccess: React.FC<TriageSuccessProps> = ({
  assessment,
  patientName,
  onStartNew,
  onViewRecord,
}) => {
  return (
    <div className="space-y-4">
      {/* Success card */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-emerald-900">
              Triage Assessment Saved
            </h2>
            <p className="text-xs text-emerald-700 mt-0.5">
              The assessment has been recorded and linked to the patient record.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2 border-t border-emerald-200 pt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-medium">Patient</span>
            <span className="text-emerald-900 font-semibold">{patientName}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-medium">Assessment ID</span>
            <span className="font-mono font-bold text-emerald-900">
              {assessment.assessmentId}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-medium">Risk Level</span>
            <RiskBadge risk={assessment.riskLevel} size="sm" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-medium">Storage</span>
            <span
              className={`text-2xs font-semibold px-2 py-0.5 rounded-full ${
                assessment.savedToDb
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {assessment.savedToDb ? 'Saved to Database' : 'Saved Locally (Pending Sync)'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-medium">Recorded At</span>
            <span className="text-emerald-900">
              {new Date(assessment.createdAt).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        {onViewRecord && (
          <button
            type="button"
            onClick={onViewRecord}
            className="flex-1 flex items-center justify-center space-x-1.5 px-4 py-2.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Patient Record</span>
          </button>
        )}
        <button
          type="button"
          onClick={onStartNew}
          className="flex-1 flex items-center justify-center space-x-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Start New Triage</span>
        </button>
      </div>
    </div>
  );
};
