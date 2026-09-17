import React from 'react';

import { RiskLevel } from '../../../types/triage';

interface RiskBadgeProps {
  risk: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

const RISK_CONFIG: Record<
  RiskLevel,
  { label: string; classes: string; dotClass: string }
> = {
  LOW: {
    label: 'LOW',
    classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  MODERATE: {
    label: 'MODERATE',
    classes: 'bg-amber-50 text-amber-800 border-amber-200',
    dotClass: 'bg-amber-500',
  },
  HIGH: {
    label: 'HIGH',
    classes: 'bg-red-50 text-red-800 border-red-200',
    dotClass: 'bg-red-500',
  },
};

export const RiskBadge: React.FC<RiskBadgeProps> = ({ risk, size = 'md' }) => {
  const config = RISK_CONFIG[risk];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-2xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full border font-semibold tracking-wide ${config.classes} ${sizeClasses[size]}`}
    >
      <span className={`rounded-full ${config.dotClass} ${dotSizeClasses[size]}`} />
      <span>Risk: {config.label}</span>
    </span>
  );
};
