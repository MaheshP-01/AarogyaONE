import React from 'react';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
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
      dosage: '500 mg',
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

  const hasAllergies = allergies.length > 0 && !allergies.includes('None reported');

  return (
    <div className="bg-white border border-slate-200 rounded-md p-4 space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Physician e-Prescription
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Prescriptions require manual clinician confirmation. AI does not generate medical prescriptions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddMedicine}
          className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500" />
          <span>Add Medicine</span>
        </button>
      </div>

      {/* Known Allergy Alert if present */}
      {hasAllergies && (
        <div className="flex items-center space-x-2 p-2 bg-amber-50/70 border border-amber-200 rounded text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Patient Allergy Alert:</strong> Verify contraindications for{' '}
            <span className="font-semibold">{allergies.join(', ')}</span> before prescribing.
          </span>
        </div>
      )}

      {/* Tabular Prescription List with Inline Editing */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
            <tr>
              <th className="py-2 px-2.5">Medicine Name</th>
              <th className="py-2 px-2 w-24">Dosage</th>
              <th className="py-2 px-2 w-24">Frequency</th>
              <th className="py-2 px-2 w-24">Duration</th>
              <th className="py-2 px-2.5">Instructions</th>
              <th className="py-2 px-2 w-10 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {prescriptions.length > 0 ? (
              prescriptions.map((rx) => (
                <tr key={rx.id} className="hover:bg-slate-50/50">
                  <td className="py-1.5 px-2">
                    <input
                      type="text"
                      value={rx.medicineName}
                      onChange={(e) => handleUpdateItem(rx.id, 'medicineName', e.target.value)}
                      placeholder="e.g. Paracetamol"
                      className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded text-slate-900 font-medium focus:outline-none focus:border-slate-500"
                    />
                  </td>
                  <td className="py-1.5 px-1.5">
                    <input
                      type="text"
                      value={rx.dosage}
                      onChange={(e) => handleUpdateItem(rx.id, 'dosage', e.target.value)}
                      placeholder="500 mg"
                      className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-slate-500 font-mono"
                    />
                  </td>
                  <td className="py-1.5 px-1.5">
                    <input
                      type="text"
                      value={rx.frequency}
                      onChange={(e) => handleUpdateItem(rx.id, 'frequency', e.target.value)}
                      placeholder="1-0-1"
                      className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-slate-500 font-mono"
                    />
                  </td>
                  <td className="py-1.5 px-1.5">
                    <input
                      type="text"
                      value={rx.duration}
                      onChange={(e) => handleUpdateItem(rx.id, 'duration', e.target.value)}
                      placeholder="3 days"
                      className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-slate-500"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <input
                      type="text"
                      value={rx.instructions}
                      onChange={(e) => handleUpdateItem(rx.id, 'instructions', e.target.value)}
                      placeholder="After meals"
                      className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-slate-500"
                    />
                  </td>
                  <td className="py-1.5 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(rx.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Remove medicine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-400 text-xs">
                  No medications added yet. Click "+ Add Medicine" to record treatment orders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
