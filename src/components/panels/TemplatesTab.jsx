import { useState, useEffect } from 'react'
import { Plus, Eye, Edit, Copy, Trash2, GripVertical, ChevronDown, ChevronRight, Library, Folder, Sparkles, Brain, X } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'
import { TemplateThumbnail } from '../common/TemplateThumbnail'
import { templateService } from '../../services/database.js'
import { aiTemplateService } from '../../services/aiTemplateService.js'
import '../../services/mockData.js' // Load the global replace function

// Category colors for better visual distinction
const getCategoryColor = (category) => {
  const colors = {
    'Business': 'bg-gradient-to-r from-blue-600 to-blue-700',
    'Marketing': 'bg-gradient-to-r from-pink-600 to-purple-600', 
    'Reports': 'bg-gradient-to-r from-green-600 to-emerald-600',
    'Analytics': 'bg-gradient-to-r from-orange-600 to-red-600',
    'Education': 'bg-gradient-to-r from-indigo-600 to-purple-600',
    'Custom': 'bg-gradient-to-r from-gray-600 to-gray-700'
  }
  return colors[category] || 'bg-gradient-to-r from-gray-600 to-gray-700'
}

// Categories for filtering
const categories = ['all', 'Reports', 'Business', 'Marketing', 'Analytics', 'Education', 'Custom']

