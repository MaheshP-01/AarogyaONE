import React from 'react';
import { Check } from 'lucide-react';
import { RegistrationStep } from '../../types/registration';
import { TranslationDictionary } from '../../utils/translations';

interface RegistrationStepperProps {
  currentStep: RegistrationStep;
  onStepClick?: (step: 1 | 2 | 3 | 4) => void;
  t: TranslationDictionary;
}

interface StepMeta {
  number: 1 | 2 | 3 | 4;
  id: string;
  title: string;
}

export const RegistrationStepper: React.FC<RegistrationStepperProps> = ({
  currentStep,
  onStepClick,
  t,
}) => {
  if (currentStep === 'success') {
    return null;
  }

  const steps: StepMeta[] = [
    { number: 1, id: 'basic', title: t.step1Title },
    { number: 2, id: 'contact', title: t.step2Title },
    { number: 3, id: 'health', title: t.step3Title },
    { number: 4, id: 'review', title: t.step4Title },
  ];

  const currentStepNum = typeof currentStep === 'number' ? currentStep : 4;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg p-3 sm:p-4 mb-6 shadow-2xs">
      {/* Mobile view: Simple text and progress bar */}
      <div className="md:hidden">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
          <span className="text-teal-800 font-bold">
            Step {currentStepNum} of 4
          </span>
          <span className="text-slate-600 truncate max-w-[200px]">
            {steps[currentStepNum - 1].title}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-700 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStepNum / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop & Tablet view: Horizontal stepper */}
      <nav aria-label="Registration Progress" className="hidden md:block">
        <ol className="flex items-center w-full">
          {steps.map((step, index) => {
            const isCompleted = step.number < currentStepNum;
            const isCurrent = step.number === currentStepNum;
            const isClickable = isCompleted && onStepClick;

            return (
              <li
                key={step.number}
                className={`flex items-center ${
                  index < steps.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  onClick={() => {
                    if (isClickable) onStepClick(step.number);
                  }}
                  className={`flex items-center space-x-2.5 py-1 px-2 rounded-md transition-colors ${
                    isClickable ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'
                  }`}
                  role={isClickable ? 'button' : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                      onStepClick(step.number);
                    }
                  }}
                >
                  {/* Step indicator circle */}
                  <span
                    className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 transition-colors ${
                      isCompleted
                        ? 'bg-teal-700 text-white'
                        : isCurrent
                        ? 'border-2 border-teal-700 text-teal-800 bg-teal-50/60'
                        : 'border border-slate-300 text-slate-400 bg-slate-50'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : `0${step.number}`}
                  </span>

                  {/* Step label */}
                  <span
                    className={`text-xs font-medium tracking-tight whitespace-nowrap ${
                      isCurrent
                        ? 'text-teal-900 font-bold'
                        : isCompleted
                        ? 'text-slate-700 hover:text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Connecting horizontal divider between steps */}
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] mx-3 transition-colors ${
                      step.number < currentStepNum ? 'bg-teal-700' : 'bg-slate-200'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};
