import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ClinicalTimelineEvent } from '../../types/doctor';

interface MedicalTimelineProps {
  events: ClinicalTimelineEvent[];
}

export const MedicalTimeline: React.FC<MedicalTimelineProps> = ({ events }) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    [events[0]?.id]: true,
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md p-3.5 sm:p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Medical History
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Longitudinal records across sub-centers, PHCs, and district hospitals
          </p>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {events.length} records
        </span>
      </div>

      <div className="relative pl-4 space-y-3 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
        {events.map((evt) => {
          const isExpanded = !!expandedIds[evt.id];
          return (
            <div key={evt.id} className="relative group text-xs">
              {/* Timeline marker dot */}
              <div className="absolute -left-4 top-1.5 w-2 h-2 rounded-full bg-slate-400 ring-2 ring-white group-hover:bg-slate-700 transition-colors" />

              <div className="bg-slate-50 border border-slate-200 rounded p-2.5 transition-colors hover:border-slate-300">
                <div
                  onClick={() => toggleExpand(evt.id)}
                  className="flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="font-mono text-[11px] text-slate-500 font-medium shrink-0">
                      {formatDate(evt.date)}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-200/70 text-slate-700 uppercase shrink-0">
                      {evt.type}
                    </span>
                    <span className="font-semibold text-slate-900 truncate">
                      {evt.title}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0 ml-2">
                    {evt.badge && (
                      <span className="text-[10px] font-medium text-slate-500 hidden sm:inline">
                        {evt.badge}
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60 text-slate-600 text-[11px] space-y-1">
                    <div className="text-slate-500">
                      <strong>Facility:</strong> {evt.facility} • <strong>Clinician:</strong> {evt.doctorOrWorker}
                    </div>
                    <p className="text-slate-800 leading-relaxed">
                      {evt.details}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
