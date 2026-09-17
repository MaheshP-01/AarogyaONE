import React from 'react';
import { Edit2 } from 'lucide-react';
import { TriageFormData } from '../../../types/triage';
import { RegisteredPatientResult } from '../../../types/registration';

interface TriageReviewProps {
  formData: TriageFormData;
  patient: RegisteredPatientResult;
  onEdit: (step: 'symptoms' | 'vitals' | 'additional_info') => void;
}

const ReviewSection: React.FC<{
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}> = ({ title, onEdit, children }) => (
  <div className="rounded-lg border border-slate-200 overflow-hidden">
    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
      <h3 className="text-xs font-bold text-slate-700">{title}</h3>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center space-x-1 text-2xs text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
        >
          <Edit2 className="w-3 h-3" />
          <span>Edit</span>
        </button>
      )}
    </div>
    <div className="px-4 py-3 space-y-1.5 text-xs text-slate-700">{children}</div>
  </div>
);

const ReviewRow: React.FC<{ label: string; value?: string }> = ({
  label,
  value,
}) =>
  value ? (
    <div className="flex items-start space-x-2">
      <span className="text-slate-500 font-medium w-32 flex-shrink-0">{label}</span>
      <span className="text-slate-800 leading-relaxed">{value}</span>
    </div>
  ) : null;

export const TriageReview: React.FC<TriageReviewProps> = ({
  formData,
  patient,
  onEdit,
}) => {
  const { vitals } = formData;

  const formatBP = () => {
    if (vitals.bpSystolic && vitals.bpDiastolic) {
      return `${vitals.bpSystolic}/${vitals.bpDiastolic} mmHg`;
    }
    if (vitals.bpSystolic) return `${vitals.bpSystolic}/— mmHg`;
    return null;
  };

  const hasAnyVital = Object.values(vitals).some((v) => v && v.trim() !== '');
  const hasAdditionalInfo =
    formData.knownAllergies || formData.currentMedications || formData.relevantHistory;

  return (
    <div className="space-y-3">
      {/* Patient */}
      <ReviewSection title="Patient">
        <ReviewRow label="Name" value={patient.fullName} />
        <ReviewRow label="Patient ID" value={patient.patientId} />
        <ReviewRow
          label="Age / Gender"
          value={`${patient.age} years • ${patient.gender}`}
        />
        <ReviewRow label="Village" value={`${patient.village}, ${patient.taluka}`} />
      </ReviewSection>

      {/* Symptoms */}
      <ReviewSection title="Symptoms" onEdit={() => onEdit('symptoms')}>
        <ReviewRow label="Chief Complaint" value={formData.chiefComplaint} />
        <ReviewRow label="Symptoms" value={formData.symptoms} />
        {formData.symptomDuration && (
          <ReviewRow label="Duration" value={formData.symptomDuration} />
        )}
      </ReviewSection>

      {/* Vitals */}
      <ReviewSection title="Vitals" onEdit={() => onEdit('vitals')}>
        {hasAnyVital ? (
          <>
            {vitals.temperature && (
              <ReviewRow label="Temperature" value={`${vitals.temperature}°F`} />
            )}
            {vitals.heartRate && (
              <ReviewRow label="Heart Rate" value={`${vitals.heartRate} bpm`} />
            )}
            {formatBP() && <ReviewRow label="Blood Pressure" value={formatBP()!} />}
            {vitals.spo2 && (
              <ReviewRow label="SpO2" value={`${vitals.spo2}%`} />
            )}
            {vitals.respiratoryRate && (
              <ReviewRow
                label="Resp. Rate"
                value={`${vitals.respiratoryRate} breaths/min`}
              />
            )}
          </>
        ) : (
          <p className="text-2xs text-slate-400 italic">No vitals recorded.</p>
        )}
      </ReviewSection>

      {/* Additional Information */}
      {hasAdditionalInfo && (
        <ReviewSection
          title="Additional Information"
          onEdit={() => onEdit('additional_info')}
        >
          {formData.knownAllergies && (
            <ReviewRow label="Allergies" value={formData.knownAllergies} />
          )}
          {formData.currentMedications && (
            <ReviewRow label="Medications" value={formData.currentMedications} />
          )}
          {formData.relevantHistory && (
            <ReviewRow label="History" value={formData.relevantHistory} />
          )}
        </ReviewSection>
      )}

      <div className="text-2xs text-slate-400 px-1">
        Please review all information carefully before submitting for AI-assisted assessment.
      </div>
    </div>
  );
};
