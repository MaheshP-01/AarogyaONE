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
} from 'lucide-react';
import { doctorMockService } from '../../services/doctorMockService';
import { FollowUpRecord, ClinicalPatient } from '../../types/doctor';
import { FollowUpModal } from '../../components/doctor/FollowUpModal';

export const FollowUpDashboardPage: React.FC = () => {
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>(doctorMockService.getFollowUps());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient] = useState<ClinicalPatient>(
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
        return <Video className="w-3.5 h-3.5 text-blue-600" />;
      case 'In-person':
        return <Stethoscope className="w-3.5 h-3.5 text-purple-600" />;
      case 'Health-worker follow-up':
      default:
        return <Home className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  const renderTableSection = (title: string, list: FollowUpRecord[], badgeStyle: string, emptyMsg: string) => (
    <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden space-y-0">
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{title}</h2>
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${badgeStyle}`}>
            {list.length}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-white border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 font-medium">
            <tr>
              <th className="py-2.5 px-4">Patient</th>
              <th className="py-2.5 px-4">Objective / Clinical Reason</th>
              <th className="py-2.5 px-4">Schedule Date & Time</th>
              <th className="py-2.5 px-4">Mode / Channel</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.length > 0 ? (
              list.map((fu) => (
                <tr key={fu.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <Link
                      to={`/doctor/patients/${fu.patientId}`}
                      className="font-bold text-slate-900 hover:text-blue-700 hover:underline"
                    >
                      {fu.patientName}
                    </Link>
                    <div className="text-[11px] text-slate-400">
                      {fu.patientAge}y/{fu.patientGender} • {fu.patientVillage}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800 max-w-sm truncate">{fu.reason}</div>
                    {fu.instructions && (
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{fu.instructions}</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-mono text-slate-800 font-medium">{fu.date}</div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{fu.time}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1.5 font-medium text-slate-700">
                      {renderModeIcon(fu.mode)}
                      <span>{fu.mode}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        fu.status === 'Scheduled'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : fu.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {fu.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                    <Link
                      to={`/doctor/patients/${fu.patientId}`}
                      className="px-2.5 py-1 text-slate-700 hover:text-blue-700 border border-slate-200 rounded text-xs font-medium hover:bg-slate-50 transition-colors"
                    >
                      Open Patient
                    </Link>
                    <Link
                      to={`/doctor/consultation/${fu.patientId}`}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 bg-blue-700 text-white rounded text-xs font-medium hover:bg-blue-800 shadow-2xs transition-colors"
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-700" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Patient Follow-up Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitor post-consultation continuity of care via frontline ASHA home visits, teleconsultations, and hospital review visits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Follow-up</span>
        </button>
      </div>

      {/* Sections: Today, Upcoming, Missed */}
      <div className="space-y-6">
        {renderTableSection(
          "Today's Scheduled Follow-ups",
          todayFollowUps,
          'bg-blue-100 text-blue-900',
          'No follow-ups scheduled for today.'
        )}

        {renderTableSection(
          'Upcoming Clinical Follow-ups',
          upcomingFollowUps,
          'bg-slate-100 text-slate-800',
          'No upcoming follow-ups found in system schedule.'
        )}

        {missedFollowUps.length > 0 &&
          renderTableSection(
            'Missed / Overdue Follow-ups',
            missedFollowUps,
            'bg-red-100 text-red-900',
            'No overdue follow-ups.'
          )}
      </div>

      {/* Follow Up Modal */}
      <FollowUpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={selectedPatient}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};
