import React from 'react';
import { DoctorKpiSummary } from '../../types/doctor';

interface KpiSummaryProps {
  summary: DoctorKpiSummary;
  onFilterUrgent?: () => void;
  onFilterAll?: () => void;
}

export const KpiSummary: React.FC<KpiSummaryProps> = ({
  summary,
  onFilterUrgent,
  onFilterAll,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {/* Today's Queue */}
      <div
        onClick={onFilterAll}
        className="p-3.5 bg-white border border-slate-200 rounded-md hover:border-slate-300 transition-colors cursor-pointer select-none"
      >
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Today's Queue
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
          {summary.todayQueueCount}
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5">
          Intake stream active
        </div>
      </div>

      {/* Urgent */}
      <div
        onClick={onFilterUrgent}
        className="p-3.5 bg-white border border-slate-200 rounded-md hover:border-red-300 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-red-700 uppercase tracking-wider">
            Urgent
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
        </div>
        <div className="text-2xl font-bold text-red-700 tracking-tight mt-1">
          {summary.urgentCount}
        </div>
        <div className="text-[11px] text-red-600/80 mt-0.5">
          Requires prompt review
        </div>
      </div>

      {/* Teleconsultations */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-md hover:border-slate-300 transition-colors">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Teleconsultations
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
          {summary.teleconsultCount}
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5">
          Remote rural links
        </div>
      </div>

      {/* Pending Referrals */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-md hover:border-slate-300 transition-colors">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Pending Referrals
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
          {summary.pendingReferralsCount}
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5">
          District Hospital
        </div>
      </div>

      {/* Follow-ups */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-md hover:border-slate-300 transition-colors">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Follow-ups
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
          {summary.todayFollowUpsCount}
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5">
          Scheduled today
        </div>
      </div>
    </div>
  );
};
