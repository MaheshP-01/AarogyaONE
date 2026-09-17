import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface EmergencyAlertProps {
  onEscalate?: () => void;
  onViewRecord?: () => void;
}

export const EmergencyAlert: React.FC<EmergencyAlertProps> = ({
  onEscalate,
  onViewRecord,
}) => {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 p-4"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 border border-red-300 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-red-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-red-800 uppercase tracking-wide">
            Urgent Medical Attention
          </p>
          <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
            Assessment contains indicators requiring prompt professional evaluation.
            Please escalate to a qualified healthcare professional immediately.
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {onEscalate && (
              <button
                type="button"
                onClick={onEscalate}
                className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-1 cursor-pointer"
              >
                Notify / Escalate
              </button>
            )}
            {onViewRecord && (
              <button
                type="button"
                onClick={onViewRecord}
                className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-800 text-xs font-semibold rounded-md border border-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-1 cursor-pointer"
              >
                View Patient Record
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
