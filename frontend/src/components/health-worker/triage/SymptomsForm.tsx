import React from 'react';
import { TriageFormData } from '../../../types/triage';

interface SymptomsFormProps {
  data: Pick<TriageFormData, 'chiefComplaint' | 'symptoms' | 'symptomDuration'>;
  errors: Partial<Record<'chiefComplaint' | 'symptoms', string>>;
  onChange: (
    field: keyof Pick<TriageFormData, 'chiefComplaint' | 'symptoms' | 'symptomDuration'>,
    value: string
  ) => void;
}

export const SymptomsForm: React.FC<SymptomsFormProps> = ({
  data,
  errors,
  onChange,
}) => {
  return (
    <div className="space-y-5">
      {/* Chief Complaint */}
      <div>
        <label
          htmlFor="triage-chief-complaint"
          className="block text-xs font-semibold text-slate-700 mb-1.5"
        >
          Chief Complaint <span className="text-red-500">*</span>
        </label>
        <input
          id="triage-chief-complaint"
          type="text"
          value={data.chiefComplaint}
          onChange={(e) => onChange('chiefComplaint', e.target.value)}
          placeholder="What is the main reason for today's visit?"
          maxLength={300}
          className={`w-full px-3 py-2.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 transition-colors ${
            errors.chiefComplaint
              ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
              : 'border-slate-300 focus:border-teal-600 focus:ring-teal-200'
          }`}
          aria-describedby={errors.chiefComplaint ? 'chief-complaint-error' : undefined}
        />
        {errors.chiefComplaint && (
          <p id="chief-complaint-error" className="mt-1 text-2xs text-red-600" role="alert">
            {errors.chiefComplaint}
          </p>
        )}
      </div>

      {/* Symptoms */}
      <div>
        <label
          htmlFor="triage-symptoms"
          className="block text-xs font-semibold text-slate-700 mb-1.5"
        >
          Symptoms <span className="text-red-500">*</span>
        </label>
        <p className="text-2xs text-slate-500 mb-1.5">
          Describe the patient's symptoms. You may enter in English, Marathi (मराठी), or Hindi (हिंदी).
        </p>
        <textarea
          id="triage-symptoms"
          value={data.symptoms}
          onChange={(e) => onChange('symptoms', e.target.value)}
          placeholder='e.g. "Fever, cough and difficulty breathing" or "ताप, खोकला आणि श्वास घेण्यास त्रास"'
          rows={4}
          maxLength={2000}
          className={`w-full px-3 py-2.5 text-xs bg-white border rounded-lg resize-none focus:outline-none focus:ring-1 transition-colors leading-relaxed ${
            errors.symptoms
              ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
              : 'border-slate-300 focus:border-teal-600 focus:ring-teal-200'
          }`}
          aria-describedby={errors.symptoms ? 'symptoms-error' : undefined}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.symptoms ? (
            <p id="symptoms-error" className="text-2xs text-red-600" role="alert">
              {errors.symptoms}
            </p>
          ) : (
            <span />
          )}
          <span className="text-3xs text-slate-400 ml-auto">
            {data.symptoms.length}/2000
          </span>
        </div>
      </div>

      {/* Symptom Duration */}
      <div>
        <label
          htmlFor="triage-duration"
          className="block text-xs font-semibold text-slate-700 mb-1.5"
        >
          Symptom Duration
          <span className="ml-1.5 text-2xs font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="triage-duration"
          type="text"
          value={data.symptomDuration}
          onChange={(e) => onChange('symptomDuration', e.target.value)}
          placeholder='e.g. "3 days", "2 weeks", "Since this morning"'
          maxLength={100}
          className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-200 transition-colors"
        />
        <p className="mt-1 text-2xs text-slate-400">
          How long has the patient been experiencing these symptoms?
        </p>
      </div>
    </div>
  );
};
