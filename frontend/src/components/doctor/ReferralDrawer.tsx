import React, { useState } from 'react';
import { X, Send, AlertOctagon, Building2, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { ClinicalPatient, ReferralRecord } from '../../types/doctor';
import { doctorMockService } from '../../services/doctorMockService';

interface ReferralDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patient: ClinicalPatient;
  initialReason?: string;
  onSuccess?: (referral: ReferralRecord) => void;
}

const DISTRICT_FACILITIES = [
  {
    name: 'District Civil Hospital, Dhule',
    type: 'District Hospital (Tertiary Care)',
    location: 'Sakri Road, Dhule (48 km)',
    specialties: ['Pulmonology', 'Cardiology', 'ICU / Critical Care', 'General Medicine'],
    bedStatus: 'ICU: 4 available | General: 22 available',
  },
  {
    name: 'Government Medical College (GMC), Dhule',
    type: 'Government Medical College & Hospital',
    location: 'Chakkar Bardi, Dhule (52 km)',
    specialties: ['Pediatrics', 'Obstetrics & Gynaecology', 'Emergency Trauma', 'General Surgery'],
    bedStatus: 'NICU: 2 available | Emergency: Open',
  },
  {
    name: 'Sub-District Hospital, Dondaicha',
    type: 'Sub-District Hospital (Secondary Care)',
    location: 'Station Road, Dondaicha (22 km)',
    specialties: ['General Medicine', 'Maternity Care', 'Pediatrics'],
    bedStatus: 'General: 12 available',
  },
  {
    name: 'District Civil Hospital, Nandurbar',
    type: 'District Hospital (Tribal Health Center)',
    location: 'Hospital Road, Nandurbar (65 km)',
    specialties: ['Sickle Cell Center', 'Malnutrition ICU', 'Obstetrics'],
    bedStatus: 'Maternity: 8 available | ICU: 2 available',
  },
];

