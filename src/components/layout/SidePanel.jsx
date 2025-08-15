import { FileText, Shapes, Palette, ImageIcon } from 'lucide-react'
import { TemplatesTab } from '../panels/TemplatesTab'
import { ElementsTab } from '../panels/ElementsTab'
import { BrandTab } from '../panels/BrandTab'
import { AssetsTab } from '../panels/AssetsTab'

const TABS = [
  { id: 'templates', name: 'Sjablonen', icon: FileText },
  { id: 'elements', name: 'Elementen', icon: Shapes },
  { id: 'assets', name: 'Assets', icon: ImageIcon },
  { id: 'brand', name: 'Huisstijl', icon: Palette }
]

export function SidePanel({ activeTab, onTabChange, selectedElement, onElementSelect, onOpenTemplateEditor, isTemplateEditorOpen, canvasMode }) {
  // Filter tabs when template editor is open - only show Elements, Assets and Brand
  const availableTabs = isTemplateEditorOpen 
    ? TABS.filter(tab => tab.id === 'elements' || tab.id === 'assets' || tab.id === 'brand')
    : TABS

  // Auto-switch to elements tab when template editor opens
  const currentTab = isTemplateEditorOpen && activeTab === 'templates' ? 'elements' : activeTab

  const renderTabContent = () => {
    switch (currentTab) {
      case 'templates':
        return <TemplatesTab onOpenTemplateEditor={onOpenTemplateEditor} />
      case 'elements':
        return (
          <ElementsTab 
            selectedElement={selectedElement}
            onElementSelect={onElementSelect}
            canvasMode={canvasMode}
          />
        )
      case 'assets':
        return <AssetsTab />
      case 'brand':
        return <BrandTab />
      default:
        return isTemplateEditorOpen 
          ? <ElementsTab selectedElement={selectedElement} onElementSelect={onElementSelect} canvasMode={canvasMode} />
          : <TemplatesTab onOpenTemplateEditor={onOpenTemplateEditor} />
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {availableTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  currentTab === tab.id
                    ? 'border-brand-blue text-brand-blue bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {renderTabContent()}
      </div>
    </div>
  )
}