import React, { useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Activity, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { LanguageCode } from '../../types';
import { TranslationDictionary } from '../../utils/translations';
import { RegisteredPatientResult } from '../../types/registration';
import {
  TriageFormData,
  TriageStep,
  VitalsErrors,
  SavedTriageAssessment,
} from '../../types/triage';
import { submitTriageAssessment } from '../../services/triageService';
import { PatientSelector } from '../../components/health-worker/triage/PatientSelector';
import { SelectedPatientCard } from '../../components/health-worker/triage/SelectedPatientCard';
import { SymptomsForm } from '../../components/health-worker/triage/SymptomsForm';
import { VitalsForm, validateVitals } from '../../components/health-worker/triage/VitalsForm';
import { AdditionalInfoForm } from '../../components/health-worker/triage/AdditionalInfoForm';
import { TriageReview } from '../../components/health-worker/triage/TriageReview';
import { AITriageResult } from '../../components/health-worker/triage/AITriageResult';
import { TriageSuccess } from '../../components/health-worker/triage/TriageSuccess';

interface LayoutContext {
  currentLanguage: LanguageCode;
  t: TranslationDictionary;
  isOnline: boolean;
}

// ---------------------------------------------------------------------------
// Initial form state
// ---------------------------------------------------------------------------
const initialFormData: TriageFormData = {
  selectedPatientId: '',
  chiefComplaint: '',
  symptoms: '',
  symptomDuration: '',
  vitals: {
    temperature: '',
    heartRate: '',
    bpSystolic: '',
    bpDiastolic: '',
    spo2: '',
    respiratoryRate: '',
  },
  knownAllergies: '',
  currentMedications: '',
  relevantHistory: '',
};

// ---------------------------------------------------------------------------
// Step configuration
// ---------------------------------------------------------------------------
const STEPS: Array<{ id: TriageStep; label: string; shortLabel: string }> = [
  { id: 'select_patient', label: 'Select Patient', shortLabel: 'Patient' },
  { id: 'symptoms', label: 'Symptoms', shortLabel: 'Symptoms' },
  { id: 'vitals', label: 'Vitals', shortLabel: 'Vitals' },
  { id: 'additional_info', label: 'Additional Info', shortLabel: 'Info' },
  { id: 'review', label: 'Review', shortLabel: 'Review' },
];

const STEP_ORDER: TriageStep[] = [
  'select_patient',
  'symptoms',
  'vitals',
  'additional_info',
  'review',
  'submitting',
  'result',
  'saving',
  'success',
];

// ---------------------------------------------------------------------------
// Main Triage Page
// ---------------------------------------------------------------------------
export const TriagePage: React.FC = () => {
  const { isOnline } = useOutletContext<LayoutContext>();

  const [currentStep, setCurrentStep] = useState<TriageStep>('select_patient');
  const [formData, setFormData] = useState<TriageFormData>(initialFormData);
  const [selectedPatient, setSelectedPatient] =
    useState<RegisteredPatientResult | null>(null);
  const [vitalsErrors, setVitalsErrors] = useState<VitalsErrors>({});
  const [symptomsErrors, setSymptomsErrors] = useState<
    Partial<Record<'chiefComplaint' | 'symptoms', string>>
  >({});
  const [triageResult, setTriageResult] = useState<SavedTriageAssessment | null>(
    null
  );
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handlePatientSelect = useCallback((patient: RegisteredPatientResult) => {
    setSelectedPatient(patient);
    setFormData((prev) => ({
      ...prev,
      selectedPatientId: patient.patientId,
      // Pre-fill additional info from patient record
      knownAllergies: patient.allergies || '',
      currentMedications: patient.currentMedications || '',
    }));
  }, []);

  const handlePatientDeselect = useCallback(() => {
    setSelectedPatient(null);
    setFormData((prev) => ({
      ...prev,
      selectedPatientId: '',
      knownAllergies: '',
      currentMedications: '',
    }));
  }, []);

  const handleSymptomsChange = useCallback(
    (
      field: keyof Pick<TriageFormData, 'chiefComplaint' | 'symptoms' | 'symptomDuration'>,
      value: string
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setSymptomsErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const handleVitalsChange = useCallback(
    (field: keyof TriageFormData['vitals'], value: string) => {
      setFormData((prev) => ({
        ...prev,
        vitals: { ...prev.vitals, [field]: value },
      }));
      setVitalsErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const handleAdditionalInfoChange = useCallback(
    (
      field: keyof Pick<
        TriageFormData,
        'knownAllergies' | 'currentMedications' | 'relevantHistory'
      >,
      value: string
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  const goToStep = useCallback((step: TriageStep) => {
    setCurrentStep(step);
    setSubmissionError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevStep = STEP_ORDER[currentIndex - 1];
      // Don't go back to submitting/saving states
      if (prevStep !== 'submitting' && prevStep !== 'saving') {
        goToStep(prevStep);
      }
    }
  }, [currentStep, goToStep]);

  // ---------------------------------------------------------------------------
  // Validation per step
  // ---------------------------------------------------------------------------

  const validateSelectPatient = () => {
    return !!selectedPatient;
  };

  const validateSymptoms = (): boolean => {
    const errors: typeof symptomsErrors = {};
    if (!formData.chiefComplaint.trim()) {
      errors.chiefComplaint = 'Please enter the chief complaint.';
    }
    if (!formData.symptoms.trim()) {
      errors.symptoms = 'Please describe the patient\'s symptoms.';
    }
    setSymptomsErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateVitalsStep = (): boolean => {
    const errors = validateVitals(formData.vitals);
    setVitalsErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ---------------------------------------------------------------------------
  // Step navigation with validation
  // ---------------------------------------------------------------------------

  const handleContinue = useCallback(() => {
    switch (currentStep) {
      case 'select_patient':
        if (!validateSelectPatient()) return; // no patient selected
        goToStep('symptoms');
        break;
      case 'symptoms':
        if (!validateSymptoms()) return;
        goToStep('vitals');
        break;
      case 'vitals':
        if (!validateVitalsStep()) return;
        goToStep('additional_info');
        break;
      case 'additional_info':
        goToStep('review');
        break;
      case 'review':
        handleSubmitAssessment();
        break;
    }
  }, [currentStep, formData, selectedPatient]); // eslint-disable-line

  // ---------------------------------------------------------------------------
  // AI Assessment submission
  // ---------------------------------------------------------------------------

  const handleSubmitAssessment = useCallback(async () => {
    if (!selectedPatient) return;

    setCurrentStep('submitting');
    setSubmissionError(null);

    try {
      const result = await submitTriageAssessment({
        formData,
        existingConditions: selectedPatient.conditions || [],
      });

      setTriageResult(result);
      goToStep('result');
    } catch (err: any) {
      setSubmissionError(
        err?.message || 'Unable to complete AI assessment. Please try again.'
      );
      goToStep('review');
    }
  }, [formData, selectedPatient, goToStep]);

  // ---------------------------------------------------------------------------
  // Save triage
  // ---------------------------------------------------------------------------

  const handleSaveTriage = useCallback(async () => {
    // Result is already saved (from submitTriageAssessment)
    // Move to success state
    setIsSaving(true);
    // Small delay to show saving state
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsSaving(false);
    goToStep('success');
  }, [goToStep]);

  // ---------------------------------------------------------------------------
  // Reset (Start New)
  // ---------------------------------------------------------------------------

  const handleStartNew = useCallback(() => {
    setFormData(initialFormData);
    setSelectedPatient(null);
    setVitalsErrors({});
    setSymptomsErrors({});
    setTriageResult(null);
    setSubmissionError(null);
    goToStep('select_patient');
  }, [goToStep]);

  // ---------------------------------------------------------------------------
  // Computed: step progress indicator
  // ---------------------------------------------------------------------------

  const activeStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const showProgress = !['submitting', 'result', 'saving', 'success'].includes(
    currentStep
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
            <Activity className="w-4 h-4 text-teal-700" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Triage Assessment
            </h1>
            <p className="text-xs text-slate-500">
              Assess the patient's current condition and prioritize the next step.
            </p>
          </div>
        </div>

        {/* Offline notice */}
        {!isOnline && (
          <div className="mt-3 text-2xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
            You are offline. Triage assessments will be saved locally and synced when connection returns.
          </div>
        )}
      </div>

      {/* Step Progress Indicator */}
      {showProgress && (
        <nav aria-label="Triage steps" className="flex items-center space-x-1">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isDone = activeStepIndex > index;
            return (
              <React.Fragment key={step.id}>
                <div
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-2xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-teal-50 border border-teal-200 text-teal-800'
                      : isDone
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full text-3xs flex items-center justify-center font-bold ${
                      isActive
                        ? 'bg-teal-600 text-white'
                        : isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isDone ? '✓' : index + 1}
                  </span>
                  <span className="hidden sm:inline">{step.shortLabel}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Error Banner */}
      {submissionError && (
        <div
          className="flex items-start space-x-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-red-800">Assessment Error</p>
            <p className="text-xs text-red-700 mt-0.5">{submissionError}</p>
            <button
              type="button"
              onClick={handleSubmitAssessment}
              className="mt-2 text-2xs font-semibold text-red-700 underline cursor-pointer hover:text-red-900"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Content Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        {/* ------------------------------------------------------------------ */}
        {/* STEP: Select Patient */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === 'select_patient' && (
          <div className="p-5">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-800">Select Patient</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Search and select the patient you are assessing today.
              </p>
            </div>

            {selectedPatient ? (
              <SelectedPatientCard
                patient={selectedPatient}
                onDeselect={handlePatientDeselect}
              />
            ) : (
              <PatientSelector onSelect={handlePatientSelect} />
            )}

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={handleContinue}
                disabled={!selectedPatient}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to Symptoms →
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP: Symptoms */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === 'symptoms' && (
          <div className="p-5">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-800">Symptoms</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Record the patient's current symptoms and chief complaint.
              </p>
            </div>

            {selectedPatient && (
              <div className="mb-4 pb-4 border-b border-slate-100">
                <p className="text-2xs text-slate-500">
                  Assessing:{' '}
                  <span className="font-semibold text-slate-700">
                    {selectedPatient.fullName}
                  </span>{' '}
                  •{' '}
                  <span className="font-mono text-teal-700">
                    {selectedPatient.patientId}
                  </span>
                </p>
              </div>
            )}

            <SymptomsForm
              data={{
                chiefComplaint: formData.chiefComplaint,
                symptoms: formData.symptoms,
                symptomDuration: formData.symptomDuration,
              }}
              errors={symptomsErrors}
              onChange={handleSymptomsChange}
            />

            <div className="mt-5 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-1 cursor-pointer"
              >
                Continue to Vitals →
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP: Vitals */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === 'vitals' && (
          <div className="p-5">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-800">Vital Signs</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Record the patient's available vitals. Leave unmeasured fields blank.
              </p>
            </div>

            <VitalsForm
              vitals={formData.vitals}
              errors={vitalsErrors}
              onChange={handleVitalsChange}
            />

            <div className="mt-5 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-1 cursor-pointer"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP: Additional Information */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === 'additional_info' && (
          <div className="p-5">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-800">
                Additional Information
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Optional clinical context to assist with triage assessment.
              </p>
            </div>

            <AdditionalInfoForm
              data={{
                knownAllergies: formData.knownAllergies,
                currentMedications: formData.currentMedications,
                relevantHistory: formData.relevantHistory,
              }}
              onChange={handleAdditionalInfoChange}
            />

            <div className="mt-5 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-1 cursor-pointer"
              >
                Review Assessment →
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP: Review */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === 'review' && selectedPatient && (
          <div className="p-5">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-800">
                Review Before Assessment
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify all information before sending for AI-assisted analysis.
              </p>
            </div>

            <TriageReview
              formData={formData}
              patient={selectedPatient}
              onEdit={(step) => goToStep(step)}
            />

            <div className="mt-5 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-1 cursor-pointer"
              >
                Assess Patient →
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP: Submitting (Loading) */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === 'submitting' && (
          <div className="p-10 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-800">
                Analyzing assessment...
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Running clinical decision-support analysis on reported data.
              </p>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP: Result */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === 'result' && triageResult && selectedPatient && (
          <div className="p-5">
            <AITriageResult
              result={triageResult}
              onSave={handleSaveTriage}
              onEdit={() => goToStep('review')}
              isSaving={isSaving}
              patientName={selectedPatient.fullName}
            />
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP: Success */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === 'success' && triageResult && selectedPatient && (
          <div className="p-5">
            <TriageSuccess
              assessment={triageResult}
              patientName={selectedPatient.fullName}
              onStartNew={handleStartNew}
            />
          </div>
        )}
      </div>
    </div>
  );
};
