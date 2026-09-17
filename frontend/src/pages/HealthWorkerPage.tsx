import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  UserPlus,
  Users,
  Activity,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Wifi,
  WifiOff,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { TranslationDictionary } from '../utils/translations';
import { RegisteredPatientResult } from '../types/registration';

interface LayoutContext {
  currentLanguage: LanguageCode;
  t: TranslationDictionary;
  isOnline: boolean;
}

export const HealthWorkerPage: React.FC = () => {
  const { t, isOnline } = useOutletContext<LayoutContext>();

  const [patients, setPatients] = useState<RegisteredPatientResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load registered patients from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ruralcare_local_patients');
      if (stored) {
        setPatients(JSON.parse(stored));
      }
    } catch (err) {
      console.warn('Error reading local patients', err);
    }
  }, []);

  const filteredPatients = patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Dashboard Top Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {t.healthWorkerRole}
            </h1>
            <span className="px-2 py-0.5 rounded text-2xs font-bold uppercase bg-teal-50 text-teal-800 border border-teal-200">
              Station Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.phcName} • Shirpur Sub-Center</span>
          </p>
        </div>

        {/* Primary CTA: Register New Patient */}
        <Link
          to="/patients/register"
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ {t.navRegistration}</span>
        </Link>
      </div>

      {/* Operational Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-3.5">
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium text-slate-600">Total Patients</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {patients.length > 0 ? patients.length : 124}
          </div>
          <span className="text-2xs text-slate-400 mt-1 block">In village registry</span>
        </div>

        <Link
          to="/health-worker/triage"
          className="p-4 bg-white border border-slate-200 hover:border-amber-400 rounded-lg shadow-2xs transition-all cursor-pointer block"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium text-slate-600">Pending Triage</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">7</div>
          <span className="text-2xs text-amber-600 mt-1 block font-medium hover:underline">
            Awaiting assessment →
          </span>
        </Link>

        <Link
          to="/health-worker/appointments"
          className="p-4 bg-white border border-slate-200 hover:border-teal-400 rounded-lg shadow-2xs transition-all cursor-pointer block"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium text-slate-600">Appointments</span>
            <Calendar className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">12</div>
          <span className="text-2xs text-teal-700 mt-1 block font-semibold hover:underline">
            Manage consultations →
          </span>
        </Link>

        <Link
          to="/health-worker/follow-ups"
          className="p-4 bg-white border border-slate-200 hover:border-teal-400 rounded-lg shadow-2xs transition-all cursor-pointer block"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium text-slate-600">Follow-ups</span>
            <Clock className="w-4 h-4 text-indigo-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">8</div>
          <span className="text-2xs text-indigo-700 mt-1 block font-semibold hover:underline">
            Due & upcoming →
          </span>
        </Link>

        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium text-slate-600">Sync Status</span>
            {isOnline ? (
              <Wifi className="w-4 h-4 text-emerald-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-amber-600" />
            )}
          </div>
          <div className="text-sm font-bold text-slate-900 mt-1">
            {isOnline ? 'Online (Synced)' : 'Offline Queue'}
          </div>
          <span className="text-2xs text-slate-400 mt-1 block">
            {isOnline ? 'Direct to PHC registry' : 'Cached in browser storage'}
          </span>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/patients/register"
          className="group p-5 bg-white border border-slate-200 hover:border-teal-400 rounded-lg transition-all shadow-2xs cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-3 group-hover:bg-teal-100 transition-colors">
            <UserPlus className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-900">
            {t.navRegistration}
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Register a new patient into the longitudinal health records system.
          </p>
          <span className="mt-3 inline-flex items-center text-xs font-semibold text-teal-700 group-hover:text-teal-900">
            Open Registration Form <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>

        <Link
          to="/health-worker/triage"
          className="group p-5 bg-white border border-slate-200 hover:border-teal-400 rounded-lg transition-all shadow-2xs cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-3 group-hover:bg-teal-100 transition-colors">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-900">
            Digital Triage
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            AI decision-support for symptom summarization, red-flags, and risk scoring.
          </p>
          <span className="mt-3 inline-flex items-center text-xs font-semibold text-teal-700 group-hover:text-teal-900">
            Start Triage <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>

        <Link
          to="/health-worker/appointments"
          className="group p-5 bg-white border border-slate-200 hover:border-teal-400 rounded-lg transition-all shadow-2xs cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-3 group-hover:bg-teal-100 transition-colors">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-900">
            Appointments
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Schedule consultations, manage slot bookings and check patients into queue.
          </p>
          <span className="mt-3 inline-flex items-center text-xs font-semibold text-teal-700 group-hover:text-teal-900">
            Manage Appointments <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>

        <Link
          to="/health-worker/follow-ups"
          className="group p-5 bg-white border border-slate-200 hover:border-teal-400 rounded-lg transition-all shadow-2xs cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-3 group-hover:bg-teal-100 transition-colors">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-900">
            Follow-ups
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Track post-consultation care, record home visits and reschedule missed calls.
          </p>
          <span className="mt-3 inline-flex items-center text-xs font-semibold text-teal-700 group-hover:text-teal-900">
            View Follow-ups <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>
      </div>

      {/* Patient Registry Section */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Recently Registered Patients
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Patients enrolled from Shirpur, Sakri, and surrounding settlements
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID or village..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-teal-600 focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {filteredPatients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-3xs">
                <tr>
                  <th className="px-4 py-3">Patient ID</th>
                  <th className="px-4 py-3">Name & Demographics</th>
                  <th className="px-4 py-3">Village / Taluka</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Sync Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPatients.map((pt) => (
                  <tr key={pt.patientId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-teal-800">
                      {pt.patientId}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900 block">{pt.fullName}</span>
                      <span className="text-2xs text-slate-400">
                        {pt.age} yrs • {pt.gender}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span>{pt.village}</span>, <span className="text-slate-500">{pt.taluka}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">
                      +91 {pt.mobileNumber}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{pt.registeredAt}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-3xs font-semibold ${
                          pt.syncStatus === 'synced'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            pt.syncStatus === 'synced' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span>{pt.syncStatus === 'synced' ? 'Synced' : 'Offline Stored'}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-700">No patient records registered yet</p>
            <p className="text-2xs text-slate-400 mt-0.5">
              Click the button below to register your first rural patient into the system.
            </p>
            <Link
              to="/patients/register"
              className="mt-4 inline-flex items-center space-x-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md shadow-2xs transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t.navRegistration}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
