import React from 'react';
import { User, MapPin, Phone, X, FileText } from 'lucide-react';
import { RegisteredPatientResult } from '../../../types/registration';

interface SelectedPatientCardProps {
  patient: RegisteredPatientResult;
  onDeselect: () => void;
}

export const SelectedPatientCard: React.FC<SelectedPatientCardProps> = ({
  patient,
  onDeselect,
}) => {
  const hasConditions =
    patient.conditions && patient.conditions.length > 0 &&
    !patient.conditions.includes('None reported');
  const hasAllergies = patient.allergies && patient.allergies.toLowerCase() !== 'none' &&
    patient.allergies.toLowerCase() !== 'none reported' &&
    patient.allergies.trim() !== '';
  const hasMedications = patient.currentMedications &&
    patient.currentMedications.toLowerCase() !== 'none' &&
    patient.currentMedications.trim() !== '';

  return (
    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-teal-100 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {patient.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-bold text-teal-900">{patient.fullName}</h3>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-xs font-mono text-teal-700 font-semibold">
                {patient.patientId}
              </span>
              <span className="text-2xs text-teal-600">
                {patient.age} yrs • {patient.gender}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onDeselect}
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer flex-shrink-0"
          aria-label="Remove selected patient"
          title="Change patient"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Details row */}
      <div className="flex flex-wrap gap-3 mt-3 text-2xs text-teal-700">
        <span className="flex items-center space-x-1">
          <MapPin className="w-3 h-3" />
          <span>{patient.village}, {patient.taluka}</span>
        </span>
        {patient.mobileNumber && (
          <span className="flex items-center space-x-1">
            <Phone className="w-3 h-3" />
            <span>+91 {patient.mobileNumber}</span>
          </span>
        )}
        {patient.preferredLanguage && (
          <span className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>
              Preferred:{' '}
              {patient.preferredLanguage === 'mr'
                ? 'मराठी'
                : patient.preferredLanguage === 'hi'
                ? 'हिंदी'
                : 'English'}
            </span>
          </span>
        )}
      </div>

      {/* Clinically relevant info */}
      {(hasConditions || hasAllergies || hasMedications) && (
        <div className="mt-3 pt-3 border-t border-teal-200 space-y-1.5">
          <p className="text-2xs font-semibold text-teal-800 flex items-center space-x-1">
            <FileText className="w-3 h-3" />
            <span>On Record</span>
          </p>
          {hasConditions && (
            <p className="text-2xs text-slate-700">
              <span className="font-medium text-slate-600">Conditions: </span>
              {patient.conditions.join(', ')}
            </p>
          )}
          {hasAllergies && (
            <p className="text-2xs text-slate-700">
              <span className="font-medium text-slate-600">Allergies: </span>
              {patient.allergies}
            </p>
          )}
          {hasMedications && (
            <p className="text-2xs text-slate-700">
              <span className="font-medium text-slate-600">Medications: </span>
              {patient.currentMedications}
            </p>
          )}
        </div>
      )}

      <p className="mt-2 text-3xs text-teal-600 italic">Patient selected for triage assessment</p>
    </div>
  );
};
