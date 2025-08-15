import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Move, RotateCcw } from 'lucide-react'

export function TemplateElement({ 
  element, 
  isSelected, 
  isPreviewMode, 
  onSelect, 
  onUpdate, 
  onDelete,
  otherElements = [],
  pageWidth = 1200,
  pageHeight = 800
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isEditing, setIsEditing] = useState(false)
  const [smartGuides, setSmartGuides] = useState([])
  const elementRef = useRef(null)

  // Smart guide detection for dragging
  const getSmartGuides = useCallback((dragX, dragY, dragWidth, dragHeight) => {
    if (!otherElements.length) return { snappedX: dragX, snappedY: dragY, guides: [] }

    const snapThreshold = 8
    const guides = []
    let snappedX = dragX
    let snappedY = dragY
    let hasSnappedX = false
    let hasSnappedY = false

    otherElements.forEach(otherElement => {
      if (otherElement.id === element.id) return

      const otherX = otherElement.x
      const otherY = otherElement.y
      const otherWidth = otherElement.width
      const otherHeight = otherElement.height
      const otherCenterX = otherX + otherWidth / 2
      const otherCenterY = otherY + otherHeight / 2
      const otherRight = otherX + otherWidth
      const otherBottom = otherY + otherHeight

      const dragCenterX = dragX + dragWidth / 2
      const dragCenterY = dragY + dragHeight / 2
      const dragRight = dragX + dragWidth
      const dragBottom = dragY + dragHeight

      // X-axis snapping
      if (!hasSnappedX) {
        // Left edges align
        if (Math.abs(dragX - otherX) <= snapThreshold) {
          snappedX = otherX
          hasSnappedX = true
          guides.push({ type: 'vertical', x: otherX, y1: Math.min(dragY, otherY) - 20, y2: Math.max(dragBottom, otherBottom) + 20 })
        }
        // Right edges align
        else if (Math.abs(dragRight - otherRight) <= snapThreshold) {
          snappedX = otherRight - dragWidth
          hasSnappedX = true
          guides.push({ type: 'vertical', x: otherRight, y1: Math.min(dragY, otherY) - 20, y2: Math.max(dragBottom, otherBottom) + 20 })
        }
        // Center alignment
        else if (Math.abs(dragCenterX - otherCenterX) <= snapThreshold) {
          snappedX = otherCenterX - dragWidth / 2
          hasSnappedX = true
          guides.push({ type: 'vertical', x: otherCenterX, y1: Math.min(dragY, otherY) - 20, y2: Math.max(dragBottom, otherBottom) + 20 })
        }
        // Left to right edge
        else if (Math.abs(dragX - otherRight) <= snapThreshold) {
          snappedX = otherRight
          hasSnappedX = true
          guides.push({ type: 'vertical', x: otherRight, y1: Math.min(dragY, otherY) - 20, y2: Math.max(dragBottom, otherBottom) + 20 })
        }
        // Right to left edge
        else if (Math.abs(dragRight - otherX) <= snapThreshold) {
          snappedX = otherX - dragWidth
          hasSnappedX = true
          guides.push({ type: 'vertical', x: otherX, y1: Math.min(dragY, otherY) - 20, y2: Math.max(dragBottom, otherBottom) + 20 })
        }
      }

      // Y-axis snapping
      if (!hasSnappedY) {
        // Top edges align
        if (Math.abs(dragY - otherY) <= snapThreshold) {
          snappedY = otherY
          hasSnappedY = true
          guides.push({ type: 'horizontal', y: otherY, x1: Math.min(dragX, otherX) - 20, x2: Math.max(dragRight, otherRight) + 20 })
        }
        // Bottom edges align
        else if (Math.abs(dragBottom - otherBottom) <= snapThreshold) {
          snappedY = otherBottom - dragHeight
          hasSnappedY = true
          guides.push({ type: 'horizontal', y: otherBottom, x1: Math.min(dragX, otherX) - 20, x2: Math.max(dragRight, otherRight) + 20 })
        }
        // Center alignment
        else if (Math.abs(dragCenterY - otherCenterY) <= snapThreshold) {
          snappedY = otherCenterY - dragHeight / 2
          hasSnappedY = true
          guides.push({ type: 'horizontal', y: otherCenterY, x1: Math.min(dragX, otherX) - 20, x2: Math.max(dragRight, otherRight) + 20 })
        }
        // Top to bottom edge
        else if (Math.abs(dragY - otherBottom) <= snapThreshold) {
          snappedY = otherBottom
          hasSnappedY = true
          guides.push({ type: 'horizontal', y: otherBottom, x1: Math.min(dragX, otherX) - 20, x2: Math.max(dragRight, otherRight) + 20 })
        }
        // Bottom to top edge
        else if (Math.abs(dragBottom - otherY) <= snapThreshold) {
          snappedY = otherY - dragHeight
          hasSnappedY = true
          guides.push({ type: 'horizontal', y: otherY, x1: Math.min(dragX, otherX) - 20, x2: Math.max(dragRight, otherRight) + 20 })
        }
      }
    })

    return { snappedX, snappedY, guides }
  }, [otherElements, element.id])

  // Smart guide detection for resizing
  const getResizeSmartGuides = useCallback((newX, newY, newWidth, newHeight, direction) => {
    if (!otherElements.length) return { snappedX: newX, snappedY: newY, snappedWidth: newWidth, snappedHeight: newHeight, guides: [] }

    const snapThreshold = 8
    const guides = []
    let snappedX = newX
    let snappedY = newY
    let snappedWidth = newWidth
    let snappedHeight = newHeight

    const newRight = newX + newWidth
    const newBottom = newY + newHeight
    const newCenterX = newX + newWidth / 2
    const newCenterY = newY + newHeight / 2

    otherElements.forEach(otherElement => {
      if (otherElement.id === element.id) return

      const otherX = otherElement.x
      const otherY = otherElement.y
      const otherWidth = otherElement.width
      const otherHeight = otherElement.height
      const otherRight = otherX + otherWidth
      const otherBottom = otherY + otherHeight
      const otherCenterX = otherX + otherWidth / 2
      const otherCenterY = otherY + otherHeight / 2

      // Only snap edges that are being resized
      if (direction.includes('e')) {
        // Right edge snapping
        if (Math.abs(newRight - otherRight) <= snapThreshold) {
          snappedWidth = otherRight - newX
          guides.push({ type: 'vertical', x: otherRight, y1: Math.min(newY, otherY) - 20, y2: Math.max(newBottom, otherBottom) + 20 })
        } else if (Math.abs(newRight - otherX) <= snapThreshold) {
          snappedWidth = otherX - newX
          guides.push({ type: 'vertical', x: otherX, y1: Math.min(newY, otherY) - 20, y2: Math.max(newBottom, otherBottom) + 20 })
        }
      }

      if (direction.includes('w')) {
        // Left edge snapping
        if (Math.abs(newX - otherX) <= snapThreshold) {
          const widthDiff = newX - otherX
          snappedX = otherX
          snappedWidth = newWidth + widthDiff
          guides.push({ type: 'vertical', x: otherX, y1: Math.min(newY, otherY) - 20, y2: Math.max(newBottom, otherBottom) + 20 })
        } else if (Math.abs(newX - otherRight) <= snapThreshold) {
          const widthDiff = newX - otherRight
          snappedX = otherRight
          snappedWidth = newWidth + widthDiff
          guides.push({ type: 'vertical', x: otherRight, y1: Math.min(newY, otherY) - 20, y2: Math.max(newBottom, otherBottom) + 20 })
        }
      }

      if (direction.includes('s')) {
        // Bottom edge snapping
        if (Math.abs(newBottom - otherBottom) <= snapThreshold) {
          snappedHeight = otherBottom - newY
          guides.push({ type: 'horizontal', y: otherBottom, x1: Math.min(newX, otherX) - 20, x2: Math.max(newRight, otherRight) + 20 })
        } else if (Math.abs(newBottom - otherY) <= snapThreshold) {
          snappedHeight = otherY - newY
          guides.push({ type: 'horizontal', y: otherY, x1: Math.min(newX, otherX) - 20, x2: Math.max(newRight, otherRight) + 20 })
        }
      }

      if (direction.includes('n')) {
        // Top edge snapping
        if (Math.abs(newY - otherY) <= snapThreshold) {
          const heightDiff = newY - otherY
          snappedY = otherY
          snappedHeight = newHeight + heightDiff
          guides.push({ type: 'horizontal', y: otherY, x1: Math.min(newX, otherX) - 20, x2: Math.max(newRight, otherRight) + 20 })
        } else if (Math.abs(newY - otherBottom) <= snapThreshold) {
          const heightDiff = newY - otherBottom
          snappedY = otherBottom
          snappedHeight = newHeight + heightDiff
          guides.push({ type: 'horizontal', y: otherBottom, x1: Math.min(newX, otherX) - 20, x2: Math.max(newRight, otherRight) + 20 })
        }
      }
    })

    return { snappedX, snappedY, snappedWidth, snappedHeight, guides }
  }, [otherElements, element.id])

  // Drag handlers
  const handleMouseDown = (e) => {
    if (isPreviewMode) return
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
    if (e.target.closest('.resize-handle')) return // Don't drag when clicking resize handle
    
    e.preventDefault()
    e.stopPropagation()
    onSelect()
    
    const rect = elementRef.current.getBoundingClientRect()
    const pageRect = elementRef.current.closest('.page-container')?.getBoundingClientRect()
    if (!pageRect) return

    setDragStart({
      x: e.clientX - pageRect.left - element.x,
      y: e.clientY - pageRect.top - element.y
    })
    setIsDragging(true)
  }

  const handleMouseMove = useCallback((e) => {
    if (isDragging && !isPreviewMode) {
      const pageRect = elementRef.current.closest('.page-container')?.getBoundingClientRect()
      if (!pageRect) return

      const rawX = e.clientX - pageRect.left - dragStart.x
      const rawY = e.clientY - pageRect.top - dragStart.y

      // Apply smart guides
      const { snappedX, snappedY, guides } = getSmartGuides(rawX, rawY, element.width, element.height)
      
      // Keep within page bounds
      const finalX = Math.max(0, Math.min(pageWidth - element.width, snappedX))
      const finalY = Math.max(0, Math.min(pageHeight - element.height, snappedY))

      setSmartGuides(guides)
      onUpdate({ x: finalX, y: finalY })
    } else if (isResizing && !isPreviewMode) {
      const pageRect = elementRef.current.closest('.page-container')?.getBoundingClientRect()
      if (!pageRect) return

      const deltaX = e.clientX - pageRect.left - resizeStart.x
      const deltaY = e.clientY - pageRect.top - resizeStart.y

      let newWidth = resizeStart.width
      let newHeight = resizeStart.height
      let newX = element.x
      let newY = element.y

      if (resizeDirection.includes('e')) {
        newWidth = Math.max(50, resizeStart.width + deltaX)
      }
      if (resizeDirection.includes('s')) {
        newHeight = Math.max(30, resizeStart.height + deltaY)
      }
      if (resizeDirection.includes('w')) {
        const newWidthCalculated = Math.max(50, resizeStart.width - deltaX)
        newX = element.x + (element.width - newWidthCalculated)
        newWidth = newWidthCalculated
      }
      if (resizeDirection.includes('n')) {
        const newHeightCalculated = Math.max(30, resizeStart.height - deltaY)
        newY = element.y + (element.height - newHeightCalculated)
        newHeight = newHeightCalculated
      }

      // Apply smart guides for resizing
      const { snappedX, snappedY, snappedWidth, snappedHeight, guides } = getResizeSmartGuides(
        newX, newY, newWidth, newHeight, resizeDirection
      )

      // Keep within page bounds
      const finalWidth = Math.min(snappedWidth, pageWidth - snappedX)
      const finalHeight = Math.min(snappedHeight, pageHeight - snappedY)
      const finalX = Math.max(0, snappedX)
      const finalY = Math.max(0, snappedY)

      setSmartGuides(guides)
      onUpdate({ x: finalX, y: finalY, width: finalWidth, height: finalHeight })
    }
  }, [isDragging, isResizing, dragStart, resizeStart, resizeDirection, getSmartGuides, getResizeSmartGuides, element, pageWidth, pageHeight, onUpdate, isPreviewMode])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeDirection(null)
    setSmartGuides([])
  }, [])

  // Resize handlers
  const handleResizeStart = (e, direction) => {
    if (isPreviewMode) return
    e.preventDefault()
    e.stopPropagation()

    const pageRect = elementRef.current.closest('.page-container')?.getBoundingClientRect()
    if (!pageRect) return

    setResizeDirection(direction)
    setResizeStart({
      x: e.clientX - pageRect.left,
      y: e.clientY - pageRect.top,
      width: element.width,
      height: element.height
    })
    setIsResizing(true)
  }

  // Global event listeners for drag/resize
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  const handleDoubleClick = () => {
    if (isPreviewMode) return
    setIsEditing(true)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      setIsEditing(false)
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  const renderElementContent = () => {
    const commonStyle = {
      width: '100%',
      height: '100%',
      fontSize: element.fontSize || undefined,
      color: element.color || '#1F2937',
      fontFamily: element.fontFamily || 'Inter',
      fontWeight: element.fontWeight || 'normal',
      backgroundColor: element.backgroundColor || undefined,
      textAlign: element.textAlign || 'left',
      lineHeight: element.lineHeight || undefined,
      padding: element.padding || undefined,
      paddingTop: element.paddingTop || undefined,
      paddingRight: element.paddingRight || undefined,
      paddingBottom: element.paddingBottom || undefined,
      paddingLeft: element.paddingLeft || undefined,
      margin: element.margin || undefined,
      marginTop: element.marginTop || undefined,
      marginRight: element.marginRight || undefined,
      marginBottom: element.marginBottom || undefined,
      marginLeft: element.marginLeft || undefined,
      borderRadius: element.borderRadius || undefined,
      border: element.border || undefined,
      borderTop: element.borderTop || undefined,
      borderRight: element.borderRight || undefined,
      borderBottom: element.borderBottom || undefined,
      borderLeft: element.borderLeft || undefined,
      borderWidth: element.borderWidth || undefined,
      borderStyle: element.borderStyle || undefined,
      borderColor: element.borderColor || undefined,
      boxShadow: element.boxShadow || undefined,
      opacity: element.opacity || undefined,
      zIndex: element.zIndex || undefined,
      position: element.position || undefined,
      overflow: element.overflow || undefined,
      textShadow: element.textShadow || undefined,
      letterSpacing: element.letterSpacing || undefined,
      wordSpacing: element.wordSpacing || undefined,
      textDecoration: element.textDecoration || undefined,
      textTransform: element.textTransform || undefined,
      verticalAlign: element.verticalAlign || undefined,
      whiteSpace: element.whiteSpace || undefined,
      display: element.display || undefined,
      alignItems: element.alignItems || undefined,
      justifyContent: element.justifyContent || undefined,
      flexDirection: element.flexDirection || undefined,
      flexWrap: element.flexWrap || undefined,
      gap: element.gap || undefined,
      gridTemplateColumns: element.gridTemplateColumns || undefined,
      gridTemplateRows: element.gridTemplateRows || undefined,
      gridColumn: element.gridColumn || undefined,
      gridRow: element.gridRow || undefined,
      transform: element.transform || undefined,
      transformOrigin: element.transformOrigin || undefined,
      transition: element.transition || undefined,
      cursor: element.cursor || undefined,
      userSelect: element.userSelect || undefined,
      pointerEvents: element.pointerEvents || undefined
    }

    // Hide page metadata elements
    if (element.type === '_page_meta' || element.element_type === '_page_meta') {
      return null
    }

    switch (element.type || element.element_type || 'text') {
      case 'text':
        if (isEditing && !isPreviewMode) {
          return (
            <textarea
              value={element.content || ''}
              onChange={(e) => onUpdate({ content: e.target.value })}
              onBlur={() => setIsEditing(false)}
              onKeyDown={handleKeyDown}
              className="w-full h-full p-2 border-0 outline-none resize-none bg-transparent"
              style={commonStyle}
              autoFocus
            />
          )
        }
        return (
          <div className="w-full h-full p-2 whitespace-pre-wrap" style={commonStyle}>
            {element.content || 'Klik om tekst te bewerken'}
          </div>
        )

      case 'heading':
        if (isEditing && !isPreviewMode) {
          return (
            <input
              type="text"
              value={element.content || ''}
              onChange={(e) => onUpdate({ content: e.target.value })}
              onBlur={() => setIsEditing(false)}
              onKeyDown={handleKeyDown}
              className="w-full h-full px-2 border-0 outline-none bg-transparent font-bold"
              style={{ ...commonStyle, fontWeight: 'bold' }}
              autoFocus
            />
          )
        }
        return (
          <div className="w-full h-full px-2 flex items-center font-bold" style={{ ...commonStyle, fontWeight: 'bold' }}>
            {element.content || 'Nieuwe heading'}
          </div>
        )

      case 'image':
        const imageSrc = element.src || element.properties?.src || element.content
        if (imageSrc) {
          return (
            <img 
              src={imageSrc}
              alt={element.alt || element.properties?.alt || 'Afbeelding'}
              className="w-full h-full rounded"
              style={{ objectFit: element.objectFit || element.properties?.objectFit || 'cover' }}
            />
          )
        }
        return (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 rounded">
            <div className="text-center">
              <div className="text-4xl mb-2">🖼️</div>
              <div className="text-sm">Afbeelding</div>
              {!isPreviewMode && (
                <div className="text-xs text-gray-400 mt-1">Dubbel-klik om URL in te voeren</div>
              )}
            </div>
          </div>
        )

      case 'video':
        if (element.src) {
          return (
            <video 
              src={element.src}
              controls={element.controls !== false}
              className="w-full h-full rounded"
              style={{ objectFit: 'cover' }}
            />
          )
        }
        return (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 rounded">
            <div className="text-center">
              <div className="text-4xl mb-2">🎥</div>
              <div className="text-sm">Video</div>
            </div>
          </div>
        )

      case 'cta':
        const buttonStyle = element.style || 'primary'
        const buttonClasses = {
          primary: 'bg-blue-600 text-white hover:bg-blue-700',
          secondary: 'bg-gray-600 text-white hover:bg-gray-700', 
          outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
        }
        
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <button 
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${buttonClasses[buttonStyle]}`}
              onClick={() => element.url && window.open(element.url, '_blank')}
            >
              {element.text || 'Button Text'}
            </button>
          </div>
        )

      case 'ai-agent':
        return (
          <div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-dashed border-purple-300 flex items-center justify-center text-purple-700 rounded">
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🤖</div>
              <div className="font-medium">AI Agent</div>
              <div className="text-sm opacity-75 mt-1">
                Type: {element.contentType || 'text'}
              </div>
              {!isPreviewMode && (
                <div className="text-xs mt-2 opacity-60">
                  Content wordt gegenereerd op basis van AI prompts
                </div>
              )}
            </div>
          </div>
        )

      case 'chart':
        return (
          <div className="w-full h-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 rounded">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-sm font-medium">Grafiek</div>
              <div className="text-xs text-gray-400 mt-1">
                {element.chartType || 'bar'} chart
              </div>
            </div>
          </div>
        )

      case 'table':
        return (
          <div className="w-full h-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 rounded">
            <div className="text-center">
              <div className="text-4xl mb-2">📋</div>
              <div className="text-sm font-medium">Tabel</div>
              <div className="text-xs text-gray-400 mt-1">
                Data tabel
              </div>
            </div>
          </div>
        )

      case 'datawidget':
        return (
          <div className="w-full h-full bg-white border border-gray-200 rounded p-4 flex flex-col justify-center items-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {element.value || '0'}
            </div>
            <div className="text-sm text-gray-600">
              {element.label || 'KPI'}
            </div>
          </div>
        )

      case 'demo':
        return (
          <div className="w-full h-full bg-gray-900 text-green-400 font-mono text-sm p-3 rounded overflow-auto">
            <div className="mb-2 text-gray-500">// Demo Block</div>
            <div>{element.code || 'console.log("Hello World");'}</div>
          </div>
        )

      case 'embed':
        return (
          <div className="w-full h-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 rounded">
            <div className="text-center">
              <div className="text-4xl mb-2">🔗</div>
              <div className="text-sm font-medium">Embed</div>
              <div className="text-xs text-gray-400 mt-1">
                Externe content
              </div>
            </div>
          </div>
        )

      case 'footer':
        return (
          <div className="w-full h-full bg-gray-800 text-white p-4 rounded flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm">
                {element.content || '© 2024 Bedrijfsnaam'}
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 rounded">
            <div className="text-center">
              <div className="text-2xl mb-2">❓</div>
              <div className="text-sm">{element.type}</div>
            </div>
          </div>
        )
    }
  }

  return (
    <>
      {/* Smart Guides */}
      {smartGuides.map((guide, index) => (
        <div
          key={index}
          className="absolute pointer-events-none"
          style={{
            ...(guide.type === 'vertical' ? {
              left: `${guide.x}px`,
              top: `${guide.y1}px`,
              width: '1px',
              height: `${guide.y2 - guide.y1}px`,
              backgroundColor: '#ff6b6b',
              zIndex: 1000
            } : {
              left: `${guide.x1}px`,
              top: `${guide.y}px`,
              width: `${guide.x2 - guide.x1}px`,
              height: '1px',
              backgroundColor: '#ff6b6b',
              zIndex: 1000
            })
          }}
        />
      ))}
      
      <div
        ref={elementRef}
        className={`absolute select-none page-element ${
          isDragging ? 'cursor-grabbing' : (!isPreviewMode ? 'cursor-move' : '')
        } ${
          isDragging ? 'opacity-80' : ''
        }`}
        style={{
          left: `${element.x}px`,
          top: `${element.y}px`,
          width: `${element.width}px`,
          height: `${element.height}px`,
          zIndex: isDragging ? 1000 : (isSelected ? 10 : 1)
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        {/* Element Content */}
        <div 
          className={`w-full h-full rounded shadow-sm overflow-hidden transition-all duration-200 ${
            isSelected && !isPreviewMode 
              ? 'border-2 border-indigo-400 shadow-lg ring-2 ring-indigo-200 ring-opacity-50' 
              : 'border border-gray-200 hover:border-gray-300'
          } ${!element.backgroundColor ? 'bg-white' : ''}`}
          style={{
            backgroundColor: element.backgroundColor || undefined
          }}>
          {renderElementContent()}
        </div>

        {/* Selection Controls (only in edit mode) */}
        {isSelected && !isPreviewMode && (
          <>
            {/* Delete Button - Modern red circle with shadow */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all duration-200 shadow-lg border-2 border-white z-20"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Move Handle - Elegant blue circle */}
            <div className="absolute -top-3 -left-3 w-7 h-7 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white z-20">
              <Move className="w-3.5 h-3.5" />
            </div>

            {/* Resize Handles - Small white circles with shadow */}
            <div 
              className="resize-handle absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-white border-2 border-indigo-400 rounded-full cursor-se-resize shadow-lg hover:bg-indigo-50 hover:border-indigo-500 transition-all duration-200 z-15"
              onMouseDown={(e) => handleResizeStart(e, 'se')}
              title="Resize"
            />
            <div 
              className="resize-handle absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-2 border-indigo-400 rounded-full cursor-s-resize shadow-lg hover:bg-indigo-50 hover:border-indigo-500 transition-all duration-200 z-15"
              onMouseDown={(e) => handleResizeStart(e, 's')}
              title="Resize height"
            />
            <div 
              className="resize-handle absolute top-1/2 -right-1.5 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-indigo-400 rounded-full cursor-e-resize shadow-lg hover:bg-indigo-50 hover:border-indigo-500 transition-all duration-200 z-15"
              onMouseDown={(e) => handleResizeStart(e, 'e')}
              title="Resize width"
            />
            <div 
              className="resize-handle absolute -top-1.5 -right-1.5 w-4 h-4 bg-white border-2 border-indigo-400 rounded-full cursor-ne-resize shadow-lg hover:bg-indigo-50 hover:border-indigo-500 transition-all duration-200 z-15"
              onMouseDown={(e) => handleResizeStart(e, 'ne')}
              title="Resize"
            />
            <div 
              className="resize-handle absolute -top-1.5 -left-1.5 w-4 h-4 bg-white border-2 border-indigo-400 rounded-full cursor-nw-resize shadow-lg hover:bg-indigo-50 hover:border-indigo-500 transition-all duration-200 z-15"
              onMouseDown={(e) => handleResizeStart(e, 'nw')}
              title="Resize"
            />
            <div 
              className="resize-handle absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-white border-2 border-indigo-400 rounded-full cursor-sw-resize shadow-lg hover:bg-indigo-50 hover:border-indigo-500 transition-all duration-200 z-15"
              onMouseDown={(e) => handleResizeStart(e, 'sw')}
              title="Resize"
            />
            <div 
              className="resize-handle absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-2 border-indigo-400 rounded-full cursor-n-resize shadow-lg hover:bg-indigo-50 hover:border-indigo-500 transition-all duration-200 z-15"
              onMouseDown={(e) => handleResizeStart(e, 'n')}
              title="Resize height"
            />
            <div 
              className="resize-handle absolute top-1/2 -left-1.5 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-indigo-400 rounded-full cursor-w-resize shadow-lg hover:bg-indigo-50 hover:border-indigo-500 transition-all duration-200 z-15"
              onMouseDown={(e) => handleResizeStart(e, 'w')}
              title="Resize width"
            />

            {/* Element Type Badge - Elegant floating badge */}
            <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow-lg border border-white font-medium z-20">
              {element.type || element.element_type || 'text'}
            </div>

            {/* Drag Feedback - Modern overlay */}
            {isDragging && (
              <div className="absolute inset-0 bg-indigo-500 bg-opacity-5 border-2 border-dashed border-indigo-400 rounded pointer-events-none backdrop-blur-sm">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                  {smartGuides.length > 0 ? '🧲 Snap uitlijning' : '↔️ Verplaatsen'}
                </div>
              </div>
            )}

            {/* Resize Feedback - Modern overlay */}
            {isResizing && (
              <div className="absolute inset-0 bg-emerald-500 bg-opacity-5 border-2 border-dashed border-emerald-400 rounded pointer-events-none backdrop-blur-sm">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                  {smartGuides.length > 0 ? '🧲 Snap resize' : '📐'} {Math.round(element.width)} × {Math.round(element.height)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}