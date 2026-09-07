import React, { useState } from 'react';
import { X, Calendar, Stethoscope, Video, Home } from 'lucide-react';
import { ClinicalPatient, FollowUpRecord } from '../../types/doctor';
import { doctorMockService } from '../../services/doctorMockService';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: ClinicalPatient;
  initialReason?: string;
  onSuccess?: (followUp: FollowUpRecord) => void;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  isOpen,
  onClose,
  patient,
  initialReason = '',
  onSuccess,
}) => {
  // Default date: 3 days from now
  const defaultDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState('10:30 AM');
  const [mode, setMode] = useState<'In-person' | 'Teleconsultation' | 'Health-worker follow-up'>('Health-worker follow-up');
  const [reason, setReason] = useState(initialReason || 'Review SpO2 stability and fever resolution at village level');
  const [instructions, setInstructions] = useState(
    'Frontline ASHA (Sunita Shinde) to measure morning pulse oximetry and temperature on Day 3. Escalate immediately if SpO2 drops below 94%.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newFollowUp = doctorMockService.scheduleFollowUp({
        patientId: patient.id,
        patientName: patient.fullName,
        patientAge: patient.age,
        patientGender: patient.gender,
        patientVillage: patient.village,
        patientPhone: patient.phone,
        date,
        time,
        mode,
        reason,
        instructions,
        doctorName: 'Dr. Anjali Sharma (General Physician)',
      });

      if (onSuccess) {
        onSuccess(newFollowUp);
      }
      onClose();
    } catch (err) {
      console.error('Error scheduling follow-up:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-lg border border-slate-300 shadow-xl max-w-lg w-full overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Schedule Clinical Follow-up
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Patient summary */}
          <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900">{patient.fullName}</span>
              <span className="text-slate-500 ml-2">({patient.age}y, {patient.gender})</span>
            </div>
            <div className="text-slate-600 font-mono text-[11px]">
              {patient.village}, {patient.taluka}
            </div>
          </div>

          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Follow-up Channel / Mode <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Health-worker follow-up', label: 'Health Worker', sub: 'Village Home Visit', icon: Home },
                { id: 'Teleconsultation', label: 'Teleconsult', sub: 'Doctor Video/Audio', icon: Video },
                { id: 'In-person', label: 'In-person PHC', sub: 'Hospital Clinic Visit', icon: Stethoscope },
              ].map((item) => {
                const isSelected = mode === item.id;
                const Icon = item.icon;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setMode(item.id as any)}
                    className={`p-2.5 rounded border text-left flex flex-col items-center justify-center text-center transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-blue-700' : 'text-slate-500'}`} />
                    <span className="text-xs font-semibold">{item.label}</span>
                    <span className="text-[10px] text-slate-500">{item.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Follow-up Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Target Time Window <span className="text-red-600">*</span>
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
              >
                <option value="09:00 AM">09:00 AM - Morning Slot</option>
                <option value="10:30 AM">10:30 AM - Morning Slot</option>
                <option value="02:00 PM">02:00 PM - Afternoon Slot</option>
                <option value="04:00 PM">04:00 PM - Evening Slot</option>
              </select>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Clinical Objective / Reason <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Check temperature response & respiratory rate"
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
              required
            />
          </div>

          {/* Specific instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Specific Instructions for ASHA / Patient
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              This will automatically sync with the frontline ASHA worker's village visit list.
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
              className="px-4 py-1.5 text-xs text-white bg-blue-700 hover:bg-blue-800 rounded font-medium shadow-xs transition-colors"
            >
              {isSubmitting ? 'Scheduling...' : 'Confirm Follow-up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
