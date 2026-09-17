import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Search,
  Plus,
  CheckCircle2,
  Ban,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { Appointment } from '../../types/appointment';
import {
  getAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} from '../../services/appointmentService';
import { AppointmentStatusBadge } from '../../components/health-worker/appointments/AppointmentStatusBadge';
import { AppointmentDetailModal } from '../../components/health-worker/appointments/AppointmentDetailModal';
import { CancelAppointmentModal } from '../../components/health-worker/appointments/CancelAppointmentModal';
import { BookAppointmentDrawer } from '../../components/health-worker/appointments/BookAppointmentDrawer';
import { getTodayIST } from '../../services/clinicalDemoData';

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<
    'all' | 'upcoming' | 'waiting' | 'in_consultation' | 'completed' | 'cancelled'
  >('all');

  // Modals & Drawers
  const [isBookDrawerOpen, setIsBookDrawerOpen] = useState(false);
  const [selectedDetailAppointment, setSelectedDetailAppointment] =
    useState<Appointment | null>(null);
  const [cancelModalAppointment, setCancelModalAppointment] =
    useState<Appointment | null>(null);

  // Notification Banner
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const loadAppointmentsData = async () => {
    try {
      setIsLoading(true);
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      console.warn('Failed to load appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointmentsData();
  }, []);

  const todayStr = getTodayIST();

  // Statistics calculation
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const todayCount = todayAppointments.length;
  const waitingCount = appointments.filter((a) => a.status === 'WAITING').length;
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;
  const cancelledCount = appointments.filter((a) => a.status === 'CANCELLED').length;

  // Filtered Appointments
  const filteredAppointments = appointments.filter((item) => {
    // Tab filter
    if (activeTab === 'upcoming') {
      if (item.status !== 'SCHEDULED' && item.status !== 'CHECKED_IN') return false;
    } else if (activeTab === 'waiting') {
      if (item.status !== 'WAITING') return false;
    } else if (activeTab === 'in_consultation') {
      if (item.status !== 'IN_CONSULTATION') return false;
    } else if (activeTab === 'completed') {
      if (item.status !== 'COMPLETED') return false;
    } else if (activeTab === 'cancelled') {
      if (item.status !== 'CANCELLED') return false;
    }

    // Search query filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      const matchPatient = (item.patientName || '').toLowerCase().includes(q);
      const matchId = (item.patientId || '').toLowerCase().includes(q);
      const matchDoctor = (item.doctorName || '').toLowerCase().includes(q);
      const matchToken = (item.tokenNumber || '').toLowerCase().includes(q);
      const matchReason = (item.reason || '').toLowerCase().includes(q);
      return matchPatient || matchId || matchDoctor || matchToken || matchReason;
    }

    return true;
  });

  // Action handlers
  const handleCheckIn = async (appointmentId: string) => {
    try {
      const updated = await updateAppointmentStatus(appointmentId, 'CHECKED_IN');
      setAppointments((prev) =>
        prev.map((a) => (a.appointmentId === appointmentId ? updated : a))
      );
      if (selectedDetailAppointment?.appointmentId === appointmentId) {
        setSelectedDetailAppointment(updated);
      }
      showNotification(`Checked in patient for appointment ${updated.tokenNumber}.`);
    } catch (err: any) {
      alert(err.message || 'Failed to check in.');
    }
  };

  const handleAddToQueue = async (appointmentId: string) => {
    try {
      const updated = await updateAppointmentStatus(appointmentId, 'WAITING');
      setAppointments((prev) =>
        prev.map((a) => (a.appointmentId === appointmentId ? updated : a))
      );
      if (selectedDetailAppointment?.appointmentId === appointmentId) {
        setSelectedDetailAppointment(updated);
      }
      showNotification(`Added ${updated.patientName} (${updated.tokenNumber}) to Doctor Queue.`);
    } catch (err: any) {
      alert(err.message || 'Failed to add to queue.');
    }
  };

  const handleConfirmCancel = async (appointmentId: string, cancelReason: string) => {
    const updated = await cancelAppointment(appointmentId, cancelReason);
    setAppointments((prev) =>
      prev.map((a) => (a.appointmentId === appointmentId ? updated : a))
    );
    if (selectedDetailAppointment?.appointmentId === appointmentId) {
      setSelectedDetailAppointment(updated);
    }
    showNotification(`Appointment cancelled.`);
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
            Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Schedule and manage patient consultations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={loadAppointmentsData}
            title="Refresh appointments"
            className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setIsBookDrawerOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* KPI Dashboard Strip (Compact Statistics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
              Today's Appointments
            </span>
            <Calendar className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{todayCount}</div>
          <span className="text-3xs text-slate-400 mt-0.5 block">Scheduled for {todayStr}</span>
        </div>

        <div className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
              Waiting in Queue
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{waitingCount}</div>
          <span className="text-3xs text-slate-400 mt-0.5 block">Ready for consultation</span>
        </div>

        <div className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
              Completed
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{completedCount}</div>
          <span className="text-3xs text-slate-400 mt-0.5 block">Consultations concluded</span>
        </div>

        <div className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
              Cancelled
            </span>
            <Ban className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{cancelledCount}</div>
          <span className="text-3xs text-slate-400 mt-0.5 block">Preserved in history</span>
        </div>
      </div>

      {/* Main Appointment Workspace */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        {/* Controls: Tabs & Search */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          {/* Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'waiting', label: 'Waiting' },
              { id: 'in_consultation', label: 'In Consultation' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' },
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

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient, token, doctor..."
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
                <th className="px-4 py-3">Token</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Doctor / Facility</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((apt) => (
                  <tr key={apt.appointmentId} className="hover:bg-slate-50/80 transition-colors">
                    {/* Token */}
                    <td className="px-4 py-3 font-mono font-bold text-teal-900">
                      <span className="bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                        {apt.tokenNumber}
                      </span>
                    </td>

                    {/* Patient */}
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 block">{apt.patientName}</span>
                      <span className="font-mono text-3xs text-slate-400">{apt.patientId}</span>
                    </td>

                    {/* Doctor */}
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800 block">{apt.doctorName}</span>
                      <span className="text-2xs text-slate-400 truncate block max-w-xs">
                        {apt.facilityName}
                      </span>
                    </td>

                    {/* Date & Time */}
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900 block">{apt.time}</span>
                      <span className="text-2xs text-slate-400">{apt.date}</span>
                    </td>

                    {/* Mode */}
                    <td className="px-4 py-3">
                      <span className="text-2xs font-medium text-slate-600">
                        {(apt.mode || 'IN_PERSON').replace('_', ' ')}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <AppointmentStatusBadge status={apt.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {apt.status === 'SCHEDULED' && (
                          <button
                            type="button"
                            onClick={() => handleCheckIn(apt.appointmentId)}
                            className="px-2.5 py-1 text-3xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded transition-colors"
                          >
                            Check In
                          </button>
                        )}

                        {apt.status === 'CHECKED_IN' && (
                          <button
                            type="button"
                            onClick={() => handleAddToQueue(apt.appointmentId)}
                            className="px-2.5 py-1 text-3xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 rounded transition-colors"
                          >
                            Add to Queue
                          </button>
                        )}

                        {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                          <button
                            type="button"
                            onClick={() => setCancelModalAppointment(apt)}
                            className="px-2 py-1 text-3xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors"
                            title="Cancel appointment"
                          >
                            Cancel
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedDetailAppointment(apt)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                          title="View appointment details"
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
                    <Calendar className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                    <p className="font-semibold text-slate-700 text-xs">No appointments found</p>
                    <p className="text-2xs text-slate-400 mt-0.5">
                      No appointments matching the selected view or search query.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards View (Clean Mobile Layout) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt) => (
              <div key={apt.appointmentId} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-teal-900 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                    {apt.tokenNumber}
                  </span>
                  <AppointmentStatusBadge status={apt.status} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{apt.patientName}</h3>
                  <span className="font-mono text-3xs text-slate-400">{apt.patientId}</span>
                </div>

                <div className="text-2xs text-slate-600 space-y-0.5">
                  <div>
                    <span className="font-semibold text-slate-700">Doctor: </span>
                    {apt.doctorName}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Time: </span>
                    {apt.date} at {apt.time} ({(apt.mode || 'IN_PERSON').replace('_', ' ')})
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-slate-700">Reason: </span>
                    {apt.reason}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedDetailAppointment(apt)}
                    className="text-2xs font-semibold text-teal-700 hover:text-teal-900"
                  >
                    View Details
                  </button>

                  <div className="flex items-center space-x-1.5">
                    {apt.status === 'SCHEDULED' && (
                      <button
                        type="button"
                        onClick={() => handleCheckIn(apt.appointmentId)}
                        className="px-2.5 py-1 text-3xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded"
                      >
                        Check In
                      </button>
                    )}

                    {apt.status === 'CHECKED_IN' && (
                      <button
                        type="button"
                        onClick={() => handleAddToQueue(apt.appointmentId)}
                        className="px-2.5 py-1 text-3xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 rounded"
                      >
                        Add to Queue
                      </button>
                    )}

                    {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                      <button
                        type="button"
                        onClick={() => setCancelModalAppointment(apt)}
                        className="px-2 py-1 text-3xs font-semibold text-rose-600"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400">
              <Calendar className="w-8 h-8 mx-auto mb-1 text-slate-300" />
              <p className="font-semibold text-slate-700 text-xs">No appointments found</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AppointmentDetailModal
        appointment={selectedDetailAppointment}
        isOpen={Boolean(selectedDetailAppointment)}
        onClose={() => setSelectedDetailAppointment(null)}
        onCheckIn={handleCheckIn}
        onAddToQueue={handleAddToQueue}
        onOpenCancel={(apt) => {
          setSelectedDetailAppointment(null);
          setCancelModalAppointment(apt);
        }}
      />

      {/* Cancel Modal */}
      {cancelModalAppointment && (
        <CancelAppointmentModal
          appointment={cancelModalAppointment}
          isOpen={Boolean(cancelModalAppointment)}
          onClose={() => setCancelModalAppointment(null)}
          onConfirm={handleConfirmCancel}
        />
      )}

      {/* Book Appointment Drawer */}
      <BookAppointmentDrawer
        isOpen={isBookDrawerOpen}
        onClose={() => setIsBookDrawerOpen(false)}
        onSuccess={(newApt) => {
          setAppointments((prev) => [newApt, ...prev]);
          showNotification(`Booked appointment ${newApt.tokenNumber} for ${newApt.patientName}.`);
        }}
      />
    </div>
  );
};
