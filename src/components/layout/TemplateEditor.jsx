import { useState, useRef, useCallback } from 'react'
import { X, Save } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'
import { TemplateElement } from '../elements/TemplateElement'
import { templateService } from '../../services/database.js'

export function TemplateEditor({ 
  template = null, 
  isOpen, 
  onClose, 
  onSave 
}) {
  const { addTemplateElement, updateTemplateElement, removeTemplateElement } = useProject()
  const [currentTemplate, setCurrentTemplate] = useState(template || {
    id: Date.now().toString(),
    name: 'Nieuw Sjabloon',
    description: 'Beschrijving van het sjabloon',
    category: 'Custom',
    elements: []
  })
  const [selectedElement, setSelectedElement] = useState(null)
  const canvasRef = useRef(null)

  if (!isOpen) return null

  // Drop handler for elements
  const handleDrop = (e) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('application/json')
    if (data) {
      const item = JSON.parse(data)
      
      if (item.type === 'element') {
        const rect = canvasRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        // Convert to relative coordinates within 1200x800 canvas
        const relativeX = (x / rect.width) * 1200
        const relativeY = (y / rect.height) * 800
        
        const newElement = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          type: item.elementType.type,
          x: Math.max(0, Math.min(1200 - 250, relativeX - 125)), // Center drop within 1200px
          y: Math.max(0, Math.min(800 - 150, relativeY - 75)), // Center drop within 800px
          width: item.elementType.type === 'heading' ? 400 : item.elementType.type === 'text' ? 300 : 250,
          height: item.elementType.type === 'heading' ? 50 : item.elementType.type === 'text' ? 100 : 150,
          ...item.elementType.defaultProps
        }
        
        addTemplateElement(newElement)
      } else if (item.type === 'asset') {
        // Handle asset drop - create image element
        const rect = canvasRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        // Convert to relative coordinates within 1200x800 canvas
        const relativeX = (x / rect.width) * 1200
        const relativeY = (y / rect.height) * 800
        
        const newElement = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          type: 'image',
          x: Math.max(0, Math.min(1200 - 200, relativeX - 100)), // Position at drop location, center asset on cursor
          y: Math.max(0, Math.min(800 - 150, relativeY - 75)), // Position at drop location, center asset on cursor
          width: 200,
          height: 150,
          content: item.asset.url,
          src: item.asset.url,
          alt: item.asset.name,
          assetId: item.asset.id,
          assetName: item.asset.name
        }
        
        addTemplateElement(newElement)
        setSelectedElement(newElement.id)
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleElementUpdate = (elementId, updates) => {
    setCurrentTemplate(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        el.id === elementId ? { ...el, ...updates } : el
      )
    }))
  }

  const handleElementDelete = (elementId) => {
    setCurrentTemplate(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId)
    }))
    if (selectedElement === elementId) {
      setSelectedElement(null)
    }
  }

  const handleSave = async () => {
    // Validate template name
    if (!currentTemplate.name || currentTemplate.name.trim() === '') {
      alert('Geef het sjabloon een naam voordat je opslaat')
      return
    }
    
    console.log('Starting save process with template:', currentTemplate)
    
    try {
      // Create final template with proper structure
      const finalTemplate = {
        name: currentTemplate.name,
        description: currentTemplate.description || '',
        category: currentTemplate.category || 'Custom',
        elements: currentTemplate.elements || [],
        // Preserve template_library_id if it exists
        ...(currentTemplate.template_library_id && { template_library_id: currentTemplate.template_library_id })
      }
      
      let savedTemplate
      
      // Check if we're updating or adding new
      // Mock templates (integer IDs) always create new, real templates can be updated
      const isSupabaseTemplate = currentTemplate.id && currentTemplate.id.includes('-') && template
      if (isSupabaseTemplate) {
        // Update existing Supabase template
        console.log('Updating existing template:', currentTemplate.id)
        savedTemplate = await templateService.update(currentTemplate.id, finalTemplate)
      } else {
        // Add new template (including when editing mock templates)
        console.log('Creating new template (from mock or new)')
        savedTemplate = await templateService.create(finalTemplate)
      }
      
      console.log('Template saved to Supabase:', savedTemplate)
      
      // Call the callback for any parent component updates
      if (onSave) {
        onSave(savedTemplate)
      }
      
      alert('Sjabloon succesvol opgeslagen!')
      onClose()
      
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Fout bij het opslaan van het sjabloon: ' + error.message)
    }
  }

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      setSelectedElement(null)
    }
  }

  return (
    <div className="absolute inset-0 bg-white z-40 flex flex-col">
      {/* Header - overlaps canvas toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            🎨 Sjabloon Editor
          </h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={currentTemplate.name}
              onChange={(e) => setCurrentTemplate(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium"
              placeholder="Sjabloon naam"
            />
            <span className="text-sm text-gray-500">
              {currentTemplate.elements.length} elementen
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Opslaan
          </button>
          <button 
            onClick={onClose}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-gray-100 overflow-hidden relative p-4">
        <div className="w-full h-full flex items-center justify-center">
          <div
            ref={canvasRef}
            className="page-container bg-white rounded-lg shadow-lg border-2 border-gray-300 relative overflow-hidden"
            style={{
              width: 'min(1200px, calc(100vw - 32rem))', // Fit within available space minus sidebar
              height: 'min(800px, calc(100vh - 12rem))', // Fit within available height minus header
              maxWidth: '1200px',
              maxHeight: '800px',
              aspectRatio: '1200/800'
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleCanvasClick}
          >
            {/* Grid Background */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  radial-gradient(circle, #374151 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />

            {/* Template Elements */}
            {currentTemplate.elements.map((element) => (
              <TemplateElement
                key={element.id}
                element={element}
                isSelected={selectedElement === element.id}
                isPreviewMode={false}
                onSelect={() => setSelectedElement(element.id)}
                onUpdate={(updates) => handleElementUpdate(element.id, updates)}
                onDelete={() => handleElementDelete(element.id)}
                otherElements={currentTemplate.elements.filter(el => el.id !== element.id)}
                pageWidth={1200}
                pageHeight={800}
              />
            ))}

            {/* Empty State */}
            {currentTemplate.elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <div className="text-lg font-medium mb-2">Leeg sjabloon</div>
                  <div className="text-sm mb-4">
                    Sleep elementen uit het sidepanel hierheen
                  </div>
                  <div className="text-xs text-gray-500">
                    <div>• Sleep elementen om te positioneren</div>
                    <div>• Gebruik resize handles om grootte aan te passen</div>
                    <div>• Smart guides helpen bij uitlijning</div>
                  </div>
                </div>
              </div>
            )}

            {/* Drop Zone Indicator */}
            <div className="absolute top-3 right-3 bg-blue-50 border border-dashed border-blue-300 rounded px-2 py-1 text-xs text-blue-600 pointer-events-none">
              🎯 Drop zone
            </div>
          </div>
        </div>

        {/* Template Info Panel */}
        <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[300px]">
          <h3 className="font-medium text-gray-900 mb-3">Sjabloon Info</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Naam</label>
              <input
                type="text"
                value={currentTemplate.name || ''}
                onChange={(e) => setCurrentTemplate(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                placeholder="Sjabloon naam"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Categorie</label>
              <select
                value={currentTemplate.category || 'Custom'}
                onChange={(e) => setCurrentTemplate(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              >
                <option value="Custom">Custom</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
                <option value="Reports">Reports</option>
                <option value="Analytics">Analytics</option>
                <option value="Education">Education</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Beschrijving</label>
              <textarea
                value={currentTemplate.description || ''}
                onChange={(e) => setCurrentTemplate(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
                placeholder="Beschrijf wat dit sjabloon doet..."
                rows={3}
              />
            </div>
            <div className="pt-2 border-t border-gray-200 text-xs text-gray-500">
              <strong>Elementen:</strong> {currentTemplate.elements.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}