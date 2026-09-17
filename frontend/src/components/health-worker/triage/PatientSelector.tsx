import React, { useState, useEffect, useRef } from 'react';
import { Search, User, MapPin, ChevronRight, X } from 'lucide-react';
import { RegisteredPatientResult } from '../../../types/registration';
import { searchLocalPatients, getAllLocalPatients } from '../../../services/triageService';

interface PatientSelectorProps {
  onSelect: (patient: RegisteredPatientResult) => void;
}

export const PatientSelector: React.FC<PatientSelectorProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RegisteredPatientResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load all patients initially
  useEffect(() => {
    const all = getAllLocalPatients();
    setResults(all);
  }, []);

  useEffect(() => {
    if (query.length === 0) {
      setResults(getAllLocalPatients());
    } else {
      setResults(searchLocalPatients(query));
    }
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (patient: RegisteredPatientResult) => {
    setShowDropdown(false);
    setQuery('');
    onSelect(patient);
  };

  const hasPatients = getAllLocalPatients().length > 0;

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Search Patient *
        </label>
        <div className="relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search by patient name, ID, or phone number"
              className="w-full pl-9 pr-8 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600/20 transition-colors"
              aria-label="Search patients"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-72 overflow-y-auto"
            >
              {results.length === 0 ? (
                <div className="p-4 text-center">
                  {!hasPatients ? (
                    <div>
                      <User className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                      <p className="text-xs text-slate-600 font-medium">No patients registered</p>
                      <p className="text-2xs text-slate-400 mt-0.5">
                        Register patients first before conducting triage.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-slate-600 font-medium">No results for "{query}"</p>
                      <p className="text-2xs text-slate-400 mt-0.5">
                        Try searching by name, patient ID, or phone number.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <ul>
                  {results.map((patient) => (
                    <li key={patient.patientId}>
                      <button
                        type="button"
                        onClick={() => handleSelect(patient)}
                        className="w-full text-left px-4 py-3 hover:bg-teal-50 hover:border-l-2 hover:border-l-teal-500 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold text-slate-900 truncate">
                              {patient.fullName}
                            </span>
                            <span className="text-2xs font-mono text-teal-700 font-bold flex-shrink-0">
                              {patient.patientId}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className="text-2xs text-slate-500">
                              {patient.age} yrs • {patient.gender}
                            </span>
                            <span className="text-2xs text-slate-400">•</span>
                            <span className="text-2xs text-slate-500 flex items-center space-x-0.5">
                              <MapPin className="w-2.5 h-2.5" />
                              <span>{patient.village}</span>
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 flex-shrink-0 ml-2" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {!hasPatients && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          No patients are registered in this station. Please register patients before conducting triage.
        </div>
      )}
    </div>
  );
};
