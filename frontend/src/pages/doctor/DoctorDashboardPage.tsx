import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Search, AlertTriangle, Play, Eye, Clock, UserCheck } from 'lucide-react';
import { LanguageCode } from '../../types';
import { TranslationDictionary } from '../../utils/translations';
import { doctorMockService } from '../../services/doctorMockService';
import { ClinicalPatient } from '../../types/doctor';
import { KpiSummary } from '../../components/doctor/KpiSummary';
import { StatusBadge } from '../../components/doctor/StatusBadge';

interface LayoutContext {
  currentLanguage: LanguageCode;
  t: TranslationDictionary;
  isOnline: boolean;
}

export const DoctorDashboardPage: React.FC = () => {
  const { t } = useOutletContext<LayoutContext>();
  const navigate = useNavigate();

  const [queueTab, setQueueTab] = useState<'all' | 'urgent' | 'waiting' | 'in_consultation' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ClinicalPatient[]>([]);

  const kpis = doctorMockService.getKpiSummary();
  const queueItems = doctorMockService.getQueue(queueTab);
  const urgentCases = doctorMockService.getQueue('urgent');

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.trim().length >= 2) {
      setSearchResults(doctorMockService.searchPatients(q));
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Greeting */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {t.doctorGreeting}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.doctorGreetingSub}
          </p>
        </div>

        {/* Global Instant Patient Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search patient by name, ID or village..."
            className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900 placeholder:text-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />

          {/* Quick Search Dropdown Preview */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-40 max-h-64 overflow-y-auto">
              <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                Found {searchResults.length} Match(es)
              </span>
              <div className="space-y-1">
                {searchResults.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      navigate(`/doctor/patients/${p.id}`);
                    }}
                    className="p-2 rounded hover:bg-slate-50 cursor-pointer flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{p.fullName}</span>
                      <span className="text-3xs text-slate-500 font-mono">
                        {p.id} • {p.age} yrs, {p.gender} • {p.village}
                      </span>
                    </div>
                    <span className="text-3xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      View Record →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPI Metric Blocks */}
      <KpiSummary
        summary={kpis}
        onFilterUrgent={() => setQueueTab('urgent')}
        onFilterAll={() => setQueueTab('all')}
        t={t}
      />

      {/* Urgent Cases Requiring Review */}
      <div className="bg-white border border-red-200/80 rounded-lg shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-red-100 bg-red-50/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              {t.urgentCasesHeading}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-3xs font-bold bg-red-600 text-white">
              {urgentCases.length} Immediate
            </span>
          </div>
          <span className="text-3xs text-slate-500 font-medium">
            Standardized clinical priority triage
          </span>
        </div>

        {urgentCases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-3xs">
                <tr>
                  <th className="px-4 py-2.5">Priority</th>
                  <th className="px-4 py-2.5">Patient Name</th>
                  <th className="px-4 py-2.5">Age/Gender</th>
                  <th className="px-4 py-2.5">Location</th>
                  <th className="px-4 py-2.5">Reported Clinical Reason</th>
                  <th className="px-4 py-2.5">Waiting Time</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {urgentCases.map((item) => (
                  <tr key={item.id} className="hover:bg-red-50/20 transition-colors">
                    <td className="px-4 py-3">
                      <StatusBadge type="priority" value={item.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/doctor/patients/${item.patientId}`}
                        className="font-bold text-slate-900 hover:text-blue-700 block"
                      >
                        {item.patientName}
                      </Link>
                      <span className="text-3xs font-mono text-slate-400">{item.patientId}</span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {item.age} yrs • {item.gender}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.village}, {item.district}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-800 font-medium">{item.chiefComplaint}</span>
                      <span className="text-3xs text-red-600 font-semibold block mt-0.5">
                        SpO2 {item.vitals.spo2} • Temp {item.vitals.temperature}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">
                      <span className="inline-flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.waitingTime}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <Link
                          to={`/doctor/patients/${item.patientId}`}
                          className="px-2.5 py-1 text-xs font-semibold rounded border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
                        >
                          {t.reviewCaseBtn}
                        </Link>
                        <Link
                          to={`/doctor/consultation/${item.id}`}
                          className="px-3 py-1 text-xs font-semibold rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors flex items-center space-x-1 shadow-2xs"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{t.startConsultBtn}</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500">
            <span>No urgent cases require your attention at this moment.</span>
          </div>
        )}
      </div>

      {/* Consultation Queue Section */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              {t.allQueueHeading}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Patients triaged by frontline health workers across Shirpur & Dhule network
            </p>
          </div>

          {/* Queue Filter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setQueueTab('all')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                queueTab === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({doctorMockService.getQueue('all').length})
            </button>
            <button
              type="button"
              onClick={() => setQueueTab('urgent')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                queueTab === 'urgent' ? 'bg-white text-red-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-red-700'
              }`}
            >
              Urgent ({urgentCases.length})
            </button>
            <button
              type="button"
              onClick={() => setQueueTab('waiting')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                queueTab === 'waiting' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Waiting ({doctorMockService.getQueue('waiting').length})
            </button>
            <button
              type="button"
              onClick={() => setQueueTab('in_consultation')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                queueTab === 'in_consultation' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              In Consult ({doctorMockService.getQueue('in_consultation').length})
            </button>
            <button
              type="button"
              onClick={() => setQueueTab('completed')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                queueTab === 'completed' ? 'bg-white text-emerald-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Completed ({doctorMockService.getQueue('completed').length})
            </button>
          </div>
        </div>

        {queueItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-3xs">
                <tr>
                  <th className="px-4 py-3">Token</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Age / Gender</th>
                  <th className="px-4 py-3">Reason for Visit</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Waiting Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {queueItems.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {q.tokenNumber}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/doctor/patients/${q.patientId}`}
                        className="font-bold text-slate-900 hover:text-blue-700 block"
                      >
                        {q.patientName}
                      </Link>
                      <span className="text-3xs text-slate-400 font-mono">
                        {q.patientId} • {q.village}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {q.age} yrs • {q.gender}
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate" title={q.chiefComplaint}>
                      <span className="font-medium text-slate-800">{q.chiefComplaint}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge type="priority" value={q.priority} />
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">
                      {q.waitingTime}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge type="queue" value={q.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <Link
                          to={`/doctor/patients/${q.patientId}`}
                          className="px-2.5 py-1 text-xs font-medium rounded border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
                          title="View clinical workspace"
                        >
                          <Eye className="w-3.5 h-3.5 inline mr-1" />
                          View
                        </Link>
                        {q.status !== 'completed' && (
                          <Link
                            to={`/doctor/consultation/${q.id}`}
                            className="px-3 py-1 text-xs font-semibold rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-2xs"
                          >
                            Consult
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            <UserCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No patients in this queue category</p>
            <p className="text-3xs text-slate-400 mt-0.5">All patients have been attended or are assigned elsewhere.</p>
          </div>
        )}
      </div>
    </div>
  );
};
