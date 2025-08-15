import { useRef } from 'react'
import { TemplateElement } from './TemplateElement'
import { Move, MousePointer } from 'lucide-react'

export function PageContainer({ 
  page, 
  position, 
  zoom, 
  isPreviewMode,
  canvasMode = 'page-edit',
  selectedElement, 
  onElementSelect, 
  onElementUpdate, 
  onElementDelete,
  onPageMouseDown,
  isDragging = false,
  dragMode = 'idle',
  isActivePage 
}) {
  const pageRef = useRef(null)
  const pageWidth = 1200
  const pageHeight = 800

  // Simple click handler that delegates to Canvas
  const handlePageClick = (e) => {
    if (isPreviewMode || canvasMode !== 'page-edit') return
    
    // Let Canvas handle all the interaction logic
    onPageMouseDown(e)
  }

  return (
    <div
      ref={pageRef}
      data-page-id={page.id}
      className={`
        page-container absolute rounded-lg shadow-lg border-2 overflow-hidden transition-all duration-200 ease-out
        ${!page.backgroundColor ? 'bg-white' : ''}
        ${isDragging ? 'cursor-grabbing shadow-2xl scale-105 rotate-1' : 'cursor-grab'}
        ${dragMode === 'dragReady' ? 'scale-102' : ''}
        ${isActivePage 
          ? 'border-brand-blue ring-2 ring-blue-100' 
          : 'border-gray-200 hover:border-gray-300'
        }
      `}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${pageWidth}px`,
        height: `${pageHeight}px`,
        backgroundColor: page.backgroundColor || '#FFFFFF',
        zIndex: isDragging ? 1000 : dragMode === 'dragReady' ? 500 : isActivePage ? 10 : 1,
        transform: isDragging ? 'scale(1.05) rotate(1deg)' : dragMode === 'dragReady' ? 'scale(1.02)' : 'scale(1)'
      }}
      onMouseDown={handlePageClick}
    >
      {/* Page Header */}
      <div className="absolute -top-8 left-0 text-sm font-medium text-gray-600">
        {page.name || `Pagina ${page.id.slice(-4)}`}
      </div>

      {/* Page Elements */}
      {page.elements?.map((element) => (
        <TemplateElement
          key={element.id}
          element={element}
          isSelected={selectedElement === element.id}
          isPreviewMode={isPreviewMode || canvasMode !== 'element-edit'}
          onSelect={() => onElementSelect(element.id)}
          onUpdate={(updates) => onElementUpdate(element.id, updates)}
          onDelete={() => onElementDelete(element.id)}
          otherElements={page.elements?.filter(el => el.id !== element.id) || []}
          pageWidth={pageWidth}
          pageHeight={pageHeight}
        />
      ))}

      {/* Empty Page State */}
      {(!page.elements || page.elements.length === 0) && !isPreviewMode && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none">
          <div className="text-center">
            <div className="text-4xl mb-2">📄</div>
            <div className="text-sm">Lege pagina</div>
            <div className="text-xs">Sleep elementen hierheen</div>
          </div>
        </div>
      )}

      {/* Page ID Badge */}
      <div className={`
        absolute top-4 right-4 text-white text-xs px-2 py-1 rounded-full
        ${isActivePage 
          ? 'bg-brand-blue' 
          : 'bg-black bg-opacity-50'
        }
      `}>
        {page.id.slice(-3)}
      </div>
      
      {/* Dynamic Page State Indicator */}
      {isActivePage && !isPreviewMode && canvasMode === 'page-edit' && (
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className={`text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 transition-all duration-200 ${
            isDragging ? 'bg-green-600 shadow-lg' : 
            dragMode === 'dragReady' ? 'bg-orange-500' : 
            'bg-brand-blue'
          }`}>
            <Move className="w-3 h-3" />
            {isDragging ? 'Verplaatsen...' : 
             dragMode === 'dragReady' ? 'Klaar om te slepen' :
             'Klik om te selecteren'}
          </div>
        </div>
      )}
      
      {/* Element Edit Mode Indicator */}
      {isActivePage && canvasMode === 'element-edit' && (
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
            <MousePointer className="w-3 h-3" />
            Element bewerking actief
          </div>
        </div>
      )}
      
      {/* Drag Handle (hover to show) */}
      {!isPreviewMode && !isActivePage && (
        <div 
          className="page-drag-handle absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-400 hover:bg-gray-600 text-white p-1 rounded cursor-grab opacity-0 hover:opacity-100 transition-opacity"
          title="Sleep pagina om te verplaatsen"
        >
          <Move className="w-4 h-4" />
        </div>
      )}
      
      {/* Dragging Visual Feedback */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-100 bg-opacity-30 border-2 border-dashed border-brand-blue rounded-lg pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white px-3 py-1 rounded-full text-sm font-medium">
            🧲 Magnetisch uitlijnen...
          </div>
          
          {/* Snap position indicator */}
          <div className="absolute -inset-1 border-2 border-green-400 border-dashed animate-pulse"></div>
        </div>
      )}
    </div>
  )
}