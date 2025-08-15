import { X, Move } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'

export function PageNavigator() {
  const { 
    pages, 
    activePage,
    setActivePage, 
    removePage 
  } = useProject()

  const handlePageClick = (pageId) => {
    setActivePage(pageId)
    
    // Call the global scroll function for zoom + center behavior
    if (window.canvasScrollToPage && typeof window.canvasScrollToPage === 'function') {
      window.canvasScrollToPage(pageId)
    }
  }

  const handleRemovePage = (pageId, e) => {
    e.stopPropagation()
    if (confirm('Weet u zeker dat u deze pagina wilt verwijderen?')) {
      removePage(pageId)
    }
  }

  // Calculate reading order based on page positions
  const getReadingOrder = () => {
    return [...pages].sort((a, b) => {
      // Primary sort by Y position, secondary by X position
      if (Math.abs(a.position.y - b.position.y) < 100) {
        return a.position.x - b.position.x // Same row, sort by X
      }
      return a.position.y - b.position.y // Different rows, sort by Y
    })
  }
  
  const orderedPages = getReadingOrder()

  if (pages.length === 0) {
    return null
  }

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[200px] max-w-[250px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">
            Pagina's ({pages.length})
          </h3>
          <div className="flex items-center gap-1">
            <Move className="w-4 h-4 text-gray-400" title="Sleep pagina's om volgorde te wijzigen" />
          </div>
        </div>

        {/* Page List - Ordered by reading flow */}
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {orderedPages.map((page, index) => (
            <div
              key={page.id}
              onClick={() => handlePageClick(page.id)}
              className={`
                group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all
                ${activePage === page.id 
                  ? 'bg-brand-blue text-white shadow-sm' 
                  : 'hover:bg-gray-50 text-gray-700'
                }
              `}
            >
              {/* Page Info */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className={`
                  w-8 h-6 rounded border-2 flex items-center justify-center text-xs font-medium flex-shrink-0
                  ${activePage === page.id 
                    ? 'border-white text-white' 
                    : 'border-gray-300 text-gray-500'
                  }
                `}>
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`
                    text-sm font-medium truncate
                    ${activePage === page.id ? 'text-white' : 'text-gray-900'}
                  `}>
                    {page.name}
                  </div>
                  <div className={`
                    text-xs truncate
                    ${activePage === page.id ? 'text-blue-100' : 'text-gray-500'}
                  `}>
                    {page.elements?.length || 0} elementen
                  </div>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => handleRemovePage(page.id, e)}
                className={`
                  p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity
                  ${activePage === page.id 
                    ? 'hover:bg-red-500 text-white hover:text-white' 
                    : 'hover:bg-red-50 text-red-500'
                  }
                `}
                title="Pagina verwijderen"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Sleep pagina's op canvas om layout te wijzigen
          </div>
        </div>
      </div>
    </div>
  )
}