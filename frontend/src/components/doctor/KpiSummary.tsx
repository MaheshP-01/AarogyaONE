import React from 'react';
import { Users, AlertTriangle, Video, Share2, Calendar } from 'lucide-react';
import { DoctorKpiSummary } from '../../types/doctor';
import { TranslationDictionary } from '../../utils/translations';

interface KpiSummaryProps {
  summary: DoctorKpiSummary;
  onFilterUrgent?: () => void;
  onFilterAll?: () => void;
  t: TranslationDictionary;
}

export const KpiSummary: React.FC<KpiSummaryProps> = ({
  summary,
  onFilterUrgent,
  onFilterAll,
  t,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {/* Today's Queue */}
      <div
        onClick={onFilterAll}
        className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-teal-400 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold text-slate-700">{t.kpiTodayQueue}</span>
          <Users className="w-4 h-4 text-teal-600" />
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {summary.todayQueueCount}
        </div>
        <span className="text-3xs text-slate-400 font-medium">Patients active</span>
      </div>

      {/* Urgent Cases */}
      <div
        onClick={onFilterUrgent}
        className="p-3.5 bg-white border border-red-200 bg-red-50/20 rounded-lg shadow-2xs hover:border-red-400 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center justify-between text-red-600 mb-1">
          <span className="text-xs font-bold text-red-700">{t.kpiUrgent}</span>
          <AlertTriangle className="w-4 h-4 text-red-600" />
        </div>
        <div className="text-2xl font-bold text-red-700 tracking-tight">
          {summary.urgentCount}
        </div>
        <span className="text-3xs text-red-600 font-medium">Immediate triage</span>
      </div>

      {/* Teleconsultations */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold text-slate-700">{t.kpiTeleconsults}</span>
          <Video className="w-4 h-4 text-blue-600" />
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {summary.teleconsultCount}
        </div>
        <span className="text-3xs text-slate-400 font-medium">Remote PHC links</span>
      </div>

      {/* Pending Referrals */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold text-slate-700">{t.kpiReferrals}</span>
          <Share2 className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {summary.pendingReferralsCount}
        </div>
        <span className="text-3xs text-slate-400 font-medium">Awaiting transfer</span>
      </div>

      {/* Follow-ups Today */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold text-slate-700">{t.kpiFollowUps}</span>
          <Calendar className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {summary.todayFollowUpsCount}
        </div>
        <span className="text-3xs text-slate-400 font-medium">Scheduled today</span>
      </div>
    </div>
  );
};
