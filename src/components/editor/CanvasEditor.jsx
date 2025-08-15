import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Save, 
  Download, 
  Share, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut,
  Type,
  Heading1,
  Image as ImageIcon,
  ArrowLeft
} from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'
import { CanvasElement } from './CanvasElement'

export function CanvasEditor() {
  const navigate = useNavigate()
  const { currentProject, selectedTemplate, contextualData, updateProject } = useProject()
  const canvasRef = useRef(null)
  
  // Canvas state
  const [zoom, setZoom] = useState(100)
  const [selectedElement, setSelectedElement] = useState(null)
  const [elements, setElements] = useState(
    selectedTemplate?.elements || [
      { 
        id: '1', 
        type: 'heading', 
        content: 'Welkom bij uw nieuwe document', 
        x: 50, 
        y: 50, 
        width: 400, 
        height: 60 
      }
    ]
  )
  
  // Tool palette
  const [selectedTool, setSelectedTool] = useState('select')
  
  const tools = [
    { id: 'select', name: 'Selecteren', icon: ArrowLeft },
    { id: 'text', name: 'Tekst', icon: Type },
    { id: 'heading', name: 'Heading', icon: Heading1 },
    { id: 'image', name: 'Afbeelding', icon: ImageIcon }
  ]

  const handleCanvasClick = (e) => {
    if (selectedTool === 'select') return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (100 / zoom)
    const y = (e.clientY - rect.top) * (100 / zoom)
    
    const newElement = {
      id: Date.now().toString(),
      type: selectedTool,
      content: selectedTool === 'heading' ? 'Nieuwe heading' : selectedTool === 'text' ? 'Nieuwe tekst' : 'Afbeelding',
      x,
      y,
      width: selectedTool === 'heading' ? 300 : selectedTool === 'text' ? 200 : 150,
      height: selectedTool === 'heading' ? 50 : selectedTool === 'text' ? 40 : 100
    }
    
    setElements(prev => [...prev, newElement])
    setSelectedTool('select')
  }

  const handleElementUpdate = (elementId, updates) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ))
  }

  const handleElementDelete = (elementId) => {
    setElements(prev => prev.filter(el => el.id !== elementId))
    setSelectedElement(null)
  }

  const handleZoomChange = (delta) => {
    setZoom(prev => Math.max(25, Math.min(200, prev + delta)))
  }

  const handleSave = () => {
    const projectData = {
      id: currentProject?.id || Date.now().toString(),
      name: currentProject?.name || 'Nieuw Project',
      template: selectedTemplate,
      elements,
      contextualData,
      lastModified: new Date().toISOString()
    }
    updateProject(projectData)
    // Show success notification
    alert('Project opgeslagen!')
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar wizard
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {currentProject?.name || 'Nieuw Document'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Opslaan
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Exporteren
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Share className="w-4 h-4" />
              Delen
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Tool Palette */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-2">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`
                  w-12 h-12 rounded-lg flex items-center justify-center transition-colors
                  ${selectedTool === tool.id
                    ? 'bg-brand-blue text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
                title={tool.name}
              >
                <Icon className="w-5 h-5" />
              </button>
            )
          })}
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <Undo className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <Redo className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleZoomChange(-25)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">
                {zoom}%
              </span>
              <button 
                onClick={() => handleZoomChange(25)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-gray-100 p-8">
            <div
              ref={canvasRef}
              className="relative bg-white rounded-lg shadow-sm mx-auto"
              style={{
                width: `${800 * (zoom / 100)}px`,
                height: `${600 * (zoom / 100)}px`,
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top left'
              }}
              onClick={handleCanvasClick}
            >
              {elements.map((element) => (
                <CanvasElement
                  key={element.id}
                  element={element}
                  isSelected={selectedElement === element.id}
                  onSelect={() => setSelectedElement(element.id)}
                  onUpdate={(updates) => handleElementUpdate(element.id, updates)}
                  onDelete={() => handleElementDelete(element.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        {selectedElement && (
          <div className="w-80 bg-white border-l border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Element eigenschappen
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  {elements.find(el => el.id === selectedElement)?.type}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inhoud
                </label>
                <textarea
                  value={elements.find(el => el.id === selectedElement)?.content || ''}
                  onChange={(e) => handleElementUpdate(selectedElement, { content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
                  rows="3"
                />
              </div>
              <button
                onClick={() => handleElementDelete(selectedElement)}
                className="w-full px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                Element verwijderen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}