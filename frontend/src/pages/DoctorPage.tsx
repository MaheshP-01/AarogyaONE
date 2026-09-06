import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, ArrowLeft, Clock, Video, ListOrdered, ShieldAlert } from 'lucide-react';

export const DoctorPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-1 text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Role Selection</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Stethoscope className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-900">Doctor Teleconsultation Portal</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Medical Officer / Specialist
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              District Hospital & Community Health Centre clinical workstation
            </p>
          </div>
        </div>

        {/* Foundation Placeholder State */}
        <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center max-w-2xl mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Step 1 — Foundation Placeholder</h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-lg mx-auto">
            This clinical workstation will host the AI-triaged patient queue, teleconsultation audio/video room, longitudinal history inspection, and digital e-prescription generation.
          </p>
        </div>

        {/* Planned Workflow Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center space-x-2 text-blue-700 font-semibold text-sm mb-1">
              <ListOrdered className="w-4 h-4" />
              <span>Triage Prioritization Queue</span>
            </div>
            <p className="text-xs text-slate-500">
              Patients automatically arranged by clinical risk severity (Red, Yellow, Green) for immediate attention.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center space-x-2 text-blue-700 font-semibold text-sm mb-1">
              <Video className="w-4 h-4" />
              <span>Low-Bandwidth Teleconsult</span>
            </div>
            <p className="text-xs text-slate-500">
              Adaptive video/audio streaming tailored for 2G/3G rural networks with live ASHA worker relay.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center space-x-2 text-blue-700 font-semibold text-sm mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>District Referral Link</span>
            </div>
            <p className="text-xs text-slate-500">
              One-click digital referral to secondary and tertiary hospitals with pre-populated case histories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
