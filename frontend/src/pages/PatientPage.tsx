import React from 'react';
import { Link } from 'react-router-dom';
import { User, ArrowLeft, Clock, QrCode, FileHeart, CalendarCheck } from 'lucide-react';

export const PatientPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-1 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Role Selection</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <User className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-900">Patient Health Portal</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Citizen / Beneficiary
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Personal health record, prescriptions, and follow-up scheduling
            </p>
          </div>
        </div>

        {/* Foundation Placeholder State */}
        <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center max-w-2xl mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Step 1 — Foundation Placeholder</h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-lg mx-auto">
            This citizen portal will provide digital health card generation, consultation summaries translated into Marathi and Hindi, and follow-up reminders via SMS/WhatsApp.
          </p>
        </div>

        {/* Planned Workflow Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center space-x-2 text-emerald-700 font-semibold text-sm mb-1">
              <QrCode className="w-4 h-4" />
              <span>Digital Health Card</span>
            </div>
            <p className="text-xs text-slate-500">
              ABHA-aligned QR code identifier that can be presented at any rural PHC or hospital for instant lookup.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center space-x-2 text-emerald-700 font-semibold text-sm mb-1">
              <FileHeart className="w-4 h-4" />
              <span>Regional Records</span>
            </div>
            <p className="text-xs text-slate-500">
              Plain-language summaries of doctor diagnosis and medication instructions translated to Marathi and Hindi.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center space-x-2 text-emerald-700 font-semibold text-sm mb-1">
              <CalendarCheck className="w-4 h-4" />
              <span>Follow-up Alerts</span>
            </div>
            <p className="text-xs text-slate-500">
              Automated reminders for vaccine schedules, medication renewals, and upcoming PHC teleconsultations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
