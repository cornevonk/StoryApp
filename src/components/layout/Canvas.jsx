import { useState, useRef, useEffect, useCallback } from 'react'
import { ZoomIn, ZoomOut, Move, Grid, Eye, MousePointer, Layout, Presentation, Undo2, Redo2, Sparkles, Loader2 } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'
import { aiTemplateService } from '../../services/aiTemplateService'
import { knowledgeDocumentService } from '../../services/knowledgeDocumentService'
import { TemplateElement } from '../elements/TemplateElement'
import { PageContainer } from '../elements/PageContainer'
import { TemplateEditor } from './TemplateEditor'
import { PresentationOverlay } from './PresentationOverlay'
import { ConfirmationModal } from '../ui/ConfirmationModal'
import { useConfirmation } from '../../hooks/useConfirmation'

export function Canvas({ 
  selectedElement, 
  onElementSelect, 
  onElementDeselect,
  templateEditorProps = null, // { template, isOpen, onClose, onSave }
  onPresentationModeChange, // Callback to inform parent about presentation mode
  canvasMode = 'page-edit', // Controlled by parent
  onCanvasModeChange // Callback to change canvas mode
}) {
  const { 
    currentProject, 
    pages = [], 
    activePage, 
    addPage, 
    setActivePage,
    addElementToPage,
    removePage,
    updatePagePosition,
    reorderPages,
    updatePageElement,
    removePageElement,
    undo,
    redo,
    canUndo,
    canRedo
  } = useProject()
  const [zoom, setZoom] = useState(100)
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const [isFillingWithAI, setIsFillingWithAI] = useState(false)
  const { modalProps, showAlert } = useConfirmation()
  
  // Notify parent when presentation mode changes
  const handlePresentationModeChange = (isOpen) => {
    setIsPresentationMode(isOpen)
    onPresentationModeChange?.(isOpen)
  }

  // AI Content Filling functionality
  const handleFillPageWithAI = async () => {
    if (!activePage || !currentProject) {
      showAlert({
        title: 'Geen pagina geselecteerd',
        message: 'Selecteer eerst een pagina om te vullen met AI content',
        type: 'info'
      })
      return
    }

    if (!aiTemplateService.isAvailable()) {
      showAlert({
        title: 'AI niet beschikbaar',
        message: 'OpenAI API is niet geconfigureerd. Voeg VITE_OPENAI_API_KEY toe aan je .env.local bestand.',
        type: 'error'
      })
      return
    }

    setIsFillingWithAI(true)

    try {
      // Get current page and its elements
      const currentPage = pages.find(p => p.id === activePage)
      if (!currentPage || !currentPage.elements || currentPage.elements.length === 0) {
        showAlert({
          title: 'Geen elementen gevonden',
          message: 'Deze pagina heeft geen elementen om te vullen. Voeg eerst tekst of heading elementen toe.',
          type: 'info'
        })
        return
      }

      // Load knowledge documents
      const knowledgeDocuments = await knowledgeDocumentService.getByProject(currentProject.id)
      console.log(`🧠 Loaded ${knowledgeDocuments.length} knowledge documents for AI generation`)
      
      if (knowledgeDocuments.length === 0) {
        showAlert({
          title: 'Geen kennisdocumenten',
          message: 'Upload eerst kennisdocumenten via het "Kennis Documenten" menu.',
          type: 'info'
        })
        return
      }

      // Filter fillable elements (text and heading only)
      const fillableElements = currentPage.elements.filter(el => 
        el.element_type === 'text' || el.element_type === 'heading' || el.type === 'text' || el.type === 'heading'
      )

      if (fillableElements.length === 0) {
        showAlert({
          title: 'Geen tekst elementen',
          message: 'Deze pagina heeft geen tekst of heading elementen om te vullen.',
          type: 'info'
        })
        return
      }

      // Generate context for this page based on its position and any existing content
      const pageContext = `Pagina ${pages.indexOf(currentPage) + 1} van ${pages.length}`
      
      // Fill each element with AI-generated content
      const updatedElements = await Promise.all(
        fillableElements.map(async (element) => {
          try {
            // Get layout metadata from the current page template
            const pageTemplate = currentPage.layoutMetadata || { 
              layoutStyle: 'professional', 
              focusArea: 'text', 
              complexity: 'medium' 
            }

            const generatedContent = await aiTemplateService.generateElementContent(
              {
                ...element,
                contentPrompt: element.element_type === 'heading' || element.type === 'heading' 
                  ? 'Genereer een pakkende titel voor deze sectie'
                  : 'Schrijf informatieve content voor deze sectie (2-4 zinnen)'
              },
              knowledgeDocuments,
              pageContext,
              pageTemplate // ← Advanced layout metadata for intelligent content generation
            )

            // Update the element in the project context
            updatePageElement(activePage, element.id, { 
              content: generatedContent,
              ai_generated: true
            })

            return {
              ...element,
              content: generatedContent,
              ai_generated: true
            }
          } catch (error) {
            console.error(`Error generating content for element ${element.id}:`, error)
            return element // Keep original if generation fails
          }
        })
      )

      showAlert({
        title: '✨ AI Content Gegenereerd!',
        message: `${fillableElements.length} elementen zijn gevuld met AI-gegenereerde content.`,
        type: 'success'
      })

    } catch (error) {
      console.error('AI Page Fill Error:', error)
      showAlert({
        title: 'AI Fout',
        message: `Fout bij het genereren van AI content: ${error.message}`,
        type: 'error'
      })
    } finally {
      setIsFillingWithAI(false)
    }
  }
  
  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle shortcuts if not in input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault()
          if (canUndo) undo()
        }
        if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault()
          if (canRedo) redo()
        }
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  // Unified page interaction state
  const [pageInteraction, setPageInteraction] = useState({
    mode: 'idle', // 'idle', 'hover', 'dragReady', 'dragging'
    targetPageId: null,
    dragStart: { x: 0, y: 0, time: 0 },
    currentPosition: { x: 0, y: 0 },
    initialPagePosition: { x: 0, y: 0 },
    snapGuides: []
  })

  const handleZoom = (delta) => {
    setZoom(prev => Math.max(25, Math.min(200, prev + delta)))
  }

  // Smart proximity-based magnetic snapping for infinite 360° canvas
  const getSnappedPosition = useCallback((dragX, dragY, draggedPageId) => {
    const pageWidth = 1200
    const pageHeight = 800
    const padding = 30
    const snapDistance = 80 // Distance within which snapping occurs
    const proximityThreshold = 200 // Only consider pages within this distance
    
    const otherPages = pages.filter(p => p.id !== draggedPageId)
    
    // If no other pages, allow free positioning
    if (otherPages.length === 0) {
      return { x: dragX, y: dragY }
    }
    
    // Find nearby pages (within proximity threshold)
    const nearbyPages = otherPages.filter(page => {
      const distance = Math.sqrt(
        Math.pow(dragX - page.position.x, 2) + 
        Math.pow(dragY - page.position.y, 2)
      )
      return distance <= proximityThreshold
    })
    
    // If no nearby pages, allow free positioning
    if (nearbyPages.length === 0) {
      return { x: dragX, y: dragY }
    }
    
    let snapX = dragX
    let snapY = dragY
    let snapInfo = { xSnapped: false, ySnapped: false, guides: [] }
    
    // Find the best snap targets with prioritized scoring
    let bestXSnap = { distance: Infinity, position: dragX, type: 'none' }
    let bestYSnap = { distance: Infinity, position: dragY, type: 'none' }
    
    nearbyPages.forEach(page => {
      const pageX = page.position.x
      const pageY = page.position.y
      
      // Y-axis snapping options (horizontal alignment)
      const yAlignOptions = [
        { pos: pageY, dist: Math.abs(dragY - pageY), type: 'align' },
        { pos: pageY + pageHeight + padding, dist: Math.abs(dragY - (pageY + pageHeight + padding)), type: 'below' },
        { pos: pageY - pageHeight - padding, dist: Math.abs(dragY - (pageY - pageHeight - padding)), type: 'above' }
      ]
      
      yAlignOptions.forEach(option => {
        if (option.dist <= snapDistance && option.dist < bestYSnap.distance) {
          bestYSnap = { distance: option.dist, position: option.pos, type: option.type, refPage: page }
        }
      })
      
      // X-axis snapping options (vertical alignment)  
      const xAlignOptions = [
        { pos: pageX, dist: Math.abs(dragX - pageX), type: 'align' },
        { pos: pageX + pageWidth + padding, dist: Math.abs(dragX - (pageX + pageWidth + padding)), type: 'right' },
        { pos: pageX - pageWidth - padding, dist: Math.abs(dragX - (pageX - pageWidth - padding)), type: 'left' }
      ]
      
      xAlignOptions.forEach(option => {
        if (option.dist <= snapDistance && option.dist < bestXSnap.distance) {
          bestXSnap = { distance: option.dist, position: option.pos, type: option.type, refPage: page }
        }
      })
    })
    
    // Apply the best snaps
    if (bestXSnap.distance < Infinity) {
      snapX = bestXSnap.position
      snapInfo.xSnapped = true
      if (bestXSnap.type === 'align') {
        snapInfo.guides.push({
          type: 'vertical',
          position: snapX,
          fromY: Math.min(dragY, bestXSnap.refPage.position.y) - 50,
          toY: Math.max(dragY + pageHeight, bestXSnap.refPage.position.y + pageHeight) + 50
        })
      }
    }
    
    if (bestYSnap.distance < Infinity) {
      snapY = bestYSnap.position
      snapInfo.ySnapped = true
      if (bestYSnap.type === 'align') {
        snapInfo.guides.push({
          type: 'horizontal',
          position: snapY,
          fromX: Math.min(dragX, bestYSnap.refPage.position.x) - 50,
          toX: Math.max(dragX + pageWidth, bestYSnap.refPage.position.x + pageWidth) + 50
        })
      }
    }
    
    // Check for collisions and adjust if necessary
    const wouldCollide = otherPages.some(page => {
      const buffer = 10 // Small buffer to prevent exact overlaps
      return (
        snapX < page.position.x + pageWidth + buffer &&
        snapX + pageWidth > page.position.x - buffer &&
        snapY < page.position.y + pageHeight + buffer &&
        snapY + pageHeight > page.position.y - buffer
      )
    })
    
    if (wouldCollide) {
      // If collision detected, use original drag position
      return { x: dragX, y: dragY, snapInfo }
    }
    
    return { x: snapX, y: snapY, snapInfo }
  }, [pages])

  // Unified page interaction system
  const handlePageMouseDown = useCallback((e, pageId) => {
    if (canvasMode !== 'page-edit') return

    const page = pages.find(p => p.id === pageId)
    if (!page) return

    e.preventDefault()
    e.stopPropagation()

    const rect = containerRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    setPageInteraction({
      mode: 'dragReady',
      targetPageId: pageId,
      dragStart: { 
        x: mouseX, 
        y: mouseY, 
        time: Date.now() 
      },
      currentPosition: { x: mouseX, y: mouseY },
      initialPagePosition: { x: page.position.x, y: page.position.y },
      snapGuides: []
    })

    // Always set as active page
    setActivePage(pageId)
  }, [canvasMode, pages, setActivePage])

  const handlePageMouseMove = useCallback((e) => {
    if (pageInteraction.mode === 'idle') return

    const rect = containerRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const deltaX = mouseX - pageInteraction.dragStart.x
    const deltaY = mouseY - pageInteraction.dragStart.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const timeDelta = Date.now() - pageInteraction.dragStart.time

    // Transition from dragReady to dragging if moved enough
    if (pageInteraction.mode === 'dragReady' && distance > 5) {
      setPageInteraction(prev => ({
        ...prev,
        mode: 'dragging'
      }))
    }

    // Update current position for both dragReady and dragging
    if (pageInteraction.mode === 'dragReady' || pageInteraction.mode === 'dragging') {
      // Convert mouse movement to canvas coordinates
      const scale = zoom / 100
      const canvasX = (mouseX - panOffset.x) / scale
      const canvasY = (mouseY - panOffset.y) / scale
      const startCanvasX = (pageInteraction.dragStart.x - panOffset.x) / scale
      const startCanvasY = (pageInteraction.dragStart.y - panOffset.y) / scale

      const newPageX = pageInteraction.initialPagePosition.x + (canvasX - startCanvasX)
      const newPageY = pageInteraction.initialPagePosition.y + (canvasY - startCanvasY)

      setPageInteraction(prev => ({
        ...prev,
        currentPosition: { x: mouseX, y: mouseY }
      }))

      // Update page position during dragging
      if (pageInteraction.mode === 'dragging') {
        const result = getSnappedPosition(newPageX, newPageY, pageInteraction.targetPageId)
        updatePagePosition(pageInteraction.targetPageId, { x: result.x, y: result.y })
      }
    }
  }, [pageInteraction, zoom, panOffset, getSnappedPosition, updatePagePosition])

  const handlePageMouseUp = useCallback((e) => {
    const timeDelta = Date.now() - pageInteraction.dragStart.time
    const deltaX = pageInteraction.currentPosition.x - pageInteraction.dragStart.x
    const deltaY = pageInteraction.currentPosition.y - pageInteraction.dragStart.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // If it was a quick click with minimal movement, just select (no additional action needed)
    const wasClick = timeDelta < 150 && distance < 5

    // Reset interaction state
    setPageInteraction({
      mode: 'idle',
      targetPageId: null,
      dragStart: { x: 0, y: 0, time: 0 },
      currentPosition: { x: 0, y: 0 },
      initialPagePosition: { x: 0, y: 0 },
      snapGuides: []
    })
  }, [pageInteraction])

  // Scroll to page function - only called from PageNavigator for zoom + center
  const scrollToPageAndCenter = (pageId) => {
    const page = pages.find(p => p.id === pageId)
    if (!page || !containerRef.current) return

    // Set zoom to 100% first
    setZoom(100)
    
    // Calculate center position for the page at 100% zoom
    const pagePosition = page.position
    const canvasRect = containerRef.current.getBoundingClientRect()
    
    // Center the page in the viewport (at 100% zoom, scale factor = 1)
    const targetX = -pagePosition.x + (canvasRect.width / 2) - (1200 / 2)
    const targetY = -pagePosition.y + (canvasRect.height / 2) - (800 / 2)
    
    // Animate to target position
    const startOffset = { x: panOffset.x, y: panOffset.y }
    const targetOffset = { x: targetX, y: targetY }
    const duration = 600
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 0.5 - Math.cos(progress * Math.PI) / 2

      const newOffset = {
        x: startOffset.x + (targetOffset.x - startOffset.x) * eased,
        y: startOffset.y + (targetOffset.y - startOffset.y) * eased
      }

      setPanOffset(newOffset)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }

  // Make this function available globally so PageNavigator can call it
  useEffect(() => {
    window.canvasScrollToPage = scrollToPageAndCenter
    return () => {
      delete window.canvasScrollToPage
    }
  }, [pages, panOffset])

  // Canvas panning - only when not interacting with pages
  const handleMouseDown = (e) => {
    // Don't start panning if we're in page interaction mode
    if (pageInteraction.mode !== 'idle') return

    if (e.button === 0 && (e.target === canvasRef.current || e.target === containerRef.current)) {
      setIsPanning(true)
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
      onElementDeselect()
    }
  }

  const handleMouseMove = useCallback((e) => {
    // Handle page interactions first
    if (pageInteraction.mode !== 'idle') {
      handlePageMouseMove(e)
      return
    }

    // Then handle canvas panning
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      })
    }
  }, [isPanning, panStart, pageInteraction.mode, handlePageMouseMove])

  const handleMouseUp = useCallback((e) => {
    // Handle page interaction end first
    if (pageInteraction.mode !== 'idle') {
      handlePageMouseUp(e)
    }
    
    // Then handle canvas panning end
    setIsPanning(false)
  }, [pageInteraction.mode, handlePageMouseUp])

  // Scroll zoom & horizontal scroll
  const handleWheel = useCallback((e) => {
    e.preventDefault()
    
    if (e.ctrlKey || e.metaKey) {
      // Zoom with Ctrl/Cmd + scroll
      const delta = e.deltaY > 0 ? -10 : 10
      handleZoom(delta)
    } else if (e.shiftKey || e.deltaX !== 0) {
      // Horizontal scroll with Shift + scroll or horizontal wheel
      setPanOffset(prev => ({
        x: prev.x - e.deltaX - e.deltaY,
        y: prev.y
      }))
    } else {
      // Regular scroll zoom
      const delta = e.deltaY > 0 ? -10 : 10
      handleZoom(delta)
    }
  }, [])

  // Event listeners
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        container.removeEventListener('wheel', handleWheel)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [handleWheel, handleMouseMove, handleMouseUp])

  // Calculate a good visible position for new templates
  const getVisiblePosition = (mouseX, mouseY) => {
    if (!containerRef.current) return { x: 0, y: 0 }
    
    const rect = containerRef.current.getBoundingClientRect()
    const scale = zoom / 100
    
    // If dropped via mouse, try to use that position first
    let targetX = (mouseX - rect.left - panOffset.x) / scale
    let targetY = (mouseY - rect.top - panOffset.y) / scale
    
    // If no mouse coordinates (e.g., from sidebar), place in center of viewport
    if (mouseX === undefined || mouseY === undefined) {
      targetX = (-panOffset.x + rect.width / 2) / scale - 600 // 600 = pageWidth/2
      targetY = (-panOffset.y + rect.height / 2) / scale - 400 // 400 = pageHeight/2
    }
    
    // Ensure the page is at least partially visible in the viewport
    const viewportLeft = -panOffset.x / scale
    const viewportTop = -panOffset.y / scale
    const viewportRight = viewportLeft + rect.width / scale
    const viewportBottom = viewportTop + rect.height / scale
    
    // If completely outside viewport, place in visible area
    if (targetX + 1200 < viewportLeft || targetX > viewportRight) {
      targetX = viewportLeft + 50 // 50px margin
    }
    if (targetY + 800 < viewportTop || targetY > viewportBottom) {
      targetY = viewportTop + 50 // 50px margin  
    }
    
    return { x: targetX, y: targetY }
  }

  // Drop handler for elements and templates  
  const handleDrop = (e) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('application/json')
    if (data) {
      const item = JSON.parse(data)
      
      if (item.type === 'template') {
        // Calculate visible position for new page
        const position = getVisiblePosition(e.clientX, e.clientY)
        addPage(item.template, position)
      } else if (item.type === 'element') {
        // Only allow adding elements when Elements tab is active
        if (canvasMode !== 'element-edit') {
          showAlert({
            title: 'Verkeerde modus',
            message: 'Schakel naar "Elementen" tab om elementen aan pagina\'s toe te voegen',
            type: 'info'
          })
          return
        }
        
        // Add element to active page - centered on page
        if (activePage) {
          const elementWidth = item.elementType.type === 'heading' ? 400 : item.elementType.type === 'text' ? 300 : 250
          const elementHeight = item.elementType.type === 'heading' ? 50 : item.elementType.type === 'text' ? 100 : 150
          
          const newElement = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            element_type: item.elementType.type, // Use element_type for Supabase compatibility
            x: (1200 - elementWidth) / 2, // Center horizontally on 1200px page
            y: (800 - elementHeight) / 2,  // Center vertically on 800px page
            width: elementWidth,
            height: elementHeight,
            ...item.elementType.defaultProps
          }
          addElementToPage(activePage, newElement)
        }
      } else if (item.type === 'asset') {
        // Handle asset drop - create image element on active page
        if (canvasMode !== 'element-edit') {
          showAlert({
            title: 'Verkeerde modus', 
            message: 'Schakel naar "Elementen" tab om assets aan pagina\'s toe te voegen',
            type: 'info'
          })
          return
        }
        
        if (activePage) {
          // Find the active page container to get accurate coordinates
          const pageElement = document.querySelector(`[data-page-id="${activePage}"]`)
          if (pageElement) {
            const pageRect = pageElement.getBoundingClientRect()
            const x = e.clientX - pageRect.left
            const y = e.clientY - pageRect.top
            
            // Convert to relative coordinates within the 1200x800 page
            const relativeX = (x / pageRect.width) * 1200
            const relativeY = (y / pageRect.height) * 800
            
            const newElement = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
              type: 'image', // Use type for consistency with template editor
              element_type: 'image', // Keep both for compatibility
              x: Math.max(0, Math.min(1200 - 200, relativeX - 100)), // Position at drop location, center asset on cursor
              y: Math.max(0, Math.min(800 - 150, relativeY - 75)),  // Position at drop location, center asset on cursor
              width: 200,
              height: 150,
              content: item.asset.url,
              src: item.asset.url,
              alt: item.asset.name,
              assetId: item.asset.id,
              assetName: item.asset.name
            }
            addElementToPage(activePage, newElement)
          }
        }
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }


  // Smart page positioning with drag & drop support
  const calculatePageLayout = () => {
    const pageWidth = 1200
    const pageHeight = 800
    const padding = 30
    
    // Sort pages by their current position to determine layout
    const sortedPages = [...pages].sort((a, b) => {
      // Primary sort by Y position, secondary by X position
      if (Math.abs(a.position.y - b.position.y) < 100) {
        return a.position.x - b.position.x // Same row, sort by X
      }
      return a.position.y - b.position.y // Different rows, sort by Y
    })
    
    // Group pages by rows (pages with similar Y positions)
    const rows = []
    let currentRow = []
    let currentRowY = null
    
    sortedPages.forEach(page => {
      if (currentRowY === null || Math.abs(page.position.y - currentRowY) < 100) {
        // Same row
        currentRow.push(page)
        currentRowY = page.position.y
      } else {
        // New row
        if (currentRow.length > 0) rows.push(currentRow)
        currentRow = [page]
        currentRowY = page.position.y
      }
    })
    if (currentRow.length > 0) rows.push(currentRow)
    
    return { rows, sortedPages }
  }
  
  const { rows, sortedPages } = calculatePageLayout()

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Canvas Toolbar - Hidden when template editor is open */}
      {!templateEditorProps?.isOpen && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => {
                  onCanvasModeChange?.('page-edit')
                  onElementDeselect()
                }}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  canvasMode === 'page-edit' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Layout className="w-4 h-4 inline mr-1" />
                Pagina's
              </button>
              <button 
                onClick={() => onCanvasModeChange?.('element-edit')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  canvasMode === 'element-edit' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MousePointer className="w-4 h-4 inline mr-1" />
                Elementen
              </button>
              <button 
                onClick={() => {
                  onCanvasModeChange?.('preview')
                  onElementDeselect()
                }}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  canvasMode === 'preview' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-4 h-4 inline mr-1" />
                Voorbeeld
              </button>
            </div>
            
            <div className="h-6 w-px bg-gray-300" />
            
            <button 
              onClick={() => {
                if (pages.length > 0) {
                  handlePresentationModeChange(true)
                  setCurrentSlide(0)
                }
              }}
              disabled={pages.length === 0}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-300 disabled:text-gray-500"
            >
              <Presentation className="w-4 h-4" />
              Presentatie
            </button>
            
            <div className="h-6 w-px bg-gray-300" />
            
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Undo/Redo buttons */}
            <button 
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className={`p-2 rounded-lg transition-colors ${
                canUndo 
                  ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button 
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              className={`p-2 rounded-lg transition-colors ${
                canRedo 
                  ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <Redo2 className="w-4 h-4" />
            </button>
            
            {/* AI Fill Button - only show when active page has fillable elements */}
            {activePage && (
              <>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                  onClick={handleFillPageWithAI}
                  disabled={isFillingWithAI}
                  title="Vul pagina met AI content op basis van kennisdocumenten"
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isFillingWithAI
                      ? 'bg-purple-100 text-purple-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-sm hover:shadow-md'
                  }`}
                >
                  {isFillingWithAI ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </button>
              </>
            )}
            
            {/* Divider */}
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            {/* Zoom controls */}
            <button 
              onClick={() => handleZoom(-25)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {zoom}%
            </span>
            <button 
              onClick={() => handleZoom(25)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
        </div>
      )}

      {/* Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden relative"
        style={{ 
          cursor: isPanning ? 'grabbing' : 'grab',
          backgroundImage: `
            radial-gradient(circle, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
        }}
        onMouseDown={handleMouseDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div 
          ref={canvasRef}
          className="absolute"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Pages */}
          {pages.map((page) => (
            <PageContainer
              key={page.id}
              page={page}
              position={page.position}
              zoom={zoom}
              isPreviewMode={canvasMode === 'preview'}
              canvasMode={canvasMode}
              selectedElement={canvasMode === 'element-edit' ? selectedElement : null}
              onElementSelect={canvasMode === 'element-edit' ? onElementSelect : () => {}}
              onElementUpdate={(elementId, updates) => updatePageElement(page.id, elementId, updates)}
              onElementDelete={(elementId) => removePageElement(page.id, elementId)}
              onPageMouseDown={(e) => handlePageMouseDown(e, page.id)}
              isDragging={pageInteraction.mode === 'dragging' && pageInteraction.targetPageId === page.id}
              dragMode={pageInteraction.mode}
              isActivePage={activePage === page.id}
            />
          ))}

          {/* Empty State */}
          {pages.length === 0 && !templateEditorProps?.isOpen && (
            <div 
              className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 flex items-center justify-center"
              style={{
                width: '1200px',
                height: '800px'
              }}
            >
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">📄</div>
                <div className="text-lg font-medium mb-2">Leeg canvas</div>
                <div className="text-sm mb-4">
                  Sleep sjablonen hierheen uit het sidepanel
                </div>
                <div className="text-xs text-gray-500">
                  <div>• <strong>Pagina's mode:</strong> Sleep pagina's om te verplaatsen</div>
                  <div>• <strong>Elementen mode:</strong> Bewerk elementen binnen pagina's</div>
                  <div>• Scroll = zoom, Sleep canvas = navigeren</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sjabloon Editor - overlay only canvas area */}
        {templateEditorProps?.isOpen && (
          <div className="absolute inset-0 z-50">
            <TemplateEditor
              template={templateEditorProps.template}
              isOpen={templateEditorProps.isOpen}
              onClose={templateEditorProps.onClose}
              onSave={templateEditorProps.onSave}
            />
          </div>
        )}
      </div>

      {/* Presentation Overlay - fullscreen */}
      <PresentationOverlay
        pages={pages}
        isOpen={isPresentationMode}
        onClose={() => handlePresentationModeChange(false)}
        initialSlide={currentSlide}
      />
      
      {/* Confirmation Modal */}
      <ConfirmationModal {...modalProps} />
    </div>
  )
}