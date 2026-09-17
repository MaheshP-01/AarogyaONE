import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  User,
  CheckCircle,
  AlertCircle,
  Activity,
  ArrowRight,
  ArrowLeft,
  Stethoscope,
  Video,
  Home,
} from 'lucide-react';
import {
  FollowUp,
  FollowUpFormData,
  FollowUpMode,
} from '../../../types/followup';
import { RegisteredPatientResult } from '../../../types/registration';
import { searchLocalPatients, getAllLocalPatients } from '../../../services/triageService';
import {
  DEMO_DOCTORS,
  AVAILABLE_TIME_SLOTS,
  getTodayIST,
} from '../../../services/clinicalDemoData';
import { createFollowUp } from '../../../services/followUpService';
import { SavedTriageAssessment, TRIAGE_STORAGE_KEY } from '../../../types/triage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (followUp: FollowUp) => void;
  initialPatientId?: string;
}

type Step = 'patient' | 'details' | 'review' | 'success';

export const ScheduleFollowUpDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  initialPatientId,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('patient');
  const [searchQuery, setSearchQuery] = useState('');
  const [matchingPatients, setMatchingPatients] = useState<RegisteredPatientResult[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<RegisteredPatientResult | null>(null);

  // Form State
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(getTodayIST());
  const [time, setTime] = useState('11:00 AM');
  const [mode, setMode] = useState<FollowUpMode>('TELECONSULTATION');
  const [doctorId, setDoctorId] = useState(DEMO_DOCTORS[0].id);
  const [notes, setNotes] = useState('');
  const [relatedTriageId, setRelatedTriageId] = useState('');

  // Triage history
  const [patientTriageList, setPatientTriageList] = useState<SavedTriageAssessment[]>([]);

  // State
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdFollowUp, setCreatedFollowUp] = useState<FollowUp | null>(null);

  useEffect(() => {
    if (isOpen) {
      const all = getAllLocalPatients();
      setMatchingPatients(all);

      if (initialPatientId) {
        const found = all.find((p) => p.patientId === initialPatientId);
        if (found) {
          setSelectedPatient(found);
          setCurrentStep('details');
        }
      }
    } else {
      setCurrentStep('patient');
      setSearchQuery('');
      setSelectedPatient(null);
      setReason('');
      setNotes('');
      setRelatedTriageId('');
      setError('');
      setCreatedFollowUp(null);
    }
  }, [isOpen, initialPatientId]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setMatchingPatients(searchLocalPatients(searchQuery));
    } else {
      setMatchingPatients(getAllLocalPatients());
    }
  }, [searchQuery]);

  useEffect(() => {
    if (selectedPatient) {
      try {
        const raw = localStorage.getItem(TRIAGE_STORAGE_KEY);
        if (raw) {
          const list: SavedTriageAssessment[] = JSON.parse(raw);
          const patientRecords = list.filter((t) => t.patientId === selectedPatient.patientId);
          setPatientTriageList(patientRecords);
          if (patientRecords.length > 0 && !relatedTriageId) {
            setRelatedTriageId(patientRecords[0].assessmentId);
          }
        }
      } catch {
        setPatientTriageList([]);
      }
    }
  }, [selectedPatient]);

  if (!isOpen) return null;

  const selectedDoctor = DEMO_DOCTORS.find((d) => d.id === doctorId) || DEMO_DOCTORS[0];

  const handlePatientSelect = (p: RegisteredPatientResult) => {
    setSelectedPatient(p);
    setCurrentStep('details');
  };

  const handleDetailsNext = () => {
    if (!reason.trim()) {
      setError('Please provide a reason for the follow-up.');
      return;
    }
    if (!date) {
      setError('Please select a follow-up date.');
      return;
    }
    if (!time) {
      setError('Please select a follow-up time.');
      return;
    }

    setError('');
    setCurrentStep('review');
  };

  const handleConfirm = async () => {
    if (!selectedPatient) return;

    try {
      setIsSubmitting(true);
      setError('');

      const formData: FollowUpFormData = {
        selectedPatientId: selectedPatient.patientId,
        selectedPatientName: selectedPatient.fullName,
        relatedTriageId: relatedTriageId || undefined,
        reason: reason.trim(),
        date,
        time,
        mode,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        notes: notes.trim() || undefined,
      };

      const result = await createFollowUp(formData);
      setCreatedFollowUp(result);
      setCurrentStep('success');
      onSuccess(result);
    } catch (err: any) {
      setError(err.message || 'Failed to schedule follow-up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleAnother = () => {
    setCurrentStep('patient');
    setSelectedPatient(null);
    setReason('');
    setNotes('');
    setRelatedTriageId('');
    setError('');
    setCreatedFollowUp(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-drawer-title"
    >
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 id="schedule-drawer-title" className="text-sm font-bold text-slate-900">
              Schedule Patient Follow-up
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Care continuity tracking for post-consultation and triage patients
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-rose-800 flex items-center space-x-2 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: PATIENT SELECTION */}
          {currentStep === 'patient' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Select Patient</h3>
                <p className="text-slate-500 text-xs">
                  Search registered patients who need follow-up evaluation.
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Suresh Patil, RC-2026-004821, phone..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-teal-600 focus:bg-white"
                  autoFocus
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {matchingPatients.length > 0 ? (
                  matchingPatients.map((p) => (
                    <div
                      key={p.patientId}
                      onClick={() => handlePatientSelect(p)}
                      className="p-3 bg-white border border-slate-200 hover:border-teal-400 rounded-lg transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 group-hover:text-teal-900">
                            {p.fullName}
                          </span>
                          <span className="font-mono text-3xs font-semibold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                            {p.patientId}
                          </span>
                        </div>
                        <p className="text-slate-500 text-2xs">
                          {p.age} years • {p.gender} • {p.village}, {p.taluka}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-teal-700 group-hover:text-teal-900 flex items-center gap-1">
                        Select <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg">
                    <User className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                    <p className="font-medium text-slate-600">No matching patients found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {currentStep === 'details' && selectedPatient && (
            <div className="space-y-4">
              {/* Patient Banner */}
              <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{selectedPatient.fullName}</span>
                  <span className="text-2xs text-slate-600">
                    {selectedPatient.patientId} • {selectedPatient.age} yrs •{' '}
                    {selectedPatient.village}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep('patient')}
                  className="text-2xs text-teal-800 font-semibold underline hover:text-teal-900"
                >
                  Change
                </button>
              </div>

              {/* Related Triage Link if present */}
              {patientTriageList.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-teal-700" /> Related Triage Assessment
                  </label>
                  <select
                    value={relatedTriageId}
                    onChange={(e) => setRelatedTriageId(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-teal-600 font-medium text-slate-700"
                  >
                    <option value="">None (Standalone follow-up)</option>
                    {patientTriageList.map((t) => (
                      <option key={t.assessmentId} value={t.assessmentId}>
                        {t.assessmentId} — {t.riskLevel} risk ({t.summary})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Reason */}
              <div>
                <label
                  htmlFor="followup-reason"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Follow-up Reason <span className="text-rose-600">*</span>
                </label>
                <input
                  id="followup-reason"
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Review symptoms after consultation, check blood pressure, monitor fever..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-teal-600 focus:bg-white"
                  autoFocus
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="followup-date"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Follow-up Date <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="followup-date"
                    type="date"
                    min={getTodayIST()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="followup-time"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Follow-up Time <span className="text-rose-600">*</span>
                  </label>
                  <select
                    id="followup-time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-teal-600 focus:bg-white text-slate-800"
                  >
                    {AVAILABLE_TIME_SLOTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mode */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Follow-up Mode <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center cursor-pointer transition-all ${
                      mode === 'TELECONSULTATION'
                        ? 'border-teal-600 bg-teal-50/50 shadow-2xs font-bold text-teal-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="followup-mode"
                      value="TELECONSULTATION"
                      checked={mode === 'TELECONSULTATION'}
                      onChange={() => setMode('TELECONSULTATION')}
                      className="sr-only"
                    />
                    <Video className="w-4 h-4 mb-1 text-blue-700" />
                    <span className="text-2xs">Teleconsult</span>
                  </label>

                  <label
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center cursor-pointer transition-all ${
                      mode === 'IN_PERSON'
                        ? 'border-teal-600 bg-teal-50/50 shadow-2xs font-bold text-teal-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="followup-mode"
                      value="IN_PERSON"
                      checked={mode === 'IN_PERSON'}
                      onChange={() => setMode('IN_PERSON')}
                      className="sr-only"
                    />
                    <Stethoscope className="w-4 h-4 mb-1 text-teal-700" />
                    <span className="text-2xs">In-person PHC</span>
                  </label>

                  <label
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center cursor-pointer transition-all ${
                      mode === 'HW_VISIT'
                        ? 'border-teal-600 bg-teal-50/50 shadow-2xs font-bold text-teal-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="followup-mode"
                      value="HW_VISIT"
                      checked={mode === 'HW_VISIT'}
                      onChange={() => setMode('HW_VISIT')}
                      className="sr-only"
                    />
                    <Home className="w-4 h-4 mb-1 text-indigo-700" />
                    <span className="text-2xs">HW Home Visit</span>
                  </label>
                </div>
              </div>

              {/* Assigned Doctor */}
              <div>
                <label
                  htmlFor="assigned-doctor"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Assigned Doctor
                </label>
                <select
                  id="assigned-doctor"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-teal-600 focus:bg-white text-slate-800"
                >
                  {DEMO_DOCTORS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="followup-notes"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Clinical Instructions / Notes
                </label>
                <textarea
                  id="followup-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Check morning blood pressure; verify antibiotic course completion..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-teal-600 focus:bg-white resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {currentStep === 'review' && selectedPatient && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Confirm Follow-up Details</h3>
                <p className="text-slate-500 text-xs">
                  Review parameters before saving to patient schedule.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 bg-white">
                <div className="p-3 flex justify-between">
                  <span className="text-slate-500 font-medium">Patient:</span>
                  <span className="font-bold text-slate-900">
                    {selectedPatient.fullName} ({selectedPatient.patientId})
                  </span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 font-medium block mb-1">Reason:</span>
                  <p className="text-slate-800 font-semibold">{reason}</p>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-slate-500 font-medium">Date & Time:</span>
                  <span className="font-bold text-slate-900">
                    {date} at {time}
                  </span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-slate-500 font-medium">Mode:</span>
                  <span className="font-semibold text-slate-800">{(mode || 'HW_VISIT').replace('_', ' ')}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-slate-500 font-medium">Doctor:</span>
                  <span className="font-semibold text-slate-800">{selectedDoctor.name}</span>
                </div>
                {notes && (
                  <div className="p-3">
                    <span className="text-slate-500 font-medium block mb-1">Notes:</span>
                    <p className="text-slate-700 text-xs leading-relaxed">{notes}</p>
                  </div>
                )}
                {relatedTriageId && (
                  <div className="p-3 flex justify-between bg-teal-50/40">
                    <span className="text-teal-800 font-medium">Attached Triage:</span>
                    <span className="font-mono font-bold text-teal-900">{relatedTriageId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS STATE */}
          {currentStep === 'success' && createdFollowUp && (
            <div className="py-6 px-2 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">Follow-up Scheduled</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Follow-up recorded and added to the care continuity schedule.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-left space-y-2 max-w-sm mx-auto text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Follow-up ID</span>
                  <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {createdFollowUp.followUpId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-semibold text-slate-900">
                    {createdFollowUp.patientName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Date:</span>
                  <span className="font-bold text-slate-900">
                    {createdFollowUp.date} at {createdFollowUp.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mode:</span>
                  <span className="font-semibold text-slate-800">
                    {(createdFollowUp.mode || 'HW_VISIT').replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md shadow-2xs transition-colors"
                >
                  View in Follow-ups List
                </button>
                <button
                  type="button"
                  onClick={handleScheduleAnother}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
                >
                  Schedule Another
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {currentStep !== 'success' && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div>
              {currentStep !== 'patient' && (
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 'details') setCurrentStep('patient');
                    if (currentStep === 'review') setCurrentStep('details');
                  }}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-md transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-md transition-colors"
              >
                Cancel
              </button>

              {currentStep === 'details' && (
                <button
                  type="button"
                  onClick={handleDetailsNext}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md shadow-2xs transition-colors"
                >
                  Review Details
                </button>
              )}

              {currentStep === 'review' && (
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="px-5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-md shadow-2xs transition-colors"
                >
                  {isSubmitting ? 'Scheduling...' : 'Schedule Follow-up'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
