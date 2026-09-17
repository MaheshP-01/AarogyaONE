import React from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Activity,
  CheckCircle2,
  ListOrdered,
  Ban,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Appointment } from '../../../types/appointment';
import { AppointmentStatusBadge } from './AppointmentStatusBadge';

interface Props {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onCheckIn: (appointmentId: string) => Promise<void>;
  onAddToQueue: (appointmentId: string) => Promise<void>;
  onOpenCancel: (appointment: Appointment) => void;
}

export const AppointmentDetailModal: React.FC<Props> = ({
  appointment,
  isOpen,
  onClose,
  onCheckIn,
  onAddToQueue,
  onOpenCancel,
}) => {
  if (!isOpen || !appointment) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {appointment.tokenNumber}
            </span>
            <h3 id="detail-modal-title" className="text-sm font-bold text-slate-900">
              Appointment Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          {/* Status Bar */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="text-3xs font-semibold text-slate-400 uppercase tracking-wider block">
                Appointment ID
              </span>
              <span className="font-mono font-bold text-slate-800 text-xs">
                {appointment.appointmentId}
              </span>
            </div>
            <div>
              <span className="text-3xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Current Status
              </span>
              <AppointmentStatusBadge status={appointment.status} />
            </div>
          </div>

          {/* Patient Details */}
          <div className="p-3.5 border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" /> Patient Information
              </span>
              <Link
                to={`/doctor/patients/${appointment.patientId}`}
                className="text-2xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-0.5"
              >
                Patient Record <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-2xs text-slate-400 block">Name</span>
                <span className="font-bold text-slate-900 text-xs">{appointment.patientName}</span>
              </div>
              <div>
                <span className="text-2xs text-slate-400 block">Patient ID</span>
                <span className="font-mono text-teal-800 text-xs">{appointment.patientId}</span>
              </div>
            </div>
          </div>

          {/* Doctor & Facility */}
          <div className="p-3.5 border border-slate-200 rounded-lg space-y-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> Consultation Target
            </span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-2xs text-slate-400 block">Doctor</span>
                <span className="font-semibold text-slate-900 text-xs">{appointment.doctorName}</span>
              </div>
              <div>
                <span className="text-2xs text-slate-400 block">Facility</span>
                <span className="text-slate-700 text-xs">{appointment.facilityName}</span>
              </div>
            </div>
          </div>

          {/* Date, Time & Mode */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" /> Date
              </span>
              <span className="font-bold text-slate-900 text-xs mt-1 block">
                {appointment.date}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" /> Time
              </span>
              <span className="font-bold text-slate-900 text-xs mt-1 block">
                {appointment.time}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block">
                Mode
              </span>
              <span className="font-bold text-slate-900 text-xs mt-1 block">
                {(appointment.mode || 'IN_PERSON').replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Reason for visit */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Reason for Consultation
            </span>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {appointment.reason}
            </p>
          </div>

          {/* Linked Triage Assessment */}
          {appointment.triageId && (
            <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-lg space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-bold text-teal-900 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-700" /> Attached Triage Assessment
                </span>
                <span className="font-mono text-3xs font-semibold text-teal-800 bg-white px-1.5 py-0.5 rounded border border-teal-200">
                  {appointment.triageId}
                </span>
              </div>
              <p className="text-2xs text-teal-800 leading-relaxed">
                A formal digital triage intake was performed and linked to this appointment session.
              </p>
            </div>
          )}

          {/* Cancellation Info if cancelled */}
          {appointment.status === 'CANCELLED' && appointment.cancelReason && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-1">
              <span className="text-2xs font-bold text-rose-900 block">Cancellation Reason</span>
              <p className="text-xs text-rose-800">{appointment.cancelReason}</p>
            </div>
          )}

          {/* Meta Info */}
          <div className="text-3xs text-slate-400 flex items-center justify-between pt-1">
            <span>Created by: {appointment.healthWorkerId}</span>
            <span>Created: {new Date(appointment.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
              <button
                type="button"
                onClick={() => onOpenCancel(appointment)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 hover:bg-rose-50 rounded-md border border-rose-200 transition-colors"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel Appointment</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {appointment.status === 'SCHEDULED' && (
              <button
                type="button"
                onClick={() => onCheckIn(appointment.appointmentId)}
                className="inline-flex items-center space-x-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-2xs transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Check In</span>
              </button>
            )}

            {appointment.status === 'CHECKED_IN' && (
              <button
                type="button"
                onClick={() => onAddToQueue(appointment.appointmentId)}
                className="inline-flex items-center space-x-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md shadow-2xs transition-colors"
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Add to Queue</span>
              </button>
            )}

            {appointment.status === 'WAITING' && (
              <Link
                to="/doctor/queue"
                className="inline-flex items-center space-x-1 px-3.5 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-300 rounded-md shadow-2xs transition-colors"
              >
                <span>View in Doctor Queue</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
