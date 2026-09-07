import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helpText?: string;
  disabled?: boolean;
  className?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  required = false,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  error,
  helpText,
  disabled = false,
  className = '',
}) => {
  const hasError = Boolean(error);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1.5">
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
        >
          {label} {required && <span className="text-red-500 text-sm font-bold">*</span>}
        </label>
      </div>

      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`w-full min-h-[42px] pl-3.5 pr-10 py-2 text-sm text-slate-900 bg-white border rounded-lg appearance-none transition-colors focus:outline-none ${
            hasError
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-slate-300 hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
          } ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${id}-error` : helpText ? `${id}-help` : undefined}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {hasError ? (
        <p
          id={`${id}-error`}
          className="mt-1.5 flex items-center text-xs font-medium text-red-600 space-x-1"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
          <span>{error}</span>
        </p>
      ) : helpText ? (
        <p id={`${id}-help`} className="mt-1.5 text-xs text-slate-500">
          {helpText}
        </p>
      ) : null}
    </div>
  );
};
