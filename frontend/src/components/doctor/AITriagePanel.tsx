import React, { useState } from 'react';
import { AITriageAssessment } from '../../types/doctor';
import { StatusBadge } from './StatusBadge';

interface AITriagePanelProps {
  triage: AITriageAssessment;
  onReviewSymptoms?: () => void;
}

export const AITriagePanel: React.FC<AITriagePanelProps> = ({ triage }) => {
  const [showLogic, setShowLogic] = useState(false);

  return (
    <div className="bg-slate-50/60 border border-slate-200 rounded-md p-3.5 sm:p-4 space-y-3">
      {/* Header & Disclaimer */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-2.5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
              AI-Assisted Triage
            </h3>
            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-600">
              Decision Support
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
            Decision-support information based on reported symptoms and available vitals. Not a diagnosis.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <StatusBadge type="risk" value={triage.riskLevel} />
          <StatusBadge type="priority" value={triage.priority} />
        </div>
      </div>

      {/* Reported Indicators */}
      <div>
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
          Reported Indicators
        </span>
        <div className="flex flex-wrap gap-1">
          {triage.reportedIndicators.map((ind, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white text-slate-800 border border-slate-200 font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" />
              {ind}
            </span>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      <div className="space-y-1">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
          AI Summary
        </span>
        <p className="text-xs text-slate-800 bg-white border border-slate-200 p-2.5 rounded leading-relaxed">
          {triage.aiSummary}
        </p>
      </div>

      {/* Recommended Next Step */}
      <div className="text-xs">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
          Recommended Next Step
        </span>
        <p className="text-slate-900 font-medium">
          {triage.recommendedNextStep}
        </p>
      </div>

      {/* Missing Information Notice if any */}
      {triage.potentialMissingInfo && (
        <div className="text-[11px] text-amber-800 bg-amber-50/60 border border-amber-200 p-2 rounded">
          <strong>Missing intake data:</strong> {triage.potentialMissingInfo}
        </div>
      )}

      {/* Transparent Logic Toggle */}
      <div className="pt-1 text-[11px]">
        <button
          type="button"
          onClick={() => setShowLogic(!showLogic)}
          className="text-slate-500 hover:text-slate-800 underline underline-offset-2"
        >
          {showLogic ? 'Hide scoring logic' : 'Show triage criteria breakdown'}
        </button>

        {showLogic && (
          <div className="mt-2 p-2.5 bg-white border border-slate-200 rounded text-[11px] space-y-1 text-slate-600 font-mono">
            <div>• Oxygen Saturation &lt; 92% triggers High Risk Flag (+4 score)</div>
            <div>• Respiratory Rate &ge; 22/min triggers Tachypnea Alert (+2 score)</div>
            <div>• Fever &gt; 101°F with acute cough flagged for chest review (+2 score)</div>
            <div className="text-slate-400 text-[10px] pt-0.5 border-t border-slate-100">
              ICMR / MoHFW National Clinical Triage Protocol Guidelines
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
