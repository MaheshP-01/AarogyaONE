import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ListOrdered,
  Search,
  Play,
  Clock,
} from 'lucide-react';
import { doctorMockService } from '../../services/doctorMockService';
import { StatusBadge } from '../../components/doctor/StatusBadge';

export const DoctorQueuePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'urgent' | 'waiting' | 'in_consultation' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const queueItems = doctorMockService.getQueue(activeTab);

  const filteredItems = queueItems.filter((q) => {
    if (!searchQuery.trim()) return true;
    const s = searchQuery.toLowerCase();
    return (
      q.patientName.toLowerCase().includes(s) ||
      q.patientId.toLowerCase().includes(s) ||
      q.tokenNumber.toLowerCase().includes(s) ||
      q.chiefComplaint.toLowerCase().includes(s)
    );
  });

  const allCount = doctorMockService.getQueue('all').length;
  const urgentCount = doctorMockService.getQueue('urgent').length;
  const waitingCount = doctorMockService.getQueue('waiting').length;
  const inConsultCount = doctorMockService.getQueue('in_consultation').length;
  const completedCount = doctorMockService.getQueue('completed').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ListOrdered className="w-5 h-5 text-blue-700" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Clinical Consultation Queue
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time intake stream of patients triaged by frontline health workers and awaiting physician evaluation.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter queue by patient or token..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-blue-600 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-2xs flex items-center space-x-2 overflow-x-auto text-xs">
        {[
          { id: 'all', label: 'All Cases', count: allCount },
          { id: 'urgent', label: 'Urgent Attention', count: urgentCount, highlight: true },
          { id: 'waiting', label: 'Waiting in Room', count: waitingCount },
          { id: 'in_consultation', label: 'In Consultation', count: inConsultCount },
          { id: 'completed', label: 'Completed Today', count: completedCount },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-md font-medium whitespace-nowrap transition-colors ${
                isSelected
                  ? tab.highlight
                    ? 'bg-red-700 text-white font-bold shadow-xs'
                    : 'bg-slate-900 text-white font-semibold shadow-xs'
                  : tab.highlight && tab.count > 0
                  ? 'text-red-700 hover:bg-red-50 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : tab.highlight && tab.count > 0
                    ? 'bg-red-100 text-red-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Queue Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Patient Details</th>
                <th className="py-3 px-4">Symptoms / Reason</th>
                <th className="py-3 px-4">Vitals Summary</th>
                <th className="py-3 px-4">AI Triage / Risk</th>
                <th className="py-3 px-4">Wait Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/90 transition-colors ${
                      item.riskLevel === 'HIGH' ? 'bg-red-50/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {item.tokenNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/doctor/patients/${item.patientId}`}
                        className="font-bold text-slate-900 hover:text-blue-700 hover:underline block"
                      >
                        {item.patientName}
                      </Link>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {item.age}y, {item.gender} • {item.patientId}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 max-w-xs truncate">
                        {item.chiefComplaint}
                      </div>
                      <div className="text-[11px] text-slate-400">Duration: {item.symptomsDuration}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                      <div>
                        SpO2: <strong className={parseInt(item.vitals.spo2) < 94 ? 'text-red-700 font-bold' : ''}>{item.vitals.spo2}</strong>
                      </div>
                      <div className="text-slate-400">
                        BP: {item.vitals.bloodPressure} • HR: {item.vitals.heartRate}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 space-y-1">
                      <StatusBadge type="risk" value={item.riskLevel} />
                      <div className="text-[10px] text-slate-400">
                        Priority: <strong className="text-slate-700">{item.priority}</strong>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.waitingTime}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge type="queue" value={item.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      <Link
                        to={`/doctor/patients/${item.patientId}`}
                        className="px-2.5 py-1 text-slate-700 hover:text-blue-700 border border-slate-200 rounded text-xs font-medium hover:bg-slate-50 transition-colors"
                      >
                        Review
                      </Link>
                      <Link
                        to={`/doctor/consultation/${item.id}`}
                        className={`inline-flex items-center space-x-1 px-3 py-1 text-white rounded text-xs font-semibold shadow-2xs transition-colors ${
                          item.riskLevel === 'HIGH'
                            ? 'bg-red-700 hover:bg-red-800'
                            : 'bg-blue-700 hover:bg-blue-800'
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Consult</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium text-slate-600">Queue is clear</p>
                    <p className="text-xs mt-1">No patients currently in this queue view.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
