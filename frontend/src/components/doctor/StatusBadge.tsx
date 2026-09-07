import React from 'react';
import { TriageRiskLevel, TriagePriority, QueueStatus, ReferralStatus } from '../../types/doctor';

interface StatusBadgeProps {
  type: 'risk' | 'priority' | 'queue' | 'referral';
  value: TriageRiskLevel | TriagePriority | QueueStatus | ReferralStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';

  if (type === 'risk' || type === 'priority') {
    const val = value.toString().toUpperCase();
    if (val === 'HIGH' || val === 'URGENT') {
      return (
        <span className={`inline-flex items-center rounded font-semibold bg-red-50 text-red-700 border border-red-200 tracking-wider uppercase ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5 shrink-0" />
          {val}
        </span>
      );
    }
    if (val === 'MODERATE' || val === 'PRIORITY') {
      return (
        <span className={`inline-flex items-center rounded font-semibold bg-amber-50 text-amber-800 border border-amber-200 tracking-wider uppercase ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-1.5 shrink-0" />
          {val}
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center rounded font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 tracking-wider uppercase ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 shrink-0" />
        {val}
      </span>
    );
  }

  if (type === 'queue') {
    const val = value.toString().toLowerCase();
    if (val === 'in_consultation') {
      return (
        <span className={`inline-flex items-center rounded font-semibold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5 shrink-0 animate-pulse" />
          IN CONSULTATION
        </span>
      );
    }
    if (val === 'waiting') {
      return (
        <span className={`inline-flex items-center rounded font-semibold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5 shrink-0" />
          WAITING
        </span>
      );
    }
    if (val === 'completed') {
      return (
        <span className={`inline-flex items-center rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 shrink-0" />
          COMPLETED
        </span>
      );
    }
  }

  if (type === 'referral') {
    const val = value.toString();
    if (val === 'Pending') {
      return (
        <span className={`inline-flex items-center rounded font-semibold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider ${sizeClasses}`}>
          PENDING
        </span>
      );
    }
    if (val === 'Accepted') {
      return (
        <span className={`inline-flex items-center rounded font-semibold bg-blue-50 text-blue-800 border border-blue-200 uppercase tracking-wider ${sizeClasses}`}>
          ACCEPTED
        </span>
      );
    }
    if (val === 'In Transit') {
      return (
        <span className={`inline-flex items-center rounded font-semibold bg-purple-50 text-purple-800 border border-purple-200 uppercase tracking-wider ${sizeClasses}`}>
          IN TRANSIT
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center rounded font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider ${sizeClasses}`}>
        COMPLETED
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded font-semibold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider ${sizeClasses}`}>
      {value}
    </span>
  );
};
