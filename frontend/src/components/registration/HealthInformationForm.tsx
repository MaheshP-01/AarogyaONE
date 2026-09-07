import React from 'react';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react';
import { PatientRegistrationFormData, FormErrors } from '../../types/registration';
import { TranslationDictionary } from '../../utils/translations';
import { FormField } from './FormField';
import { PhoneInput } from './PhoneInput';

interface HealthInformationFormProps {
  formData: PatientRegistrationFormData;
  errors: FormErrors;
  onChange: (field: keyof PatientRegistrationFormData, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  t: TranslationDictionary;
}

export const HealthInformationForm: React.FC<HealthInformationFormProps> = ({
  formData,
  errors,
  onChange,
  onNext,
  onBack,
  t,
}) => {
  const commonConditions = [
    { id: 'hypertension', label: t.conditionHypertension },
    { id: 'diabetes', label: t.conditionDiabetes },
    { id: 'asthma', label: t.conditionAsthma },
    { id: 'heart', label: t.conditionHeartDisease },
    { id: 'tb', label: t.conditionTuberculosis },
    { id: 'arthritis', label: t.conditionArthritis },
    { id: 'none', label: t.conditionNone },
  ];

  const handleConditionToggle = (conditionLabel: string) => {
    let current = [...formData.existingConditions];

    if (conditionLabel === t.conditionNone) {
      // If selecting "None", clear all others
      if (current.includes(conditionLabel)) {
        current = [];
      } else {
        current = [conditionLabel];
      }
    } else {
      // Remove "None reported" if any other condition is picked
      current = current.filter((c) => c !== t.conditionNone);
      if (current.includes(conditionLabel)) {
        current = current.filter((c) => c !== conditionLabel);
      } else {
        current.push(conditionLabel);
      }
    }

    onChange('existingConditions', current);
  };

  const handleQuickAllergy = (allergy: string) => {
    if (allergy === t.conditionNone) {
      onChange('knownAllergies', t.conditionNone);
    } else {
      if (!formData.knownAllergies || formData.knownAllergies === t.conditionNone) {
        onChange('knownAllergies', allergy);
      } else if (!formData.knownAllergies.includes(allergy)) {
        onChange('knownAllergies', `${formData.knownAllergies}, ${allergy}`);
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-7 shadow-2xs">
      {/* Step Header */}
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          {t.healthInfoHeading}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {t.healthInfoDesc}
        </p>
      </div>

      {/* Clinical Assessment Separation Notice */}
      <div className="mb-6 p-4 rounded-lg bg-teal-50/70 border border-teal-200 flex items-start space-x-3">
        <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wide">
            {t.clinicalNoteHeading}
          </h4>
          <p className="text-xs text-teal-800 mt-0.5 leading-relaxed">
            {t.clinicalNoteText}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Known Allergies */}
        <div>
          <FormField
            id="knownAllergies"
            label={t.allergiesLabel}
            value={formData.knownAllergies}
            onChange={(e) => onChange('knownAllergies', e.target.value)}
            placeholder={t.allergiesPlaceholder}
          />
          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-2xs font-semibold text-slate-400 uppercase mr-1">
              Quick select:
            </span>
            {['None reported', 'Penicillin', 'Sulfa drugs', 'Dust / Pollen'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickAllergy(tag)}
                className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Existing Conditions */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            {t.conditionsLabel}
          </label>
          <p className="text-xs text-slate-500 mb-2.5">
            {t.conditionsHint}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {commonConditions.map((cond) => {
              const isSelected = formData.existingConditions.includes(cond.label);
              return (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() => handleConditionToggle(cond.label)}
                  className={`min-h-[40px] px-3 py-2 text-xs font-medium rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 border-teal-700 text-teal-900 font-semibold ring-1 ring-teal-700'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  <span className="truncate">{cond.label}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-teal-700 shrink-0 ml-1.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Other Medical Conditions & Current Medications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="otherConditions"
            label={t.otherConditionsLabel}
            value={formData.otherConditions}
            onChange={(e) => onChange('otherConditions', e.target.value)}
            placeholder={t.otherConditionsPlaceholder}
          />

          <FormField
            id="currentMedications"
            label={t.medicationsLabel}
            value={formData.currentMedications}
            onChange={(e) => onChange('currentMedications', e.target.value)}
            placeholder={t.medicationsPlaceholder}
          />
        </div>

        {/* Emergency Contact Information */}
        <div className="pt-4 border-t border-slate-100">
          <div className="mb-3">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              {t.emergencyHeading}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Contact person in case of urgent clinical referral or hospital transfer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              id="emergencyContactName"
              label={t.emergencyNameLabel}
              value={formData.emergencyContactName}
              onChange={(e) => onChange('emergencyContactName', e.target.value)}
              placeholder={t.emergencyNamePlaceholder}
            />

            <FormField
              id="emergencyContactRelation"
              label={t.emergencyRelationLabel}
              value={formData.emergencyContactRelation}
              onChange={(e) => onChange('emergencyContactRelation', e.target.value)}
              placeholder={t.emergencyRelationPlaceholder}
            />

            <PhoneInput
              id="emergencyContactPhone"
              label={t.emergencyPhoneLabel}
              value={formData.emergencyContactPhone}
              onChange={(val) => onChange('emergencyContactPhone', val)}
              placeholder={t.emergencyPhonePlaceholder}
              error={errors.emergencyContactPhone}
            />
          </div>
        </div>
      </div>

      {/* Form Action Footer */}
      <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backBtn}</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-sm font-medium rounded-lg transition-colors shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
        >
          <span>{t.continueBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
