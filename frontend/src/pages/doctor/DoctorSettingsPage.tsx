import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Bell, Building2, Shield } from 'lucide-react';

export const DoctorSettingsPage: React.FC = () => {
  const [facility, setFacility] = useState('District Hospital, Dhule');
  const [specialty, setSpecialty] = useState('General Medicine & Pulmonology');
  const [audioChimes, setAudioChimes] = useState(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState('30');
  const [lowBandwidthMode, setLowBandwidthMode] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-blue-700" />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Doctor Workstation Preferences
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Configure clinical workstation environment, assigned health facility, audio alerts, and teleconsultation bandwidth parameters.
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs px-4 py-2.5 rounded-lg flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Workstation settings successfully saved and applied.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Practice & Facility Configuration */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-slate-700" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Assigned Facility & Clinical Department
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Primary Assigned Facility
              </label>
              <select
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-blue-600 focus:outline-none"
              >
                <option value="District Hospital, Dhule">District Civil Hospital, Dhule</option>
                <option value="GMC Dhule">Government Medical College (GMC), Dhule</option>
                <option value="Shirpur Sub-District Hospital">Sub-District Hospital, Shirpur</option>
                <option value="Civil Hospital Jalgaon">Civil Hospital, Jalgaon</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Physician Department / Specialty
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-blue-600 focus:outline-none font-medium"
              />
            </div>
          </div>
        </div>

        {/* Clinical Alerts & Notification Settings */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <Bell className="w-4 h-4 text-slate-700" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Triage Alerts & Sound Notifications
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={audioChimes}
                onChange={(e) => setAudioChimes(e.target.checked)}
                className="w-4 h-4 rounded text-blue-700 focus:ring-blue-500 border-slate-300"
              />
              <div>
                <span className="font-semibold text-slate-800">Play Audio Chime on High-Risk Patient Arrival</span>
                <p className="text-[11px] text-slate-500">Audible notification when an acute dyspnea / high fever patient is triaged by a frontline ASHA worker.</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={lowBandwidthMode}
                onChange={(e) => setLowBandwidthMode(e.target.checked)}
                className="w-4 h-4 rounded text-blue-700 focus:ring-blue-500 border-slate-300"
              />
              <div>
                <span className="font-semibold text-slate-800">Enable Low-Bandwidth Adaptive Mode</span>
                <p className="text-[11px] text-slate-500">Prioritizes crystal-clear audio stream over video when rural cell towers experience packet drops.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Consultation Auto-Save */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <Shield className="w-4 h-4 text-slate-700" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Consultation Integrity & Auto-Save
            </h2>
          </div>

          <div className="text-xs max-w-sm">
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Local Auto-Save Interval (Seconds)
            </label>
            <select
              value={autoSaveInterval}
              onChange={(e) => setAutoSaveInterval(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-blue-600 focus:outline-none"
            >
              <option value="15">Every 15 seconds (High Frequency)</option>
              <option value="30">Every 30 seconds (Recommended)</option>
              <option value="60">Every 60 seconds</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">Prevents loss of clinical observations during intermittent hospital network disconnections.</p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center space-x-1.5 px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
