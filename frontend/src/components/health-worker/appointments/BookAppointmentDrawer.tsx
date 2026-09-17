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
  Users,
} from 'lucide-react';
import {
  Appointment,
  AppointmentFormData,
  ConsultationMode,
} from '../../../types/appointment';
import { RegisteredPatientResult } from '../../../types/registration';
import { searchLocalPatients, getAllLocalPatients } from '../../../services/triageService';
import {
  DEMO_FACILITIES,
  DEMO_DOCTORS,
  AVAILABLE_TIME_SLOTS,
  getTodayIST,
} from '../../../services/clinicalDemoData';
import { getBookedSlots, createAppointment } from '../../../services/appointmentService';
import { SavedTriageAssessment, TRIAGE_STORAGE_KEY } from '../../../types/triage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (appointment: Appointment) => void;
  initialPatientId?: string;
}

type Step = 'patient' | 'doctor' | 'mode' | 'datetime' | 'reason' | 'review' | 'success';

export const BookAppointmentDrawer: React.FC<Props> = ({
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
  const [selectedFacilityId, setSelectedFacilityId] = useState(DEMO_FACILITIES[0].id);
  const [selectedDoctorId, setSelectedDoctorId] = useState(DEMO_DOCTORS[0].id);
  const [consultationMode, setConsultationMode] = useState<ConsultationMode>('IN_PERSON');
  const [selectedDate, setSelectedDate] = useState(getTodayIST());
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [selectedTriageId, setSelectedTriageId] = useState<string>('');

  // Available / Booked slots
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Patient triage history
  const [patientTriageList, setPatientTriageList] = useState<SavedTriageAssessment[]>([]);

  // Submission & errors
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  // Initial load
  useEffect(() => {
    if (isOpen) {
      const allPatients = getAllLocalPatients();
      setMatchingPatients(allPatients);

      if (initialPatientId) {
        const found = allPatients.find((p) => p.patientId === initialPatientId);
        if (found) {
          setSelectedPatient(found);
          setCurrentStep('doctor');
        }
      }
    } else {
      // Reset state on close
      setCurrentStep('patient');
      setSearchQuery('');
      setSelectedPatient(null);
      setSelectedTime('');
      setReason('');
      setSelectedTriageId('');
      setError('');
      setCreatedAppointment(null);
    }
  }, [isOpen, initialPatientId]);

  // Handle patient search
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setMatchingPatients(searchLocalPatients(searchQuery));
    } else {
      setMatchingPatients(getAllLocalPatients());
    }
  }, [searchQuery]);

  // Load booked slots whenever doctor or date changes
  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      setIsLoadingSlots(true);
      getBookedSlots(selectedDoctorId, selectedDate)
        .then((slots) => {
          setBookedSlots(slots);
          if (slots.includes(selectedTime)) {
            setSelectedTime('');
          }
        })
        .finally(() => setIsLoadingSlots(false));
    }
  }, [selectedDoctorId, selectedDate]);

  // Load patient's previous triage records
  useEffect(() => {
    if (selectedPatient) {
      try {
        const raw = localStorage.getItem(TRIAGE_STORAGE_KEY);
        if (raw) {
          const list: SavedTriageAssessment[] = JSON.parse(raw);
          const patientRecords = list.filter((t) => t.patientId === selectedPatient.patientId);
          setPatientTriageList(patientRecords);
          if (patientRecords.length > 0 && !selectedTriageId) {
            setSelectedTriageId(patientRecords[0].assessmentId);
          }
        }
      } catch {
        setPatientTriageList([]);
      }
    }
  }, [selectedPatient]);

  if (!isOpen) return null;

  const selectedDoctor = DEMO_DOCTORS.find((d) => d.id === selectedDoctorId) || DEMO_DOCTORS[0];
  const selectedFacility =
    DEMO_FACILITIES.find((f) => f.id === selectedFacilityId) || DEMO_FACILITIES[0];

  const handlePatientSelect = (p: RegisteredPatientResult) => {
    setSelectedPatient(p);
    setCurrentStep('doctor');
  };

  const handleDoctorNext = () => {
    setCurrentStep('mode');
  };

  const handleModeNext = () => {
    setCurrentStep('datetime');
  };

  const handleDateTimeNext = () => {
    if (!selectedDate) {
      setError('Please select an appointment date.');
      return;
    }
    if (!selectedTime) {
      setError('Please select an available time slot.');
      return;
    }
    setError('');
    setCurrentStep('reason');
  };

  const handleReasonNext = () => {
    if (!reason.trim()) {
      setError('Please provide a reason for the consultation.');
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

      const formData: AppointmentFormData = {
        selectedPatientId: selectedPatient.patientId,
        selectedPatientName: selectedPatient.fullName,
        facilityId: selectedFacility.id,
        facilityName: selectedFacility.name,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        mode: consultationMode,
        date: selectedDate,
        time: selectedTime,
        reason: reason.trim(),
        triageId: selectedTriageId || undefined,
      };

      const result = await createAppointment(formData);
      setCreatedAppointment(result);
      setCurrentStep('success');
      onSuccess(result);
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookAnother = () => {
    setCurrentStep('patient');
    setSelectedPatient(null);
    setSelectedTime('');
    setReason('');
    setSelectedTriageId('');
    setError('');
    setCreatedAppointment(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 id="drawer-title" className="text-sm font-bold text-slate-900">
              Book Doctor Appointment
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Step-by-step clinical scheduling workflow
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

        {/* Progress Indicator */}
        {currentStep !== 'success' && (
          <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between text-3xs font-semibold text-slate-400">
            <span className={currentStep === 'patient' ? 'text-teal-700 font-bold' : ''}>
              1. Patient
            </span>
            <span>→</span>
            <span className={currentStep === 'doctor' ? 'text-teal-700 font-bold' : ''}>
              2. Doctor
            </span>
            <span>→</span>
            <span className={currentStep === 'mode' ? 'text-teal-700 font-bold' : ''}>
              3. Type
            </span>
            <span>→</span>
            <span className={currentStep === 'datetime' ? 'text-teal-700 font-bold' : ''}>
              4. Slot
            </span>
            <span>→</span>
            <span className={currentStep === 'reason' ? 'text-teal-700 font-bold' : ''}>
              5. Details
            </span>
            <span>→</span>
            <span className={currentStep === 'review' ? 'text-teal-700 font-bold' : ''}>
              6. Confirm
            </span>
          </div>
        )}

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
                  Search registered rural patients by name, ID or mobile number.
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
                    <p className="text-2xs text-slate-400 mt-0.5">
                      Verify patient registration in the directory.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: DOCTOR & FACILITY */}
          {currentStep === 'doctor' && selectedPatient && (
            <div className="space-y-4">
              {/* Selected Patient Mini Banner */}
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

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  1. Select Facility
                </label>
                <div className="space-y-1.5">
                  {DEMO_FACILITIES.map((fac) => (
                    <label
                      key={fac.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedFacilityId === fac.id
                          ? 'border-teal-600 bg-teal-50/40 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="facility"
                        value={fac.id}
                        checked={selectedFacilityId === fac.id}
                        onChange={() => setSelectedFacilityId(fac.id)}
                        className="mt-0.5 text-teal-600 focus:ring-teal-500"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">{fac.name}</span>
                        <span className="text-2xs text-slate-500">{fac.location}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  2. Select Doctor
                </label>
                <div className="space-y-2">
                  {DEMO_DOCTORS.map((doc) => (
                    <label
                      key={doc.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedDoctorId === doc.id
                          ? 'border-teal-600 bg-teal-50/40 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="doctor"
                        value={doc.id}
                        checked={selectedDoctorId === doc.id}
                        onChange={() => setSelectedDoctorId(doc.id)}
                        className="mt-0.5 text-teal-600 focus:ring-teal-500"
                      />
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">{doc.name}</span>
                          <span className="text-3xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            {doc.specialty}
                          </span>
                        </div>
                        <p className="text-2xs text-slate-500">{doc.facilityName}</p>
                        <p className="text-3xs text-emerald-700 font-semibold">{doc.availability}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONSULTATION MODE */}
          {currentStep === 'mode' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Consultation Mode</h3>
                <p className="text-slate-500 text-xs">
                  Choose how the consultation will take place.
                </p>
              </div>

              <div className="space-y-2.5">
                <label
                  className={`flex items-start space-x-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    consultationMode === 'IN_PERSON'
                      ? 'border-teal-600 bg-teal-50/40 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="mode"
                    value="IN_PERSON"
                    checked={consultationMode === 'IN_PERSON'}
                    onChange={() => setConsultationMode('IN_PERSON')}
                    className="mt-0.5 text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block flex items-center gap-1.5 text-xs">
                      <Stethoscope className="w-4 h-4 text-teal-700" /> In-person Consultation
                    </span>
                    <span className="text-2xs text-slate-500 leading-relaxed block mt-0.5">
                      Patient travels directly to the PHC or hospital facility for physical examination.
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-start space-x-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    consultationMode === 'TELECONSULTATION'
                      ? 'border-teal-600 bg-teal-50/40 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="mode"
                    value="TELECONSULTATION"
                    checked={consultationMode === 'TELECONSULTATION'}
                    onChange={() => setConsultationMode('TELECONSULTATION')}
                    className="mt-0.5 text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block flex items-center gap-1.5 text-xs">
                      <Video className="w-4 h-4 text-blue-700" /> Teleconsultation (Remote Audio/Video)
                    </span>
                    <span className="text-2xs text-slate-500 leading-relaxed block mt-0.5">
                      Doctor connects via teleconsultation link. Prevents unnecessary travel for remote rural patients.
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-start space-x-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    consultationMode === 'HW_ASSISTED'
                      ? 'border-teal-600 bg-teal-50/40 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="mode"
                    value="HW_ASSISTED"
                    checked={consultationMode === 'HW_ASSISTED'}
                    onChange={() => setConsultationMode('HW_ASSISTED')}
                    className="mt-0.5 text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block flex items-center gap-1.5 text-xs">
                      <Users className="w-4 h-4 text-indigo-700" /> Health-worker Assisted Consultation
                    </span>
                    <span className="text-2xs text-slate-500 leading-relaxed block mt-0.5">
                      ASHA/ANM connects from patient home or sub-center with vitals intake tools and assists doctor.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: DATE & TIME */}
          {currentStep === 'datetime' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Appointment Date & Time</h3>
                <p className="text-slate-500 text-xs">
                  Available slots are evaluated against doctor schedules to prevent double-booking.
                </p>
              </div>

              <div>
                <label
                  htmlFor="appointment-date"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Consultation Date <span className="text-rose-600">*</span>
                </label>
                <input
                  id="appointment-date"
                  type="date"
                  min={getTodayIST()}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Available Time Slots (IST) <span className="text-rose-600">*</span>
                  </label>
                  {isLoadingSlots && (
                    <span className="text-3xs text-teal-700 font-medium animate-pulse">
                      Checking availability...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {AVAILABLE_TIME_SLOTS.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = selectedTime === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedTime(slot)}
                        className={`p-2.5 rounded-md text-xs font-semibold border transition-all text-center ${
                          isSelected
                            ? 'bg-teal-700 text-white border-teal-800 shadow-2xs'
                            : isBooked
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-slate-50'
                        }`}
                        title={isBooked ? 'This slot is already booked' : 'Click to select'}
                      >
                        {slot}
                        {isBooked && (
                          <span className="block text-3xs font-normal text-slate-400 no-underline">
                            Booked
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REASON & OPTIONAL TRIAGE */}
          {currentStep === 'reason' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Consultation Reason</h3>
                <p className="text-slate-500 text-xs">
                  Describe the primary clinical concern or reason for visit.
                </p>
              </div>

              <div>
                <label
                  htmlFor="appointment-reason"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Reason for Visit <span className="text-rose-600">*</span>
                </label>
                <textarea
                  id="appointment-reason"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Acute shortness of breath with productive cough for 2 days; review hypertension medications..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-teal-600 focus:bg-white resize-none"
                  autoFocus
                />
              </div>

              {/* Related Triage Assessment Dropdown */}
              {patientTriageList.length > 0 && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-teal-700" />
                    <span className="font-bold text-slate-800 text-xs">
                      Attach Triage Assessment (Optional)
                    </span>
                  </div>
                  <p className="text-2xs text-slate-500">
                    Previous triage record available for this patient. Attaching links the symptom severity and vitals into the doctor queue.
                  </p>

                  <select
                    value={selectedTriageId}
                    onChange={(e) => setSelectedTriageId(e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-teal-600 font-medium text-slate-700"
                  >
                    <option value="">None (Don't attach triage)</option>
                    {patientTriageList.map((t) => (
                      <option key={t.assessmentId} value={t.assessmentId}>
                        {t.assessmentId} — {t.riskLevel} risk ({t.summary})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: CONFIRMATION REVIEW */}
          {currentStep === 'review' && selectedPatient && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Confirm Appointment</h3>
                <p className="text-slate-500 text-xs">
                  Please review all consultation parameters before confirming.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 bg-white">
                <div className="p-3 flex justify-between">
                  <span className="text-slate-500 font-medium">Patient:</span>
                  <span className="font-bold text-slate-900">
                    {selectedPatient.fullName} ({selectedPatient.patientId})
                  </span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-slate-500 font-medium">Doctor:</span>
                  <span className="font-bold text-slate-900">{selectedDoctor.name}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-slate-500 font-medium">Facility:</span>
                  <span className="text-slate-800">{selectedFacility.name}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-slate-500 font-medium">Date:</span>
                  <span className="font-bold text-slate-900">{selectedDate}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-slate-500 font-medium">Time Slot:</span>
                  <span className="font-bold text-teal-800">{selectedTime}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-slate-500 font-medium">Mode:</span>
                  <span className="font-semibold text-slate-800">
                    {(consultationMode || 'IN_PERSON').replace('_', ' ')}
                  </span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 font-medium block mb-1">Reason:</span>
                  <p className="text-slate-800 text-xs leading-relaxed">{reason}</p>
                </div>
                {selectedTriageId && (
                  <div className="p-3 flex justify-between bg-teal-50/40">
                    <span className="text-teal-800 font-medium">Attached Triage:</span>
                    <span className="font-mono font-bold text-teal-900">{selectedTriageId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 7: SUCCESS STATE */}
          {currentStep === 'success' && createdAppointment && (
            <div className="py-6 px-2 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">Appointment Confirmed</h3>
                <p className="text-xs text-slate-500 mt-1">
                  The appointment has been scheduled and token generated.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-left space-y-2 max-w-sm mx-auto text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Token Number</span>
                  <span className="font-mono text-sm font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                    {createdAppointment.tokenNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Appointment ID:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {createdAppointment.appointmentId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-semibold text-slate-900">
                    {createdAppointment.patientName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Doctor:</span>
                  <span className="font-semibold text-slate-900">
                    {createdAppointment.doctorName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-bold text-slate-900">
                    {createdAppointment.date} at {createdAppointment.time}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md shadow-2xs transition-colors"
                >
                  View in Appointments List
                </button>
                <button
                  type="button"
                  onClick={handleBookAnother}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
                >
                  Book Another
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
                    if (currentStep === 'doctor') setCurrentStep('patient');
                    if (currentStep === 'mode') setCurrentStep('doctor');
                    if (currentStep === 'datetime') setCurrentStep('mode');
                    if (currentStep === 'reason') setCurrentStep('datetime');
                    if (currentStep === 'review') setCurrentStep('reason');
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

              {currentStep === 'doctor' && (
                <button
                  type="button"
                  onClick={handleDoctorNext}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md shadow-2xs transition-colors"
                >
                  Continue to Mode
                </button>
              )}

              {currentStep === 'mode' && (
                <button
                  type="button"
                  onClick={handleModeNext}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md shadow-2xs transition-colors"
                >
                  Continue to Slot
                </button>
              )}

              {currentStep === 'datetime' && (
                <button
                  type="button"
                  onClick={handleDateTimeNext}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md shadow-2xs transition-colors"
                >
                  Continue to Details
                </button>
              )}

              {currentStep === 'reason' && (
                <button
                  type="button"
                  onClick={handleReasonNext}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md shadow-2xs transition-colors"
                >
                  Review Appointment
                </button>
              )}

              {currentStep === 'review' && (
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="px-5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-md shadow-2xs transition-colors"
                >
                  {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
