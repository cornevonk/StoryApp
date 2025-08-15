import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProject } from '../../contexts/ProjectContext'
import { StepIndicator } from './StepIndicator'
import { TemplateSelection } from './TemplateSelection'
import { ContextualDataInput } from './ContextualDataInput'
import { AIProcessing } from './AIProcessing'
import { FinalReview } from './FinalReview'

const STEPS = [
  { id: 1, name: 'Templates', title: 'Kies een sjabloon' },
  { id: 2, name: 'Data', title: 'Voeg contextuele data toe' },
  { id: 3, name: 'AI', title: 'AI past sjabloon aan' },
  { id: 4, name: 'Review', title: 'Bekijk resultaat' },
  { id: 5, name: 'Editor', title: 'Ga naar editor' }
]

export function WizardFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()
  const { selectedTemplate, contextualData, createProject } = useProject()

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToEditor = () => {
    // Create project with current data
    createProject({
      name: 'Nieuw Project',
      template: selectedTemplate,
      contextualData: contextualData
    })
    navigate('/editor')
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <TemplateSelection onNext={nextStep} />
      case 2:
        return <ContextualDataInput onNext={nextStep} onPrev={prevStep} />
      case 3:
        return <AIProcessing onNext={nextStep} onPrev={prevStep} />
      case 4:
        return <FinalReview onNext={goToEditor} onPrev={prevStep} />
      default:
        return <TemplateSelection onNext={nextStep} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Page Template Configurator</h1>
              <p className="text-gray-600 mt-1">Configureer pagina sjablonen voor uw Canvas applicatie</p>
            </div>
            <StepIndicator steps={STEPS} currentStep={currentStep} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Stap {currentStep} van {STEPS.length}
            </div>
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Vorige
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}