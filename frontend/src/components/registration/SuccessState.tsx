import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, FileText, Activity, UserPlus, Shield, Wifi, WifiOff } from 'lucide-react';
import { RegisteredPatientResult } from '../../types/registration';
import { TranslationDictionary } from '../../utils/translations';

interface SuccessStateProps {
  patient: RegisteredPatientResult;
  onRegisterAnother: () => void;
  onViewRecord?: () => void;
  onStartAssessment?: () => void;
  t: TranslationDictionary;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  patient,
  onRegisterAnother,
  onViewRecord,
  onStartAssessment,
  t,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(patient.patientId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-10 shadow-2xs max-w-2xl mx-auto text-center">
      {/* Success Icon */}
      <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto mb-4">
        <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
      </div>

      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
        {t.successTitle}
      </h2>
      <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
        {t.successSubtitle}
      </p>

      {/* Patient ID Container */}
      <div className="my-6 p-4 rounded-lg bg-slate-50 border border-slate-200 max-w-md mx-auto">
        <span className="block text-2xs font-bold text-slate-500 uppercase tracking-widest mb-1">
          {t.patientIdLabel}
        </span>
        <div className="flex items-center justify-center space-x-3">
          <span className="text-2xl font-mono font-bold text-slate-900 tracking-wider">
            {patient.patientId}
          </span>
          <button
            type="button"
            onClick={handleCopyId}
            className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            title="Copy Patient ID to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">{t.copiedText}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.copyIdBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Patient Summary Snapshot */}
      <div className="text-left bg-white border border-slate-200 rounded-lg p-4 mb-6 text-xs text-slate-700 space-y-2">
        <div className="flex justify-between py-1 border-b border-slate-100">
          <span className="text-slate-400">Patient Name</span>
          <span className="font-semibold text-slate-900">{patient.fullName}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-100">
          <span className="text-slate-400">Demographics</span>
          <span className="text-slate-800">
            {patient.age} yrs • {patient.gender} • {patient.village}, {patient.taluka}
          </span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-100">
          <span className="text-slate-400">Primary Contact</span>
          <span className="font-mono text-slate-800">+91 {patient.mobileNumber}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-100">
          <span className="text-slate-400">{t.registeredByLabel}</span>
          <span className="text-slate-800">
            {patient.registeredBy} ({patient.phcLocation})
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-slate-400">Storage & Sync Status</span>
          <span className="inline-flex items-center space-x-1 font-medium text-emerald-700">
            {patient.syncStatus === 'synced' ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>Synchronized with Central Registry</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-amber-700">Stored locally (Queued for offline sync)</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onStartAssessment}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
        >
          <Activity className="w-4 h-4" />
          <span>{t.startAssessmentBtn}</span>
        </button>

        <button
          type="button"
          onClick={onViewRecord}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          <FileText className="w-4 h-4 text-slate-500" />
          <span>{t.viewRecordBtn}</span>
        </button>

        <button
          type="button"
          onClick={onRegisterAnother}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-slate-600" />
          <span>{t.registerAnotherBtn}</span>
        </button>
      </div>

      {/* Micro footer disclaimer */}
      <p className="mt-6 text-2xs text-slate-400 flex items-center justify-center space-x-1">
        <Shield className="w-3 h-3 text-slate-400" />
        <span>Electronic health record complies with Indian digital health guidelines.</span>
      </p>
    </div>
  );
};
