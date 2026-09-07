import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  PatientRegistrationFormData,
  RegistrationStep,
  RegisteredPatientResult,
  FormErrors,
  PreferredLanguage,
} from '../types/registration';
import { LanguageCode } from '../types';
import { TranslationDictionary } from '../utils/translations';
import { RegistrationStepper } from '../components/registration/RegistrationStepper';
import { BasicInformationForm } from '../components/registration/BasicInformationForm';
import { ContactLocationForm } from '../components/registration/ContactLocationForm';
import { HealthInformationForm } from '../components/registration/HealthInformationForm';
import { ReviewPatient } from '../components/registration/ReviewPatient';
import { SuccessState } from '../components/registration/SuccessState';

interface LayoutContext {
  currentLanguage: LanguageCode;
  t: TranslationDictionary;
  isOnline: boolean;
}

const INITIAL_FORM_DATA: PatientRegistrationFormData = {
  fullName: '',
  dob: '',
  age: '',
  gender: '',
  preferredLanguage: 'mr',
  mobileNumber: '',
  alternateContact: '',
  village: '',
  taluka: 'Shirpur',
  district: 'Dhule',
  pinCode: '',
  knownAllergies: '',
  existingConditions: [],
  otherConditions: '',
  currentMedications: '',
  emergencyContactName: '',
  emergencyContactRelation: '',
  emergencyContactPhone: '',
  consentConfirmed: false,
};

