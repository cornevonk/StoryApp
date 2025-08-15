import { useState, useRef } from 'react'
import { X, Move, BarChart3, Table2, MousePointer, Bot, Code, ExternalLink, Layout, Gauge, Play, Image as ImageIcon } from 'lucide-react'

export function CanvasElement({ element, isSelected, onSelect, onUpdate, onDelete }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const elementRef = useRef(null)

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
    
    e.preventDefault()
    e.stopPropagation()
    onSelect()
    
    const rect = e.currentTarget.getBoundingClientRect()
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setIsDragging(true)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    
    const canvasRect = elementRef.current.parentElement.getBoundingClientRect()
    const newX = e.clientX - canvasRect.left - dragStart.x
    const newY = e.clientY - canvasRect.top - dragStart.y
    
    onUpdate({
      x: Math.max(0, newX),
      y: Math.max(0, newY)
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleDoubleClick = () => {
    if (element.type === 'text' || element.type === 'heading') {
      setIsEditing(true)
    }
  }

  const handleContentChange = (value) => {
    onUpdate({ content: value })
  }

  const handleContentBlur = () => {
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      setIsEditing(false)
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  // Parse properties from database (can be JSON string or object)
  const getProperties = () => {
    if (!element.properties) return {}
    if (typeof element.properties === 'string') {
      try {
        return JSON.parse(element.properties)
      } catch {
        return {}
      }
    }
    return element.properties
  }

  const props = getProperties()

  // Get text-related properties for rendering
  const getTextProps = () => {
    return {
      fontSize: props.fontSize || (element.type === 'heading' ? 24 : 14),
      fontWeight: props.fontWeight || (element.type === 'heading' ? 'bold' : 'normal'),
      color: props.color || '#1f2937',
      fontFamily: props.fontFamily || 'Inter, system-ui, sans-serif',
      textAlign: props.textAlign || 'left',
      lineHeight: props.lineHeight || 1.5,
      letterSpacing: props.letterSpacing
    }
  }

  // Build style object from properties
  const buildStyles = (properties = {}, includeTextStyles = true) => {
    const styles = {}
    
    // Text styles (only if requested)
    if (includeTextStyles) {
      if (properties.color) styles.color = properties.color
      if (properties.fontSize) styles.fontSize = typeof properties.fontSize === 'number' ? `${properties.fontSize}px` : properties.fontSize
      if (properties.fontWeight) styles.fontWeight = properties.fontWeight
      if (properties.fontFamily) styles.fontFamily = properties.fontFamily
      if (properties.textAlign) styles.textAlign = properties.textAlign
      if (properties.lineHeight) styles.lineHeight = properties.lineHeight
      if (properties.letterSpacing) styles.letterSpacing = properties.letterSpacing
      if (properties.fontStyle) styles.fontStyle = properties.fontStyle
    }
    
    // Background and colors
    if (properties.backgroundColor) styles.backgroundColor = properties.backgroundColor
    if (properties.background) styles.background = properties.background
    
    // Gradient text effect
    if (properties.backgroundClip) {
      styles.backgroundClip = properties.backgroundClip
      styles.WebkitBackgroundClip = properties.backgroundClip
      if (properties.backgroundClip === 'text') {
        styles.WebkitTextFillColor = 'transparent'
      }
    }
    if (properties.WebkitBackgroundClip) {
      styles.WebkitBackgroundClip = properties.WebkitBackgroundClip
      if (properties.WebkitBackgroundClip === 'text') {
        styles.WebkitTextFillColor = 'transparent'
      }
    }
    
    // Spacing
    if (properties.padding) styles.padding = properties.padding
    if (properties.margin) styles.margin = properties.margin
    
    // Borders
    if (properties.border) styles.border = properties.border
    if (properties.borderRadius) styles.borderRadius = typeof properties.borderRadius === 'number' ? `${properties.borderRadius}px` : properties.borderRadius
    if (properties.borderColor) styles.borderColor = properties.borderColor
    if (properties.borderWidth) styles.borderWidth = properties.borderWidth
    if (properties.borderLeft) styles.borderLeft = properties.borderLeft
    if (properties.borderTop) styles.borderTop = properties.borderTop
    if (properties.borderRight) styles.borderRight = properties.borderRight
    if (properties.borderBottom) styles.borderBottom = properties.borderBottom
    
    // Effects
    if (properties.boxShadow) styles.boxShadow = properties.boxShadow
    if (properties.opacity) styles.opacity = properties.opacity
    if (properties.transform) styles.transform = properties.transform
    if (properties.transition) styles.transition = properties.transition
    
    // Layout
    if (properties.display) styles.display = properties.display
    if (properties.flexDirection) styles.flexDirection = properties.flexDirection
    if (properties.alignItems) styles.alignItems = properties.alignItems
    if (properties.justifyContent) styles.justifyContent = properties.justifyContent
    if (properties.gap) styles.gap = properties.gap
    
    return styles
  }

  const renderContent = () => {
    // Editing mode for text elements
    if (isEditing && (element.type === 'text' || element.type === 'heading')) {
      return (
        <textarea
          value={element.content}
          onChange={(e) => handleContentChange(e.target.value)}
          onBlur={handleContentBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-2 border-0 outline-none resize-none bg-transparent"
          style={buildStyles(props)}
          autoFocus
        />
      )
    }

    switch (element.type) {
      case 'heading':
        const headingStyles = buildStyles(props)
        return (
          <div className="w-full h-full flex items-center" style={{ padding: props.padding || '12px' }}>
            <h1 style={headingStyles} className="w-full">
              {element.content}
            </h1>
          </div>
        )

      case 'text':
        const textStyles = buildStyles(props)
        return (
          <div className="w-full h-full overflow-auto" style={{ padding: props.padding || '12px' }}>
            <p style={textStyles} className="whitespace-pre-wrap">
              {element.content}
            </p>
          </div>
        )

      case 'image':
        return (
          <div className="w-full h-full flex items-center justify-center" style={buildStyles(props)}>
            {element.content?.startsWith('http') || element.src?.startsWith('http') ? (
              <img 
                src={element.content || element.src || props.src} 
                alt={props.alt || "Image"} 
                className="w-full h-full"
                style={{ objectFit: props.objectFit || 'cover', borderRadius: props.borderRadius }}
              />
            ) : (
              <div className="text-center p-4">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <div className="text-sm text-gray-500">{element.content || props.alt || 'Image Placeholder'}</div>
              </div>
            )}
          </div>
        )

      case 'video':
        return (
          <div className="w-full h-full flex items-center justify-center bg-black" style={buildStyles(props)}>
            {element.content?.startsWith('http') || props.src ? (
              <video 
                src={element.content || props.src}
                poster={props.poster}
                controls={props.controls !== false}
                className="w-full h-full"
                style={{ borderRadius: props.borderRadius }}
              />
            ) : (
              <div className="text-center text-white">
                <Play className="w-12 h-12 mx-auto mb-2" />
                <div className="text-sm">{element.content || 'Video Player'}</div>
              </div>
            )}
          </div>
        )

      case 'datawidget':
        const widgetStyles = buildStyles(props, false)
        const valueSize = props.fontSize || 28
        const labelSize = Math.max(12, valueSize * 0.5)
        return (
          <div className="w-full h-full flex flex-col items-center justify-center" style={widgetStyles}>
            <div style={{ 
              fontSize: typeof valueSize === 'number' ? `${valueSize}px` : valueSize,
              fontWeight: props.fontWeight || '700',
              color: props.color || '#ffffff',
              lineHeight: 1.2
            }}>
              {props.value || element.content || '0'}
            </div>
            <div style={{ 
              fontSize: `${labelSize}px`,
              color: props.color || '#ffffff',
              opacity: 0.9,
              marginTop: '4px'
            }}>
              {props.label || 'Metric'}
            </div>
          </div>
        )

      case 'chart':
        return (
          <div className="w-full h-full flex flex-col p-4" style={buildStyles(props)}>
            <div className="text-sm font-semibold mb-2" style={{ color: props.color || '#1f2937' }}>
              {props.title || element.content || 'Chart'}
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-50 rounded">
              <BarChart3 className="w-16 h-16 text-gray-400" />
            </div>
          </div>
        )

      case 'table':
        const headers = props.headers || ['Column 1', 'Column 2']
        const rows = props.rows || [['Data 1', 'Data 2']]
        return (
          <div className="w-full h-full overflow-auto" style={buildStyles(props)}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: props.headerBg || '#f3f4f6' }}>
                  {headers.map((header, i) => (
                    <th key={i} className="p-2 text-left font-semibold" style={{ color: props.headerColor || '#111827' }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-t" style={{ backgroundColor: i % 2 === 1 && props.alternateRowBg ? props.alternateRowBg : 'transparent' }}>
                    {row.map((cell, j) => (
                      <td key={j} className="p-2" style={{ padding: props.cellPadding }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      case 'cta':
        const ctaStyles = buildStyles(props)
        return (
          <button 
            className="w-full h-full flex items-center justify-center transition-transform hover:scale-105"
            style={ctaStyles}
          >
            <span style={{ fontWeight: props.fontWeight || '600' }}>
              {props.text || element.content || 'Click Here'}
            </span>
          </button>
        )

      case 'footer':
        return (
          <div className="w-full h-full flex items-center justify-center p-3" style={buildStyles(props)}>
            <div className="text-center text-sm">
              {element.content || props.content || '© 2024 Company Name'}
            </div>
          </div>
        )

      case 'ai-agent':
        return (
          <div className="w-full h-full flex items-center p-4" style={buildStyles(props)}>
            <Bot className="w-8 h-8 mr-3 flex-shrink-0" style={{ color: props.color || '#6366f1' }} />
            <div className="flex-1 text-sm">
              {element.content || props.systemPrompt || 'AI Assistant Ready'}
            </div>
          </div>
        )

      case 'demo':
        return (
          <div className="w-full h-full overflow-auto" style={buildStyles(props)}>
            <pre className="p-3 text-xs font-mono" style={{ backgroundColor: props.backgroundColor || '#1e293b', color: props.color || '#64d86b' }}>
              <code>{element.content || props.code || '// Code example'}</code>
            </pre>
          </div>
        )

      case 'embed':
        return (
          <div className="w-full h-full flex items-center justify-center" style={buildStyles(props)}>
            {props.embedType === 'iframe' && props.src ? (
              <iframe 
                src={props.src}
                className="w-full h-full border-0"
                title={props.title || 'Embedded Content'}
                style={{ borderRadius: props.borderRadius }}
              />
            ) : (
              <div className="text-center p-4">
                <ExternalLink className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <div className="text-sm text-gray-500">{element.content || props.src || 'Embed Content'}</div>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="w-full h-full flex items-center justify-center p-4" style={buildStyles(props)}>
            <div className="text-center">
              <div className="text-2xl mb-2">📦</div>
              <div className="text-sm text-gray-500">{element.type}</div>
              <div className="text-xs text-gray-400 mt-1">{element.content}</div>
            </div>
          </div>
        )
    }
  }

  return (
    <div
      ref={elementRef}
      className={`absolute cursor-move select-none ${
        isSelected ? 'ring-2 ring-brand-blue ring-opacity-50' : ''
      }`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        zIndex: element.order_index || 0
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* Element Content - Apply container styles */}
      <div className="w-full h-full overflow-hidden" style={{
        borderRadius: props.borderRadius,
        backgroundColor: props.backgroundColor || props.background,
        boxShadow: props.boxShadow,
        border: props.border
      }}>
        {renderContent()}
      </div>

      {/* Selection Controls */}
      {isSelected && (
        <>
          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-50"
          >
            <X className="w-3 h-3" />
          </button>

          {/* Resize Handles */}
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-brand-blue cursor-se-resize" />
        </>
      )}
    </div>
  )
}