import { useState, useCallback, useRef, useEffect } from 'react'
import { ArrowLeft, Settings, Zap, MessageSquare, Trash2, Sparkles, Loader2 } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'
import { openaiService } from '../../services/openaiService'
import { knowledgeDocumentService } from '../../services/knowledgeDocumentService'

export function ElementSettings({ element, pageId = null, onElementUpdate = null, onElementDelete = null }) {
  const [activeTab, setActiveTab] = useState('properties')
  const [isGenerating, setIsGenerating] = useState(false)
  const [localContent, setLocalContent] = useState(element.content || '')
  const updateTimeoutRef = useRef(null)
  
  const { 
    updateTemplateElement, 
    removeTemplateElement, 
    updatePageElement, 
    removePageElement,
    activePage,
    currentProject
  } = useProject()

  // Sync local content when element changes
  useEffect(() => {
    setLocalContent(element.content || '')
  }, [element.content])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])

  const handleUpdate = (updates) => {
    if (onElementUpdate) {
      // Direct callback from parent component
      onElementUpdate(element.id, updates)
    } else if (pageId) {
      // Update element on specific page
      updatePageElement(pageId, element.id, updates)
    } else if (activePage && element.pageId !== undefined) {
      // Update element on active page
      updatePageElement(activePage, element.id, updates)
    } else {
      // Fallback to template element (for template editor)
      updateTemplateElement(element.id, updates)
    }
  }

  // Debounced content update to prevent typing lag
  const handleContentChange = useCallback((newContent) => {
    setLocalContent(newContent)
    
    // Clear existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    
    // Set new timeout for debounced update
    updateTimeoutRef.current = setTimeout(() => {
      handleUpdate({ content: newContent })
    }, 300) // 300ms debounce
  }, [])

  // Immediate update for non-content changes
  const handleImmediateUpdate = useCallback((updates) => {
    handleUpdate(updates)
  }, [])

  const handleDelete = () => {
    if (confirm('Weet u zeker dat u dit element wilt verwijderen?')) {
      if (onElementDelete) {
        // Direct callback from parent component
        onElementDelete(element.id)
      } else if (pageId) {
        // Remove element from specific page
        removePageElement(pageId, element.id)
      } else if (activePage && element.pageId !== undefined) {
        // Remove element from active page
        removePageElement(activePage, element.id)
      } else {
        // Fallback to template element (for template editor)
        removeTemplateElement(element.id)
      }
    }
  }

  const handleMagicGeneration = async () => {
    if (!currentProject) {
      alert('Geen project geselecteerd')
      return
    }

    if (!openaiService.isAvailable()) {
      alert('OpenAI API is niet geconfigureerd. Voeg VITE_OPENAI_API_KEY toe aan je .env.local bestand.')
      return
    }

    const currentContent = localContent || ''
    if (!currentContent.trim()) {
      alert('Voer eerst een prompt in het tekstveld in')
      return
    }

    setIsGenerating(true)
    try {
      // Load knowledge documents for the current project
      const knowledgeDocuments = await knowledgeDocumentService.getByProject(currentProject.id)
      
      if (knowledgeDocuments.length === 0) {
        alert('Geen kennisdocumenten gevonden voor dit project. Upload eerst documenten via het "Kennis Documenten" menu.')
        return
      }

      // Generate content using AI
      const generatedContent = await openaiService.generateContent(currentContent, knowledgeDocuments)
      
      // Update both local state and element
      setLocalContent(generatedContent)
      handleUpdate({ content: generatedContent })
      
    } catch (error) {
      console.error('Magic generation error:', error)
      alert(`Fout bij het genereren van content: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const renderPropertiesTab = () => {
    switch (element.type || element.element_type || 'text') {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inhoud
              </label>
              <div className="relative">
                <textarea
                  value={localContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Type hier je prompt of bestaande tekst..."
                />
                <button
                  onClick={handleMagicGeneration}
                  disabled={isGenerating}
                  className="absolute top-2 right-2 p-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
                  title="✨ AI Magic - Genereer content op basis van kennisdocumenten"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  )}
                </button>
              </div>
              {currentProject && (
                <p className="text-xs text-gray-500 mt-1">
                  💡 Type een prompt en klik op ✨ om AI content te genereren op basis van je kennisdocumenten
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lettergrootte
                </label>
                <input
                  type="number"
                  value={element.fontSize || 16}
                  onChange={(e) => handleImmediateUpdate({ fontSize: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kleur
                </label>
                <input
                  type="color"
                  value={element.color || '#1F2937'}
                  onChange={(e) => handleImmediateUpdate({ color: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )

      case 'heading':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heading Tekst
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={localContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  placeholder="Type hier je prompt of bestaande heading..."
                />
                <button
                  onClick={handleMagicGeneration}
                  disabled={isGenerating}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
                  title="✨ AI Magic - Genereer content op basis van kennisdocumenten"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  )}
                </button>
              </div>
              {currentProject && (
                <p className="text-xs text-gray-500 mt-1">
                  💡 Type een prompt en klik op ✨ om AI content te genereren op basis van je kennisdocumenten
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grootte
                </label>
                <select
                  value={element.fontSize || 24}
                  onChange={(e) => handleImmediateUpdate({ fontSize: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                >
                  <option value={18}>H3 (18px)</option>
                  <option value={24}>H2 (24px)</option>
                  <option value={32}>H1 (32px)</option>
                  <option value={48}>XL (48px)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kleur
                </label>
                <input
                  type="color"
                  value={element.color || '#1F2937'}
                  onChange={(e) => handleImmediateUpdate({ color: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Afbeelding URL
              </label>
              <input
                type="url"
                value={element.src || ''}
                onChange={(e) => handleUpdate({ src: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt tekst
              </label>
              <input
                type="text"
                value={element.alt || ''}
                onChange={(e) => handleUpdate({ alt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Object Fit
              </label>
              <select
                value={element.objectFit || 'cover'}
                onChange={(e) => handleUpdate({ objectFit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
              </select>
            </div>
          </div>
        )

      case 'cta':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Tekst
              </label>
              <input
                type="text"
                value={element.text || ''}
                onChange={(e) => handleUpdate({ text: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link URL
              </label>
              <input
                type="url"
                value={element.url || ''}
                onChange={(e) => handleUpdate({ url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stijl
              </label>
              <select
                value={element.style || 'primary'}
                onChange={(e) => handleUpdate({ style: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>
            </div>
          </div>
        )

      case 'ai-agent':
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>AI Agent:</strong> Dit element wordt automatisch gevuld op basis van de AI prompts
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <select
                value={element.contentType || 'text'}
                onChange={(e) => handleUpdate({ contentType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              >
                <option value="text">Tekst</option>
                <option value="list">Lijst</option>
                <option value="summary">Samenvatting</option>
                <option value="title">Titel</option>
              </select>
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-600">
              Eigenschappen voor {element.type || element.element_type || 'text'} komen binnenkort
            </div>
          </div>
        )
    }
  }

  const renderAITab = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>AI Variabelen:</strong> Deze instellingen bepalen hoe AI content genereert voor dit element
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          System Prompt
        </label>
        <textarea
          value={element.systemPrompt || ''}
          onChange={(e) => handleUpdate({ systemPrompt: e.target.value })}
          placeholder="Geef de AI een rol en instructies..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Context Prompt
        </label>
        <textarea
          value={element.contextPrompt || ''}
          onChange={(e) => handleUpdate({ contextPrompt: e.target.value })}
          placeholder="Beschrijf welke data de AI moet gebruiken..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Keywords
        </label>
        <input
          type="text"
          value={element.keywords || ''}
          onChange={(e) => handleUpdate({ keywords: e.target.value })}
          placeholder="belangrijk, woorden, komma gescheiden"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tone of Voice
        </label>
        <select
          value={element.toneOfVoice || 'professional'}
          onChange={(e) => handleUpdate({ toneOfVoice: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
        >
          <option value="professional">Professional</option>
          <option value="friendly">Vriendelijk</option>
          <option value="formal">Formeel</option>
          <option value="casual">Casual</option>
          <option value="enthusiastic">Enthousiast</option>
        </select>
      </div>
    </div>
  )

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="w-8 h-8 bg-brand-blue text-white rounded-lg flex items-center justify-center text-sm font-medium">
          {(element.type || element.element_type || 'text').charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-medium text-gray-900 capitalize">
            {element.type || element.element_type || 'text'}
          </h3>
          <p className="text-sm text-gray-600">
            Element #{element.id.slice(-4)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'properties'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          Eigenschappen
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'ai'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          AI
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'properties' && renderPropertiesTab()}
        {activeTab === 'ai' && renderAITab()}
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Element verwijderen
        </button>
      </div>
    </div>
  )
}