// Mock templates - Management Recap Document Suite
const MOCK_TEMPLATES = [
  {
    id: '1',
    name: 'Management Recap 2024',
    description: 'Welkomstpagina met jaar overzicht en intro',
    category: 'Reports',
    thumbnail: '/api/placeholder/200/150',
    elements: [
      { 
        id: '1', 
        type: 'heading', 
        content: 'Management Recap 2024', 
        x: 60, 
        y: 120, 
        width: 1080, 
        height: 120,
        fontSize: '72px',
        fontWeight: 'bold',
        color: 'var(--brand-primary)',
        textAlign: 'center'
      },
      { 
        id: '2', 
        type: 'text', 
        content: 'Een jaar van groei, innovatie en uitmuntendheid', 
        x: 60, 
        y: 260, 
        width: 1080, 
        height: 60,
        fontSize: '32px',
        color: 'var(--brand-text)',
        textAlign: 'center',
        fontStyle: 'italic'
      },
      { 
        id: '3', 
        type: 'image', 
        content: 'Company headquarters building', 
        x: 200, 
        y: 350, 
        width: 800, 
        height: 300,
        borderRadius: '20px'
      },
      { 
        id: '4', 
        type: 'datawidget', 
        content: 'Revenue Growth\n+47%', 
        x: 60, 
        y: 680, 
        width: 240, 
        height: 100,
        backgroundColor: 'var(--brand-primary)',
        color: 'white',
        fontSize: '24px',
        textAlign: 'center',
        borderRadius: '16px',
        fontWeight: 'bold'
      },
      { 
        id: '5', 
        type: 'datawidget', 
        content: 'Team Members\n342', 
        x: 340, 
        y: 680, 
        width: 240, 
        height: 100,
        backgroundColor: 'var(--brand-secondary)',
        color: 'white',
        fontSize: '24px',
        textAlign: 'center',
        borderRadius: '16px',
        fontWeight: 'bold'
      },
      { 
        id: '6', 
        type: 'datawidget', 
        content: 'Client Satisfaction\n96%', 
        x: 620, 
        y: 680, 
        width: 240, 
        height: 100,
        backgroundColor: 'var(--brand-accent)',
        color: 'white',
        fontSize: '24px',
        textAlign: 'center',
        borderRadius: '16px',
        fontWeight: 'bold'
      },
      { 
        id: '7', 
        type: 'datawidget', 
        content: 'Global Markets\n28', 
        x: 900, 
        y: 680, 
        width: 240, 
        height: 100,
        backgroundColor: '#8B5CF6',
        color: 'white',
        fontSize: '24px',
        textAlign: 'center',
        borderRadius: '16px',
        fontWeight: 'bold'
      }
    ]
  },
  {
    id: '2',
    name: 'Inhoudsopgave 2024',
    description: 'Overzicht van alle hoofdstukken en secties',
    category: 'Reports',
    thumbnail: '/api/placeholder/200/150',
    elements: [
      { 
        id: '1', 
        type: 'heading', 
        content: 'Inhoudsopgave', 
        x: 60, 
        y: 60, 
        width: 1080, 
        height: 80,
        fontSize: '56px',
        fontWeight: 'bold',
        color: 'var(--brand-primary)',
        textAlign: 'left'
      },
      { 
        id: '2', 
        type: 'text', 
        content: '01. Executive Summary...................................... 3\n\n02. Financiële Prestaties Q4 2024............................ 4\n\n03. Operationele Hoogtepunten............................ 5\n\n04. Teamontwikkeling & HR Metrics........................ 6\n\n05. Klantrelaties & Tevredenheid.......................... 7\n\n06. Risicomanagement & Compliance....................... 8\n\n07. Strategische Vooruitblik 2025......................... 9\n\n08. Conclusies & Aanbevelingen........................... 10', 
        x: 100, 
        y: 200, 
        width: 1000, 
        height: 500,
        fontSize: '28px',
        color: 'var(--brand-text)',
        lineHeight: '1.8'
      },
      { 
        id: '3', 
        type: 'text', 
        content: 'Dit document bevat vertrouwelijke informatie en is bedoeld voor interne distributie.', 
        x: 60, 
        y: 720, 
        width: 1080, 
        height: 40,
        fontSize: '16px',
        color: 'var(--brand-secondary)',
        textAlign: 'center',
        fontStyle: 'italic'
      }
    ]
  },
  {
    id: '3',
    name: 'Executive Summary',
    description: 'Hoofdpunten en strategische samenvatting',
    category: 'Reports',
    thumbnail: '/api/placeholder/200/150', 
    elements: [
      { 
        id: '1', 
        type: 'heading', 
        content: 'Executive Summary', 
        x: 60, 
        y: 40, 
        width: 1080, 
        height: 80,
        fontSize: '48px',
        fontWeight: 'bold',
        color: 'var(--brand-primary)',
        textAlign: 'left'
      },
      { 
        id: '2', 
        type: 'text', 
        content: '2024 is een uitzonderlijk jaar geweest voor onze organisatie. We hebben significant gegroeid in alle kerngebieden en nieuwe standaarden gezet voor operationele excellentie.\n\nOnze financiële prestaties overtreffen de gestelde doelstellingen met een omzetgroei van 47% ten opzichte van vorig jaar. Dit succes is het directe resultaat van strategische investeringen in talent, technologie en marktuitbreiding.', 
        x: 60, 
        y: 140, 
        width: 520, 
        height: 300,
        fontSize: '18px',
        lineHeight: '1.6',
        color: 'var(--brand-text)'
      },
      { 
        id: '3', 
        type: 'datawidget', 
        content: 'Omzetgroei\n€47.2M\n+47%', 
        x: 620, 
        y: 140, 
        width: 240, 
        height: 140,
        backgroundColor: 'var(--brand-primary)',
        color: 'white',
        fontSize: '20px',
        textAlign: 'center',
        borderRadius: '16px',
        fontWeight: 'bold'
      },
      { 
        id: '4', 
        type: 'datawidget', 
        content: 'Nieuwe Klanten\n156\n+23%', 
        x: 900, 
        y: 140, 
        width: 240, 
        height: 140,
        backgroundColor: 'var(--brand-secondary)',
        color: 'white',
        fontSize: '20px',
        textAlign: 'center',
        borderRadius: '16px',
        fontWeight: 'bold'
      },
      { 
        id: '5', 
        type: 'text', 
        content: '🎯 Strategische Prioriteiten 2024:\n\n• Marktleiderschap vestigen in Europa\n• Digitale transformatie versnellen\n• Duurzaamheidsdoelen realiseren\n• Talent development programma uitbreiden\n• Klantervaring optimaliseren\n\n✅ Status: 94% van doelen behaald', 
        x: 60, 
        y: 480, 
        width: 520, 
        height: 260,
        fontSize: '16px',
        lineHeight: '1.7',
        color: 'var(--brand-text)'
      },
      { 
        id: '6', 
        type: 'chart', 
        content: '📈 Kernmetrics 2024\n\n▪ EBITDA: €12.4M (+52%)\n▪ Market Share: 18.3% (+4.2%)\n▪ Employee Satisfaction: 91%\n▪ Customer NPS: 73\n▪ Innovation Index: 8.7/10\n\n🏆 Behaalde Certificeringen:\n▪ ISO 27001 (Security)\n▪ ISO 14001 (Environment)\n▪ Great Place to Work', 
        x: 620, 
        y: 320, 
        width: 520, 
        height: 420,
        backgroundColor: '#f8fafc',
        border: '2px solid var(--brand-accent)',
        borderRadius: '16px',
        fontSize: '16px',
        padding: '24px',
        lineHeight: '1.6'
      }
    ]
  }
]

