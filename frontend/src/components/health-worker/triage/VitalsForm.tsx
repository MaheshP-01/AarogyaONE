import React from 'react';
import { VitalsData, VitalsErrors, VITALS_RANGES } from '../../../types/triage';

interface VitalsFormProps {
  vitals: VitalsData;
  errors: VitalsErrors;
  onChange: (field: keyof VitalsData, value: string) => void;
}

interface VitalFieldConfig {
  key: keyof VitalsData;
  label: string;
  unit: string;
  placeholder: string;
  inputMode: 'numeric' | 'decimal';
  hint?: string;
}

const VITAL_FIELDS: VitalFieldConfig[] = [
  {
    key: 'temperature',
    label: 'Temperature',
    unit: '°F',
    placeholder: 'e.g. 98.6',
    inputMode: 'decimal',
    hint: 'Normal: 97.0–99.5°F',
  },
  {
    key: 'heartRate',
    label: 'Heart Rate',
    unit: 'bpm',
    placeholder: 'e.g. 72',
    inputMode: 'numeric',
    hint: 'Normal: 60–100 bpm',
  },
  {
    key: 'spo2',
    label: 'Oxygen Saturation (SpO2)',
    unit: '%',
    placeholder: 'e.g. 98',
    inputMode: 'numeric',
    hint: 'Normal: ≥95%',
  },
  {
    key: 'respiratoryRate',
    label: 'Respiratory Rate',
    unit: 'breaths/min',
    placeholder: 'e.g. 16',
    inputMode: 'numeric',
    hint: 'Normal: 12–20 breaths/min',
  },
];

export const VitalsForm: React.FC<VitalsFormProps> = ({
  vitals,
  errors,
  onChange,
}) => {
  return (
    <div className="space-y-5">
      <p className="text-2xs text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
        Enter available vitals. Not all vitals are required — record only those that have been measured.
        Leave unavailable measurements blank.
      </p>

      {/* Individual vital fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {VITAL_FIELDS.map((field) => {
          const error = errors[field.key];
          return (
            <div key={field.key}>
              <label
                htmlFor={`vital-${field.key}`}
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                {field.label}
                <span className="ml-1.5 text-2xs font-normal text-slate-400">(optional)</span>
              </label>
              <div className="relative">
                <input
                  id={`vital-${field.key}`}
                  type="text"
                  inputMode={field.inputMode}
                  value={vitals[field.key]}
                  onChange={(e) => {
                    // Allow only numbers and decimal point
                    const raw = e.target.value;
                    if (raw === '' || /^[0-9]*\.?[0-9]*$/.test(raw)) {
                      onChange(field.key, raw);
                    }
                  }}
                  placeholder={field.placeholder}
                  className={`w-full pl-3 pr-16 py-2.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 transition-colors ${
                    error
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                      : 'border-slate-300 focus:border-teal-600 focus:ring-teal-200'
                  }`}
                  aria-describedby={`vital-${field.key}-error`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-2xs text-slate-400 font-medium pointer-events-none">
                  {field.unit}
                </span>
              </div>
              {error ? (
                <p
                  id={`vital-${field.key}-error`}
                  className="mt-0.5 text-2xs text-red-600"
                  role="alert"
                >
                  {error}
                </p>
              ) : field.hint ? (
                <p className="mt-0.5 text-2xs text-slate-400">{field.hint}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Blood Pressure — special two-field layout */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Blood Pressure
          <span className="ml-1.5 text-2xs font-normal text-slate-400">(optional)</span>
        </label>
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              id="vital-bpSystolic"
              type="text"
              inputMode="numeric"
              value={vitals.bpSystolic}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === '' || /^[0-9]*$/.test(raw)) onChange('bpSystolic', raw);
              }}
              placeholder="Systolic"
              className={`w-full px-3 py-2.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 transition-colors ${
                errors.bpSystolic
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                  : 'border-slate-300 focus:border-teal-600 focus:ring-teal-200'
              }`}
            />
          </div>
          <span className="text-slate-400 font-bold text-sm">/</span>
          <div className="flex-1 relative">
            <input
              id="vital-bpDiastolic"
              type="text"
              inputMode="numeric"
              value={vitals.bpDiastolic}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === '' || /^[0-9]*$/.test(raw)) onChange('bpDiastolic', raw);
              }}
              placeholder="Diastolic"
              className={`w-full px-3 py-2.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 transition-colors ${
                errors.bpDiastolic
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                  : 'border-slate-300 focus:border-teal-600 focus:ring-teal-200'
              }`}
            />
          </div>
          <span className="text-2xs text-slate-400 font-medium whitespace-nowrap">mmHg</span>
        </div>
        {(errors.bpSystolic || errors.bpDiastolic) && (
          <p className="mt-0.5 text-2xs text-red-600" role="alert">
            {errors.bpSystolic || errors.bpDiastolic}
          </p>
        )}
        <p className="mt-0.5 text-2xs text-slate-400">Normal: below 120/80 mmHg</p>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Vitals validation helper — exported for use in parent
// ---------------------------------------------------------------------------
export const validateVitals = (vitals: VitalsData): VitalsErrors => {
  const errors: VitalsErrors = {};
  const { temperature, heartRate, bpSystolic, bpDiastolic, spo2, respiratoryRate } = vitals;

  if (temperature) {
    const val = parseFloat(temperature);
    const { min, max } = VITALS_RANGES.temperature;
    if (isNaN(val) || val < min || val > max) {
      errors.temperature = `Enter a valid temperature (${min}–${max}°F).`;
    }
  }
  if (heartRate) {
    const val = parseInt(heartRate, 10);
    const { min, max } = VITALS_RANGES.heartRate;
    if (isNaN(val) || val < min || val > max) {
      errors.heartRate = `Enter a valid heart rate (${min}–${max} bpm).`;
    }
  }
  if (bpSystolic) {
    const val = parseInt(bpSystolic, 10);
    const { min, max } = VITALS_RANGES.bpSystolic;
    if (isNaN(val) || val < min || val > max) {
      errors.bpSystolic = `Enter a valid systolic BP (${min}–${max} mmHg).`;
    }
  }
  if (bpDiastolic) {
    const val = parseInt(bpDiastolic, 10);
    const { min, max } = VITALS_RANGES.bpDiastolic;
    if (isNaN(val) || val < min || val > max) {
      errors.bpDiastolic = `Enter a valid diastolic BP (${min}–${max} mmHg).`;
    }
  }
  if (spo2) {
    const val = parseFloat(spo2);
    const { min, max } = VITALS_RANGES.spo2;
    if (isNaN(val) || val < min || val > max) {
      errors.spo2 = `Enter a valid SpO2 value (${min}–${max}%).`;
    }
  }
  if (respiratoryRate) {
    const val = parseInt(respiratoryRate, 10);
    const { min, max } = VITALS_RANGES.respiratoryRate;
    if (isNaN(val) || val < min || val > max) {
      errors.respiratoryRate = `Enter a valid respiratory rate (${min}–${max} breaths/min).`;
    }
  }

  return errors;
};
