import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Share2, AlertTriangle, User, Phone, MapPin } from 'lucide-react';
import { doctorMockService } from '../../services/doctorMockService';
import { VitalsPanel } from '../../components/doctor/VitalsPanel';
import { AITriagePanel } from '../../components/doctor/AITriagePanel';
import { MedicalTimeline } from '../../components/doctor/MedicalTimeline';
import { ReferralDrawer } from '../../components/doctor/ReferralDrawer';

export const PatientClinicalWorkspacePage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [isReferralOpen, setIsReferralOpen] = useState(false);

  const patient = doctorMockService.getPatient(patientId || 'RC-2026-004821');
  const queueItem = doctorMockService.getQueueItem(patientId || 'RC-2026-004821');
  const timeline = doctorMockService.getPatientTimeline(patientId || 'RC-2026-004821');

  if (!patient) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white border border-slate-200 rounded-md text-center space-y-3">
        <h2 className="text-base font-bold text-slate-900">Patient Record Not Found</h2>
        <p className="text-xs text-slate-500">
          No clinical record found matching identifier "{patientId}".
        </p>
        <Link
          to="/doctor"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-900 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  const currentVitals = queueItem?.vitals || {
    temperature: '102°F',
    heartRate: '96 bpm',
    bloodPressure: '138/86 mmHg',
    spo2: '91%',
    respiratoryRate: '22 /min',
    recordedAt: 'Today 08:45 AM',
    recordedBy: 'Sunita Shinde, ANM',
  };

  const currentTriage = queueItem?.triage || {
    riskLevel: 'HIGH',
    priority: 'URGENT',
    reportedIndicators: ['Fever', 'Cough', 'Breathing difficulty', 'Low SpO2'],
    aiSummary: 'Reported symptoms and vitals indicate elevated risk and warrant prompt clinical evaluation.',
    recommendedNextStep: 'Prioritize physician assessment.',
    potentialMissingInfo: 'Duration of symptoms not recorded.',
    disclaimer: 'Decision-support information based on reported symptoms and available vitals. Not a diagnosis.',
  };

  const chiefComplaint = queueItem?.chiefComplaint || 'Breathing difficulty & persistent fever';
  const symptomsDuration = queueItem?.symptomsDuration || '3 days';
  const symptomsList = queueItem?.symptomsList || ['Fever', 'Dry cough', 'Dyspnea on exertion'];

  const getLanguageLabel = (code: string) => {
    if (code === 'mr') return 'Marathi';
    if (code === 'hi') return 'Hindi';
    return 'English';
  };

  const hasAllergies = patient.allergies && !patient.allergies.includes('None reported');

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-16">
      {/* Top Back Nav & Quick Action */}
      <div className="flex items-center justify-between">
        <Link
          to="/doctor"
          className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Queue</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsReferralOpen(true)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors inline-flex items-center space-x-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Refer Patient</span>
          </button>

          <Link
            to={`/doctor/consultation/${queueItem?.id || patient.id}`}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors inline-flex items-center space-x-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Consultation</span>
          </Link>
        </div>
      </div>

      {/* Patient Master Clinical Header */}
      <div className="bg-white border border-slate-200 rounded-md p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-baseline space-x-3">
            <span className="text-xs text-slate-400 font-medium">Patient:</span>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              {patient.fullName}
            </h1>
            <span className="font-mono text-xs text-slate-500 font-medium">
              ID: {patient.id}
            </span>
          </div>

          <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{patient.age} years</span>
            <span>•</span>
            <span>{patient.gender}</span>
            <span>•</span>
            <span>Preferred language: <strong className="text-slate-800">{getLanguageLabel(patient.preferredLanguage)}</strong></span>
            <span>•</span>
            <span>{patient.village}, {patient.taluka}, {patient.district}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Link
            to={`/doctor/consultation/${queueItem?.id || patient.id}`}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold transition-colors inline-flex items-center space-x-1.5 shadow-2xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Consultation</span>
          </Link>
        </div>
      </div>

      {/* Structured 2-Column Clinical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= LEFT / MAIN COLUMN (8 cols) ================= */}
        <div className="lg:col-span-8 space-y-4">
          {/* Current Visit */}
          <div className="bg-white border border-slate-200 rounded-md p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Current Visit
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Intake: Today
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Chief Complaint
                </span>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  {chiefComplaint}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Duration
                </span>
                <p className="text-sm font-medium text-slate-800 mt-0.5 font-mono">
                  {symptomsDuration}
                </p>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Reported Symptoms
              </span>
              <div className="flex flex-wrap gap-1.5">
                {symptomsList.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-800 border border-slate-200 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Vitals (Temperature, Heart Rate, Blood Pressure, SpO2, Respiratory Rate) */}
          <VitalsPanel vitals={currentVitals} />

          {/* AI-Assisted Triage (Non-dominant, decision support) */}
          <AITriagePanel triage={currentTriage} />

          {/* Medical History Timeline */}
          <MedicalTimeline events={timeline} />
        </div>

        {/* ================= RIGHT COLUMN: PATIENT SUMMARY (4 cols) ================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* Patient Summary Card */}
          <div className="bg-white border border-slate-200 rounded-md p-4 space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Patient Summary
              </h2>
            </div>

            {/* Allergies */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Allergies
              </span>
              {hasAllergies ? (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-900 space-y-0.5">
                  <div className="font-bold flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    <span>Known Drug / Food Allergies</span>
                  </div>
                  <div>{patient.allergies.join(', ')}</div>
                </div>
              ) : (
                <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 p-2 rounded">
                  None reported
                </p>
              )}
            </div>

            {/* Existing Conditions */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Existing Conditions
              </span>
              {patient.existingConditions && patient.existingConditions.length > 0 && !patient.existingConditions.includes('None reported') ? (
                <ul className="space-y-1 text-xs">
                  {patient.existingConditions.map((cond) => (
                    <li key={cond} className="p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-800 font-medium">
                      {cond}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic">None reported</p>
              )}
            </div>

            {/* Current Medications */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Current Medications
              </span>
              {patient.currentMedications && patient.currentMedications.length > 0 && !patient.currentMedications.includes('None reported') ? (
                <ul className="space-y-1 text-xs font-mono">
                  {patient.currentMedications.map((med) => (
                    <li key={med} className="p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-800">
                      {med}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic">None reported</p>
              )}
            </div>

            {/* Emergency Contact */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Emergency Contact
              </span>
              <div className="font-semibold text-slate-900">
                {patient.emergencyContact?.name} ({patient.emergencyContact?.relation})
              </div>
              <div className="font-mono text-slate-600">
                {patient.emergencyContact?.phone}
              </div>
            </div>

            {/* Location & ABHA */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Demographics & ABHA
              </span>
              <div className="text-slate-600">
                Village: <span className="font-medium text-slate-900">{patient.village}, {patient.taluka}</span>
              </div>
              <div className="text-slate-600 font-mono text-[11px]">
                ABHA: {patient.abhaId || '91-4421-8890-1204'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over Referral Drawer */}
      <ReferralDrawer
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
        patient={patient}
        initialReason={chiefComplaint}
      />
    </div>
  );
};
