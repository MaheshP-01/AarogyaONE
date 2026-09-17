import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  ListChecks,
} from 'lucide-react';
import { SavedTriageAssessment } from '../../../types/triage';
import { RiskBadge } from './RiskBadge';
import { EmergencyAlert } from './EmergencyAlert';

interface AITriageResultProps {
  result: SavedTriageAssessment;
  onSave: () => void;
  onEdit: () => void;
  isSaving: boolean;
  patientName: string;
}

const PRIORITY_CONFIG: Record<
  string,
  { label: string; classes: string }
> = {
  ROUTINE: {
    label: 'ROUTINE',
    classes: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  PRIORITY: {
    label: 'PRIORITY',
    classes: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  URGENT: {
    label: 'URGENT',
    classes: 'bg-red-50 text-red-800 border-red-200',
  },
};

export const AITriageResult: React.FC<AITriageResultProps> = ({
  result,
  onSave,
  onEdit,
  isSaving,
  patientName,
}) => {
  const priorityConfig =
    PRIORITY_CONFIG[result.priority] || PRIORITY_CONFIG.ROUTINE;

  return (
    <div className="space-y-4">
      {/* AI Header & Disclaimer */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-teal-600" />
            <h2 className="text-xs font-bold text-slate-800">
              AI-Assisted Triage
            </h2>
          </div>
          <p className="text-2xs text-slate-500 mt-0.5">
            {result.disclaimer}
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Risk Level + Priority */}
          <div className="flex flex-wrap items-center gap-3">
            <RiskBadge risk={result.riskLevel} size="md" />
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${priorityConfig.classes}`}
            >
              Priority: {priorityConfig.label}
            </span>
          </div>

          {/* Emergency Alert */}
          {result.emergencyFlag && (
            <EmergencyAlert
              onEscalate={() => {
                // Placeholder: In a full implementation, this would open an escalation workflow
                alert(
                  'Please contact the PHC/district hospital directly. This feature will be connected in a future update.'
                );
              }}
            />
          )}

          {/* Reported Indicators */}
          {result.indicators && result.indicators.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center space-x-1.5">
                <ListChecks className="w-3.5 h-3.5 text-slate-500" />
                <span>Reported Indicators</span>
              </p>
              <ul className="space-y-1">
                {result.indicators.map((indicator, i) => (
                  <li
                    key={i}
                    className="flex items-start space-x-2 text-xs text-slate-700"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{indicator}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Clinical Summary */}
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-1.5">
              Clinical Summary
            </p>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
              {result.summary}
            </p>
          </div>

          {/* Recommended Next Step */}
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-1.5">
              Recommended Next Step
            </p>
            <p className="text-xs text-slate-700 leading-relaxed bg-teal-50 border border-teal-200 rounded-md px-3 py-2">
              {result.recommendedNextStep}
            </p>
          </div>

          {/* Missing Information */}
          {result.missingInformation && result.missingInformation.length > 0 ? (
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Missing Information</span>
              </p>
              <ul className="space-y-1">
                {result.missingInformation.map((item, i) => (
                  <li key={i} className="text-2xs text-amber-700">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-2xs text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Required assessment information is available.</span>
            </div>
          )}
        </div>
      </div>

      {/* Patient context */}
      <p className="text-2xs text-slate-500 px-1">
        Assessment for: <span className="font-semibold text-slate-700">{patientName}</span>
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={onEdit}
          disabled={isSaving}
          className="flex-1 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 cursor-pointer disabled:opacity-50"
        >
          Edit Assessment
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 px-4 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-1 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSaving ? (
            <>
              <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Saving Assessment...</span>
            </>
          ) : (
            <span>Save Triage</span>
          )}
        </button>
      </div>
    </div>
  );
};
