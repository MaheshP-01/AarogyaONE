import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  MapPin,
  AlertTriangle,
  FileText,
  Share2,
} from 'lucide-react';
import { doctorMockService } from '../../services/doctorMockService';
import { VitalsPanel } from '../../components/doctor/VitalsPanel';
import { AITriagePanel } from '../../components/doctor/AITriagePanel';
import { MedicalTimeline } from '../../components/doctor/MedicalTimeline';
import { StatusBadge } from '../../components/doctor/StatusBadge';

export const PatientClinicalWorkspacePage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();

  const patient = doctorMockService.getPatient(patientId || 'RC-2026-004821');
  const queueItem = doctorMockService.getQueueItem(patientId || 'RC-2026-004821');
  const timeline = doctorMockService.getPatientTimeline(patientId || 'RC-2026-004821');

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white border border-slate-200 rounded-lg text-center">
        <h2 className="text-base font-bold text-slate-800">Unable to locate patient record</h2>
        <p className="text-xs text-slate-500 mt-1">
          No clinical record found matching identifier "{patientId}".
        </p>
        <Link
          to="/doctor"
          className="mt-4 inline-flex items-center space-x-1 text-xs font-semibold text-blue-700 hover:text-blue-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard Queue</span>
        </Link>
      </div>
    );
  }

  // Fallback vitals and triage if patient wasn't in active queue
  const currentVitals = queueItem?.vitals || {
    temperature: '98.6°F',
    heartRate: '78 bpm',
    bloodPressure: '120/80 mmHg',
    spo2: '98%',
    respiratoryRate: '16 /min',
    recordedAt: 'Today',
    recordedBy: 'Sunita Shinde, ANM',
  };

  const currentTriage = queueItem?.triage || {
    riskLevel: 'LOW',
    priority: 'ROUTINE',
    reportedIndicators: ['Routine baseline examination'],
    aiSummary: 'Reported symptoms and vitals are within standard parameters. Routine clinical consultation recommended.',
    recommendedNextStep: 'Conduct standard physician physical evaluation.',
    disclaimer: 'Decision-support information generated from reported symptoms and available vitals. Not a diagnosis.',
  };

  const chiefComplaint = queueItem?.chiefComplaint || 'Routine medical check-up & health intake';
  const symptomsDuration = queueItem?.symptomsDuration || '3 days';
  const symptomsList = queueItem?.symptomsList || ['Routine intake'];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Navigation & Action Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/doctor"
          className="inline-flex items-center space-x-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Queue</span>
        </Link>

        <div className="flex items-center space-x-2">
          <Link
            to={`/doctor/referrals/new?patientId=${patient.id}`}
            className="px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors inline-flex items-center space-x-1"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Refer Patient</span>
          </Link>

          <Link
            to={`/doctor/consultation/${queueItem?.id || 'CQ-101'}`}
            className="px-4 py-1.5 text-xs font-semibold rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors inline-flex items-center space-x-1.5 shadow-2xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Consultation</span>
          </Link>
        </div>
      </div>

      {/* Patient Master Identification Strip */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-base shrink-0">
              {patient.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  {patient.fullName}
                </h1>
                <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {patient.id}
                </span>
                {patient.abhaId && (
                  <span className="text-3xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    ABHA: {patient.abhaId}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {patient.age} yrs • {patient.gender} • Language:{' '}
                {patient.preferredLanguage === 'mr'
                  ? 'Marathi (मराठी)'
                  : patient.preferredLanguage === 'hi'
                  ? 'Hindi (हिंदी)'
                  : 'English'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
            <div className="text-right">
              <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider block">
                Primary Location
              </span>
              <span className="font-medium text-slate-800 flex items-center justify-end space-x-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>
                  {patient.village}, {patient.taluka}, {patient.district}
                </span>
              </span>
            </div>

            <div className="text-right pl-3 border-l border-slate-200">
              <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider block">
                Contact Phone
              </span>
              <span className="font-mono font-medium text-slate-900">
                +91 {patient.phone}
              </span>
            </div>

            {queueItem && (
              <div className="text-right pl-3 border-l border-slate-200">
                <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider block">
                  Triage Status
                </span>
                <div className="mt-0.5">
                  <StatusBadge type="priority" value={queueItem.priority} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two-Column Clinical Workstation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Background & Longitudinal Profile (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Allergies & Chronic Conditions */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Medical Alerts & Conditions
            </h3>

            {/* Known Allergies */}
            <div>
              <span className="text-3xs font-bold text-red-600 uppercase tracking-wider block mb-1">
                Known Drug Allergies
              </span>
              <div className="flex flex-wrap gap-1">
                {patient.allergies.map((all, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-800 border border-red-200"
                  >
                    <AlertTriangle className="w-3 h-3 mr-1 text-red-600" />
                    {all}
                  </span>
                ))}
              </div>
            </div>

            {/* Existing Chronic Conditions */}
            <div>
              <span className="text-3xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Diagnosed Chronic Conditions
              </span>
              <div className="flex flex-wrap gap-1">
                {patient.existingConditions.map((cond, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    {cond}
                  </span>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div>
              <span className="text-3xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Current Active Medications
              </span>
              <div className="space-y-1">
                {patient.currentMedications.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 rounded text-xs font-medium bg-slate-50 border border-slate-200 text-slate-800"
                  >
                    {med}
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="pt-2 border-t border-slate-100 text-xs">
              <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Emergency Contact
              </span>
              <span className="font-semibold text-slate-900 block">
                {patient.emergencyContact.name} ({patient.emergencyContact.relation})
              </span>
              <span className="font-mono text-slate-600 text-2xs">
                +91 {patient.emergencyContact.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Current Visit, Vitals & AI Triage (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Current Visit Symptoms */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-teal-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Current Presentation & Chief Complaint
                </h3>
              </div>
              <span className="text-2xs font-semibold text-slate-500">
                Duration: <strong className="text-slate-800">{symptomsDuration}</strong>
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-3 mb-3">
              <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Recorded Chief Complaint
              </span>
              <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                "{chiefComplaint}"
              </p>
            </div>

            <div>
              <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Reported Symptom Cluster
              </span>
              <div className="flex flex-wrap gap-1.5">
                {symptomsList.map((sym, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                  >
                    • {sym}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Vitals Panel */}
          <VitalsPanel vitals={currentVitals} />

          {/* AI-Assisted Triage Panel */}
          <AITriagePanel
            triage={currentTriage}
            onReviewSymptoms={() => {
              // Smooth scroll to chief complaint
              window.scrollTo({ top: 180, behavior: 'smooth' });
            }}
          />
        </div>
      </div>

      {/* Longitudinal Medical History Timeline */}
      <MedicalTimeline events={timeline} />
    </div>
  );
};
