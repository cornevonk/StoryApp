import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Play, Pause, Home, Maximize, Minimize } from 'lucide-react'
import { TemplateElement } from '../elements/TemplateElement'

export function PresentationOverlay({ 
  pages, 
  isOpen, 
  onClose, 
  initialSlide = 0 
}) {
  const [currentPageId, setCurrentPageId] = useState(pages[initialSlide]?.id || null)
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Build spatial navigation map
  const buildSpatialMap = useCallback(() => {
    const spatialMap = new Map()
    
    pages.forEach(currentPage => {
      const currentPos = currentPage.position
      const neighbors = { left: null, right: null, up: null, down: null }
      
      pages.forEach(otherPage => {
        if (otherPage.id === currentPage.id) return
        
        const otherPos = otherPage.position
        const deltaX = otherPos.x - currentPos.x
        const deltaY = otherPos.y - currentPos.y
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        
        // Tolerances for alignment
        const horizontalTolerance = 100 // Pages considered "horizontally aligned" within this Y difference
        const verticalTolerance = 100   // Pages considered "vertically aligned" within this X difference
        
        // Right: same row (similar Y), positive X direction
        if (Math.abs(deltaY) <= horizontalTolerance && deltaX > 0) {
          if (!neighbors.right || distance < Math.sqrt(
            Math.pow(neighbors.right.position.x - currentPos.x, 2) + 
            Math.pow(neighbors.right.position.y - currentPos.y, 2)
          )) {
            neighbors.right = otherPage
          }
        }
        
        // Left: same row (similar Y), negative X direction  
        if (Math.abs(deltaY) <= horizontalTolerance && deltaX < 0) {
          if (!neighbors.left || distance < Math.sqrt(
            Math.pow(neighbors.left.position.x - currentPos.x, 2) + 
            Math.pow(neighbors.left.position.y - currentPos.y, 2)
          )) {
            neighbors.left = otherPage
          }
        }
        
        // Down: same column (similar X), positive Y direction
        if (Math.abs(deltaX) <= verticalTolerance && deltaY > 0) {
          if (!neighbors.down || distance < Math.sqrt(
            Math.pow(neighbors.down.position.x - currentPos.x, 2) + 
            Math.pow(neighbors.down.position.y - currentPos.y, 2)
          )) {
            neighbors.down = otherPage
          }
        }
        
        // Up: same column (similar X), negative Y direction
        if (Math.abs(deltaX) <= verticalTolerance && deltaY < 0) {
          if (!neighbors.up || distance < Math.sqrt(
            Math.pow(neighbors.up.position.x - currentPos.x, 2) + 
            Math.pow(neighbors.up.position.y - currentPos.y, 2)
          )) {
            neighbors.up = otherPage
          }
        }
      })
      
      spatialMap.set(currentPage.id, neighbors)
    })
    
    return spatialMap
  }, [pages])

  const spatialMap = buildSpatialMap()
  
  // Build reading route - ordered path through all pages
  const buildReadingRoute = useCallback(() => {
    if (pages.length === 0) return []
    
    // Start with top-left page (smallest X + Y)
    let route = []
    let visited = new Set()
    
    const startPage = pages.reduce((topLeft, page) => {
      const score = page.position.x + page.position.y
      const topLeftScore = topLeft.position.x + topLeft.position.y
      return score < topLeftScore ? page : topLeft
    })
    
    let currentRoutePoint = startPage
    route.push(currentRoutePoint)
    visited.add(currentRoutePoint.id)
    
    // Build route by following right-then-down flow
    while (route.length < pages.length) {
      const neighbors = spatialMap.get(currentRoutePoint.id)
      let nextPage = null
      
      // Prefer right first, then down, then any unvisited
      if (neighbors?.right && !visited.has(neighbors.right.id)) {
        nextPage = neighbors.right
      } else if (neighbors?.down && !visited.has(neighbors.down.id)) {
        nextPage = neighbors.down
      } else {
        // Find any unvisited neighbor
        const unvisitedNeighbors = Object.values(neighbors || {}).filter(n => n && !visited.has(n.id))
        if (unvisitedNeighbors.length > 0) {
          nextPage = unvisitedNeighbors[0]
        } else {
          // Jump to nearest unvisited page
          const unvisited = pages.filter(p => !visited.has(p.id))
          if (unvisited.length > 0) {
            nextPage = unvisited.reduce((nearest, page) => {
              const distToPage = Math.sqrt(
                Math.pow(page.position.x - currentRoutePoint.position.x, 2) +
                Math.pow(page.position.y - currentRoutePoint.position.y, 2)
              )
              const distToNearest = Math.sqrt(
                Math.pow(nearest.position.x - currentRoutePoint.position.x, 2) +
                Math.pow(nearest.position.y - currentRoutePoint.position.y, 2)
              )
              return distToPage < distToNearest ? page : nearest
            })
          }
        }
      }
      
      if (nextPage) {
        route.push(nextPage)
        visited.add(nextPage.id)
        currentRoutePoint = nextPage
      } else {
        break
      }
    }
    
    return route
  }, [pages, spatialMap])
  
  const readingRoute = buildReadingRoute()
  
  // Get current page object
  const currentPage = pages.find(p => p.id === currentPageId) || pages[0]
  const currentRouteIndex = readingRoute.findIndex(p => p.id === currentPageId)

  // Auto-play functionality following reading route
  useEffect(() => {
    if (!isAutoPlay || !isOpen || !currentPage || readingRoute.length === 0) return
    
    const timer = setInterval(() => {
      const nextIndex = currentRouteIndex + 1
      if (nextIndex < readingRoute.length) {
        setCurrentPageId(readingRoute[nextIndex].id)
      } else {
        // End of route, stop autoplay
        setIsAutoPlay(false)
      }
    }, 5000) // 5 seconds per slide
    
    return () => clearInterval(timer)
  }, [isAutoPlay, isOpen, currentPage, readingRoute, currentRouteIndex])

  // Tree-based directional navigation - matches visual positions in navigation tree
  const navigateToDirection = (direction) => {
    if (!currentPage) return
    
    // Calculate the same scaling and bounds as used in the navigation tree
    const minX = Math.min(...pages.map(p => p.position.x))
    const maxX = Math.max(...pages.map(p => p.position.x + 1200))
    const minY = Math.min(...pages.map(p => p.position.y))
    const maxY = Math.max(...pages.map(p => p.position.y + 800))
    
    const canvasWidth = maxX - minX
    const canvasHeight = maxY - minY
    const containerSize = 240
    const scale = Math.min(
      containerSize / canvasWidth,
      containerSize / canvasHeight,
      0.3
    )
    
    // Convert current page to tree coordinates
    const currentTreeX = (currentPage.position.x - minX) * scale
    const currentTreeY = (currentPage.position.y - minY) * scale
    
    // Filter candidates based on tree positions
    let candidatePages = []
    
    switch (direction) {
      case 'left':
        candidatePages = pages.filter(p => {
          const treeX = (p.position.x - minX) * scale
          return treeX < currentTreeX
        })
        break
      case 'right':
        candidatePages = pages.filter(p => {
          const treeX = (p.position.x - minX) * scale
          return treeX > currentTreeX
        })
        break
      case 'up':
        candidatePages = pages.filter(p => {
          const treeY = (p.position.y - minY) * scale
          return treeY < currentTreeY
        })
        break
      case 'down':
        candidatePages = pages.filter(p => {
          const treeY = (p.position.y - minY) * scale
          return treeY > currentTreeY
        })
        break
    }
    
    if (candidatePages.length === 0) {
      console.log(`No page ${direction} of current page in tree view`)
      return
    }
    
    // Find nearest by tree distance (not canvas distance)
    const nearest = candidatePages.sort((a, b) => {
      const aTreeX = (a.position.x - minX) * scale
      const aTreeY = (a.position.y - minY) * scale
      const bTreeX = (b.position.x - minX) * scale
      const bTreeY = (b.position.y - minY) * scale
      
      const distA = Math.sqrt(
        Math.pow(aTreeX - currentTreeX, 2) + 
        Math.pow(aTreeY - currentTreeY, 2)
      )
      const distB = Math.sqrt(
        Math.pow(bTreeX - currentTreeX, 2) + 
        Math.pow(bTreeY - currentTreeY, 2)
      )
      return distA - distB
    })[0]
    
    setCurrentPageId(nearest.id)
    setIsAutoPlay(false) // Stop autoplay on manual navigation
  }

  const navigateToFirstPage = () => {
    // Find the top-left page (smallest X + Y coordinates)
    const firstPage = pages.reduce((topLeft, page) => {
      const score = page.position.x + page.position.y
      const topLeftScore = topLeft.position.x + topLeft.position.y
      return score < topLeftScore ? page : topLeft
    })
    setCurrentPageId(firstPage.id)
  }

  const navigateToLastPage = () => {
    // Find the bottom-right page (largest X + Y coordinates)  
    const lastPage = pages.reduce((bottomRight, page) => {
      const score = page.position.x + page.position.y
      const bottomRightScore = bottomRight.position.x + bottomRight.position.y
      return score > bottomRightScore ? page : bottomRight
    })
    setCurrentPageId(lastPage.id)
  }

  // Keyboard navigation with spatial awareness
  const handleKeyPress = useCallback((e) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        navigateToDirection('right')
        break
      case 'ArrowLeft':
        e.preventDefault()
        navigateToDirection('left')
        break
      case 'ArrowUp':
        e.preventDefault()
        navigateToDirection('up')
        break
      case 'ArrowDown':
      case ' ': // Space now goes down instead of right
        e.preventDefault()
        navigateToDirection('down')
        break
      case 'Escape':
        onClose()
        break
      case 'Home':
        e.preventDefault()
        navigateToFirstPage()
        break
      case 'End':
        e.preventDefault()
        navigateToLastPage()
        break
      case 'f':
      case 'F11':
        e.preventDefault()
        toggleFullscreen()
        break
    }
  }, [currentPage, spatialMap])

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress, isOpen])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

  // Early return AFTER all hooks
  if (!isOpen || !pages.length) return null

  return (
    <div className="fixed inset-0 bg-black z-50 flex">
      {/* Left Panel - Minimalistic Navigation Tree (25%) */}
      <div className="w-1/4 flex items-center justify-center">
        <div className="relative bg-gray-800 rounded-xl w-80 h-80 border border-gray-600 flex items-center justify-center">
          {/* Calculate minimap bounds */}
          {(() => {
            if (pages.length === 0) return (
              <div className="text-gray-400 text-sm">
                Geen pagina's
              </div>
            )
            
            const minX = Math.min(...pages.map(p => p.position.x))
            const maxX = Math.max(...pages.map(p => p.position.x + 1200))
            const minY = Math.min(...pages.map(p => p.position.y))
            const maxY = Math.max(...pages.map(p => p.position.y + 800))
            
            const canvasWidth = maxX - minX
            const canvasHeight = maxY - minY
            
            // Container dimensions (320x320) with some margin
            const containerSize = 240
            
            // Calculate scale to fit the content with margin
            const scale = Math.min(
              containerSize / canvasWidth,
              containerSize / canvasHeight,
              0.3  // Maximum scale for readability
            )
            
            // Calculate scaled dimensions
            const scaledWidth = canvasWidth * scale
            const scaledHeight = canvasHeight * scale
            
            return (
              <div 
                className="relative"
                style={{
                  width: `${scaledWidth}px`,
                  height: `${scaledHeight}px`
                }}
              >
                {pages.map((page) => {
                  const x = (page.position.x - minX) * scale
                  const y = (page.position.y - minY) * scale
                  const isCurrent = page.id === currentPageId
                  
                  return (
                    <button
                      key={page.id}
                      onClick={() => {
                        setCurrentPageId(page.id)
                        setIsAutoPlay(false)
                      }}
                      className={`absolute rounded-full transition-all duration-300 border-2 ${
                        isCurrent 
                          ? 'w-6 h-6 bg-emerald-500 border-emerald-300 shadow-lg shadow-emerald-500/40 scale-110' 
                          : 'w-3 h-3 bg-emerald-600 border-emerald-400 hover:bg-emerald-500 hover:scale-125 hover:shadow-md hover:shadow-emerald-500/30'
                      }`}
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      title={page.name || `Pagina ${page.id.slice(-4)}`}
                    />
                  )
                })}
              </div>
            )
          })()}
        </div>
      </div>

      {/* Right Panel - Overlay Style Presentation (75%) */}
      <div className="flex-1 flex flex-col">
        {/* Header Controls - Floating Style */}
        <div className="bg-black bg-opacity-75 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium">
              Presentatie
            </h3>
            <div className="text-sm text-gray-300">
              {currentRouteIndex + 1} / {readingRoute.length}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-play toggle */}
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`p-2 rounded-lg transition-colors ${
                isAutoPlay 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title={isAutoPlay ? 'Auto-play aan' : 'Auto-play uit'}
            >
              {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Go to first page */}
            <button
              onClick={navigateToFirstPage}
              className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              title="Naar eerste pagina"
            >
              <Home className="w-4 h-4" />
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title="Presentatie sluiten"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area - Overlay Style */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          {/* Slide Title - Centered above slide */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white text-center">
              {currentPage?.name || 'Geen pagina'}
            </h2>
          </div>
          
          {/* Current Slide - Not Full Width */}
          <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
            style={{
              width: 'min(65vw, calc(55vh * 1.5))',
              height: 'min(55vh, calc(65vw / 1.5))',
              aspectRatio: '1200/800'
            }}
          >
            {/* Page Elements */}
            {currentPage?.elements?.map((element) => (
              <TemplateElement
                key={element.id}
                element={element}
                isSelected={false}
                isPreviewMode={true}
                onSelect={() => {}}
                onUpdate={() => {}}
                onDelete={() => {}}
                otherElements={[]}
                pageWidth={1200}
                pageHeight={800}
              />
            ))}

            {/* Empty slide indicator */}
            {(!currentPage?.elements || currentPage.elements.length === 0) && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <div className="text-lg">Lege pagina</div>
                </div>
              </div>
            )}
          </div>

          {/* Spatial Navigation Arrows */}
          <button
            onClick={() => navigateToDirection('left')}
            className="absolute left-4 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all"
            title="Pagina links"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => navigateToDirection('right')}
            className="absolute right-4 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all"
            title="Pagina rechts"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}