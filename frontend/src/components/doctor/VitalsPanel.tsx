import React from 'react';
import { Activity, Thermometer, Heart, Wind, Gauge, Clock, UserCheck } from 'lucide-react';
import { ClinicalVitals } from '../../types/doctor';

interface VitalsPanelProps {
  vitals: ClinicalVitals;
}

export const VitalsPanel: React.FC<VitalsPanelProps> = ({ vitals }) => {
  // Parse SpO2 for warning color
  const spo2Num = parseInt(vitals.spo2.replace(/\D/g, ''), 10);
  const isSpo2Low = !isNaN(spo2Num) && spo2Num < 94;

  // Parse Temp for fever
  const tempNum = parseFloat(vitals.temperature.replace(/[^0-9.]/g, ''));
  const isTempHigh = !isNaN(tempNum) && tempNum >= 100.4;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-teal-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Clinical Vitals
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-3xs text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{vitals.recordedAt}</span>
          <span>•</span>
          <UserCheck className="w-3 h-3" />
          <span>{vitals.recordedBy}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Temperature */}
        <div
          className={`p-3 rounded-lg border ${
            isTempHigh ? 'bg-red-50/40 border-red-200' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-3xs font-semibold uppercase tracking-wider">Temp</span>
            <Thermometer className={`w-3.5 h-3.5 ${isTempHigh ? 'text-red-600' : 'text-slate-400'}`} />
          </div>
          <div className={`text-base font-bold ${isTempHigh ? 'text-red-700' : 'text-slate-900'}`}>
            {vitals.temperature}
          </div>
          <span className="text-3xs text-slate-400">Oral probe</span>
        </div>

        {/* SpO2 */}
        <div
          className={`p-3 rounded-lg border ${
            isSpo2Low ? 'bg-red-50/40 border-red-200' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-3xs font-semibold uppercase tracking-wider">SpO2</span>
            <Wind className={`w-3.5 h-3.5 ${isSpo2Low ? 'text-red-600' : 'text-slate-400'}`} />
          </div>
          <div className={`text-base font-bold ${isSpo2Low ? 'text-red-700' : 'text-slate-900'}`}>
            {vitals.spo2}
          </div>
          <span className={`text-3xs font-medium ${isSpo2Low ? 'text-red-600 font-semibold' : 'text-slate-400'}`}>
            {isSpo2Low ? 'Hypoxia Warning' : 'Room air'}
          </span>
        </div>

        {/* Heart Rate */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-3xs font-semibold uppercase tracking-wider">Heart Rate</span>
            <Heart className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-base font-bold text-slate-900">{vitals.heartRate}</div>
          <span className="text-3xs text-slate-400">Pulse regular</span>
        </div>

        {/* Blood Pressure */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-3xs font-semibold uppercase tracking-wider">Blood Pressure</span>
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-base font-bold text-slate-900">{vitals.bloodPressure}</div>
          <span className="text-3xs text-slate-400">Sitting position</span>
        </div>

        {/* Respiratory Rate */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-3xs font-semibold uppercase tracking-wider">Resp Rate</span>
            <Wind className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-base font-bold text-slate-900">{vitals.respiratoryRate}</div>
          <span className="text-3xs text-slate-400">Spontaneous</span>
        </div>
      </div>
    </div>
  );
};
