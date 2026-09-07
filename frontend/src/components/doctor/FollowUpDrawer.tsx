import React, { useState } from 'react';
import { X, Calendar, Clock, Stethoscope, Video, Home, CheckCircle2 } from 'lucide-react';
import { ClinicalPatient, FollowUpRecord, FollowUpMode } from '../../types/doctor';
import { doctorMockService } from '../../services/doctorMockService';

interface FollowUpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patient: ClinicalPatient;
  initialReason?: string;
  onSuccess?: (followUp: FollowUpRecord) => void;
}

export const FollowUpDrawer: React.FC<FollowUpDrawerProps> = ({
  isOpen,
  onClose,
  patient,
  initialReason = '',
  onSuccess,
}) => {
  const defaultDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState('10:30 AM');
  const [mode, setMode] = useState<FollowUpMode>('Health-worker follow-up');
  const [reason, setReason] = useState(initialReason || 'Review SpO2 stability and fever resolution at village level');
  const [instructions, setInstructions] = useState(
    'Frontline ASHA (Sunita Shinde) to measure morning pulse oximetry and temperature on Day 3. Escalate immediately if SpO2 drops below 94%.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRecord, setCreatedRecord] = useState<FollowUpRecord | null>(null);

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

      setCreatedRecord(newFollowUp);
      if (onSuccess) {
        onSuccess(newFollowUp);
      }
    } catch (err) {
      console.error('Error scheduling follow-up:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCreatedRecord(null);
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
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col drawer-panel animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-700" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {createdRecord ? 'Follow-up Scheduled' : 'Schedule Clinical Follow-up'}
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
            {createdRecord ? (
              <div className="space-y-4 py-4 text-center sm:text-left">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto sm:mx-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Follow-up Successfully Scheduled
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Scheduled task synchronized with patient longitudinal record and frontline ASHA worker's village queue.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs space-y-2 text-left">
                  <div className="flex justify-between pb-1.5 border-b border-slate-200/80">
                    <span className="text-slate-500">Patient</span>
                    <span className="font-semibold text-slate-800">{createdRecord.patientName}</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-slate-200/80">
                    <span className="text-slate-500">Schedule Date</span>
                    <span className="font-mono text-slate-900 font-bold">{createdRecord.date} at {createdRecord.time}</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-slate-200/80">
                    <span className="text-slate-500">Mode</span>
                    <span className="font-medium text-slate-800">{createdRecord.mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Objective</span>
                    <span className="text-slate-800 text-right truncate max-w-xs">{createdRecord.reason}</span>
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Patient summary strip */}
                <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{patient.fullName}</span>
                    <span className="text-slate-500 ml-1.5">({patient.age}y, {patient.gender})</span>
                  </div>
                  <span className="font-mono text-slate-500 text-[11px]">{patient.village}</span>
                </div>

                {/* Follow-up Mode */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Follow-up Channel / Mode <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Health-worker follow-up', label: 'ASHA Visit', sub: 'Village Home', icon: Home },
                      { id: 'Teleconsultation', label: 'Teleconsult', sub: 'Doctor Call', icon: Video },
                      { id: 'In-person', label: 'PHC Clinic', sub: 'In-person', icon: Stethoscope },
                    ].map((item) => {
                      const isSelected = mode === item.id;
                      const Icon = item.icon;
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setMode(item.id as FollowUpMode)}
                          className={`p-2 rounded border text-center transition-all ${
                            isSelected
                              ? 'border-slate-900 bg-slate-900 text-white font-medium shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 mx-auto mb-1 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                          <div className="text-xs font-semibold">{item.label}</div>
                          <div className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>{item.sub}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Date <span className="text-red-600">*</span>
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
                      Time Slot <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
                    >
                      <option value="09:00 AM">09:00 AM - Morning</option>
                      <option value="10:30 AM">10:30 AM - Morning</option>
                      <option value="02:00 PM">02:00 PM - Afternoon</option>
                      <option value="04:00 PM">04:00 PM - Evening</option>
                    </select>
                  </div>
                </div>

                {/* Objective */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Objective / Clinical Reason <span className="text-red-600">*</span>
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
                    Instructions for ASHA / Patient
                  </label>
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:border-blue-600 focus:outline-none text-slate-800"
                  />
                </div>

                {/* Submit */}
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
                    className="px-4 py-1.5 text-xs text-white bg-slate-900 hover:bg-slate-800 rounded font-medium transition-colors"
                  >
                    {isSubmitting ? 'Scheduling...' : 'Schedule Follow-up'}
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
