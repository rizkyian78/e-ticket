import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Props {
  currentStep: 'method' | 'payment' | 'processing' | 'result';
}

export function Breadcrumb({ currentStep }: Props) {
  const steps = [
    { id: 'method', label: 'Payment Method', active: currentStep === 'method' },
    { id: 'payment', label: 'Payment Details', active: currentStep === 'payment' },
    { id: 'processing', label: 'Processing', active: currentStep === 'processing' },
    { id: 'result', label: 'Complete', active: currentStep === 'result' }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.active);
  };

  return (
    <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 overflow-x-auto">
        {steps.map((step, index) => {
          const isActive = step.active;
          const isPast = index < getCurrentStepIndex();
          const isFuture = index > getCurrentStepIndex();

          return (
            <React.Fragment key={step.id}>
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600 flex-shrink-0" />
              )}
              <div
                className={`
                  flex items-center gap-2 whitespace-nowrap
                  ${isActive ? 'text-[#635BFF] font-medium' : ''}
                  ${isPast ? 'text-gray-900 dark:text-gray-100' : ''}
                  ${isFuture ? 'text-gray-400 dark:text-gray-600' : ''}
                `}
              >
                <div
                  className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                    ${isActive ? 'bg-[#635BFF] text-white' : ''}
                    ${isPast ? 'bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-500' : ''}
                    ${isFuture ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600' : ''}
                  `}
                >
                  {isPast ? '✓' : index + 1}
                </div>
                <span className="text-sm">{step.label}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
