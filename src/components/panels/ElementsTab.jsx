import { useState } from 'react'
import { 
  Type, 
  Heading1, 
  Image, 
  Video, 
  BarChart3, 
  Table, 
  Layout, 
  Bot, 
  MousePointer, 
  Gauge,
  Code,
  ExternalLink,
  GripVertical
} from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'
import { ElementSettings } from './ElementSettings'

// Element types with their configuration
// ALL ELEMENT TYPES RESTORED - FULL FUNCTIONALITY
const ELEMENT_TYPES = [
  {
    type: 'text',
    name: 'Tekstvak',
    icon: Type,
    description: 'Eenvoudige tekst of paragraaf',
    defaultProps: { content: 'Voer uw tekst hier in...', fontSize: 16, color: '#1F2937' }
  },
  {
    type: 'heading', 
    name: 'Heading',
    icon: Heading1,
    description: 'Grote titel of koptekst',
    defaultProps: { content: 'Nieuwe heading', fontSize: 24, fontWeight: 'bold', color: '#1F2937' }
  },
  {
    type: 'image',
    name: 'Afbeelding',
    icon: Image,
    description: 'Foto of grafische elementen', 
    defaultProps: { src: '', alt: 'Afbeelding', objectFit: 'cover' }
  },
  {
    type: 'video',
    name: 'Video',
    icon: Video,
    description: 'Video content of embed',
    defaultProps: { src: '', controls: true, autoplay: false }
  },
  {
    type: 'chart',
    name: 'Grafiek',
    icon: BarChart3,
    description: 'Data visualisatie en grafieken',
    defaultProps: { chartType: 'bar', data: [], title: 'Grafiek Titel' }
  },
  {
    type: 'table',
    name: 'Tabel',
    icon: Table,
    description: 'Gestructureerde data in tabel',
    defaultProps: { headers: ['Kolom 1', 'Kolom 2'], rows: [['Data 1', 'Data 2']] }
  },
  {
    type: 'footer',
    name: 'Footer',
    icon: Layout,
    description: 'Pagina footer met links',
    defaultProps: { content: '© 2024 Bedrijfsnaam', links: [] }
  },
  {
    type: 'ai-agent',
    name: 'AI Agent',
    icon: Bot,
    description: 'AI-gestuurde inhoud generatie',
    defaultProps: { 
      systemPrompt: 'Je bent een behulpzame AI assistant...',
      contextPrompt: 'Gebruik de volgende context...',
      contentType: 'text'
    }
  },
  {
    type: 'cta',
    name: 'Call-to-Action',
    icon: MousePointer,
    description: 'Actieknoppen en links',
    defaultProps: { text: 'Klik hier', url: '#', style: 'primary' }
  },
  {
    type: 'datawidget',
    name: 'Data Widget',
    icon: Gauge,
    description: 'KPIs, counters, progressbars',
    defaultProps: { 
      widgetType: 'counter', 
      value: 0, 
      label: 'Waarde', 
      format: 'number' 
    }
  },
  {
    type: 'demo',
    name: 'Demo Blok',
    icon: Code,
    description: 'Live code uitvoering',
    defaultProps: { 
      code: '// Voer uw code hier in\nconsole.log("Hello World");', 
      language: 'javascript',
      editable: true 
    }
  },
  {
    type: 'embed',
    name: 'Embed Blok',
    icon: ExternalLink,
    description: 'Externe content (YouTube, Maps, etc.)',
    defaultProps: { 
      embedType: 'iframe', 
      src: '', 
      width: '100%', 
      height: '300px' 
    }
  }
]

export function ElementsTab({ selectedElement, onElementSelect, canvasMode }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [draggedElement, setDraggedElement] = useState(null)
  const { addTemplateElement, currentTemplate, pages, activePage, updatePageElement, removePageElement } = useProject()

  const filteredElements = ELEMENT_TYPES.filter(element =>
    element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    element.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDragStart = (e, elementType) => {
    setDraggedElement(elementType)
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'element',
      elementType: elementType
    }))
  }

  const handleAddElement = (elementType) => {
    const { activePage, addElementToPage } = useProject()
    
    // Only allow adding elements in element-edit mode
    if (canvasMode !== 'element-edit') {
      alert('Schakel eerst naar "Elementen" modus om elementen toe te voegen')
      return
    }
    
    if (!activePage) {
      alert('Maak eerst een pagina aan om elementen toe te voegen')
      return
    }

    const newElement = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      element_type: elementType.type, // Use element_type for Supabase compatibility
      x: 100 + Math.random() * 200, // Random position
      y: 100 + Math.random() * 200,
      width: elementType.type === 'heading' ? 400 : elementType.type === 'text' ? 300 : 250,
      height: elementType.type === 'heading' ? 50 : elementType.type === 'text' ? 100 : 150,
      ...elementType.defaultProps
    }
    
    addElementToPage(activePage, newElement)
    onElementSelect(newElement.id)
  }

  // Show element settings if an element is selected
  if (selectedElement) {
    // First check template elements (for template editor mode)
    let element = currentTemplate?.elements?.find(el => el.id === selectedElement)
    
    // If not found in template, check all page elements
    if (!element) {
      for (const page of pages) {
        element = page.elements?.find(el => el.id === selectedElement)
        if (element) {
          // Pass the page ID and update/delete callbacks for page elements
          return (
            <ElementSettings 
              element={element}
              pageId={page.id}
              onElementUpdate={(elementId, updates) => updatePageElement(page.id, elementId, updates)}
              onElementDelete={(elementId) => removePageElement(page.id, elementId)}
            />
          )
        }
      }
    }
    
    // Template element (for template editor)
    if (element) {
      return <ElementSettings element={element} />
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Mode Info */}
      {canvasMode !== 'element-edit' ? (
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-800">
            <strong>Let op:</strong> Schakel naar "Elementen" modus (links bovenin) om elementen toe te voegen aan pagina's
          </p>
        </div>
      ) : (
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            <strong>✓ Actief:</strong> Sleep elementen naar de pagina of klik om toe te voegen
          </p>
        </div>
      )}

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Zoek elementen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
        />
      </div>

      {/* Elements List */}
      <div className="space-y-2">
        {filteredElements.map(elementType => {
          const Icon = elementType.icon
          return (
            <div
              key={elementType.type}
              draggable={canvasMode === 'element-edit'}
              onDragStart={canvasMode === 'element-edit' ? (e) => handleDragStart(e, elementType) : undefined}
              onClick={() => handleAddElement(elementType)}
              className={`bg-white border border-gray-200 rounded-lg p-3 transition-all group ${
                canvasMode === 'element-edit' 
                  ? 'hover:border-brand-blue hover:shadow-sm cursor-move'
                  : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <Icon className="w-5 h-5 text-gray-600 group-hover:text-brand-blue" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {elementType.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {elementType.description}
                  </p>
                </div>

                <div className="text-gray-400 group-hover:text-brand-blue transition-colors">
                  <GripVertical className="w-4 h-4" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredElements.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🔍</div>
          <p>Geen elementen gevonden</p>
          <p className="text-sm">Probeer een andere zoekterm</p>
        </div>
      )}
    </div>
  )
}