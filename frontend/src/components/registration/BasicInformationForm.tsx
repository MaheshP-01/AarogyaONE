import React from 'react';
import { ArrowRight, AlertCircle, Calendar } from 'lucide-react';
import { PatientRegistrationFormData, FormErrors, Gender, PreferredLanguage } from '../../types/registration';
import { TranslationDictionary } from '../../utils/translations';
import { FormField } from './FormField';
import { SelectField } from './SelectField';

interface BasicInformationFormProps {
  formData: PatientRegistrationFormData;
  errors: FormErrors;
  onChange: (field: keyof PatientRegistrationFormData, value: any) => void;
  onNext: () => void;
  t: TranslationDictionary;
}

export const BasicInformationForm: React.FC<BasicInformationFormProps> = ({
  formData,
  errors,
  onChange,
  onNext,
  t,
}) => {
  // Auto-calculate age when DOB changes
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dobValue = e.target.value;
    onChange('dob', dobValue);

    if (dobValue) {
      const birthDate = new Date(dobValue);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge >= 0 && calculatedAge <= 120) {
        onChange('age', calculatedAge.toString());
      }
    }
  };

  const handleGenderSelect = (gender: Gender) => {
    onChange('gender', gender);
  };

  const languageOptions = [
    { value: 'mr', label: t.langMarathi },
    { value: 'hi', label: t.langHindi },
    { value: 'en', label: t.langEnglish },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-7 shadow-2xs">
      {/* Step Header */}
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          {t.basicInfoHeading}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {t.basicInfoDesc}
        </p>
      </div>

      <div className="space-y-5">
        {/* Full Name Field */}
        <FormField
          id="fullName"
          label={t.fullNameLabel}
          required
          type="text"
          value={formData.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          placeholder={t.fullNamePlaceholder}
          error={errors.fullName}
          autoComplete="name"
        />

        {/* DOB & Age row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="dob"
            label={t.dobLabel}
            type="date"
            value={formData.dob}
            onChange={handleDobChange}
            max={new Date().toISOString().split('T')[0]}
            helpText={t.dobHint}
            rightElement={<Calendar className="w-4 h-4 text-slate-400" />}
          />

          <FormField
            id="age"
            label={t.ageLabel}
            required
            type="number"
            min={0}
            max={120}
            value={formData.age}
            onChange={(e) => onChange('age', e.target.value)}
            placeholder={t.agePlaceholder}
            error={errors.age}
          />
        </div>

        {/* Gender Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {t.genderLabel} <span className="text-red-500 text-sm font-bold">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {(['male', 'female', 'other'] as Gender[]).map((g) => {
              const isSelected = formData.gender === g;
              const label =
                g === 'male'
                  ? t.genderMale
                  : g === 'female'
                  ? t.genderFemale
                  : t.genderOther;

              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGenderSelect(g)}
                  className={`min-h-[42px] px-3 py-2 text-sm font-medium rounded-lg border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 border-teal-700 text-teal-900 font-semibold ring-1 ring-teal-700'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {errors.gender && (
            <p className="mt-1.5 flex items-center text-xs font-medium text-red-600 space-x-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
              <span>{errors.gender}</span>
            </p>
          )}
        </div>

        {/* Preferred Language */}
        <SelectField
          id="preferredLanguage"
          label={t.preferredLanguageLabel}
          required
          value={formData.preferredLanguage}
          onChange={(e) => onChange('preferredLanguage', e.target.value as PreferredLanguage)}
          options={languageOptions}
        />
      </div>

      {/* Form Action Footer */}
      <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end">
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