export function TemplatesTab({ onOpenTemplateEditor }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedLibraries, setExpandedLibraries] = useState({})
  const [dragOverLibrary, setDragOverLibrary] = useState(null)
  const [showAIModal, setShowAIModal] = useState(false)
  const [aiGenerationState, setAIGenerationState] = useState('idle') // idle, analyzing, generating, complete
  const [aiAnalysis, setAIAnalysis] = useState(null)
  const { 
    templates, 
    templateLibraries,
    setCurrentTemplate,
    loadTemplates,
    createTemplateLibrary,
    deleteTemplateLibrary,
    moveTemplateToLibrary,
    currentProject
  } = useProject()


  // Helper functions for library management
  const toggleLibrary = (libraryId) => {
    setExpandedLibraries(prev => ({
      ...prev,
      [libraryId]: !prev[libraryId]
    }))
  }

  const handleCreateLibrary = async () => {
    const name = prompt('Naam voor nieuwe bibliotheek:')
    if (name && name.trim()) {
      try {
        await createTemplateLibrary({
          name: name.trim(),
          description: '',
          icon: '📁'
        })
      } catch (error) {
        alert('Fout bij het aanmaken van bibliotheek: ' + error.message)
      }
    }
  }

  const handleCreateAILibrary = async () => {
    if (!currentProject) {
      alert('Geen project geselecteerd')
      return
    }

    if (!aiTemplateService.isAvailable()) {
      alert('OpenAI API is niet geconfigureerd. Voeg VITE_OPENAI_API_KEY toe aan je .env.local bestand.')
      return
    }

    setShowAIModal(true)
    setAIGenerationState('analyzing')

    try {
      // Analyze documents and generate template structure
      const result = await aiTemplateService.analyzeDocumentsForTemplates(currentProject.id)
      setAIAnalysis(result)
      setAIGenerationState('complete')
      
    } catch (error) {
      console.error('AI Template Generation Error:', error)
      setAIGenerationState('idle')
      alert(`Fout bij AI template generatie: ${error.message}`)
      setShowAIModal(false)
    }
  }

  const handleConfirmAILibrary = async () => {
    if (!aiAnalysis || !currentProject) return

    setAIGenerationState('generating')

    try {
      // Create new AI library
      const library = await createTemplateLibrary({
        name: `AI Templates - ${new Date().toLocaleDateString('nl-NL')}`,
        description: `AI-gegenereerde templates gebaseerd op ${aiAnalysis.documentCount} kennisdocumenten`,
        icon: '🤖'
      })

      if (!library || !library.id) {
        throw new Error('Failed to create template library')
      }

      // Save each template to the library
      for (const template of aiAnalysis.templateStructure) {
        await templateService.create({
          ...template,
          template_library_id: library.id,
          project_id: currentProject.id,
          is_custom: true
        })
      }

      // Refresh templates and close modal
      if (typeof loadTemplates === 'function') {
        try {
          await loadTemplates()
        } catch (error) {
          console.warn('Could not refresh templates automatically:', error)
        }
      } else {
        console.warn('loadTemplates function not available')
      }
      
      setShowAIModal(false)
      setAIGenerationState('idle')
      setAIAnalysis(null)

      // Expand the new library
      setExpandedLibraries(prev => ({
        ...prev,
        [library.id]: true
      }))

      const message = `✨ AI bibliotheek aangemaakt met ${aiAnalysis.templateStructure.length} templates!${
        typeof loadTemplates !== 'function' ? '\n\nVervers de pagina om de nieuwe templates te zien.' : ''
      }`
      alert(message)
      
    } catch (error) {
      console.error('Error creating AI library:', error)
      alert('Fout bij het aanmaken van AI bibliotheek: ' + error.message)
      setAIGenerationState('complete') // Back to confirmation state
    }
  }

  const handleDeleteLibrary = async (libraryId, libraryName) => {
    if (confirm(`Weet je zeker dat je de bibliotheek "${libraryName}" wilt verwijderen?`)) {
      try {
        await deleteTemplateLibrary(libraryId)
      } catch (error) {
        alert('Fout bij het verwijderen van bibliotheek: ' + error.message)
      }
    }
  }

  // Templates are now loaded from Supabase via ProjectContext
  // Filter out hidden mock templates (just like original localStorage version)
  const hiddenTemplates = JSON.parse(localStorage.getItem('hidden-templates') || '[]')
  const visibleMockTemplates = MOCK_TEMPLATES.filter(template => !hiddenTemplates.includes(template.id))
  
  // Use both mock templates AND Supabase templates (just like original localStorage version)
  const allTemplates = [...visibleMockTemplates, ...(templates || [])]

  // Separate loose templates (no library) from library templates
  const looseTemplates = allTemplates.filter(t => !t.template_library_id)
  const libraryTemplates = allTemplates.filter(t => t.template_library_id)

  // Group library templates by library
  const templatesByLibrary = (templateLibraries || []).reduce((acc, library) => {
    acc[library.id] = {
      ...library,
      templates: libraryTemplates.filter(t => t.template_library_id === library.id)
    }
    return acc
  }, {})


  const handleCreateTemplate = () => {
    onOpenTemplateEditor(null) // New template - no callback needed, TemplateEditor handles localStorage directly
  }

  const handleEditTemplate = (template, e) => {
    e.stopPropagation()
    onOpenTemplateEditor(template) // Edit template - no callback needed
  }

  const handleDeleteTemplate = async (template, e) => {
    e.stopPropagation()
    
    const confirmDelete = window.confirm(`Weet je zeker dat je het sjabloon "${template.name}" wilt verwijderen?`)
    
    if (confirmDelete) {
      try {
        // Check if it's a mock template (integer ID) or Supabase template (UUID)
        if (typeof template.id === 'string' && template.id.includes('-')) {
          // Supabase template
          if (template.is_custom) {
            await templateService.delete(template.id)
          } else {
            await templateService.hide(template.id)
          }
        } else {
          // Mock template - add to hidden list (localStorage approach)
          const hiddenTemplates = JSON.parse(localStorage.getItem('hidden-templates') || '[]')
          hiddenTemplates.push(template.id)
          localStorage.setItem('hidden-templates', JSON.stringify(hiddenTemplates))
        }
        
        // Force templates refresh without page reload
        if (typeof loadTemplates === 'function') {
          try {
            await loadTemplates()
          } catch (error) {
            console.warn('Could not refresh templates automatically:', error)
          }
        } else {
          console.warn('loadTemplates function not available')
        }
        
        console.log('Template deleted/hidden:', template.name)
        
      } catch (error) {
        console.error('Error deleting/hiding template:', error)
        alert('Fout bij het verwijderen van het sjabloon: ' + error.message)
      }
    }
  }

  const { addPage } = useProject()
  
  const handleUseTemplate = (template) => {
    // Add template as new page instead of setting as current template
    addPage(template)
  }

  const handleDragStart = (e, template) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'template',
      template: template
    }))
  }

  const handleLibraryDragOver = (e, libraryId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverLibrary(libraryId)
  }

  const handleLibraryDragLeave = (e) => {
    e.preventDefault()
    setDragOverLibrary(null)
  }

  const handleLibraryDrop = async (e, libraryId) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverLibrary(null)
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      if (data.type === 'template') {
        const template = data.template
        
        // Only move if template doesn't already belong to this library
        if (template.template_library_id !== libraryId) {
          await moveTemplateToLibrary(template.id, libraryId)
          console.log(`Moved template "${template.name}" to library`)
        }
      }
    } catch (error) {
      console.error('Error handling template drop:', error)
    }
  }

  return (
    <div className="p-4 space-y-6">
        {/* Create Template Button */}
        <button
          onClick={handleCreateTemplate}
          className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-brand-blue text-brand-blue rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Plus className="w-5 h-5" />
          sjabloon
        </button>
        
        {/* Create Template Library Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleCreateLibrary}
            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-purple-500 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <Folder className="w-5 h-5" />
            Nieuwe bibliotheek
          </button>
          
          <button
            onClick={handleCreateAILibrary}
            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-5 h-5" />
            🤖 AI Bibliotheek Genereren
          </button>
        </div>

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Zoek templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Alle' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Template Libraries Accordion */}
        {Object.values(templatesByLibrary).length > 0 && (
          <div className="space-y-4 -mx-4">
            {Object.values(templatesByLibrary).map(library => {
              const filteredLibraryTemplates = library.templates.filter(template => {
                const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                     template.description.toLowerCase().includes(searchTerm.toLowerCase())
                const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
                return matchesSearch && matchesCategory
              })
              
              if (filteredLibraryTemplates.length === 0 && searchTerm) return null
              
              return (
                <div key={library.id} className="bg-white border-b border-gray-200 last:border-b-0">
                  {/* Library Header */}
                  <div 
                    className={`flex items-center justify-between p-4 transition-colors ${
                      dragOverLibrary === library.id 
                        ? 'bg-blue-100 border-2 border-blue-300 border-dashed' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onDragOver={(e) => handleLibraryDragOver(e, library.id)}
                    onDragLeave={handleLibraryDragLeave}
                    onDrop={(e) => handleLibraryDrop(e, library.id)}
                  >
                    <button
                      onClick={() => toggleLibrary(library.id)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <Folder className={`w-5 h-5 ${
                        dragOverLibrary === library.id ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                      <div>
                        <h3 className={`font-semibold ${
                          dragOverLibrary === library.id ? 'text-blue-900' : 'text-gray-900'
                        }`}>{library.name}</h3>
                        <p className={`text-sm ${
                          dragOverLibrary === library.id ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          {dragOverLibrary === library.id ? 'Sleep hier naartoe!' : `${filteredLibraryTemplates.length} sjablonen`}
                        </p>
                      </div>
                      <div className="ml-auto">
                        {expandedLibraries[library.id] ? 
                          <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        }
                      </div>
                    </button>
                    
                    {/* Library Actions */}
                    {!library.is_default && (
                      <button
                        onClick={() => handleDeleteLibrary(library.id, library.name)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors ml-2"
                        title="Bibliotheek verwijderen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Library Content */}
                  {expandedLibraries[library.id] && (
                    <div className="px-4 pt-4 pb-4 space-y-6">
                      {filteredLibraryTemplates.map(template => (
                        <div 
                          key={template.id} 
                          className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:shadow-xl hover:border-brand-blue/30 hover:-translate-y-1 transition-all duration-300 cursor-move group"
                          draggable
                          onDragStart={(e) => handleDragStart(e, template)}
                          onClick={() => handleUseTemplate(template)}
                        >
                          {/* Title Section */}
                          <div className="px-5 pt-5 pb-3 bg-gradient-to-r from-gray-50/50 to-white">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                                {template.name}
                              </h3>
                              
                              {/* Actions */}
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                <button
                                  title="Sjabloon verwijderen"
                                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                                  onClick={(e) => handleDeleteTemplate(template, e)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                  title="Voorbeeld bekijken"
                                  className="p-2.5 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  title="Sjabloon bewerken"
                                  className="p-2.5 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
                                  onClick={(e) => handleEditTemplate(template, e)}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <div className="text-gray-300 group-hover:text-gray-400 transition-colors ml-1">
                                  <GripVertical className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Thumbnail Section */}
                          <div className="px-4 pb-4">
                            <div className="relative w-full aspect-[15/10] bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                              <TemplateThumbnail 
                                template={template} 
                                className="w-full h-full"
                                scale={0.25}
                              />
                              
                              {/* Preview Hint */}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-black/75 text-white px-2 py-1 rounded text-xs font-medium">
                                  👁️ Preview
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Info Section */}
                          <div className="px-5 pb-5">
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                              {template.description}
                            </p>
                            
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <span className={`text-xs px-3 py-2 rounded-full font-bold text-white shadow-sm ${getCategoryColor(template.category)}`}>
                                  {template.category}
                                </span>
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                  <span className="text-sm text-gray-600 font-medium">
                                    {template.elements.length} elementen
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-sm text-brand-blue opacity-0 group-hover:opacity-100 transition-all duration-300 font-medium bg-blue-50 rounded-lg p-2 text-center">
                              ✨ Klik om toe te voegen of sleep naar canvas
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Empty library state */}
                      {filteredLibraryTemplates.length === 0 && !searchTerm && (
                        <div className="text-center py-8 text-gray-400">
                          <Library className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Geen sjablonen in deze bibliotheek</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Loose Templates (no library) */}
        {looseTemplates
          .filter(template => {
            const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 template.description.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
            return matchesSearch && matchesCategory
          }).length > 0 && (
          <div className="space-y-6">
            {looseTemplates
              .filter(template => {
                const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                     template.description.toLowerCase().includes(searchTerm.toLowerCase())
                const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
                return matchesSearch && matchesCategory
              })
              .map(template => (
              <div 
                key={template.id} 
                className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:shadow-xl hover:border-brand-blue/30 hover:-translate-y-1 transition-all duration-300 cursor-move group"
                draggable
                onDragStart={(e) => handleDragStart(e, template)}
                onClick={() => handleUseTemplate(template)}
              >
                {/* Title Section */}
                <div className="px-5 pt-5 pb-3 bg-gradient-to-r from-gray-50/50 to-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">
                      {template.name}
                    </h3>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <button
                        title="Sjabloon verwijderen"
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                        onClick={(e) => handleDeleteTemplate(template, e)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        title="Voorbeeld bekijken"
                        className="p-2.5 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        title="Sjabloon bewerken"
                        className="p-2.5 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
                        onClick={(e) => handleEditTemplate(template, e)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <div className="text-gray-300 group-hover:text-gray-400 transition-colors ml-1">
                        <GripVertical className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Section */}
                <div className="px-4 pb-4">
                  <div className="relative w-full aspect-[15/10] bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    <TemplateThumbnail 
                      template={template} 
                      className="w-full h-full"
                      scale={0.25}
                    />
                    
                    {/* Preview Hint */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/75 text-white px-2 py-1 rounded text-xs font-medium">
                        👁️ Preview
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="px-5 pb-5">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-2 rounded-full font-bold text-white shadow-sm ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span className="text-sm text-gray-600 font-medium">
                          {template.elements.length} elementen
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-brand-blue opacity-0 group-hover:opacity-100 transition-all duration-300 font-medium bg-blue-50 rounded-lg p-2 text-center">
                    ✨ Klik om toe te voegen of sleep naar canvas
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {looseTemplates.filter(template => {
            const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 template.description.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
            return matchesSearch && matchesCategory
          }).length === 0 && 
          Object.values(templatesByLibrary).every(library => 
            library.templates.filter(template => {
              const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                   template.description.toLowerCase().includes(searchTerm.toLowerCase())
              const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
              return matchesSearch && matchesCategory
            }).length === 0
          ) && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p>Geen templates gevonden</p>
            <p className="text-sm">Probeer een andere zoekterm</p>
          </div>
        )}

        {/* AI Template Generation Modal */}
        {showAIModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Brain className="w-8 h-8" />
                    <div>
                      <h2 className="text-2xl font-bold">AI Template Generator</h2>
                      <p className="text-purple-100">Automatische template generatie op basis van kennisdocumenten</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowAIModal(false)
                      setAIGenerationState('idle')
                      setAIAnalysis(null)
                    }}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {aiGenerationState === 'analyzing' && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Kennisdocumenten analyseren...</h3>
                    <p className="text-gray-600">AI analyseert je documenten om de beste template structuur te bepalen</p>
                  </div>
                )}

                {aiGenerationState === 'generating' && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <Sparkles className="w-16 h-16 text-purple-500 animate-bounce" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Templates genereren...</h3>
                    <p className="text-gray-600">Bibliotheek wordt aangemaakt met AI-gegenereerde templates</p>
                  </div>
                )}

                {aiGenerationState === 'complete' && aiAnalysis && (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-green-900">Analyse Voltooid!</h3>
                          <p className="text-green-700 text-sm mt-1">
                            {aiAnalysis.documentCount} kennisdocumenten geanalyseerd
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Gegenereerde Template Structuur:</h4>
                      
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Hoofdonderwerpen:</span>
                            <p className="text-gray-900">{aiAnalysis.analysis.mainTopics?.join(', ') || 'Diverse onderwerpen'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Aantal templates:</span>
                            <p className="text-gray-900">{aiAnalysis.templateStructure.length} slides</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <span className="font-medium text-gray-600">Template overzicht:</span>
                          <div className="space-y-1">
                            {aiAnalysis.templateStructure.map((template, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-gray-900">{template.name}</span>
                                <span className="text-gray-500">({template.elements.length} elementen)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowAIModal(false)
                          setAIGenerationState('idle')
                          setAIAnalysis(null)
                        }}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Annuleren
                      </button>
                      <button
                        onClick={handleConfirmAILibrary}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
                      >
                        ✨ Bibliotheek Aanmaken
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  )
}