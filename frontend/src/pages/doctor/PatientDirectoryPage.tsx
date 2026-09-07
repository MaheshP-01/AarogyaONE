import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Play,
  UserPlus,
  Filter,
} from 'lucide-react';
import { doctorMockService } from '../../services/doctorMockService';

export const PatientDirectoryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');

  const allPatients = doctorMockService.getAllPatients();

  const filteredPatients = allPatients.filter((p) => {
    const matchesSearch =
      !searchQuery.trim() ||
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.taluka.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDistrict = districtFilter === 'all' || p.district.toLowerCase() === districtFilter.toLowerCase();

    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-700" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Patient Registry & Longitudinal Records
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centralized index of rural patients registered across primary health centers, sub-centers, and mobile camps.
          </p>
        </div>

        <Link
          to="/register"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, Patient ID, phone, or village..."
            className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-blue-600 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">District:</span>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="text-xs p-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:outline-none"
          >
            <option value="all">All Districts (Dhule, Nandurbar, Jalgaon)</option>
            <option value="dhule">Dhule</option>
            <option value="nandurbar">Nandurbar</option>
            <option value="jalgaon">Jalgaon</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Age / Sex</th>
                <th className="py-3 px-4">Village / District</th>
                <th className="py-3 px-4">Known Allergies</th>
                <th className="py-3 px-4">Existing Conditions</th>
                <th className="py-3 px-4">ABHA ID / Contact</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((pat) => (
                  <tr key={pat.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-blue-700">
                      {pat.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <Link
                        to={`/doctor/patients/${pat.id}`}
                        className="hover:text-blue-700 hover:underline"
                      >
                        {pat.fullName}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {pat.age}y, {pat.gender}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{pat.village}</div>
                      <div className="text-[11px] text-slate-400">{pat.taluka}, {pat.district}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {pat.allergies && pat.allergies.length > 0 && !pat.allergies.includes('None reported') ? (
                        <div className="flex flex-wrap gap-1">
                          {pat.allergies.map((a) => (
                            <span
                              key={a}
                              className="px-1.5 py-0.5 bg-red-50 text-red-800 border border-red-200 rounded text-[10px] font-semibold"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None reported</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {pat.existingConditions && pat.existingConditions.length > 0 && !pat.existingConditions.includes('None reported') ? (
                        <span className="text-slate-800 font-medium text-[11px]">
                          {pat.existingConditions.join(', ')}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">None reported</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      <div>{pat.abhaId || 'Pending ABHA'}</div>
                      <div className="text-slate-400">{pat.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      <Link
                        to={`/doctor/patients/${pat.id}`}
                        className="px-2.5 py-1 text-slate-700 hover:text-blue-700 border border-slate-200 rounded text-xs font-medium hover:bg-slate-50 transition-colors"
                      >
                        View Chart
                      </Link>
                      <Link
                        to={`/doctor/consultation/${pat.id}`}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-blue-700 text-white rounded text-xs font-medium hover:bg-blue-800 shadow-2xs transition-colors"
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
                    <p className="text-sm font-medium text-slate-600">No patients matched search criteria</p>
                    <p className="text-xs mt-1">Try refining your name, phone, or village search query.</p>
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
