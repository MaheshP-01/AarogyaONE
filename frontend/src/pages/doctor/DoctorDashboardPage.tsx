import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Eye, Clock } from 'lucide-react';
import { doctorMockService } from '../../services/doctorMockService';
import { KpiSummary } from '../../components/doctor/KpiSummary';
import { StatusBadge } from '../../components/doctor/StatusBadge';

export const DoctorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [queueTab, setQueueTab] = useState<'all' | 'urgent' | 'waiting' | 'in_consultation' | 'completed'>('all');

  const kpis = doctorMockService.getKpiSummary();
  const queueItems = doctorMockService.getQueue(queueTab);
  const urgentCases = doctorMockService.getQueue('urgent');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Greeting */}
      <div className="bg-white border border-slate-200 rounded-md p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Good morning, Dr. Anjali
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Here’s what needs your attention today.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
          <span>District Civil Hospital, Dhule</span>
          <span>•</span>
          <span>Shift: Morning Clinic</span>
        </div>
      </div>

      {/* KPI Metric Blocks */}
      <KpiSummary
        summary={kpis}
        onFilterUrgent={() => setQueueTab('urgent')}
        onFilterAll={() => setQueueTab('all')}
      />

      {/* Main Section: Needs Attention (Urgent Cases) */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
        <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Needs Attention
            </h2>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-red-100 text-red-800">
              {urgentCases.length} Urgent
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Cases flagged with elevated clinical risk
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-white border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              <tr>
                <th className="py-2.5 px-4">Priority</th>
                <th className="py-2.5 px-4">Patient</th>
                <th className="py-2.5 px-4">Age</th>
                <th className="py-2.5 px-4">Reason / Symptoms</th>
                <th className="py-2.5 px-4">Waiting Time</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {urgentCases.length > 0 ? (
                urgentCases.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <StatusBadge type="priority" value={item.priority} />
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/doctor/patients/${item.patientId}`}
                        className="font-bold text-slate-900 hover:text-blue-700 hover:underline"
                      >
                        {item.patientName}
                      </Link>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.patientId} • {item.village}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {item.age}
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium">
                      {item.chiefComplaint}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">
                      {item.waitingTime}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge type="queue" value={item.status} />
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        to={`/doctor/patients/${item.patientId}`}
                        className="px-2.5 py-1 text-slate-700 hover:text-slate-900 border border-slate-200 rounded text-xs font-medium hover:bg-slate-50 transition-colors inline-block"
                      >
                        Review
                      </Link>
                      <Link
                        to={`/doctor/consultation/${item.id}`}
                        className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-medium transition-colors inline-flex items-center space-x-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Consult</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No urgent cases require your attention.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Secondary Section: Consultation Queue */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
        {/* Tabs Bar */}
        <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Today's Consultation Queue
          </h2>

          <div className="flex items-center space-x-1 overflow-x-auto text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'urgent', label: 'Urgent' },
              { id: 'waiting', label: 'Waiting' },
              { id: 'in_consultation', label: 'In Consultation' },
              { id: 'completed', label: 'Completed' },
            ].map((tab) => {
              const isSelected = queueTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setQueueTab(tab.id as any)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'bg-white text-slate-900 font-semibold border border-slate-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-white border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              <tr>
                <th className="py-2.5 px-4">Token</th>
                <th className="py-2.5 px-4">Patient</th>
                <th className="py-2.5 px-4">Age</th>
                <th className="py-2.5 px-4">Reason / Symptoms</th>
                <th className="py-2.5 px-4">Priority</th>
                <th className="py-2.5 px-4">Waiting</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queueItems.length > 0 ? (
                queueItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {item.tokenNumber}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/doctor/patients/${item.patientId}`}
                        className="font-bold text-slate-900 hover:text-blue-700 hover:underline"
                      >
                        {item.patientName}
                      </Link>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.patientId} • {item.village}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {item.age}
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium">
                      {item.chiefComplaint}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge type="priority" value={item.priority} />
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">
                      {item.waitingTime}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge type="queue" value={item.status} />
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        to={`/doctor/patients/${item.patientId}`}
                        className="px-2.5 py-1 text-slate-700 hover:text-slate-900 border border-slate-200 rounded text-xs font-medium hover:bg-slate-50 transition-colors inline-block"
                      >
                        Review
                      </Link>
                      <Link
                        to={`/doctor/consultation/${item.id}`}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors inline-flex items-center space-x-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Start Consultation</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No patients currently in this queue view.
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
