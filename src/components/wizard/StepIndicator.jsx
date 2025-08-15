import { Check } from 'lucide-react'

export function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center space-x-4">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep
        const isCurrent = step.id === currentStep
        const isUpcoming = step.id > currentStep

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${isCompleted 
                    ? 'bg-brand-blue text-white' 
                    : isCurrent 
                    ? 'bg-brand-blue text-white ring-4 ring-blue-100' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="ml-3 min-w-0">
                <p className={`text-sm font-medium ${isCurrent ? 'text-brand-blue' : 'text-gray-500'}`}>
                  {step.name}
                </p>
                <p className="text-xs text-gray-400">{step.title}</p>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={`
                  w-8 h-0.5 mx-4
                  ${step.id < currentStep ? 'bg-brand-blue' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}