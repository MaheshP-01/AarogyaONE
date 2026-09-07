import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Plus,
  Play,
  Stethoscope,
  Video,
  Home,
  ArrowRight,
} from 'lucide-react';
import { doctorMockService } from '../../services/doctorMockService';
import { FollowUpRecord, ClinicalPatient } from '../../types/doctor';
import { FollowUpDrawer } from '../../components/doctor/FollowUpDrawer';

export const FollowUpDashboardPage: React.FC = () => {
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>(doctorMockService.getFollowUps());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<ClinicalPatient>(
    doctorMockService.getPatient('RC-2026-004821') || doctorMockService.getAllPatients()[0]
  );

  const todayStr = '2026-09-07';

  const todayFollowUps = followUps.filter((f) => f.date === todayStr);
  const upcomingFollowUps = followUps.filter((f) => f.date > todayStr);
  const missedFollowUps = followUps.filter((f) => f.date < todayStr && f.status !== 'Completed');

  const handleCreateSuccess = () => {
    setFollowUps(doctorMockService.getFollowUps());
  };

  const renderModeIcon = (mode: string) => {
    switch (mode) {
      case 'Teleconsultation':
        return <Video className="w-3.5 h-3.5 text-sky-700" />;
      case 'In-person':
        return <Stethoscope className="w-3.5 h-3.5 text-indigo-700" />;
      case 'Health-worker follow-up':
      default:
        return <Home className="w-3.5 h-3.5 text-emerald-700" />;
    }
  };

  const renderTableSection = (title: string, list: FollowUpRecord[], countBadgeClass: string, emptyMsg: string) => (
    <div className="bg-white border border-slate-200/90 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200/90 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">{title}</h2>
          <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${countBadgeClass}`}>
            {list.length}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/40 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-medium">
            <tr>
              <th className="py-2.5 px-3.5">Patient</th>
              <th className="py-2.5 px-3.5">Reason</th>
              <th className="py-2.5 px-3.5">Date & Time</th>
              <th className="py-2.5 px-3.5">Mode</th>
              <th className="py-2.5 px-3.5">Status</th>
              <th className="py-2.5 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.length > 0 ? (
              list.map((fu) => (
                <tr key={fu.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3.5">
                    <Link
                      to={`/doctor/patients/${fu.patientId}`}
                      className="font-semibold text-slate-900 hover:text-sky-700 hover:underline inline-block"
                    >
                      {fu.patientName}
                    </Link>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {fu.patientAge}y • {fu.patientGender} • {fu.patientVillage}
                    </div>
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="font-medium text-slate-800 max-w-sm truncate">{fu.reason}</div>
                    {fu.instructions && (
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{fu.instructions}</div>
                    )}
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="font-mono text-slate-800 text-[11px] font-medium">{fu.date}</div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{fu.time}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="flex items-center space-x-1.5 font-medium text-slate-700">
                      {renderModeIcon(fu.mode)}
                      <span className="text-xs">{fu.mode}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        fu.status === 'Scheduled'
                          ? 'bg-sky-50 text-sky-800 border border-sky-200'
                          : fu.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {fu.status}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right space-x-2 whitespace-nowrap">
                    <Link
                      to={`/doctor/patients/${fu.patientId}`}
                      className="px-2.5 py-1 text-slate-700 hover:text-slate-900 border border-slate-200 rounded text-xs font-medium hover:bg-slate-50 transition-colors"
                    >
                      Open Patient
                    </Link>
                    <Link
                      to={`/doctor/consultation/${fu.patientId}`}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Start Consultation</span>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                  {emptyMsg}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-sky-700" />
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
              Follow-up Management
            </h1>
          </div>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Monitor post-consultation continuity of care across frontline ASHA home visits, teleconsultations, and in-person review visits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedPatient(doctorMockService.getPatient('RC-2026-004821') || doctorMockService.getAllPatients()[0]);
            setIsDrawerOpen(true);
          }}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      {/* Sections: Today, Upcoming, Missed */}
      <div className="space-y-5">
        {renderTableSection(
          "Today",
          todayFollowUps,
          'bg-sky-100 text-sky-900',
          'No follow-ups scheduled for today.'
        )}

        {renderTableSection(
          'Upcoming',
          upcomingFollowUps,
          'bg-slate-100 text-slate-800',
          'No upcoming follow-ups found in system schedule.'
        )}

        {missedFollowUps.length > 0 &&
          renderTableSection(
            'Missed / Overdue',
            missedFollowUps,
            'bg-rose-100 text-rose-900',
            'No overdue follow-ups.'
          )}
      </div>

      {/* Follow Up Slide-Over Drawer */}
      <FollowUpDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        patient={selectedPatient}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

