import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Send,
  Plus,
  AlertOctagon,
  Building2,
  Search,
  ArrowRight,
} from 'lucide-react';
import { doctorMockService } from '../../services/doctorMockService';
import { ReferralRecord, ClinicalPatient } from '../../types/doctor';
import { StatusBadge } from '../../components/doctor/StatusBadge';
import { ReferralModal } from '../../components/doctor/ReferralModal';

export const ReferralDashboardPage: React.FC = () => {
  const location = useLocation();
  const [referrals, setReferrals] = useState<ReferralRecord[]>(doctorMockService.getReferrals());
  const [activeTab, setActiveTab] = useState<'all' | 'Pending' | 'Accepted' | 'In Transit' | 'Completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Referral creation modal state
  // If user navigated to /doctor/referrals/new, auto-open modal
  const [isModalOpen, setIsModalOpen] = useState(location.pathname.includes('/new'));
  const [selectedPatient, setSelectedPatient] = useState<ClinicalPatient>(
    doctorMockService.getPatient('RC-2026-004821') || doctorMockService.getAllPatients()[0]
  );

  const allPatients = doctorMockService.getAllPatients();

  const handleCreateSuccess = () => {
    setReferrals(doctorMockService.getReferrals());
  };

  const filteredReferrals = referrals.filter((r) => {
    const matchesTab = activeTab === 'all' || r.status === activeTab;
    const matchesSearch =
      !searchQuery ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.destinationFacility.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requiredSpecialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = referrals.filter((r) => r.status === 'Pending').length;
  const acceptedCount = referrals.filter((r) => r.status === 'Accepted').length;
  const inTransitCount = referrals.filter((r) => r.status === 'In Transit').length;
  const completedCount = referrals.filter((r) => r.status === 'Completed').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Send className="w-5 h-5 text-blue-700" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Referrals Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track patient transfers from rural primary health centers to secondary Sub-District and tertiary District Civil Hospitals.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Referral</span>
        </button>
      </div>

      {/* Emergency Escalation Banner */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start space-x-3">
          <AlertOctagon className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-950 uppercase tracking-wide">
              Urgent Medical Attention & Emergency Escalation
            </span>
            <p className="text-amber-800 mt-0.5">
              Requires immediate clinical escalation? Create an emergency referral to dispatch priority notification to District Civil Hospital casualty desk.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedPatient(doctorMockService.getPatient('RC-2026-004821') || allPatients[0]);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-medium shrink-0 transition-colors"
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Create Emergency Referral</span>
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setActiveTab('Pending')}
          className={`p-4 rounded-lg border transition-all cursor-pointer ${
            activeTab === 'Pending' ? 'bg-amber-50 border-amber-300 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending Acceptance</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{pendingCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Awaiting casualty triage</div>
        </div>

        <div
          onClick={() => setActiveTab('Accepted')}
          className={`p-4 rounded-lg border transition-all cursor-pointer ${
            activeTab === 'Accepted' ? 'bg-blue-50 border-blue-300 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Accepted by Center</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{acceptedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Bed / specialist allocated</div>
        </div>

        <div
          onClick={() => setActiveTab('In Transit')}
          className={`p-4 rounded-lg border transition-all cursor-pointer ${
            activeTab === 'In Transit' ? 'bg-purple-50 border-purple-300 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">In Transit</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">{inTransitCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Patient traveling to hospital</div>
        </div>

        <div
          onClick={() => setActiveTab('Completed')}
          className={`p-4 rounded-lg border transition-all cursor-pointer ${
            activeTab === 'Completed' ? 'bg-emerald-50 border-emerald-300 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Completed / Admitted</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{completedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Discharged or in ward</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto text-xs pb-1 sm:pb-0">
          {(['all', 'Pending', 'Accepted', 'In Transit', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'all' ? 'All Referrals' : tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, patient, hospital..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-blue-600 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Referral ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Destination Facility</th>
                <th className="py-3 px-4">Specialty</th>
                <th className="py-3 px-4">Created At</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReferrals.length > 0 ? (
                filteredReferrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-blue-700">
                      {ref.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/doctor/patients/${ref.patientId}`}
                        className="font-bold text-slate-900 hover:text-blue-700 hover:underline"
                      >
                        {ref.patientName}
                      </Link>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {ref.patientAge}y/{ref.patientGender} • {ref.patientId}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge type="priority" value={ref.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-xs">{ref.destinationFacility}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{ref.facilityType}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {ref.requiredSpecialty}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {ref.createdAt}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge type="referral" value={ref.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/doctor/patients/${ref.patientId}`}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-700 hover:text-blue-900"
                      >
                        <span>View Chart</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium text-slate-600">No referrals found</p>
                    <p className="text-xs mt-1">All hospital referrals are currently up to date.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Referral Creation Modal */}
      <ReferralModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={selectedPatient}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};
