import React from 'react';
import { AppointmentStatus } from '../../../types/appointment';

interface Props {
  status: AppointmentStatus;
}

export const AppointmentStatusBadge: React.FC<Props> = ({ status }) => {
  const configs: Record<
    AppointmentStatus,
    { label: string; bg: string; text: string; dot: string; border: string }
  > = {
    SCHEDULED: {
      label: 'Scheduled',
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      dot: 'bg-sky-500',
      border: 'border-sky-200',
    },
    CHECKED_IN: {
      label: 'Checked In',
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      dot: 'bg-indigo-500',
      border: 'border-indigo-200',
    },
    WAITING: {
      label: 'Waiting',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
      border: 'border-amber-200',
    },
    IN_CONSULTATION: {
      label: 'In Consultation',
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      dot: 'bg-teal-500',
      border: 'border-teal-200',
    },
    COMPLETED: {
      label: 'Completed',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      dot: 'bg-emerald-500',
      border: 'border-emerald-200',
    },
    CANCELLED: {
      label: 'Cancelled',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      dot: 'bg-slate-400',
      border: 'border-slate-300',
    },
    NO_SHOW: {
      label: 'No Show',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      dot: 'bg-rose-500',
      border: 'border-rose-200',
    },
  };

  const config = configs[status] || configs.SCHEDULED;

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-2xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};
