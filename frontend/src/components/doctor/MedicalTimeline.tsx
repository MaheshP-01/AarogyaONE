import React, { useState } from 'react';
import {
  FileText,
  UserCheck,
  FlaskConical,
  Pill,
  Share2,
  ChevronDown,
  ChevronUp,
  Calendar,
} from 'lucide-react';
import { ClinicalTimelineEvent } from '../../types/doctor';

interface MedicalTimelineProps {
  events: ClinicalTimelineEvent[];
}

export const MedicalTimeline: React.FC<MedicalTimelineProps> = ({ events }) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    [events[0]?.id]: true, // first event expanded by default
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getTypeIcon = (type: ClinicalTimelineEvent['type']) => {
    switch (type) {
      case 'Consultation':
        return <FileText className="w-3.5 h-3.5 text-blue-600" />;
      case 'Visit':
        return <UserCheck className="w-3.5 h-3.5 text-teal-600" />;
      case 'Lab Report':
        return <FlaskConical className="w-3.5 h-3.5 text-purple-600" />;
      case 'Prescription':
        return <Pill className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Referral':
        return <Share2 className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Calendar className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Longitudinal Medical History Timeline
          </h3>
          <p className="text-2xs text-slate-500 mt-0.5">
            Synchronized records across rural sub-centers, PHCs, and district hospitals
          </p>
        </div>
        <span className="text-2xs text-slate-400 font-mono">
          {events.length} Events Recorded
        </span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {events.map((evt) => {
          const isExpanded = Boolean(expandedIds[evt.id]);

          return (
            <div key={evt.id} className="relative">
              {/* Timeline marker icon */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center">
                {getTypeIcon(evt.type)}
              </div>

              {/* Event card */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div
                  onClick={() => toggleExpand(evt.id)}
                  className="flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xs font-mono font-bold text-slate-500">
                      {evt.date}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-3xs font-bold uppercase bg-slate-200 text-slate-700">
                      {evt.type}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {evt.title}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {evt.badge && (
                      <span className="px-1.5 py-0.5 rounded text-3xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {evt.badge}
                      </span>
                    )}
                    <span className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-200/70 text-xs text-slate-700 space-y-1.5">
                    <div className="flex items-center space-x-3 text-3xs text-slate-500">
                      <span>Facility: <strong className="text-slate-700">{evt.facility}</strong></span>
                      <span>•</span>
                      <span>Recorded By: <strong className="text-slate-700">{evt.doctorOrWorker}</strong></span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed bg-white p-2 rounded border border-slate-200/60">
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
