import React from 'react';
import { TriageFormData } from '../../../types/triage';

interface AdditionalInfoFormProps {
  data: Pick<
    TriageFormData,
    'knownAllergies' | 'currentMedications' | 'relevantHistory'
  >;
  onChange: (
    field: keyof Pick<
      TriageFormData,
      'knownAllergies' | 'currentMedications' | 'relevantHistory'
    >,
    value: string
  ) => void;
}

export const AdditionalInfoForm: React.FC<AdditionalInfoFormProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <p className="text-2xs text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
        All fields below are optional. Pre-filled values are from the patient's registered record.
        Update only if information has changed.
      </p>

      {/* Known Allergies */}
      <div>
        <label
          htmlFor="triage-allergies"
          className="block text-xs font-semibold text-slate-700 mb-1.5"
        >
          Known Allergies
          <span className="ml-1.5 text-2xs font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="triage-allergies"
          type="text"
          value={data.knownAllergies}
          onChange={(e) => onChange('knownAllergies', e.target.value)}
          placeholder="e.g. Penicillin, Sulfa drugs, or None reported"
          maxLength={300}
          className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-200 transition-colors"
        />
      </div>

      {/* Current Medications */}
      <div>
        <label
          htmlFor="triage-medications"
          className="block text-xs font-semibold text-slate-700 mb-1.5"
        >
          Current Medications
          <span className="ml-1.5 text-2xs font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="triage-medications"
          type="text"
          value={data.currentMedications}
          onChange={(e) => onChange('currentMedications', e.target.value)}
          placeholder="e.g. Amlodipine 5mg, Metformin, or None"
          maxLength={500}
          className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-200 transition-colors"
        />
      </div>

      {/* Relevant History */}
      <div>
        <label
          htmlFor="triage-history"
          className="block text-xs font-semibold text-slate-700 mb-1.5"
        >
          Relevant Medical History
          <span className="ml-1.5 text-2xs font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="triage-history"
          value={data.relevantHistory}
          onChange={(e) => onChange('relevantHistory', e.target.value)}
          placeholder="Any relevant surgeries, hospitalizations, or recent clinical events"
          rows={3}
          maxLength={1000}
          className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 rounded-lg resize-none focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-200 transition-colors leading-relaxed"
        />
      </div>
    </div>
  );
};
