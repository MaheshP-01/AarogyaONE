import React from 'react';
import { AlertCircle, Phone } from 'lucide-react';

interface PhoneInputProps {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  helpText?: string;
  disabled?: boolean;
  className?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  id,
  label,
  required = false,
  value,
  onChange,
  onBlur,
  placeholder = '9876543210',
  error,
  helpText,
  disabled = false,
  className = '',
}) => {
  const hasError = Boolean(error);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, max 10
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange(raw);
  };

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

      <div className="relative flex rounded-lg shadow-2xs">
        {/* Country code prefix */}
        <div className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-sm font-medium select-none">
          <span className="mr-1">🇮🇳</span>
          <span>+91</span>
        </div>

        <input
          id={id}
          name={id}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          value={value}
          onChange={handleInputChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full min-h-[42px] px-3.5 py-2 text-sm text-slate-900 bg-white border rounded-r-lg transition-colors placeholder:text-slate-400 focus:outline-none ${
            hasError
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-slate-300 hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
          } ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${id}-error` : helpText ? `${id}-help` : undefined}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
          <Phone className="w-4 h-4" />
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
