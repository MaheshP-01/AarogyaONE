import React, { useState } from 'react';
import { AlertTriangle, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';
import { AITriageAssessment } from '../../types/doctor';
import { StatusBadge } from './StatusBadge';

interface AITriagePanelProps {
  triage: AITriageAssessment;
  onReviewSymptoms?: () => void;
}

export const AITriagePanel: React.FC<AITriagePanelProps> = ({ triage, onReviewSymptoms }) => {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-2xs">
      {/* Header with explicit AI decision support label */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              <Sparkles className="w-3 h-3" />
            </span>
            <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
              AI-Assisted Triage
            </h3>
            <span className="text-3xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              Decision Support
            </span>
          </div>
          <p className="text-2xs text-slate-500 mt-1 leading-relaxed">
            {triage.disclaimer}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <StatusBadge type="risk" value={triage.riskLevel} size="md" />
          <StatusBadge type="priority" value={triage.priority} size="md" />
        </div>
      </div>

      {/* Reported Clinical Indicators */}
      <div className="py-3 border-b border-slate-100">
        <span className="text-3xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
          Reported Indicators
        </span>
        <div className="flex flex-wrap gap-1.5">
          {triage.reportedIndicators.map((ind, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5" />
              {ind}
            </span>
          ))}
        </div>
      </div>

      {/* AI Clinical Summary (strictly non-diagnostic) */}
      <div className="py-3 border-b border-slate-100 space-y-2">
        <div>
          <span className="text-3xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Clinical Summary
          </span>
          <p className="text-xs text-slate-800 bg-slate-50 border border-slate-200 p-2.5 rounded-md leading-relaxed">
            "{triage.aiSummary}"
          </p>
        </div>

        <div>
          <span className="text-3xs font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
            Recommended Next Step
          </span>
          <p className="text-xs font-medium text-teal-800 flex items-center space-x-1">
            <ChevronRight className="w-3.5 h-3.5 text-teal-600" />
            <span>{triage.recommendedNextStep}</span>
          </p>
        </div>

        {triage.potentialMissingInfo && (
          <div className="flex items-start space-x-2 p-2 bg-amber-50 border border-amber-200 rounded text-2xs text-amber-900">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Potential Missing Information: </span>
              <span>{triage.potentialMissingInfo}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action and Transparency Toggle */}
      <div className="pt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-2xs font-medium text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showExplanation ? 'Hide Triage Logic' : 'How was this scored?'}</span>
        </button>

        {onReviewSymptoms && (
          <button
            type="button"
            onClick={onReviewSymptoms}
            className="px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md transition-colors cursor-pointer"
          >
            Review Symptoms
          </button>
        )}
      </div>

      {/* Transparent AI Logic Drawer */}
      {showExplanation && (
        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-md text-2xs text-slate-600 space-y-1">
          <span className="font-bold text-slate-800 block">Decision Support Transparency:</span>
          <p>
            Triage score computed using standardized Indian Public Health Standards (IPHS) urgency guidelines. Symptoms of respiratory distress, hypoxia (&lt;92%), and sustained high fever trigger urgent risk elevation to ensure prompt physician evaluation.
          </p>
        </div>
      )}
    </div>
  );
};
