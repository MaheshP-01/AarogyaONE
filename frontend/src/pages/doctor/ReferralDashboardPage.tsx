import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Send,
  Plus,
  AlertTriangle,
  Building2,
  Search,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { doctorMockService } from '../../services/doctorMockService';
import { ReferralRecord, ClinicalPatient } from '../../types/doctor';
import { StatusBadge } from '../../components/doctor/StatusBadge';
import { ReferralDrawer } from '../../components/doctor/ReferralDrawer';

export const ReferralDashboardPage: React.FC = () => {
  const location = useLocation();
  const [referrals, setReferrals] = useState<ReferralRecord[]>(doctorMockService.getReferrals());
  const [activeTab, setActiveTab] = useState<'all' | 'Pending' | 'Accepted' | 'In Progress' | 'Completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Referral creation drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(location.pathname.includes('/new'));
  const [selectedPatient, setSelectedPatient] = useState<ClinicalPatient>(
    doctorMockService.getPatient('RC-2026-004821') || doctorMockService.getAllPatients()[0]
  );
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  const allPatients = doctorMockService.getAllPatients();

  const handleCreateSuccess = () => {
    setReferrals(doctorMockService.getReferrals());
  };

  const openDrawerForNew = (emergency = false) => {
    setIsEmergencyMode(emergency);
    setSelectedPatient(doctorMockService.getPatient('RC-2026-004821') || allPatients[0]);
    setIsDrawerOpen(true);
  };

  const filteredReferrals = referrals.filter((r) => {
    // Treat 'In Transit' as 'In Progress' for tab matching if needed
    const normalizedStatus = r.status === 'In Transit' ? 'In Progress' : r.status;
    const matchesTab = activeTab === 'all' || normalizedStatus === activeTab;
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
  const inProgressCount = referrals.filter((r) => r.status === 'In Transit' || r.status === 'In Progress').length;
  const completedCount = referrals.filter((r) => r.status === 'Completed').length;

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Send className="w-4 h-4 text-sky-700" />
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
              Referral Management
            </h1>
          </div>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Track and coordinate secondary and tertiary facility transfers across Dhule, Nandurbar, and Jalgaon districts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => openDrawerForNew(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 rounded-md text-xs font-semibold transition-colors shrink-0"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
            <span>Emergency Transfer</span>
          </button>

          <button
            type="button"
            onClick={() => openDrawerForNew(false)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Referral</span>
          </button>
        </div>
      </div>

      {/* Metric counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('Pending')}
          className={`p-3.5 rounded-lg border text-left transition-all ${
            activeTab === 'Pending'
              ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300'
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending</div>
          <div className="text-xl font-bold text-amber-800 mt-1 font-mono">{pendingCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Awaiting casualty triage</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('Accepted')}
          className={`p-3.5 rounded-lg border text-left transition-all ${
            activeTab === 'Accepted'
              ? 'bg-sky-50/70 border-sky-300 ring-1 ring-sky-300'
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Accepted</div>
          <div className="text-xl font-bold text-sky-800 mt-1 font-mono">{acceptedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Bed / specialist allocated</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('In Progress')}
          className={`p-3.5 rounded-lg border text-left transition-all ${
            activeTab === 'In Progress'
              ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-300'
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">In Progress</div>
          <div className="text-xl font-bold text-indigo-800 mt-1 font-mono">{inProgressCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Patient in transit / ambulance</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('Completed')}
          className={`p-3.5 rounded-lg border text-left transition-all ${
            activeTab === 'Completed'
              ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Completed</div>
          <div className="text-xl font-bold text-emerald-800 mt-1 font-mono">{completedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Admitted or completed</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto text-xs">
          {(['all', 'Pending', 'Accepted', 'In Progress', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
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
            placeholder="Filter by ID, patient, hospital..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-sky-600 focus:outline-none transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-white border border-slate-200/90 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3.5">Referral ID</th>
                <th className="py-2.5 px-3.5">Patient</th>
                <th className="py-2.5 px-3.5">Priority</th>
                <th className="py-2.5 px-3.5">Destination</th>
                <th className="py-2.5 px-3.5">Created</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReferrals.length > 0 ? (
                filteredReferrals.map((ref) => {
                  const displayStatus = ref.status === 'In Transit' ? 'In Progress' : ref.status;
                  return (
                    <tr key={ref.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 font-mono text-[11px] font-semibold text-sky-800">
                        {ref.id}
                      </td>
                      <td className="py-3 px-3.5">
                        <Link
                          to={`/doctor/patients/${ref.patientId}`}
                          className="font-semibold text-slate-900 hover:text-sky-700 hover:underline inline-block"
                        >
                          {ref.patientName}
                        </Link>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {ref.patientAge}y • {ref.patientGender} • {ref.patientId}
                        </div>
                      </td>
                      <td className="py-3 px-3.5">
                        <StatusBadge type="priority" value={ref.priority} />
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="font-medium text-slate-800 flex items-center space-x-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-xs">{ref.destinationFacility}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {ref.facilityType} • {ref.requiredSpecialty}
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-slate-500 font-mono text-[11px]">
                        {ref.createdAt}
                      </td>
                      <td className="py-3 px-3.5">
                        <StatusBadge type="referral" value={displayStatus} />
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <Link
                          to={`/doctor/patients/${ref.patientId}`}
                          className="inline-flex items-center space-x-1 text-xs font-medium text-sky-700 hover:text-sky-900"
                        >
                          <span>View Record</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-xs font-medium text-slate-600">No referrals found</p>
                    <p className="text-[11px] mt-0.5">All patient referrals in this category are up to date.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Referral Creation Slide-Over Drawer */}
      <ReferralDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        patient={selectedPatient}
        onSuccess={handleCreateSuccess}
        isEmergencyMode={isEmergencyMode}
      />
    </div>
  );
};

