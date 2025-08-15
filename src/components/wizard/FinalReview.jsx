import { useState } from 'react'
import { Eye, Edit, Download, Share } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'

export function FinalReview({ onNext, onPrev }) {
  const { selectedTemplate, contextualData } = useProject()
  const [projectName, setProjectName] = useState('Mijn Document')

  // Mock preview data - in real app this would be the AI-processed template
  const previewData = {
    title: selectedTemplate?.elements?.find(e => e.type === 'heading')?.content || 'Document Titel',
    content: contextualData?.text || 'Gegenereerde content op basis van uw input...',
    elements: selectedTemplate?.elements?.length || 0,
    aiChanges: [
      'Content aangepast voor uw context',
      'Kleuren geoptimaliseerd',
      'Layout verbeterd',
      'Tekst gegenereerd'
    ]
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pagina sjabloon is geconfigureerd!
        </h2>
        <p className="text-gray-600">
          Bekijk het resultaat en ga naar de configurator voor verdere aanpassingen
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Document Preview</h3>
              <div className="flex gap-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Mock Document Preview */}
            <div className="p-8 bg-gray-50 aspect-[4/3] flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full">
                <div className="text-2xl font-bold text-gray-900 mb-4">
                  {previewData.title}
                </div>
                <div className="text-gray-700 mb-4 line-clamp-3">
                  {previewData.content}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-brand-blue h-2 rounded-full w-3/4"></div>
                  </div>
                  <span className="text-sm text-gray-500">75%</span>
                </div>
                <button className="w-full bg-brand-blue text-white py-2 rounded-lg text-sm">
                  Call to Action
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Project Info</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Naam
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sjabloon
                </label>
                <div className="text-sm text-gray-600">
                  {selectedTemplate?.name || 'Geen sjabloon geselecteerd'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Elementen
                </label>
                <div className="text-sm text-gray-600">
                  {previewData.elements} elementen
                </div>
              </div>
            </div>
          </div>

          {/* AI Changes */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">AI Aanpassingen</h3>
            <div className="space-y-2">
              {previewData.aiChanges.map((change, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-brand-emerald rounded-full"></div>
                  {change}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Acties</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4" />
                Bewerk in Editor
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Share className="w-4 h-4" />
                Deel Document
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Terug naar AI
        </button>
        
        <button
          onClick={onNext}
          className="px-8 py-3 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Open in Editor
        </button>
      </div>
    </div>
  )
}