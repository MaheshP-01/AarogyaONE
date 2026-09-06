import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { APP_NAME } from '../../utils/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-white font-semibold text-base mb-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <span>{APP_NAME}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Designed for primary healthcare centers (PHC), sub-centers, and rural communities across Maharashtra.
              Bridging the last mile in healthcare delivery through field-first digital workflows.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs leading-relaxed text-slate-300 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300 mb-1">Clinical Decision Support Disclaimer</p>
                <p>
                  RuralCare Connect utilizes AI exclusively for symptom summarization, triage prioritization, multilingual
                  translation, and structured workflow suggestions. AI is NOT a diagnostic system. All medical decisions,
                  clinical diagnoses, and prescriptions remain the sole responsibility of qualified healthcare professionals.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RuralCare Connect — Smart India Hackathon (SIH) 2026 MVP</p>
          <div className="flex items-center space-x-4">
            <span>Step 1: Foundation Baseline</span>
            <span>•</span>
            <span>Maharashtra Rural Health Initiative</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
