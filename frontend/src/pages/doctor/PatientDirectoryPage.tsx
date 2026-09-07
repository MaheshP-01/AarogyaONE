import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Play,
  UserPlus,
  Filter,
  ArrowRight,
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
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-sky-700" />
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
              Patient Registry & Longitudinal Records
            </h1>
          </div>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Centralized index of registered rural patients across PHCs, sub-centers, and mobile camps in Maharashtra.
          </p>
        </div>

        <Link
          to="/register"
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Register New Patient</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name, ID, phone, or village..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-sky-600 focus:outline-none transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">District:</span>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-800 focus:bg-white focus:outline-none transition-colors"
          >
            <option value="all">All Districts (Dhule, Nandurbar, Jalgaon)</option>
            <option value="dhule">Dhule District</option>
            <option value="nandurbar">Nandurbar District</option>
            <option value="jalgaon">Jalgaon District</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white border border-slate-200/90 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3.5">Patient ID</th>
                <th className="py-2.5 px-3.5">Full Name</th>
                <th className="py-2.5 px-3.5">Age / Sex</th>
                <th className="py-2.5 px-3.5">Village / District</th>
                <th className="py-2.5 px-3.5">Known Allergies</th>
                <th className="py-2.5 px-3.5">Existing Conditions</th>
                <th className="py-2.5 px-3.5">ABHA ID / Contact</th>
                <th className="py-2.5 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((pat) => (
                  <tr key={pat.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-medium text-sky-800 text-[11px]">
                      {pat.id}
                    </td>
                    <td className="py-3 px-3.5 font-semibold text-slate-900">
                      <Link
                        to={`/doctor/patients/${pat.id}`}
                        className="hover:text-sky-700 hover:underline inline-block"
                      >
                        {pat.fullName}
                      </Link>
                    </td>
                    <td className="py-3 px-3.5 text-slate-700">
                      {pat.age}y, {pat.gender}
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-medium text-slate-800">{pat.village}</div>
                      <div className="text-[11px] text-slate-400">{pat.taluka}, {pat.district}</div>
                    </td>
                    <td className="py-3 px-3.5">
                      {pat.allergies && pat.allergies.length > 0 && !pat.allergies.includes('None reported') ? (
                        <div className="flex flex-wrap gap-1">
                          {pat.allergies.map((a) => (
                            <span
                              key={a}
                              className="px-1.5 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded text-[10px] font-semibold"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None reported</span>
                      )}
                    </td>
                    <td className="py-3 px-3.5">
                      {pat.existingConditions && pat.existingConditions.length > 0 && !pat.existingConditions.includes('None reported') ? (
                        <span className="text-slate-800 font-medium text-[11px]">
                          {pat.existingConditions.join(', ')}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">None reported</span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-[11px] text-slate-600">
                      <div>{pat.abhaId || 'Pending ABHA'}</div>
                      <div className="text-slate-400">{pat.phone}</div>
                    </td>
                    <td className="py-3 px-3.5 text-right space-x-2 whitespace-nowrap">
                      <Link
                        to={`/doctor/patients/${pat.id}`}
                        className="px-2.5 py-1 text-slate-700 hover:text-slate-900 border border-slate-200 rounded text-xs font-medium hover:bg-slate-50 transition-colors"
                      >
                        View Chart
                      </Link>
                      <Link
                        to={`/doctor/consultation/${pat.id}`}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
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
                    <p className="text-xs font-medium text-slate-600">No patients matched search criteria</p>
                    <p className="text-[11px] mt-0.5">Try refining your name, phone, or village search query.</p>
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

