import React from 'react'

export function TemplateThumbnail({ template, className = "", scale = 0.25 }) {
  if (!template || !template.elements || template.elements.length === 0) {
    return (
      <div className={`bg-gray-100 border rounded flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-2xl">📄</div>
      </div>
    )
  }

  // Find the bounds of all elements to scale properly
  const bounds = template.elements.reduce((acc, el) => ({
    minX: Math.min(acc.minX, el.x || 0),
    minY: Math.min(acc.minY, el.y || 0),
    maxX: Math.max(acc.maxX, (el.x || 0) + (el.width || 250)),
    maxY: Math.max(acc.maxY, (el.y || 0) + (el.height || 150))
  }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity })

  const contentWidth = bounds.maxX - bounds.minX
  const contentHeight = bounds.maxY - bounds.minY
  
  // Scale factor to fit content in the container
  const containerPadding = 20
  const availableWidth = 300 - (containerPadding * 2) // Assuming ~300px width
  const availableHeight = 200 - (containerPadding * 2) // Assuming ~200px height
  
  const scaleX = availableWidth / contentWidth
  const scaleY = availableHeight / contentHeight
  const finalScale = Math.min(scaleX, scaleY, 0.3) // Max scale of 0.3

  // Brand colors
  const brandColors = {
    primary: '#0027FF',
    secondary: '#03FFB2', 
    accent: '#F97316',
    text: '#1F2937',
    background: '#FFFFFF'
  }

  const getColor = (color) => {
    if (!color) return brandColors.text
    if (color.includes('var(--brand-primary)')) return brandColors.primary
    if (color.includes('var(--brand-secondary)')) return brandColors.secondary
    if (color.includes('var(--brand-accent)')) return brandColors.accent
    if (color.includes('var(--brand-text)')) return brandColors.text
    if (color.includes('var(--brand-background)')) return brandColors.background
    return color
  }

  const getBackgroundColor = (bgColor) => {
    if (!bgColor || bgColor === 'transparent') return 'transparent'
    if (bgColor.includes('var(--brand-primary)')) return brandColors.primary
    if (bgColor.includes('var(--brand-secondary)')) return brandColors.secondary
    if (bgColor.includes('var(--brand-accent)')) return brandColors.accent
    return bgColor
  }

  const renderElement = (element, index) => {
    const style = {
      position: 'absolute',
      left: `${((element.x || 0) - bounds.minX) * finalScale + containerPadding}px`,
      top: `${((element.y || 0) - bounds.minY) * finalScale + containerPadding}px`,
      width: `${(element.width || 250) * finalScale}px`,
      height: `${(element.height || 150) * finalScale}px`,
      fontSize: `${Math.max(8, (parseInt(element.fontSize) || 16) * finalScale)}px`,
      fontWeight: element.fontWeight || 'normal',
      color: getColor(element.color),
      backgroundColor: getBackgroundColor(element.backgroundColor),
      textAlign: element.textAlign || 'left',
      borderRadius: element.borderRadius ? `${Math.max(2, parseInt(element.borderRadius) * finalScale)}px` : '0',
      border: element.border || 'none',
      padding: `${Math.max(2, finalScale * 8)}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'flex-end' : 'flex-start',
      overflow: 'hidden',
      lineHeight: '1.2',
      fontFamily: 'Inter, sans-serif'
    }

    let content = element.content || ''
    
    switch (element.type) {
      case 'heading':
        return (
          <div key={index} style={{...style, fontWeight: 'bold'}}>
            {content.substring(0, 50)}
          </div>
        )
      
      case 'text':
        return (
          <div key={index} style={{...style, fontSize: Math.max(6, parseInt(style.fontSize) * 0.8) + 'px'}}>
            {content.substring(0, 80)}
          </div>
        )
      
      case 'cta':
        return (
          <div key={index} style={{
            ...style, 
            fontWeight: 'bold',
            fontSize: Math.max(7, parseInt(style.fontSize) * 0.7) + 'px',
            textAlign: 'center'
          }}>
            {content.substring(0, 20) || 'Button'}
          </div>
        )
      
      case 'image':
        return (
          <div key={index} style={{
            ...style, 
            backgroundColor: '#f3f4f6', 
            border: '1px solid #d1d5db',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: Math.max(16, parseInt(style.fontSize) * 1.2) + 'px' }}>🖼️</span>
          </div>
        )
      
      case 'datawidget':
        const lines = content.split('\n')
        return (
          <div key={index} style={{
            ...style,
            flexDirection: 'column',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: Math.max(6, parseInt(style.fontSize) * 0.6) + 'px' }}>
              {lines[0] || 'KPI'}
            </div>
            <div style={{ fontSize: Math.max(8, parseInt(style.fontSize) * 0.7) + 'px', marginTop: '1px' }}>
              {lines[1] || '100%'}
            </div>
          </div>
        )
      
      case 'chart':
        return (
          <div key={index} style={style}>
            <span style={{ fontSize: Math.max(8, parseInt(style.fontSize) * 0.8) + 'px' }}>
              📊 {content.substring(0, 40)}
            </span>
          </div>
        )
      
      default:
        return (
          <div key={index} style={{...style, backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', textAlign: 'center'}}>
            <span style={{ fontSize: Math.max(10, parseInt(style.fontSize)) + 'px' }}>📄</span>
          </div>
        )
    }
  }

  return (
    <div className={`bg-white rounded relative overflow-hidden ${className}`}>
      <div style={{ width: '100%', height: '100%', position: 'relative', minHeight: '150px' }}>
        {template.elements.map(renderElement)}
      </div>
    </div>
  )
}