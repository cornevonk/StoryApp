import { useState } from 'react'
import { ProjectDropdown } from './ProjectDropdown'
import { KnowledgeDocumentsDropdown } from './KnowledgeDocumentsDropdown'
import { Canvas } from './Canvas'
import { SidePanel } from './SidePanel'
import { PageNavigator } from './PageNavigator'
import { ProjectSelectionScreen } from './ProjectSelectionScreen'
import { useProject } from '../../contexts/ProjectContext'

export function MainLayout() {
  const [activeSidePanelTab, setActiveSidePanelTab] = useState('templates')
  const [selectedElement, setSelectedElement] = useState(null)
  const [templateEditor, setTemplateEditor] = useState({ isOpen: false, template: null })
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const [canvasMode, setCanvasMode] = useState('page-edit') // 'page-edit', 'element-edit', or 'preview'
  const { currentProject } = useProject()

  // Auto-switch to element-edit mode when Elements tab is selected
  const handleTabChange = (tabId) => {
    setActiveSidePanelTab(tabId)
    if (tabId === 'elements') {
      setCanvasMode('element-edit')
    }
  }

  const handleOpenTemplateEditor = (template = null) => {
    setTemplateEditor({ isOpen: true, template })
  }

  const handleCloseTemplateEditor = () => {
    setTemplateEditor({ isOpen: false, template: null })
  }

  const handleSaveTemplate = (template) => {
    // TemplateEditor handles localStorage directly, just close the editor
    handleCloseTemplateEditor()
  }

  // Show project selection screen if no project is loaded
  if (!currentProject) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Hero Section - Project Management Bar with overlay */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600 shadow-lg relative z-50">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left side - Logo */}
              <div className="flex items-center">
                <img 
                  src="https://hiperacademy.nl/wp-content/themes/hiperacademy.nl/public/images/logo.svg" 
                  alt="Hyper Academy" 
                  className="h-8 w-auto"
                />
              </div>

              {/* Center - Story App Title */}
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white">
                    Story App
                  </h1>
                  <div className="relative group">
                    <div className="w-5 h-5 bg-blue-400 hover:bg-blue-300 text-slate-800 rounded-full flex items-center justify-center text-xs font-bold cursor-help transition-colors">
                      i
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-8 w-80 p-4 bg-white text-gray-800 text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 border">
                      <strong className="text-slate-800">Story App</strong> - De moderne AI-gedreven storytelling platform voor professionele presentaties. Combineer kennis documenten met intelligente templates om overtuigende verhalen te creëren die impact maken.
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t transform rotate-45"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Actions and Project Info */}
              <div className="flex items-center gap-4">
                <div className="text-sm text-slate-300">
                  Geen project geladen
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <ProjectDropdown />
                  <KnowledgeDocumentsDropdown />
                </div>
              </div>
            </div>
          </div>
          {/* Overlay for header */}
          <div className="absolute inset-0 bg-gray-500 bg-opacity-40"></div>
        </div>

        {/* Project Selection Screen */}
        <ProjectSelectionScreen />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Hero Section - Project Management Bar */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600 shadow-lg relative z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <img 
                src="https://hiperacademy.nl/wp-content/themes/hiperacademy.nl/public/images/logo.svg" 
                alt="Hyper Academy" 
                className="h-8 w-auto"
              />
            </div>

            {/* Center - Story App Title */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">
                  Story App
                </h1>
                <div className="relative group">
                  <div className="w-5 h-5 bg-blue-400 hover:bg-blue-300 text-slate-800 rounded-full flex items-center justify-center text-xs font-bold cursor-help transition-colors">
                    i
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-8 w-80 p-4 bg-white text-gray-800 text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 border">
                    <strong className="text-slate-800">Story App</strong> - De moderne AI-gedreven storytelling platform voor professionele presentaties. Combineer kennis documenten met intelligente templates om overtuigende verhalen te creëren die impact maken.
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t transform rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Actions and Project Info */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-300">
                {currentProject?.name || 'Geen project geladen'}
              </div>
              <div className="flex items-center gap-3">
                <ProjectDropdown />
                <KnowledgeDocumentsDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas - Main Work Area */}
        <div className="flex-1 flex flex-col">
          <Canvas 
            selectedElement={selectedElement}
            onElementSelect={setSelectedElement}
            onElementDeselect={() => setSelectedElement(null)}
            onPresentationModeChange={setIsPresentationMode}
            canvasMode={canvasMode}
            onCanvasModeChange={setCanvasMode}
            templateEditorProps={{
              template: templateEditor.template,
              isOpen: templateEditor.isOpen,
              onClose: handleCloseTemplateEditor,
              onSave: handleSaveTemplate
            }}
          />
        </div>

        {/* Side Panel - Templates/Elements/Brand */}
        <div className="w-96 border-l border-gray-200 bg-white">
          <SidePanel 
            activeTab={activeSidePanelTab}
            onTabChange={handleTabChange}
            selectedElement={selectedElement}
            onElementSelect={setSelectedElement}
            onOpenTemplateEditor={handleOpenTemplateEditor}
            isTemplateEditorOpen={templateEditor.isOpen}
            canvasMode={canvasMode}
          />
        </div>
      </div>
      
      {/* Floating Page Navigator - Hidden during presentation */}
      {!isPresentationMode && <PageNavigator />}
    </div>
  )
}