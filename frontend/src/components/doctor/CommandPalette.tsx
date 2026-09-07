import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, ArrowRight, X, Clock, AlertTriangle, Stethoscope } from 'lucide-react';
import { doctorMockService } from '../../services/doctorMockService';
import { ClinicalPatient } from '../../types/doctor';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ClinicalPatient[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults(doctorMockService.getAllPatients().slice(0, 5));
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Update search results
  useEffect(() => {
    if (!isOpen) return;
    if (query.trim().length > 0) {
      setResults(doctorMockService.searchPatients(query).slice(0, 8));
      setSelectedIndex(0);
    } else {
      setResults(doctorMockService.getAllPatients().slice(0, 5));
    }
  }, [query, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        handleSelectPatient(results[selectedIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelectPatient = (patientId: string) => {
    onClose();
    navigate(`/doctor/patients/${patientId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 drawer-backdrop">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-xl bg-white rounded-lg border border-slate-200 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Input bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient by name, ID or phone..."
            className="w-full text-sm bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-1.5 divide-y divide-slate-50">
          <div className="px-3 py-1.5 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            {query.trim() ? `Search Results (${results.length})` : 'Recent Clinical Patients'}
          </div>

          {results.length > 0 ? (
            results.map((patient, index) => {
              const isSelected = index === selectedIndex;
              const hasAllergies = patient.allergies && !patient.allergies.includes('None reported');
              return (
                <div
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient.id)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`px-3 py-2.5 rounded flex items-center justify-between cursor-pointer transition-colors text-xs ${
                    isSelected ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-7 h-7 rounded bg-slate-200 text-slate-700 flex items-center justify-center font-medium text-xs shrink-0">
                      {patient.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-900 truncate">
                          {patient.fullName}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400">
                          {patient.id}
                        </span>
                        {hasAllergies && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 text-[10px] font-medium border border-amber-200">
                            Allergies
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {patient.age}y, {patient.gender} • {patient.village}, {patient.taluka}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 shrink-0 ml-3">
                    <span className="font-mono">{patient.phone}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-700' : 'text-slate-300'}`} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No patients found matching "{query}"
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↵</kbd>
              <span>to open record</span>
            </span>
          </div>
          <span className="text-slate-400">Public Healthcare Access</span>
        </div>
      </div>
    </div>
  );
};