export const PatientRegistrationPage: React.FC = () => {
  const { currentLanguage, t, isOnline } = useOutletContext<LayoutContext>();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1);
  const [formData, setFormData] = useState<PatientRegistrationFormData>({
    ...INITIAL_FORM_DATA,
    preferredLanguage: (currentLanguage as PreferredLanguage) || 'mr',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredPatient, setRegisteredPatient] = useState<RegisteredPatientResult | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Field change handler
  const handleFieldChange = (field: keyof PatientRegistrationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error upon editing
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Validation functions
  const validateStep1 = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.fullName.trim()) {
      errs.fullName = t.errFullNameRequired;
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Full name must be at least 2 characters.';
    }

    if (!formData.age.toString().trim()) {
      errs.age = t.errAgeRequired;
    } else {
      const ageNum = parseInt(formData.age.toString(), 10);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
        errs.age = t.errAgeInvalid;
      }
    }

    if (!formData.gender) {
      errs.gender = t.errGenderRequired;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: FormErrors = {};

    const cleanMobile = formData.mobileNumber.replace(/\D/g, '');
    if (!cleanMobile) {
      errs.mobileNumber = 'Mobile number is required';
    } else if (cleanMobile.length !== 10) {
      errs.mobileNumber = t.errMobileInvalid;
    }

    if (formData.alternateContact) {
      const cleanAlt = formData.alternateContact.replace(/\D/g, '');
      if (cleanAlt.length !== 10) {
        errs.alternateContact = t.errAltMobileInvalid;
      }
    }

    if (!formData.village.trim()) {
      errs.village = t.errVillageRequired;
    }

    if (!formData.taluka.trim()) {
      errs.taluka = t.errTalukaRequired;
    }

    if (!formData.district.trim()) {
      errs.district = t.errDistrictRequired;
    }

    const cleanPin = formData.pinCode.replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      errs.pinCode = t.errPinInvalid;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errs: FormErrors = {};

    if (formData.emergencyContactPhone) {
      const cleanPhone = formData.emergencyContactPhone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        errs.emergencyContactPhone = t.errEmergencyPhoneInvalid;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep4 = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.consentConfirmed) {
      errs.consentConfirmed = t.errConsentRequired;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step advancement
  const handleNextFromStep1 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextFromStep2 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextFromStep3 = () => {
    if (validateStep3()) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Jump directly to step from review
  const handleJumpToStep = (step: 1 | 2 | 3) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Form submission & unique Patient ID generation
  const handleSubmit = () => {
    if (!validateStep4()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate clinical registration transaction
    setTimeout(() => {
      // Generate clean clinical ID: RC-2026-XXXXXX
      const randomSeq = Math.floor(100000 + Math.random() * 900000);
      const generatedId = `RC-2026-${randomSeq}`;

      const newRecord: RegisteredPatientResult = {
        patientId: generatedId,
        fullName: formData.fullName.trim(),
        age: formData.age.toString(),
        gender:
          formData.gender === 'male'
            ? 'Male'
            : formData.gender === 'female'
            ? 'Female'
            : 'Other',
        preferredLanguage: formData.preferredLanguage,
        mobileNumber: formData.mobileNumber,
        village: formData.village.trim(),
        taluka: formData.taluka,
        district: formData.district,
        pinCode: formData.pinCode,
        allergies: formData.knownAllergies || 'None reported',
        conditions: formData.existingConditions,
        currentMedications: formData.currentMedications || 'None reported',
        emergencyContact: {
          name: formData.emergencyContactName,
          relation: formData.emergencyContactRelation,
          phone: formData.emergencyContactPhone,
        },
        registeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        registeredBy: t.healthWorkerRole,
        phcLocation: t.phcName,
        syncStatus: isOnline ? 'synced' : 'pending_offline',
      };

      // Store in local storage for demonstration & offline resilience
      try {
        const stored = JSON.parse(localStorage.getItem('ruralcare_local_patients') || '[]');
        stored.unshift(newRecord);
        localStorage.setItem('ruralcare_local_patients', JSON.stringify(stored.slice(0, 50)));
      } catch (err) {
        console.warn('Local storage write warning', err);
      }

      setRegisteredPatient(newRecord);
      setIsSubmitting(false);
      setCurrentStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  // Reset to register another patient
  const handleRegisterAnother = () => {
    setFormData({
      ...INITIAL_FORM_DATA,
      preferredLanguage: (currentLanguage as PreferredLanguage) || 'mr',
    });
    setErrors({});
    setRegisteredPatient(null);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel registration with confirmation if data exists
  const handleCancel = () => {
    const hasData = Boolean(
      formData.fullName || formData.mobileNumber || formData.village
    );

    if (hasData) {
      if (window.confirm(t.cancelConfirmation)) {
        handleRegisterAnother();
      }
    } else {
      navigate('/health-worker');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Toast Notification if triggered */}
      {notification && (
        <div className="mb-4 p-3 rounded-lg bg-teal-800 text-white text-xs flex justify-between items-center shadow-md animate-in fade-in">
          <span>{notification}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-teal-200 hover:text-white ml-3"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Registration Header */}
      {currentStep !== 'success' && (
        <div className="flex items-center justify-between pb-4 mb-2">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {t.pageTitle}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.pageSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-300 transition-colors cursor-pointer"
          >
            {t.cancelBtn}
          </button>
        </div>
      )}

      {/* Stepper */}
      <RegistrationStepper
        currentStep={currentStep}
        onStepClick={(step) => {
          // Allow going back to earlier steps anytime
          if (typeof currentStep === 'number' && step < currentStep) {
            setCurrentStep(step);
          }
        }}
        t={t}
      />

      {/* Step Form Rendering */}
      {currentStep === 1 && (
        <BasicInformationForm
          formData={formData}
          errors={errors}
          onChange={handleFieldChange}
          onNext={handleNextFromStep1}
          t={t}
        />
      )}

      {currentStep === 2 && (
        <ContactLocationForm
          formData={formData}
          errors={errors}
          onChange={handleFieldChange}
          onNext={handleNextFromStep2}
          onBack={() => setCurrentStep(1)}
          t={t}
        />
      )}

      {currentStep === 3 && (
        <HealthInformationForm
          formData={formData}
          errors={errors}
          onChange={handleFieldChange}
          onNext={handleNextFromStep3}
          onBack={() => setCurrentStep(2)}
          t={t}
        />
      )}

      {currentStep === 4 && (
        <ReviewPatient
          formData={formData}
          errors={errors}
          onChange={handleFieldChange}
          onSubmit={handleSubmit}
          onBack={() => setCurrentStep(3)}
          onJumpToStep={handleJumpToStep}
          isSubmitting={isSubmitting}
          t={t}
        />
      )}

      {currentStep === 'success' && registeredPatient && (
        <SuccessState
          patient={registeredPatient}
          onRegisterAnother={handleRegisterAnother}
          onViewRecord={() => {
            setNotification(
              `Patient record #${registeredPatient.patientId} loaded. Longitudinal history view active.`
            );
          }}
          onStartAssessment={() => {
            setNotification(
              `Clinical assessment triage module for #${registeredPatient.patientId} will launch in Step 3.`
            );
          }}
          t={t}
        />
      )}
    </div>
  );
};