export const ReferralDrawer: React.FC<ReferralDrawerProps> = ({
  isOpen,
  onClose,
  patient,
  initialReason = '',
  onSuccess,
}) => {
  const [priority, setPriority] = useState<'Routine' | 'Urgent' | 'Emergency'>('Urgent');
  const [requiredSpecialty, setRequiredSpecialty] = useState('Pulmonology');
  const [selectedFacility, setSelectedFacility] = useState(DISTRICT_FACILITIES[0].name);
  const [reason, setReason] = useState(initialReason || 'Acute symptom exacerbation requiring higher-center evaluation');
  const [clinicalNotes, setClinicalNotes] = useState(
    `Patient ${patient.fullName}, ${patient.age}y/${patient.gender} presents with acute respiratory symptoms and low SpO2. Existing history of ${patient.existingConditions?.join(', ') || 'N/A'}. Specialist review recommended.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdReferral, setCreatedReferral] = useState<ReferralRecord | null>(null);

  if (!isOpen) return null;

  const currentFacility = DISTRICT_FACILITIES.find((f) => f.name === selectedFacility) || DISTRICT_FACILITIES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newRef = doctorMockService.createReferral({
        patientId: patient.id,
        patientName: patient.fullName,
        patientAge: patient.age,
        patientGender: patient.gender,
        destinationFacility: currentFacility.name,
        facilityType: currentFacility.type,
        destinationLocation: currentFacility.location,
        requiredSpecialty,
        priority,
        reason,
        clinicalNotes,
        createdBy: 'Dr. Anjali Sharma (General Physician)',
      });

      setCreatedReferral(newRef);
      if (onSuccess) {
        onSuccess(newRef);
      }
    } catch (err) {
      console.error('Error creating referral:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCreatedReferral(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden drawer-backdrop">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs transition-opacity"
        onClick={handleResetAndClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col drawer-panel animate-in slide-in-from-right duration-200">
          {/* Top Bar */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-2">
              <Send className="w-4 h-4 text-slate-700" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {createdReferral ? 'Referral Created' : 'Create Hospital Referral'}
              </h2>
            </div>
            <button
              onClick={handleResetAndClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {createdReferral ? (
              /* Success confirmation state */
              <div className="space-y-4 py-4 text-center sm:text-left">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto sm:mx-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Hospital Referral Successfully Dispatched
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    High-priority transfer order transmitted to casualty intake triage at destination center.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs space-y-2 text-left">
                  <div className="flex justify-between pb-1.5 border-b border-slate-200/80">
                    <span className="text-slate-500">Referral ID</span>
                    <span className="font-mono font-bold text-slate-900">{createdReferral.id}</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-slate-200/80">
                    <span className="text-slate-500">Patient</span>
                    <span className="font-semibold text-slate-800">{createdReferral.patientName} ({createdReferral.patientId})</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-slate-200/80">
                    <span className="text-slate-500">Destination</span>
                    <span className="font-medium text-slate-800">{createdReferral.destinationFacility}</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-slate-200/80">
                    <span className="text-slate-500">Required Specialty</span>
                    <span className="text-slate-800">{createdReferral.requiredSpecialty}</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-slate-200/80">
                    <span className="text-slate-500">Priority</span>
                    <span className="font-bold text-amber-700">{createdReferral.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      {createdReferral.status}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleResetAndClose}
                    className="w-full py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Done & Return to Workspace
                  </button>
                </div>
              </div>
            ) : (
              /* Referral Input Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Patient Summary Strip */}
                <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{patient.fullName}</span>
                    <span className="text-slate-500 ml-1.5">({patient.age}y, {patient.gender})</span>
                  </div>
                  <span className="font-mono text-slate-500 text-[11px]">{patient.id}</span>
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Referral Urgency / Priority <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Routine', 'Urgent', 'Emergency'] as const).map((p) => {
                      const isSelected = priority === p;
                      let btnStyle = 'border-slate-200 text-slate-700 hover:border-slate-300';
                      if (isSelected) {
                        if (p === 'Emergency') btnStyle = 'border-red-600 bg-red-50 text-red-900 font-bold';
                        else if (p === 'Urgent') btnStyle = 'border-amber-600 bg-amber-50 text-amber-900 font-bold';
                        else btnStyle = 'border-blue-600 bg-blue-50 text-blue-900 font-bold';
                      }
                      return (
                        <button
                          type="button"
                          key={p}
                          onClick={() => setPriority(p)}
                          className={`p-2 rounded border text-xs text-center transition-all ${btnStyle}`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Emergency warning if selected */}
                {priority === 'Emergency' && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 text-xs flex items-start space-x-2">
                    <AlertOctagon className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-red-900 uppercase">Emergency Medical Escalation</span>
                      <p className="text-red-700 text-[11px] mt-0.5">
                        Casualty triage officer at {currentFacility.name} will receive an urgent priority broadcast for incoming patient.
                      </p>
                    </div>
                  </div>
                )}

                {/* Required Specialty */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Required Specialty <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={requiredSpecialty}
                    onChange={(e) => setRequiredSpecialty(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
                  >
                    <option value="Pulmonology">Pulmonology (Chest Medicine)</option>
                    <option value="Cardiology">Cardiology / Cardiac Care</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Pediatrics">Pediatrics & Neonatology</option>
                    <option value="Obstetrics & Gynaecology">Obstetrics & High-Risk Pregnancy</option>
                    <option value="General Surgery">General Surgery</option>
                    <option value="Orthopedics">Orthopedics & Trauma</option>
                    <option value="Sickle Cell / Hematology">Sickle Cell & Hematology</option>
                  </select>
                </div>

                {/* Destination Facility */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Destination Facility <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={selectedFacility}
                    onChange={(e) => setSelectedFacility(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
                  >
                    {DISTRICT_FACILITIES.map((f) => (
                      <option key={f.name} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Facility Details Box */}
                <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span className="flex items-center space-x-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>{currentFacility.name}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">{currentFacility.type}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-500 text-[11px]">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{currentFacility.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                    <span className="text-slate-600 truncate max-w-xs">
                      Specialties: {currentFacility.specialties.slice(0, 2).join(', ')}...
                    </span>
                    <span className="font-mono text-emerald-700 font-medium shrink-0">
                      {currentFacility.bedStatus}
                    </span>
                  </div>
                </div>

                {/* Clinical Reason */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Clinical Reason for Referral <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
                    placeholder="e.g. Severe respiratory distress requiring arterial blood gas and chest CT"
                    required
                  />
                </div>

                {/* Detailed Findings */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Physician Notes & Clinical Findings
                  </label>
                  <textarea
                    rows={3}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:border-blue-600 focus:outline-none font-mono text-slate-800"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-200 rounded font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-1.5 text-xs text-white rounded font-medium transition-colors ${
                      priority === 'Emergency'
                        ? 'bg-red-700 hover:bg-red-800'
                        : priority === 'Urgent'
                        ? 'bg-amber-700 hover:bg-amber-800'
                        : 'bg-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    {isSubmitting ? 'Dispatching...' : 'Create Referral'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
