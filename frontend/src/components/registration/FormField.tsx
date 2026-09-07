import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  type?: 'text' | 'number' | 'date' | 'email';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  helpText?: string;
  autoComplete?: string;
  min?: number | string;
  max?: number | string;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  disabled?: boolean;
  className?: string;
  rightElement?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  required = false,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helpText,
  autoComplete,
  min,
  max,
  inputMode,
  disabled = false,
  className = '',
  rightElement,
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
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          min={min}
          max={max}
          inputMode={inputMode}
          disabled={disabled}
          className={`w-full min-h-[42px] px-3.5 py-2 text-sm text-slate-900 bg-white border rounded-lg transition-colors placeholder:text-slate-400 focus:outline-none ${
            hasError
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-slate-300 hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
          } ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''} ${
            rightElement ? 'pr-11' : ''
          }`}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${id}-error` : helpText ? `${id}-help` : undefined}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {rightElement}
          </div>
        )}
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
