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
import { ReferralModal } from '../../components/doctor/ReferralModal';
import { FollowUpModal } from '../../components/doctor/FollowUpModal';

export const ConsultationWorkspacePage: React.FC = () => {
  const { consultationId } = useParams<{ consultationId: string }>();

  // Fetch consultation item or patient
  const [queueItem, setQueueItem] = useState<ConsultationQueueItem | undefined>(undefined);
  const [patient, setPatient] = useState<ClinicalPatient | undefined>(undefined);
  const [timeline, setTimeline] = useState<ClinicalTimelineEvent[]>([]);

  // Clinical consultation draft fields
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptomsNotes, setSymptomsNotes] = useState('');
  const [clinicalObservations, setClinicalObservations] = useState('');
  const [doctorAssessment, setDoctorAssessment] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);

  // Active consultation elapsed timer
  const [elapsedSeconds, setElapsedSeconds] = useState(145); // default starting at ~2.5 mins
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Modals
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [saveDraftMessage, setSaveDraftMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!consultationId) return;

    // Find queue item or patient
    const item = doctorMockService.getQueueItem(consultationId);
    if (item) {
      setQueueItem(item);
      const pat = doctorMockService.getPatient(item.patientId);
      setPatient(pat);
      setTimeline(doctorMockService.getPatientTimeline(item.patientId));

      // Prepopulate clinical fields from intake
      setChiefComplaint(item.chiefComplaint);
      setSymptomsNotes(
        `Patient reports acute onset of ${item.chiefComplaint.toLowerCase()} since ${item.symptomsDuration || '3 days'}. Dyspnea exacerbates on exertion and supine position. Cough productive with whitish sputum. No frank hemoptysis.`
      );
      setClinicalObservations(
        `Auscultation: Bilateral coarse crepitations in lower lung zones. Prolonged expiratory phase. Tachypneic at rest (RR: ${item.vitals.respiratoryRate}). Hydration adequate. Mild peripheral pallor noted.`
      );
      setDoctorAssessment(
        `Infective exacerbation of Chronic Bronchitis with secondary Hypoxemia (SpO2: ${item.vitals.spo2}). Known Hypertensive on irregular medications.`
      );
      setTreatmentPlan(
        `1. Supplemental humidified oxygen titration (maintain SpO2 ≥ 94%)\n2. Bronchodilator nebulization with Salbutamol + Ipratropium\n3. Oral empirical antibiotic course\n4. Strict monitoring of blood pressure & fluid balance`
      );

      // Default baseline prescription items
      setPrescriptions([
        {
          id: 'rx-1',
          medicineName: 'Amoxicillin + Clavulanic Acid (Augmentin)',
          dosage: '625 mg',
          frequency: '1-0-1',
          duration: '5 days',
          instructions: 'After meals with water',
        },
        {
          id: 'rx-2',
          medicineName: 'Salbutamol + Ipratropium Respules',
          dosage: '2.5 ml',
          frequency: 'TDS (3 times/day)',
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
      // Fallback: Check if consultationId directly matches a patientId
      const pat = doctorMockService.getPatient(consultationId);
      if (pat) {
        setPatient(pat);
        setTimeline(doctorMockService.getPatientTimeline(pat.id));
        setChiefComplaint('Routine clinical review and health assessment');
      }
    }
  }, [consultationId]);

  // Timer increment
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
      setSaveDraftMessage('Clinical notes and prescription draft saved locally.');
      setTimeout(() => setSaveDraftMessage(''), 4000);
    }, 400);
  };

  const handleCompleteConsultation = () => {
    if (!patient) return;

    const record: ConsultationRecord = {
      id: `CONS-2026-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.fullName,
      doctorName: 'Dr. Anjali Sharma',
      facility: 'Shirpur Sub-District / PHC Teleconsult Hub',
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
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-800">Consultation Session Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested consultation token or patient ID could not be identified in the active queue.
        </p>
        <Link
          to="/doctor"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-700 text-white rounded text-xs font-medium hover:bg-blue-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Doctor Queue</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-16">
      {/* Top Clinical Header Bar */}
      <div className="bg-white border border-slate-200 rounded-lg px-4 sm:px-6 py-3.5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <Link
            to={`/doctor/patients/${patient.id}`}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
            title="Back to Patient Chart"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                Clinical Consultation
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 animate-pulse" />
                In Consultation
              </span>
            </div>
            <div className="text-xs text-slate-600 flex items-center space-x-2 mt-0.5">
              <span>Patient: <strong className="text-slate-900">{patient.fullName}</strong></span>
              <span>•</span>
              <span className="font-mono text-slate-500">{patient.id}</span>
              <span>•</span>
              <span>{patient.age}y / {patient.gender}</span>
              <span>•</span>
              <span>{patient.village}, {patient.taluka}</span>
            </div>
          </div>
        </div>

        {/* Right side: Timer & Quick Teleconsult toggle */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="font-mono font-bold text-slate-800">{formatTimer(elapsedSeconds)}</span>
            <span className="text-[10px] text-slate-400 uppercase">Elapsed</span>
          </div>

          <Link
            to={`/doctor/teleconsultation/${patient.id}`}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded text-xs font-medium transition-colors"
          >
            <Video className="w-3.5 h-3.5 text-blue-700" />
            <span>Launch Video Call</span>
          </Link>
        </div>
      </div>

      {/* Draft feedback message if any */}
      {saveDraftMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs px-4 py-2.5 rounded-lg flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveDraftMessage}</span>
        </div>
      )}

      {/* Completion Banner if finished */}
      {isCompleted && (
        <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg text-slate-900 space-y-3">
          <div className="flex items-center space-x-2 text-blue-900">
            <CheckCircle2 className="w-5 h-5 text-blue-700" />
            <h2 className="text-sm font-bold">Consultation Successfully Finalized & Stored</h2>
          </div>
          <p className="text-xs text-slate-700">
            Clinical assessment, observations, and {prescriptions.length} medication orders have been securely committed to patient record <span className="font-mono font-semibold">{patient.id}</span> and synchronized with the frontline ASHA worker.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/doctor"
              className="px-4 py-1.5 bg-blue-700 text-white rounded text-xs font-medium hover:bg-blue-800"
            >
              Return to Consultation Queue
            </Link>
            <Link
              to={`/doctor/patients/${patient.id}`}
              className="px-4 py-1.5 bg-white text-slate-700 border border-slate-300 rounded text-xs font-medium hover:bg-slate-50"
            >
              View Updated Patient Record
            </Link>
            <button
              onClick={() => setShowReferralModal(true)}
              className="px-4 py-1.5 bg-amber-700 text-white rounded text-xs font-medium hover:bg-amber-800"
            >
              Refer to District Hospital
            </button>
            <button
              onClick={() => setShowFollowUpModal(true)}
              className="px-4 py-1.5 bg-emerald-700 text-white rounded text-xs font-medium hover:bg-emerald-800"
            >
              Schedule Follow-up
            </button>
          </div>
        </div>
      )}

      {/* 3-Column Clinical Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= COLUMN 1: LEFT - PATIENT SUMMARY (3 cols) ================= */}
        <div className="lg:col-span-3 space-y-4">
          {/* Demographics Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-blue-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Patient Demographics
              </h2>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Full Name</div>
                <div className="font-bold text-slate-900">{patient.fullName}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Age / Sex</div>
                  <div className="font-medium text-slate-800">{patient.age}y, {patient.gender}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Language</div>
                  <div className="font-medium text-slate-800 uppercase">{patient.preferredLanguage}</div>
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Location</div>
                <div className="font-medium text-slate-800">
                  {patient.village}, {patient.taluka}, {patient.district}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">ABHA ID</div>
                <div className="font-mono text-slate-700 text-[11px]">{patient.abhaId || 'Pending ABHA generation'}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Emergency Contact</div>
                <div className="text-slate-800">
                  {patient.emergencyContact?.name} ({patient.emergencyContact?.relation}):{' '}
                  <span className="font-mono font-medium">{patient.emergencyContact?.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Allergies Card - Prominent Warning */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-2">
            <div className="flex items-center space-x-1.5 pb-2 border-b border-slate-100">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Allergies & Contraindications
              </h2>
            </div>
            {patient.allergies && patient.allergies.length > 0 && !patient.allergies.includes('None reported') ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {patient.allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="inline-flex items-center px-2.5 py-1 bg-red-50 text-red-800 border border-red-200 rounded text-xs font-semibold"
                  >
                    <AlertOctagon className="w-3 h-3 mr-1 text-red-600" />
                    {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No drug allergies recorded in medical profile.</p>
            )}
          </div>

          {/* Existing Conditions */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Existing Chronic Conditions
            </h2>
            {patient.existingConditions && patient.existingConditions.length > 0 && !patient.existingConditions.includes('None reported') ? (
              <ul className="space-y-1.5 text-xs">
                {patient.existingConditions.map((cond) => (
                  <li key={cond} className="flex items-center space-x-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">No chronic pre-existing illnesses reported.</p>
            )}
          </div>

          {/* Current Ongoing Medications */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Current Medications
            </h2>
            {patient.currentMedications && patient.currentMedications.length > 0 && !patient.currentMedications.includes('None reported') ? (
              <ul className="space-y-1.5 text-xs font-mono text-slate-700">
                {patient.currentMedications.map((med) => (
                  <li key={med} className="p-1.5 bg-slate-50 border border-slate-200 rounded">
                    {med}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">No regular daily medications recorded.</p>
            )}
          </div>
        </div>

        {/* ================= COLUMN 2: CENTER - CLINICAL WORKSPACE (6 cols) ================= */}
        <div className="lg:col-span-6 space-y-4">
          {/* Chief Complaint */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Chief Complaint <span className="text-red-600">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Intake reported</span>
            </div>
            <input
              type="text"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
              placeholder="e.g. Acute exacerbation of breathlessness, high-grade fever for 3 days"
            />
          </div>

          {/* Symptoms / Clinical Notes */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Symptoms & History of Presenting Illness <span className="text-red-600">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Detailed Onset & Duration</span>
            </div>
            <textarea
              rows={3}
              value={symptomsNotes}
              onChange={(e) => setSymptomsNotes(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded text-slate-800 focus:border-blue-600 focus:outline-none leading-relaxed"
              placeholder="Record chronology of symptoms, progression, diurnal variation, aggravating or relieving factors..."
            />
          </div>

          {/* Clinical Observations */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Physical Examination & Clinical Observations <span className="text-red-600">*</span>
              </label>
              <span className="text-[11px] text-slate-400">General & Systemic Exam</span>
            </div>
            <textarea
              rows={3}
              value={clinicalObservations}
              onChange={(e) => setClinicalObservations(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded text-slate-800 focus:border-blue-600 focus:outline-none leading-relaxed"
              placeholder="Record chest auscultation, cardiovascular sounds, abdominal signs, cyanosis, clubbing, pedal edema..."
            />
          </div>

          {/* Doctor Assessment / Diagnosis */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Doctor Clinical Assessment & Provisional Diagnosis <span className="text-red-600">*</span>
              </label>
              <span className="text-[11px] text-blue-700 font-medium">Physician Assessment</span>
            </div>
            <textarea
              rows={3}
              value={doctorAssessment}
              onChange={(e) => setDoctorAssessment(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded text-slate-800 focus:border-blue-600 focus:outline-none leading-relaxed font-medium"
              placeholder="Physician's definitive clinical impression and differential diagnosis..."
            />
          </div>

          {/* Treatment Plan */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Treatment Plan & Care Instructions <span className="text-red-600">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Diet, Hydration & Escalation Signs</span>
            </div>
            <textarea
              rows={3}
              value={treatmentPlan}
              onChange={(e) => setTreatmentPlan(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded text-slate-800 focus:border-blue-600 focus:outline-none leading-relaxed font-mono"
              placeholder="Outline supportive therapy, nursing instructions, fluid intake, and warning signs..."
            />
          </div>

          {/* Doctor e-Prescription Form */}
          <PrescriptionForm
            prescriptions={prescriptions}
            onChange={setPrescriptions}
            allergies={patient.allergies}
          />
        </div>

        {/* ================= COLUMN 3: RIGHT - CLINICAL CONTEXT & AI TRIAGE (3 cols) ================= */}
        <div className="lg:col-span-3 space-y-4">
          {/* Intake Vitals */}
          {queueItem && (
            <VitalsPanel vitals={queueItem.vitals} />
          )}

          {/* AI-Assisted Triage Decision Support Panel */}
          {queueItem && (
            <AITriagePanel triage={queueItem.triage} />
          )}

          {/* Previous Consultations / Timeline History */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <History className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Longitudinal History
              </h2>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {timeline.map((evt) => (
                <div key={evt.id} className="text-xs border-l-2 border-slate-200 pl-3 py-0.5 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{evt.title}</span>
                    <span className="font-mono text-[10px] text-slate-400">{evt.date}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{evt.facility} • {evt.doctorOrWorker}</div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{evt.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= FIXED BOTTOM ACTION BAR ================= */}
      <div className="sticky bottom-3 z-40 bg-white/95 backdrop-blur-xs border border-slate-300 rounded-lg p-3 sm:px-6 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Doctor session active. Clinical assessment requires attending physician confirmation.</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Save Draft */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-slate-600" />
            <span>{isSavingDraft ? 'Saving...' : 'Save Draft'}</span>
          </button>

          {/* Refer Patient */}
          <button
            type="button"
            onClick={() => setShowReferralModal(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-amber-700" />
            <span>Refer Patient</span>
          </button>

          {/* Schedule Follow-up */}
          <button
            type="button"
            onClick={() => setShowFollowUpModal(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-700" />
            <span>Schedule Follow-up</span>
          </button>

          {/* Complete Consultation (Primary) */}
          <button
            type="button"
            onClick={handleCompleteConsultation}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded shadow-xs transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Consultation</span>
          </button>
        </div>
      </div>

      {/* Referral Modal */}
      {patient && (
        <ReferralModal
          isOpen={showReferralModal}
          onClose={() => setShowReferralModal(false)}
          patient={patient}
          initialReason={chiefComplaint}
          onSuccess={(ref) => {
            setSaveDraftMessage(`Referral to ${ref.destinationFacility} successfully generated.`);
            setTimeout(() => setSaveDraftMessage(''), 5000);
          }}
        />
      )}

      {/* Follow-up Modal */}
      {patient && (
        <FollowUpModal
          isOpen={showFollowUpModal}
          onClose={() => setShowFollowUpModal(false)}
          patient={patient}
          initialReason={chiefComplaint}
          onSuccess={(fu) => {
            setSaveDraftMessage(`Follow-up (${fu.mode}) scheduled for ${fu.date}.`);
            setTimeout(() => setSaveDraftMessage(''), 5000);
          }}
        />
      )}
    </div>
  );
};
