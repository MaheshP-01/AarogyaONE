import React from 'react';
import { Plus, Trash2, Pill, ShieldAlert } from 'lucide-react';
import { PrescriptionItem } from '../../types/doctor';

interface PrescriptionFormProps {
  prescriptions: PrescriptionItem[];
  onChange: (items: PrescriptionItem[]) => void;
  allergies?: string[];
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  prescriptions,
  onChange,
  allergies = [],
}) => {
  const handleAddMedicine = () => {
    const newItem: PrescriptionItem = {
      id: `rx-${Date.now()}`,
      medicineName: '',
      dosage: '',
      frequency: '1-0-1',
      duration: '3 days',
      instructions: 'After meals',
    };
    onChange([...prescriptions, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof PrescriptionItem, val: string) => {
    const updated = prescriptions.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    onChange(updated);
  };

  const handleRemoveItem = (id: string) => {
    onChange(prescriptions.filter((item) => item.id !== id));
  };

  // Common quick templates
  const addQuickTemplate = (name: string, dose: string, freq: string, dur: string, inst: string) => {
    const newItem: PrescriptionItem = {
      id: `rx-${Date.now()}`,
      medicineName: name,
      dosage: dose,
      frequency: freq,
      duration: dur,
      instructions: inst,
    };
    onChange([...prescriptions, newItem]);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Pill className="w-4 h-4 text-teal-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Physician e-Prescription
          </h3>
          <span className="text-3xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            Manual Verification Required
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddMedicine}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Medicine</span>
        </button>
      </div>

      {/* Allergy alert safety banner */}
      {allergies.length > 0 && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-md text-2xs text-red-800 flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
          <span>
            <strong>Patient Allergy Alert:</strong> Known sensitivities to {allergies.join(', ')}. Avoid prescribing cross-reactive compounds.
          </span>
        </div>
      )}

      {/* Quick Prescription Presets for Rural PHC */}
      <div className="flex flex-wrap items-center gap-1.5 text-2xs">
        <span className="text-slate-400 font-semibold uppercase mr-1">Quick Select:</span>
        <button
          type="button"
          onClick={() => addQuickTemplate('Paracetamol', '500 mg', '1-0-1', '3 days', 'After meals')}
          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
        >
          + Paracetamol 500mg
        </button>
        <button
          type="button"
          onClick={() => addQuickTemplate('Amoxicillin', '500 mg', '1-1-1', '5 days', 'After meals')}
          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
        >
          + Amoxicillin 500mg
        </button>
        <button
          type="button"
          onClick={() => addQuickTemplate('Salbutamol Inhaler', '100 mcg', '2 puffs TDS', '7 days', 'Inhalation SOS')}
          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
        >
          + Salbutamol Inhaler
        </button>
        <button
          type="button"
          onClick={() => addQuickTemplate('Oral Rehydration Salts (ORS)', '1 sachet in 1L water', 'Frequent sips', '3 days', 'With clean water')}
          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
        >
          + ORS Rehydration
        </button>
      </div>

      {/* Prescription Rows Table */}
      {prescriptions.length > 0 ? (
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-3xs">
              <tr>
                <th className="px-3 py-2.5 w-1/3">Medicine Name</th>
                <th className="px-3 py-2.5">Dosage</th>
                <th className="px-3 py-2.5">Frequency</th>
                <th className="px-3 py-2.5">Duration</th>
                <th className="px-3 py-2.5">Instructions</th>
                <th className="px-2 py-2.5 text-center w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {prescriptions.map((rx) => (
                <tr key={rx.id} className="hover:bg-slate-50/50">
                  <td className="p-2">
                    <input
                      type="text"
                      value={rx.medicineName}
                      onChange={(e) => handleUpdateItem(rx.id, 'medicineName', e.target.value)}
                      placeholder="e.g. Paracetamol"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-teal-600 focus:outline-none"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={rx.dosage}
                      onChange={(e) => handleUpdateItem(rx.id, 'dosage', e.target.value)}
                      placeholder="e.g. 500 mg"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-teal-600 focus:outline-none"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={rx.frequency}
                      onChange={(e) => handleUpdateItem(rx.id, 'frequency', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-teal-600 focus:outline-none"
                    >
                      <option value="1-0-1">1-0-1 (Morning & Night)</option>
                      <option value="1-1-1">1-1-1 (Thrice daily)</option>
                      <option value="1-0-0">1-0-0 (Morning only)</option>
                      <option value="0-0-1">0-0-1 (Night only)</option>
                      <option value="SOS">SOS (When needed)</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={rx.duration}
                      onChange={(e) => handleUpdateItem(rx.id, 'duration', e.target.value)}
                      placeholder="e.g. 3 days"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-teal-600 focus:outline-none"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={rx.instructions}
                      onChange={(e) => handleUpdateItem(rx.id, 'instructions', e.target.value)}
                      placeholder="e.g. After meals"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-teal-600 focus:outline-none"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(rx.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove medicine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500">
          <span>No medicines prescribed yet. Click "+ Add Medicine" to prescribe treatment.</span>
        </div>
      )}
    </div>
  );
};
