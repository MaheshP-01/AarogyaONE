import React from 'react';
import { ClinicalVitals } from '../../types/doctor';

interface VitalsPanelProps {
  vitals: ClinicalVitals;
}

export const VitalsPanel: React.FC<VitalsPanelProps> = ({ vitals }) => {
  const spo2Num = parseInt(vitals.spo2.replace(/\D/g, ''), 10);
  const isHypoxic = !isNaN(spo2Num) && spo2Num < 94;

  const tempNum = parseFloat(vitals.temperature.replace(/[^0-9.]/g, ''));
  const isFebrile = !isNaN(tempNum) && tempNum >= 100.4;

  return (
    <div className="bg-white border border-slate-200 rounded-md p-3.5 sm:p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Clinical Vitals
        </h3>
        <div className="text-[11px] text-slate-400 font-mono">
          Intake: {vitals.recordedAt}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {/* Temperature */}
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Temperature</span>
            {isFebrile && (
              <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1 rounded">
                FEVER
              </span>
            )}
          </div>
          <div className={`text-base font-bold mt-1 ${isFebrile ? 'text-red-700' : 'text-slate-900'}`}>
            {vitals.temperature}
          </div>
          <div className="text-[10px] text-slate-400">Oral digital</div>
        </div>

        {/* SpO2 */}
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>SpO2</span>
            {isHypoxic && (
              <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1 rounded">
                LOW
              </span>
            )}
          </div>
          <div className={`text-base font-bold mt-1 ${isHypoxic ? 'text-red-700' : 'text-slate-900'}`}>
            {vitals.spo2}
          </div>
          <div className="text-[10px] text-slate-400">Pulse oximeter</div>
        </div>

        {/* Heart Rate */}
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
          <div className="text-[11px] text-slate-500 font-medium">Heart Rate</div>
          <div className="text-base font-bold text-slate-900 mt-1">
            {vitals.heartRate}
          </div>
          <div className="text-[10px] text-slate-400">Resting radial</div>
        </div>

        {/* Blood Pressure */}
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
          <div className="text-[11px] text-slate-500 font-medium">Blood Pressure</div>
          <div className="text-base font-bold text-slate-900 mt-1">
            {vitals.bloodPressure}
          </div>
          <div className="text-[10px] text-slate-400">mmHg (Right arm)</div>
        </div>

        {/* Respiratory Rate */}
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
          <div className="text-[11px] text-slate-500 font-medium">Resp. Rate</div>
          <div className="text-base font-bold text-slate-900 mt-1">
            {vitals.respiratoryRate}
          </div>
          <div className="text-[10px] text-slate-400">Breaths / min</div>
        </div>
      </div>
    </div>
  );
};
