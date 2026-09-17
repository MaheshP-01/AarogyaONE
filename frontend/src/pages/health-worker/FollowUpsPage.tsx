import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { FollowUp, FollowUpCompletionData } from '../../types/followup';
import {
  getFollowUps,
  completeFollowUp,
  rescheduleFollowUp,
  updateFollowUpStatus,
} from '../../services/followUpService';
import { FollowUpStatusBadge } from '../../components/health-worker/followups/FollowUpStatusBadge';
import { CompleteFollowUpModal } from '../../components/health-worker/followups/CompleteFollowUpModal';
import { RescheduleFollowUpModal } from '../../components/health-worker/followups/RescheduleFollowUpModal';
import { FollowUpDetailModal } from '../../components/health-worker/followups/FollowUpDetailModal';
import { ScheduleFollowUpDrawer } from '../../components/health-worker/followups/ScheduleFollowUpDrawer';
import { getTodayIST } from '../../services/clinicalDemoData';

export const FollowUpsPage: React.FC = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'due' | 'upcoming' | 'missed' | 'completed' | 'all'>(
    'due'
  );

  // Modals & Drawers
  const [isScheduleDrawerOpen, setIsScheduleDrawerOpen] = useState(false);
  const [selectedDetailFollowUp, setSelectedDetailFollowUp] = useState<FollowUp | null>(null);
  const [completeModalFollowUp, setCompleteModalFollowUp] = useState<FollowUp | null>(null);
  const [rescheduleModalFollowUp, setRescheduleModalFollowUp] = useState<FollowUp | null>(null);

  // Toast Notification
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const loadFollowUpsData = async () => {
    try {
      setIsLoading(true);
      const data = await getFollowUps();
      setFollowUps(data);
    } catch (err) {
      console.warn('Failed to load follow-ups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFollowUpsData();
  }, []);

  const todayStr = getTodayIST();

  // KPI Statistics
  const dueCount = followUps.filter((f) => f.status === 'DUE').length;
  const upcomingCount = followUps.filter((f) => f.status === 'UPCOMING').length;
  const missedCount = followUps.filter((f) => f.status === 'MISSED').length;
  const completedCount = followUps.filter((f) => f.status === 'COMPLETED').length;

  // Filtered List
  const filteredFollowUps = followUps.filter((item) => {
    if (activeTab === 'due' && item.status !== 'DUE') return false;
    if (activeTab === 'upcoming' && item.status !== 'UPCOMING') return false;
    if (activeTab === 'missed' && item.status !== 'MISSED') return false;
    if (activeTab === 'completed' && item.status !== 'COMPLETED') return false;

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      const matchPatient = item.patientName.toLowerCase().includes(q);
      const matchId = item.patientId.toLowerCase().includes(q);
      const matchReason = item.reason.toLowerCase().includes(q);
      const matchDoctor = (item.doctorName || '').toLowerCase().includes(q);
      const matchFollowUpId = item.followUpId.toLowerCase().includes(q);
      return matchPatient || matchId || matchReason || matchDoctor || matchFollowUpId;
    }

    return true;
  });

  // Action handlers
  const handleConfirmComplete = async (
    followUpId: string,
    completionData: FollowUpCompletionData
  ) => {
    const updated = await completeFollowUp(followUpId, completionData);
    setFollowUps((prev) => prev.map((f) => (f.followUpId === followUpId ? updated : f)));
    if (selectedDetailFollowUp?.followUpId === followUpId) {
      setSelectedDetailFollowUp(updated);
    }
    showNotification(`Marked follow-up for ${updated.patientName} as completed.`);
  };

  const handleConfirmReschedule = async (
    followUpId: string,
    newDate: string,
    newTime: string,
    reason: string
  ) => {
    const newFollowUp = await rescheduleFollowUp(followUpId, newDate, newTime, reason);
    await loadFollowUpsData();
    showNotification(
      `Rescheduled follow-up for ${newFollowUp.patientName} to ${newFollowUp.date} at ${newFollowUp.time}.`
    );
  };

  const handleCancelFollowUp = async (followUpId: string) => {
    if (window.confirm('Are you sure you want to cancel this follow-up?')) {
      const updated = await updateFollowUpStatus(followUpId, 'CANCELLED', 'Cancelled by health worker');
      setFollowUps((prev) => prev.map((f) => (f.followUpId === followUpId ? updated : f)));
      if (selectedDetailFollowUp?.followUpId === followUpId) {
        setSelectedDetailFollowUp(updated);
      }
      showNotification('Follow-up cancelled.');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 p-3 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Follow-ups
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track patients who need continued care.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={loadFollowUpsData}
            title="Refresh follow-ups"
            className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setIsScheduleDrawerOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Follow-up</span>
          </button>
        </div>
      </div>

      {/* KPI Dashboard Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
              Due Today
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{dueCount}</div>
          <span className="text-3xs text-slate-400 mt-0.5 block">Requires action on {todayStr}</span>
        </div>

        <div className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
              Upcoming
            </span>
            <Calendar className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{upcomingCount}</div>
          <span className="text-3xs text-slate-400 mt-0.5 block">Scheduled for future dates</span>
        </div>

        <div className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
              Missed
            </span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{missedCount}</div>
          <span className="text-3xs text-slate-400 mt-0.5 block">Needs immediate rescheduling</span>
        </div>

        <div className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
              Completed
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{completedCount}</div>
          <span className="text-3xs text-slate-400 mt-0.5 block">Follow-up evaluated & saved</span>
        </div>
      </div>

      {/* Main Follow-up Workspace */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        {/* Controls: Tabs & Search */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'due', label: 'Due Today' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'missed', label: 'Missed' },
              { id: 'completed', label: 'Completed' },
              { id: 'all', label: 'All' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="relative max-w-xs w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient, doctor, reason..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-teal-600 focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-3xs">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Due Date & Time</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Assigned Doctor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredFollowUps.length > 0 ? (
                filteredFollowUps.map((item) => (
                  <tr key={item.followUpId} className="hover:bg-slate-50/80 transition-colors">
                    {/* Patient */}
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 block">{item.patientName}</span>
                      <span className="font-mono text-3xs text-slate-400">{item.patientId}</span>
                    </td>

                    {/* Reason */}
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-800 block max-w-xs truncate">
                        {item.reason}
                      </span>
                      {item.rescheduledFromId && (
                        <span className="text-3xs text-amber-700 block">
                          Rescheduled from {item.rescheduledFromId}
                        </span>
                      )}
                    </td>

                    {/* Date & Time */}
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900 block">{item.date}</span>
                      <span className="text-2xs text-slate-400">{item.time}</span>
                    </td>

                    {/* Mode */}
                    <td className="px-4 py-3">
                      <span className="text-2xs font-medium text-slate-600">
                        {item.mode.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Doctor */}
                    <td className="px-4 py-3">
                      <span className="text-2xs text-slate-700 font-medium">
                        {item.doctorName || 'Attending Physician'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <FollowUpStatusBadge status={item.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {item.status !== 'COMPLETED' && item.status !== 'CANCELLED' && (
                          <button
                            type="button"
                            onClick={() => setCompleteModalFollowUp(item)}
                            className="px-2.5 py-1 text-3xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 rounded transition-colors"
                          >
                            Mark Complete
                          </button>
                        )}

                        {item.status === 'MISSED' && (
                          <button
                            type="button"
                            onClick={() => setRescheduleModalFollowUp(item)}
                            className="px-2.5 py-1 text-3xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 rounded transition-colors"
                          >
                            Reschedule
                          </button>
                        )}

                        {item.status === 'UPCOMING' && (
                          <button
                            type="button"
                            onClick={() => setRescheduleModalFollowUp(item)}
                            className="px-2 py-1 text-3xs font-medium text-slate-600 hover:text-slate-800 rounded transition-colors"
                          >
                            Reschedule
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedDetailFollowUp(item)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                          title="View follow-up details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    <Clock className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                    <p className="font-semibold text-slate-700 text-xs">No follow-ups found</p>
                    <p className="text-2xs text-slate-400 mt-0.5">
                      No follow-up records matching this filter view.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredFollowUps.length > 0 ? (
            filteredFollowUps.map((item) => (
              <div key={item.followUpId} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                    {item.followUpId}
                  </span>
                  <FollowUpStatusBadge status={item.status} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{item.patientName}</h3>
                  <p className="text-xs text-slate-700 font-medium mt-0.5">{item.reason}</p>
                </div>

                <div className="text-2xs text-slate-600 space-y-0.5">
                  <div>
                    <span className="font-semibold text-slate-700">Due: </span>
                    {item.date} at {item.time} ({(item.mode || 'VISIT').replace('_', ' ')})
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Doctor: </span>
                    {item.doctorName || 'Attending Physician'}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedDetailFollowUp(item)}
                    className="text-2xs font-semibold text-teal-700 hover:text-teal-900"
                  >
                    Open Details
                  </button>

                  <div className="flex items-center space-x-1.5">
                    {item.status !== 'COMPLETED' && item.status !== 'CANCELLED' && (
                      <button
                        type="button"
                        onClick={() => setCompleteModalFollowUp(item)}
                        className="px-2.5 py-1 text-3xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 rounded"
                      >
                        Mark Complete
                      </button>
                    )}

                    {item.status === 'MISSED' && (
                      <button
                        type="button"
                        onClick={() => setRescheduleModalFollowUp(item)}
                        className="px-2.5 py-1 text-3xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded"
                      >
                        Reschedule
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400">
              <Clock className="w-8 h-8 mx-auto mb-1 text-slate-300" />
              <p className="font-semibold text-slate-700 text-xs">No follow-ups found</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <FollowUpDetailModal
        followUp={selectedDetailFollowUp}
        isOpen={Boolean(selectedDetailFollowUp)}
        onClose={() => setSelectedDetailFollowUp(null)}
        onOpenComplete={(f) => {
          setSelectedDetailFollowUp(null);
          setCompleteModalFollowUp(f);
        }}
        onOpenReschedule={(f) => {
          setSelectedDetailFollowUp(null);
          setRescheduleModalFollowUp(f);
        }}
        onCancel={handleCancelFollowUp}
      />

      {/* Complete Modal */}
      {completeModalFollowUp && (
        <CompleteFollowUpModal
          followUp={completeModalFollowUp}
          isOpen={Boolean(completeModalFollowUp)}
          onClose={() => setCompleteModalFollowUp(null)}
          onConfirm={handleConfirmComplete}
        />
      )}

      {/* Reschedule Modal */}
      {rescheduleModalFollowUp && (
        <RescheduleFollowUpModal
          followUp={rescheduleModalFollowUp}
          isOpen={Boolean(rescheduleModalFollowUp)}
          onClose={() => setRescheduleModalFollowUp(null)}
          onConfirm={handleConfirmReschedule}
        />
      )}

      {/* Schedule Drawer */}
      <ScheduleFollowUpDrawer
        isOpen={isScheduleDrawerOpen}
        onClose={() => setIsScheduleDrawerOpen(false)}
        onSuccess={(newFu) => {
          setFollowUps((prev) => [newFu, ...prev]);
          showNotification(`Scheduled follow-up for ${newFu.patientName}.`);
        }}
      />
    </div>
  );
};
