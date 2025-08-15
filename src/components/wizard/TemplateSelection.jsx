import { useState } from 'react'
import { Plus, Eye, Star } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'

// Mock templates - in real app these would come from API
const MOCK_TEMPLATES = [
  {
    id: 1,
    name: 'Business Pitch',
    description: 'Voor startups en bedrijfspresentaties',
    category: 'Business',
    thumbnail: '/api/placeholder/300/200',
    preview: '📊',
    isPopular: true,
    elements: [
      { type: 'heading', content: 'Uw Bedrijfsnaam' },
      { type: 'text', content: 'Wij revolutioneren de markt met onze innovatieve oplossing.' },
      { type: 'image', content: 'https://placehold.co/600x300/0027FF/white?text=Product+Demo' },
      { type: 'cta', content: 'Bekijk onze demo' }
    ]
  },
  {
    id: 2,
    name: 'Project Status',
    description: 'Voor team updates en voortgang',
    category: 'Reports',
    thumbnail: '/api/placeholder/300/200',
    preview: '✅',
    isPopular: false,
    elements: [
      { type: 'heading', content: 'Project Update - Week 12' },
      { type: 'text', content: 'Dit is een overzicht van onze voortgang deze week:' },
      { type: 'text', content: '✅ Feature A voltooid\\n⏳ Feature B in ontwikkeling\\n📋 Feature C gepland' }
    ]
  },
  {
    id: 3,
    name: 'Event Aankondiging',
    description: 'Voor evenementen en workshops',
    category: 'Marketing',
    thumbnail: '/api/placeholder/300/200',
    preview: '🎉',
    isPopular: true,
    elements: [
      { type: 'heading', content: 'Exclusieve Workshop!' },
      { type: 'text', content: 'Doe mee aan onze hands-on workshop over de nieuwste trends en technieken.' },
      { type: 'image', content: 'https://placehold.co/600x200/03FFB2/000000?text=Workshop+Event' },
      { type: 'cta', content: 'Meld je aan' }
    ]
  }
]

const CATEGORIES = ['Alle', 'Business', 'Reports', 'Marketing', 'Creative']

export function TemplateSelection({ onNext }) {
  const [selectedCategory, setSelectedCategory] = useState('Alle')
  const [selectedTemplate, setSelectedTemplateLocal] = useState(null)
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const { setTemplate } = useProject()

  const filteredTemplates = selectedCategory === 'Alle' 
    ? MOCK_TEMPLATES 
    : MOCK_TEMPLATES.filter(t => t.category === selectedCategory)

  const handleTemplateSelect = (template) => {
    setSelectedTemplateLocal(template)
    setTemplate(template)
  }

  const handleNext = () => {
    if (selectedTemplate) {
      onNext()
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Kies een pagina sjabloon
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Selecteer een pagina sjabloon om te configureren voor uw Canvas applicatie.
          U kunt het aanpassen met de template configurator.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-white rounded-lg p-1 shadow-sm border">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${selectedCategory === category
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={`
              bg-white rounded-xl shadow-sm border-2 transition-all cursor-pointer group hover:shadow-md
              ${selectedTemplate?.id === template.id 
                ? 'border-brand-blue ring-2 ring-blue-100' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => handleTemplateSelect(template)}
          >
            {/* Template Preview */}
            <div className="relative">
              <div className="aspect-video bg-gray-100 rounded-t-xl flex items-center justify-center text-4xl">
                {template.preview}
              </div>
              {template.isPopular && (
                <div className="absolute top-3 right-3">
                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Populair
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-t-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setPreviewTemplate(template)
                  }}
                  className="bg-white/90 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-white"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {template.elements.length} elementen
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Custom Template Card */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer group">
          <div className="aspect-video flex items-center justify-center text-gray-400">
            <Plus className="w-12 h-12" />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-semibold text-gray-700 mb-1">Custom Sjabloon</h3>
            <p className="text-sm text-gray-500">Upload uw eigen sjabloon</p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={handleNext}
          disabled={!selectedTemplate}
          className={`
            px-8 py-3 rounded-lg font-medium text-white transition-all
            ${selectedTemplate
              ? 'bg-brand-blue hover:bg-blue-700 shadow-sm'
              : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          Doorgaan met '{selectedTemplate?.name || 'geselecteerd sjabloon'}'
        </button>
      </div>
    </div>
  )
}