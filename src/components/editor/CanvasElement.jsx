import { useState, useRef } from 'react'
import { X, Move } from 'lucide-react'

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
    setIsEditing(true)
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

  const renderContent = () => {
    if (isEditing) {
      if (element.type === 'text' || element.type === 'heading') {
        return (
          <textarea
            value={element.content}
            onChange={(e) => handleContentChange(e.target.value)}
            onBlur={handleContentBlur}
            onKeyDown={handleKeyDown}
            className="w-full h-full p-2 border-0 outline-none resize-none bg-transparent"
            autoFocus
          />
        )
      }
    }

    switch (element.type) {
      case 'heading':
        return (
          <h1 className="text-2xl font-bold text-gray-900 p-2">
            {element.content}
          </h1>
        )
      case 'text':
        return (
          <p className="text-base text-gray-700 p-2 whitespace-pre-wrap">
            {element.content}
          </p>
        )
      case 'image':
        return (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 rounded">
            {element.content.startsWith('http') ? (
              <img 
                src={element.content} 
                alt="Element" 
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-2">🖼️</div>
                <div className="text-sm">{element.content}</div>
              </div>
            )}
          </div>
        )
      default:
        return (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
            {element.content}
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
        height: `${element.height}px`
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* Element Content */}
      <div className="w-full h-full bg-white border border-gray-200 rounded overflow-hidden">
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
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>

          {/* Move Handle */}
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-brand-blue text-white rounded-full flex items-center justify-center">
            <Move className="w-3 h-3" />
          </div>

          {/* Resize Handles */}
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-brand-blue rounded cursor-se-resize"></div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-brand-blue rounded cursor-s-resize"></div>
          <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 bg-brand-blue rounded cursor-e-resize"></div>
        </>
      )}

      {/* Editing Overlay */}
      {isEditing && (
        <div className="absolute inset-0 bg-blue-50 bg-opacity-75 rounded flex items-center justify-center">
          <div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
            Dubbelklik om te bewerken
          </div>
        </div>
      )}
    </div>
  )
}