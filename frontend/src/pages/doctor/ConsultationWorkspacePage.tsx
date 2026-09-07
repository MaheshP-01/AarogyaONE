import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Save,
  CheckCircle2,
  AlertTriangle,
  Send,
  Calendar,
  AlertOctagon,
  User,
  History,
  ShieldCheck,
  Video,
} from 'lucide-react';
import { doctorMockService } from '../../services/doctorMockService';
import {
  ClinicalPatient,
  ConsultationQueueItem,
  PrescriptionItem,
  ConsultationRecord,
  ClinicalTimelineEvent,
} from '../../types/doctor';
import { VitalsPanel } from '../../components/doctor/VitalsPanel';
import { AITriagePanel } from '../../components/doctor/AITriagePanel';
import { PrescriptionForm } from '../../components/doctor/PrescriptionForm';
import { ReferralDrawer } from '../../components/doctor/ReferralDrawer';
import { FollowUpDrawer } from '../../components/doctor/FollowUpDrawer';

export const ConsultationWorkspacePage: React.FC = () => {
  const { consultationId } = useParams<{ consultationId: string }>();

  // Patient & Queue Data
  const [queueItem, setQueueItem] = useState<ConsultationQueueItem | undefined>(undefined);
  const [patient, setPatient] = useState<ClinicalPatient | undefined>(undefined);
  const [timeline, setTimeline] = useState<ClinicalTimelineEvent[]>([]);

  // Clinical consultation note fields
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptomsNotes, setSymptomsNotes] = useState('');
  const [clinicalObservations, setClinicalObservations] = useState('');
  const [doctorAssessment, setDoctorAssessment] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);

  // Active consultation timer
  const [elapsedSeconds, setElapsedSeconds] = useState(145);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Drawers & States
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!consultationId) return;

    const item = doctorMockService.getQueueItem(consultationId);
    if (item) {
      setQueueItem(item);
      const pat = doctorMockService.getPatient(item.patientId);
      setPatient(pat);
      setTimeline(doctorMockService.getPatientTimeline(item.patientId));

      setChiefComplaint(item.chiefComplaint);
      setSymptomsNotes(
        `Patient reports acute onset of ${item.chiefComplaint.toLowerCase()} since ${item.symptomsDuration || '3 days'}. Dyspnea exacerbates on exertion and supine position. Cough productive with whitish sputum. No hemoptysis.`
      );
      setClinicalObservations(
        `Auscultation: Bilateral coarse crepitations in lower lung zones. Prolonged expiratory phase. Tachypneic at rest (RR: ${item.vitals.respiratoryRate}). Hydration adequate. Mild pallor noted.`
      );
      setDoctorAssessment(
        `Infective exacerbation of Chronic Bronchitis with secondary Hypoxemia (SpO2: ${item.vitals.spo2}). Known Hypertensive on irregular therapy.`
      );
      setTreatmentPlan(
        `1. Supplemental humidified oxygen titration (maintain SpO2 ≥ 94%)\n2. Bronchodilator nebulization with Salbutamol + Ipratropium\n3. Oral empirical antibiotic course\n4. Monitor blood pressure & fluid intake`
      );

      setPrescriptions([
        {
          id: 'rx-1',
          medicineName: 'Amoxicillin + Clavulanic Acid',
          dosage: '625 mg',
          frequency: '1-0-1',
          duration: '5 days',
          instructions: 'After meals',
        },
        {
          id: 'rx-2',
          medicineName: 'Salbutamol + Ipratropium Respules',
          dosage: '2.5 ml',
          frequency: '1-1-1 (TDS)',
          duration: '3 days',
          instructions: 'Nebulization every 8 hours',
        },
        {
          id: 'rx-3',
          medicineName: 'Paracetamol',
          dosage: '650 mg',
          frequency: '1-0-1 SOS',
          duration: '3 days',
          instructions: 'Take only if temperature > 100°F',
        },
      ]);
    } else {
      const pat = doctorMockService.getPatient(consultationId);
      if (pat) {
        setPatient(pat);
        setTimeline(doctorMockService.getPatientTimeline(pat.id));
        setChiefComplaint('Routine clinical review and health evaluation');
      }
    }
  }, [consultationId]);

  // Elapsed timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && !isCompleted) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isCompleted]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSaveDraft = () => {
    setIsSavingDraft(true);
    setTimeout(() => {
      setIsSavingDraft(false);
      setDraftMessage('Clinical notes and prescription draft saved locally.');
      setTimeout(() => setDraftMessage(''), 3500);
    }, 300);
  };

  const handleCompleteConsultation = () => {
    if (!patient) return;

    const record: ConsultationRecord = {
      id: `CONS-2026-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.fullName,
      doctorName: 'Dr. Anjali Sharma',
      facility: 'Shirpur Rural Hospital / Teleconsult Hub',
      dateTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      chiefComplaint,
      symptomsNotes,
      clinicalObservations,
      doctorAssessment,
      treatmentPlan,
      prescriptions,
      status: 'completed',
    };

    doctorMockService.saveConsultation(record);
    setIsCompleted(true);
    setIsTimerRunning(false);
  };

  if (!patient) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white border border-slate-200 rounded-md text-center space-y-3">
        <h2 className="text-base font-bold text-slate-900">Consultation Session Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested consultation token or patient could not be located in the active queue.
        </p>
        <Link
          to="/doctor"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-900 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Queue</span>
        </Link>
      </div>
    );
  }

  const hasAllergies = patient.allergies && !patient.allergies.includes('None reported');

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-20">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <Link
            to={`/doctor/patients/${patient.id}`}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
            title="Back to Patient Chart"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                Consultation
              </h1>
              <span className="font-semibold text-slate-900">• {patient.fullName}</span>
              <span className="font-mono text-xs text-slate-500">{patient.id}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                IN CONSULTATION
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {patient.age}y, {patient.gender} • Village: {patient.village}, {patient.taluka}
            </div>
          </div>
        </div>

        {/* Right Timer & Quick Teleconsult toggle */}
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono font-medium text-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          <Link
            to={`/doctor/teleconsultation/${patient.id}`}
            className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded text-xs font-medium transition-colors"
          >
            <Video className="w-3.5 h-3.5 text-slate-600" />
            <span>Video Call</span>
          </Link>
        </div>
      </div>

      {/* Save feedback banner */}
      {draftMessage && (
        <div className="bg-slate-100 border border-slate-300 text-slate-900 text-xs px-3.5 py-2 rounded flex items-center space-x-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{draftMessage}</span>
        </div>
      )}

      {/* Completion Banner */}
      {isCompleted && (
        <div className="bg-slate-900 text-white p-4 rounded-md space-y-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider">
              Consultation Successfully Completed
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Clinical notes, observations, assessment, and {prescriptions.length} medication orders have been committed to patient chart {patient.id}.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Link
              to="/doctor"
              className="px-3 py-1 bg-white text-slate-900 rounded text-xs font-medium hover:bg-slate-100"
            >
              Return to Queue
            </Link>
            <Link
              to={`/doctor/patients/${patient.id}`}
              className="px-3 py-1 bg-slate-800 text-slate-200 rounded text-xs font-medium hover:bg-slate-700 border border-slate-700"
            >
              View Updated Chart
            </Link>
          </div>
        </div>
      )}

      {/* Shared Layout: Main Consultation Form (Left 8 cols) + Sticky Context Panel (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= MAIN CONSULTATION FORM (8 cols) ================= */}
        <div className="lg:col-span-8 space-y-4">
          {/* Chief Complaint */}
          <div className="bg-white border border-slate-200 rounded-md p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Chief Complaint
              </label>
              <span className="text-[10px] text-slate-400">Intake reported</span>
            </div>
            <textarea
              rows={2}
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-500 leading-relaxed"
            />
          </div>

          {/* Clinical Notes */}
          <div className="bg-white border border-slate-200 rounded-md p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Clinical Notes / History of Presenting Illness
              </label>
              <span className="text-[10px] text-slate-400">Onset & progression</span>
            </div>
            <textarea
              rows={3}
              value={symptomsNotes}
              onChange={(e) => setSymptomsNotes(e.target.value)}
              placeholder="Record symptoms chronology, aggravating factors..."
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-slate-500 leading-relaxed"
            />
          </div>

          {/* Clinical Assessment */}
          <div className="bg-white border border-slate-200 rounded-md p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Clinical Assessment & Differential Diagnosis
              </label>
              <span className="text-[10px] text-slate-400">Attending physician impression</span>
            </div>
            <textarea
              rows={3}
              value={doctorAssessment}
              onChange={(e) => setDoctorAssessment(e.target.value)}
              placeholder="Record primary clinical impression..."
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-slate-500 leading-relaxed font-medium"
            />
          </div>

          {/* Treatment Plan */}
          <div className="bg-white border border-slate-200 rounded-md p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Treatment Plan & Clinical Instructions
              </label>
              <span className="text-[10px] text-slate-400">Therapy & warning signs</span>
            </div>
            <textarea
              rows={3}
              value={treatmentPlan}
              onChange={(e) => setTreatmentPlan(e.target.value)}
              placeholder="Outline therapeutic regimen, hydration, oxygen titration..."
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-slate-500 leading-relaxed font-mono"
            />
          </div>

          {/* Clean Inline Prescription Form */}
          <PrescriptionForm
            prescriptions={prescriptions}
            onChange={setPrescriptions}
            allergies={patient.allergies}
          />
        </div>

        {/* ================= RIGHT CONTEXT PANEL: STICKY WHILE SCROLLING (4 cols) ================= */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-18">
          {/* Vitals Summary */}
          {queueItem && (
            <VitalsPanel vitals={queueItem.vitals} />
          )}

          {/* Allergies & Current Medications */}
          <div className="bg-white border border-slate-200 rounded-md p-4 text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Clinical Safety Context
              </span>
            </div>

            {/* Allergies */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Allergies
              </span>
              {hasAllergies ? (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-900">
                  <strong>Warning:</strong> {patient.allergies.join(', ')}
                </div>
              ) : (
                <div className="text-slate-600 bg-slate-50 border border-slate-200 p-1.5 rounded">
                  None reported
                </div>
              )}
            </div>

            {/* Existing Conditions */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Existing Conditions
              </span>
              <div className="text-slate-800 font-medium bg-slate-50 border border-slate-200 p-1.5 rounded">
                {patient.existingConditions?.join(', ') || 'None reported'}
              </div>
            </div>

            {/* Current Medications */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Current Medications
              </span>
              <div className="text-slate-800 font-mono text-[11px] bg-slate-50 border border-slate-200 p-1.5 rounded">
                {patient.currentMedications?.join(', ') || 'None reported'}
              </div>
            </div>
          </div>

          {/* AI Summary Card */}
          {queueItem && (
            <AITriagePanel triage={queueItem.triage} />
          )}

          {/* Previous Visits / History */}
          <div className="bg-white border border-slate-200 rounded-md p-4 text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Previous Consultations
              </span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {timeline.slice(0, 3).map((evt) => (
                <div key={evt.id} className="p-2 bg-slate-50 border border-slate-200 rounded text-[11px] space-y-0.5">
                  <div className="flex justify-between text-slate-500 font-mono text-[10px]">
                    <span>{evt.date}</span>
                    <span className="uppercase">{evt.type}</span>
                  </div>
                  <div className="font-semibold text-slate-800">{evt.title}</div>
                  <div className="text-slate-500 truncate">{evt.details}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM STICKY ACTION BAR ================= */}
      <div className="sticky bottom-3 z-40 bg-white/95 backdrop-blur-xs border border-slate-300 rounded-md p-3 px-4 sm:px-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
          <span>Doctor session active. Prescriptions require physician confirmation.</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Save Draft */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors inline-flex items-center space-x-1"
          >
            <Save className="w-3.5 h-3.5 text-slate-600" />
            <span>{isSavingDraft ? 'Saving...' : 'Save Draft'}</span>
          </button>

          {/* Refer Patient (opens right-side slide-over drawer) */}
          <button
            type="button"
            onClick={() => setIsReferralOpen(true)}
            className="px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded transition-colors inline-flex items-center space-x-1"
          >
            <Send className="w-3.5 h-3.5 text-amber-700" />
            <span>Refer Patient</span>
          </button>

          {/* Schedule Follow-up (opens lightweight drawer) */}
          <button
            type="button"
            onClick={() => setIsFollowUpOpen(true)}
            className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded transition-colors inline-flex items-center space-x-1"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-600" />
            <span>Schedule Follow-up</span>
          </button>

          {/* Complete Consultation (Primary) */}
          <button
            type="button"
            onClick={handleCompleteConsultation}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors inline-flex items-center space-x-1.5 shadow-2xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Consultation</span>
          </button>
        </div>
      </div>

      {/* Slide-over Referral Drawer */}
      <ReferralDrawer
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
        patient={patient}
        initialReason={chiefComplaint}
        onSuccess={(ref) => {
          setDraftMessage(`Hospital referral to ${ref.destinationFacility} dispatched.`);
          setTimeout(() => setDraftMessage(''), 4000);
        }}
      />

      {/* Slide-over Follow-up Drawer */}
      <FollowUpDrawer
        isOpen={isFollowUpOpen}
        onClose={() => setIsFollowUpOpen(false)}
        patient={patient}
        initialReason={chiefComplaint}
        onSuccess={(fu) => {
          setDraftMessage(`Clinical follow-up scheduled for ${fu.date} (${fu.mode}).`);
          setTimeout(() => setDraftMessage(''), 4000);
        }}
      />
    </div>
  );
};
