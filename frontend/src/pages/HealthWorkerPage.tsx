import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowLeft, Clock, WifiOff, FileText, Activity } from 'lucide-react';

export const HealthWorkerPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-1 text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Role Selection</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-900">Health Worker Portal</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                ASHA / ANM Frontline
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Primary healthcare center (PHC) & sub-center field station
            </p>
          </div>
        </div>

        {/* Foundation Placeholder State */}
        <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center max-w-2xl mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Step 1 — Foundation Placeholder</h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-lg mx-auto">
            This frontline interface will provide offline-first patient intake, vital signs capture, structured chief complaint recording, and AI decision-support triage in upcoming phases.
          </p>
        </div>

        {/* Planned Workflow Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center space-x-2 text-teal-700 font-semibold text-sm mb-1">
              <WifiOff className="w-4 h-4" />
              <span>Offline-First Intake</span>
            </div>
            <p className="text-xs text-slate-500">
              Cached patient forms and local IndexedDB storage for areas with zero cellular connectivity.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center space-x-2 text-teal-700 font-semibold text-sm mb-1">
              <Activity className="w-4 h-4" />
              <span>AI Decision Support</span>
            </div>
            <p className="text-xs text-slate-500">
              Automated symptom clustering, red-flag detection, and urgency prioritization before doctor review.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center space-x-2 text-teal-700 font-semibold text-sm mb-1">
              <FileText className="w-4 h-4" />
              <span>Multilingual Voice / Text</span>
            </div>
            <p className="text-xs text-slate-500">
              Marathi & Hindi speech-to-text recording designed for field workers with varying literacy levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
