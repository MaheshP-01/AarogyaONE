import React, { useState } from 'react';
import { X, AlertOctagon, Send, Building2, MapPin } from 'lucide-react';
import { ClinicalPatient, ReferralRecord } from '../../types/doctor';
import { doctorMockService } from '../../services/doctorMockService';

interface ReferralModalProps {
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

export const ReferralModal: React.FC<ReferralModalProps> = ({
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
    `Patient ${patient.fullName}, ${patient.age}y/${patient.gender} presents with acute respiratory symptoms and low SpO2 (91%). Existing history of ${patient.existingConditions.join(', ') || 'N/A'}. Immediate specialist review recommended.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facilityNotified, setFacilityNotified] = useState(false);

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

      if (onSuccess) {
        onSuccess(newRef);
      }
      onClose();
    } catch (err) {
      console.error('Error creating referral:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-lg border border-slate-300 shadow-xl max-w-2xl w-full overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Send className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Create Secondary / Tertiary Care Referral
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Escalation Notice if Emergency Selected */}
        {priority === 'Emergency' && (
          <div className="bg-red-50 border-b border-red-200 p-4">
            <div className="flex items-start space-x-3">
              <AlertOctagon className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-bold text-red-900 tracking-tight uppercase">
                  Urgent Medical Attention Escalation
                </div>
                <div className="text-red-700">
                  Patient: <span className="font-semibold">{patient.fullName}</span> ({patient.id}) requires immediate clinical escalation.
                </div>
                <div className="text-[11px] text-red-600 flex items-center justify-between pt-1">
                  <span>Direct triage alert will be dispatched to {currentFacility.name} casualty desk.</span>
                  <button
                    type="button"
                    onClick={() => setFacilityNotified(true)}
                    className="ml-2 px-2.5 py-1 bg-red-700 text-white rounded font-medium hover:bg-red-800 transition-colors"
                  >
                    {facilityNotified ? 'Facility Notified ✓' : 'Notify Destination Facility Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Patient Quick Strip */}
          <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900">{patient.fullName}</span>
              <span className="text-slate-500 ml-2">({patient.age}y, {patient.gender})</span>
            </div>
            <div className="text-slate-600">
              ID: <span className="font-mono font-medium text-slate-800">{patient.id}</span>
            </div>
            <div className="text-slate-600">
              Village: <span className="font-medium text-slate-800">{patient.village}, {patient.taluka}</span>
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Referral Urgency / Priority <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Routine', 'Urgent', 'Emergency'] as const).map((p) => {
                const isSelected = priority === p;
                let bgStyle = 'border-slate-200 hover:border-slate-300 text-slate-700';
                if (isSelected) {
                  if (p === 'Emergency') bgStyle = 'border-red-600 bg-red-50 text-red-900 font-bold ring-1 ring-red-500';
                  else if (p === 'Urgent') bgStyle = 'border-amber-600 bg-amber-50 text-amber-900 font-bold ring-1 ring-amber-500';
                  else bgStyle = 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-500';
                }
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`p-2.5 rounded border text-xs text-center transition-all ${bgStyle}`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specialty Required */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
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
          </div>

          {/* Facility Details Box */}
          <div className="bg-blue-50/50 border border-blue-200 rounded p-3 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-semibold text-blue-950">
              <span className="flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-700" />
                <span>{currentFacility.name}</span>
              </span>
              <span className="text-[11px] font-normal text-slate-600">{currentFacility.type}</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-600 text-[11px]">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{currentFacility.location}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-blue-100 text-[11px]">
              <span className="text-slate-600">
                Specialties: {currentFacility.specialties.join(', ')}
              </span>
              <span className="font-mono text-emerald-700 font-medium">
                {currentFacility.bedStatus}
              </span>
            </div>
          </div>

          {/* Reason for Referral */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Clinical Reason for Referral <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Hypoxemic respiratory distress requiring arterial blood gas and chest CT"
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
              required
            />
          </div>

          {/* Detailed Clinical Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Physician Referral Summary & Findings <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={3}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded focus:border-blue-600 focus:outline-none font-mono text-slate-800"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Attached: Patient intake vitals, symptoms, known allergies, and current medication list will be automatically synchronized with destination facility.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-1.5 text-xs text-white rounded font-medium shadow-xs transition-colors ${
                priority === 'Emergency'
                  ? 'bg-red-700 hover:bg-red-800'
                  : priority === 'Urgent'
                  ? 'bg-amber-700 hover:bg-amber-800'
                  : 'bg-blue-700 hover:bg-blue-800'
              }`}
            >
              {isSubmitting ? 'Creating Referral...' : priority === 'Emergency' ? 'Create Emergency Referral' : 'Create Referral'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
