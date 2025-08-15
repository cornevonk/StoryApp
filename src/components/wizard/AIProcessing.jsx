import { useState, useEffect } from 'react'
import { Bot, Sparkles, CheckCircle } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'

const PROCESSING_STEPS = [
  'Analyseren van uw data...',
  'Genereren van relevante content...',
  'Optimaliseren van layout...',
  'Aanpassen van stijlen...',
  'Finaliseren van document...'
]

export function AIProcessing({ onNext, onPrev }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const { selectedTemplate, contextualData } = useProject()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < PROCESSING_STEPS.length - 1) {
          return prev + 1
        } else {
          setIsComplete(true)
          clearInterval(timer)
          return prev
        }
      })
    }, 1500) // Each step takes 1.5 seconds

    return () => clearInterval(timer)
  }, [])

  const handleNext = () => {
    if (isComplete) {
      onNext()
    }
  }

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-brand-blue to-brand-emerald rounded-full flex items-center justify-center mx-auto mb-6">
          {isComplete ? (
            <CheckCircle className="w-12 h-12 text-white" />
          ) : (
            <Bot className="w-12 h-12 text-white animate-pulse" />
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isComplete ? 'Pagina sjabloon is geconfigureerd!' : 'Pagina sjabloon wordt geconfigureerd...'}
        </h2>
        
        <p className="text-gray-600">
          {isComplete 
            ? 'Uw pagina sjabloon is succesvol geconfigureerd met uw data'
            : 'Even geduld terwijl uw pagina sjabloon wordt aangepast'
          }
        </p>
      </div>

      {/* Processing Steps */}
      <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
        <div className="space-y-4">
          {PROCESSING_STEPS.map((step, index) => {
            const isCompleted = index < currentStep || isComplete
            const isCurrent = index === currentStep && !isComplete
            
            return (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${isCompleted 
                      ? 'bg-green-100 text-green-700' 
                      : isCurrent 
                      ? 'bg-brand-blue text-white animate-pulse' 
                      : 'bg-gray-100 text-gray-400'
                    }
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`
                    ${isCompleted ? 'text-gray-900' : isCurrent ? 'text-brand-blue font-medium' : 'text-gray-500'}
                  `}>
                    {step}
                  </span>
                </div>
                
                {isCurrent && (
                  <Sparkles className="w-5 h-5 text-brand-blue animate-spin" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Preview Info */}
      {isComplete && (
        <div className="bg-green-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Wat is er aangepast?</h3>
          <div className="text-sm text-green-700 space-y-1">
            <p>✅ Content gegenereerd op basis van uw input</p>
            <p>✅ Layout geoptimaliseerd voor {selectedTemplate?.name}</p>
            <p>✅ Kleuren aangepast aan uw stijl</p>
            {contextualData?.text && <p>✅ Tekst geïntegreerd in relevante secties</p>}
            {contextualData?.files?.length > 0 && (
              <p>✅ {contextualData.files.length} bestand(en) verwerkt</p>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          disabled={!isComplete}
          className={`
            px-6 py-3 border border-gray-300 rounded-lg transition-colors
            ${isComplete 
              ? 'hover:bg-gray-50 text-gray-700' 
              : 'text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Vorige stap
        </button>
        
        <button
          onClick={handleNext}
          disabled={!isComplete}
          className={`
            px-8 py-3 rounded-lg transition-all
            ${isComplete
              ? 'bg-brand-blue text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Bekijk resultaat
        </button>
      </div>
    </div>
  )
}