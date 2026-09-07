import React from 'react';
import { ArrowLeft, Edit2, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { PatientRegistrationFormData, FormErrors } from '../../types/registration';
import { TranslationDictionary } from '../../utils/translations';

interface ReviewPatientProps {
  formData: PatientRegistrationFormData;
  errors: FormErrors;
  onChange: (field: keyof PatientRegistrationFormData, value: any) => void;
  onSubmit: () => void;
  onBack: () => void;
  onJumpToStep: (step: 1 | 2 | 3) => void;
  isSubmitting?: boolean;
  t: TranslationDictionary;
}

export const ReviewPatient: React.FC<ReviewPatientProps> = ({
  formData,
  errors,
  onChange,
  onSubmit,
  onBack,
  onJumpToStep,
  isSubmitting = false,
  t,
}) => {
  const genderLabel =
    formData.gender === 'male'
      ? t.genderMale
      : formData.gender === 'female'
      ? t.genderFemale
      : t.genderOther;

  const languageLabel =
    formData.preferredLanguage === 'mr'
      ? t.langMarathi
      : formData.preferredLanguage === 'hi'
      ? t.langHindi
      : t.langEnglish;

  // Mask mobile number for privacy while displaying last 4 digits
  const maskedMobile =
    formData.mobileNumber.length === 10
      ? `XXXXXX${formData.mobileNumber.slice(6)}`
      : formData.mobileNumber;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-7 shadow-2xs">
      {/* Step Header */}
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          {t.reviewHeading}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {t.reviewDesc}
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Patient Information */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t.patientInfoCard}
            </h3>
            <button
              type="button"
              onClick={() => onJumpToStep(1)}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-6 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Full Name</span>
              <span className="text-slate-900 font-bold text-sm">{formData.fullName || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Age & Gender</span>
              <span className="text-slate-800 font-semibold">
                {formData.age ? `${formData.age} yrs` : '—'} • {genderLabel || '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Date of Birth</span>
              <span className="text-slate-700">{formData.dob || 'Not specified'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Preferred Language</span>
              <span className="text-slate-700">{languageLabel}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Location */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t.contactLocationCard}
            </h3>
            <button
              type="button"
              onClick={() => onJumpToStep(2)}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-6 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Mobile Number</span>
              <span className="text-slate-900 font-bold tracking-wide">
                +91 {maskedMobile || '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Alternate Contact</span>
              <span className="text-slate-700">
                {formData.alternateContact ? `+91 ${formData.alternateContact}` : 'None provided'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Village / Pada</span>
              <span className="text-slate-800 font-semibold">{formData.village || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Taluka & District</span>
              <span className="text-slate-700">
                {formData.taluka}, {formData.district} (PIN {formData.pinCode})
              </span>
            </div>
            {formData.locationCoordinates && (
              <div className="sm:col-span-2">
                <span className="text-slate-400 block font-medium">GPS Coordinates</span>
                <span className="text-teal-800 font-mono text-2xs">
                  {formData.locationCoordinates.latitude.toFixed(4)}° N,{' '}
                  {formData.locationCoordinates.longitude.toFixed(4)}° E
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Health Information */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t.healthInfoCard}
            </h3>
            <button
              type="button"
              onClick={() => onJumpToStep(3)}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Known Allergies</span>
              <span className="text-slate-800 font-medium">
                {formData.knownAllergies || 'None reported'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Diagnosed Conditions</span>
              <span className="text-slate-800 font-medium">
                {formData.existingConditions.length > 0
                  ? formData.existingConditions.join(', ')
                  : 'None reported'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Current Medications</span>
              <span className="text-slate-800 font-medium">
                {formData.currentMedications || 'None reported'}
              </span>
            </div>
            {formData.emergencyContactName && (
              <div className="sm:col-span-2 pt-2 border-t border-slate-200/60">
                <span className="text-slate-400 block font-medium">Emergency Contact</span>
                <span className="text-slate-800 font-medium">
                  {formData.emergencyContactName}{' '}
                  {formData.emergencyContactRelation && `(${formData.emergencyContactRelation})`} —{' '}
                  {formData.emergencyContactPhone ? `+91 ${formData.emergencyContactPhone}` : 'No phone'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Verification Checkbox */}
        <div className="pt-2">
          <label className="flex items-start space-x-3 cursor-pointer select-none p-3.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              id="consentConfirmed"
              checked={formData.consentConfirmed}
              onChange={(e) => onChange('consentConfirmed', e.target.checked)}
              className="w-4 h-4 mt-0.5 text-teal-700 border-slate-300 rounded focus:ring-teal-600 focus:ring-2 cursor-pointer"
            />
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900 block mb-0.5">
                Verification & Consent Confirmation
              </span>
              <span>{t.consentText}</span>
            </div>
          </label>

          {errors.consentConfirmed && (
            <p className="mt-2 flex items-center text-xs font-medium text-red-600 space-x-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
              <span>{errors.consentConfirmed}</span>
            </p>
          )}
        </div>
      </div>

      {/* Form Action Footer */}
      <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backBtn}</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-sm font-semibold rounded-lg transition-colors shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.submittingText}</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>{t.submitBtn}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
