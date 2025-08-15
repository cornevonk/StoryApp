import { useState, useEffect } from 'react'
import { Palette, Type, Download, Upload, Save } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'

export function BrandTab() {
  const { currentProject, updateProject } = useProject()
  const [activeSection, setActiveSection] = useState('colors')

  const branding = currentProject?.branding || {
    colors: {
      primary: '#0027FF',
      secondary: '#03FFB2', 
      accent: '#F97316',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    spacing: {
      sm: '8px',
      md: '16px',
      lg: '24px'
    }
  }

  // Update CSS variables whenever branding changes
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--brand-primary', branding.colors.primary)
    root.style.setProperty('--brand-secondary', branding.colors.secondary)
    root.style.setProperty('--brand-accent', branding.colors.accent)
    root.style.setProperty('--brand-text', branding.colors.text)
    root.style.setProperty('--brand-background', branding.colors.background)
    
    root.style.setProperty('--brand-font-heading', `'${branding.fonts.heading}', -apple-system, BlinkMacSystemFont, sans-serif`)
    root.style.setProperty('--brand-font-body', `'${branding.fonts.body}', -apple-system, BlinkMacSystemFont, sans-serif`)
    
    root.style.setProperty('--brand-spacing-sm', branding.spacing.sm)
    root.style.setProperty('--brand-spacing-md', branding.spacing.md)
    root.style.setProperty('--brand-spacing-lg', branding.spacing.lg)
  }, [branding])

  const handleColorChange = (colorKey, value) => {
    updateProject({
      branding: {
        ...branding,
        colors: {
          ...branding.colors,
          [colorKey]: value
        }
      }
    })
  }

  const handleFontChange = (fontKey, value) => {
    updateProject({
      branding: {
        ...branding,
        fonts: {
          ...branding.fonts,
          [fontKey]: value
        }
      }
    })
  }

  const handleSpacingChange = (spacingKey, value) => {
    updateProject({
      branding: {
        ...branding,
        spacing: {
          ...branding.spacing,
          [spacingKey]: value
        }
      }
    })
  }

  const exportBranding = () => {
    const brandingJson = JSON.stringify(branding, null, 2)
    const blob = new Blob([brandingJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'huisstijl.json'
    link.click()
  }

  const importBranding = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedBranding = JSON.parse(e.target.result)
          updateProject({ branding: importedBranding })
          alert('Huisstijl succesvol geïmporteerd!')
        } catch (error) {
          alert('Fout bij importeren: ongeldig bestand')
        }
      }
      reader.readAsText(file)
    }
  }

  const resetToDefaults = () => {
    if (confirm('Weet u zeker dat u de huisstijl wilt resetten naar standaard waarden?')) {
      updateProject({
        branding: {
          colors: {
            primary: '#0027FF',
            secondary: '#03FFB2', 
            accent: '#F97316',
            text: '#1F2937',
            background: '#FFFFFF'
          },
          fonts: {
            heading: 'Inter',
            body: 'Inter'
          },
          spacing: {
            sm: '8px',
            md: '16px',
            lg: '24px'
          }
        }
      })
    }
  }

  const sections = [
    { id: 'colors', name: 'Kleuren', icon: Palette },
    { id: 'typography', name: 'Typografie', icon: Type }
  ]

  const renderColorsSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primaire kleur
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={branding.colors.primary}
              onChange={(e) => handleColorChange('primary', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              value={branding.colors.primary}
              onChange={(e) => handleColorChange('primary', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secundaire kleur
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={branding.colors.secondary}
              onChange={(e) => handleColorChange('secondary', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              value={branding.colors.secondary}
              onChange={(e) => handleColorChange('secondary', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accent kleur
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={branding.colors.accent}
              onChange={(e) => handleColorChange('accent', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              value={branding.colors.accent}
              onChange={(e) => handleColorChange('accent', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tekst kleur
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={branding.colors.text}
              onChange={(e) => handleColorChange('text', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              value={branding.colors.text}
              onChange={(e) => handleColorChange('text', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Achtergrond kleur
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={branding.colors.background}
              onChange={(e) => handleColorChange('background', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              value={branding.colors.background}
              onChange={(e) => handleColorChange('background', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* Color Preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Voorbeeld</h4>
        <div className="space-y-2">
          <div 
            className="h-8 rounded flex items-center px-3 text-white text-sm font-medium"
            style={{ backgroundColor: branding.colors.primary }}
          >
            Primaire kleur
          </div>
          <div 
            className="h-8 rounded flex items-center px-3 text-gray-900 text-sm font-medium"
            style={{ backgroundColor: branding.colors.secondary }}
          >
            Secundaire kleur
          </div>
          <div 
            className="h-8 rounded flex items-center px-3 text-white text-sm font-medium"
            style={{ backgroundColor: branding.colors.accent }}
          >
            Accent kleur
          </div>
        </div>
      </div>
    </div>
  )

  const renderTypographySection = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Heading lettertype
        </label>
        <select
          value={branding.fonts.heading}
          onChange={(e) => handleFontChange('heading', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
        >
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Lato">Lato</option>
          <option value="Poppins">Poppins</option>
          <option value="Montserrat">Montserrat</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Body lettertype
        </label>
        <select
          value={branding.fonts.body}
          onChange={(e) => handleFontChange('body', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
        >
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Lato">Lato</option>
          <option value="Source Sans Pro">Source Sans Pro</option>
        </select>
      </div>

      {/* Typography Preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Voorbeeld</h4>
        <div className="space-y-3">
          <h1 
            className="text-2xl font-bold"
            style={{ fontFamily: branding.fonts.heading, color: branding.colors.text }}
          >
            Dit is een heading
          </h1>
          <p 
            className="text-base"
            style={{ fontFamily: branding.fonts.body, color: branding.colors.text }}
          >
            Dit is body tekst. Het toont hoe uw gekozen lettertypen er uit zien in combinatie met de gekozen kleuren.
          </p>
        </div>
      </div>

      {/* Spacing Controls */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900">Afstanden</h4>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Klein</label>
            <input
              type="text"
              value={branding.spacing.sm}
              onChange={(e) => handleSpacingChange('sm', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Medium</label>
            <input
              type="text"
              value={branding.spacing.md}
              onChange={(e) => handleSpacingChange('md', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Groot</label>
            <input
              type="text"
              value={branding.spacing.lg}
              onChange={(e) => handleSpacingChange('lg', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-4 space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {sections.map(section => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeSection === section.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {section.name}
            </button>
          )
        })}
      </div>

      {/* Section Content */}
      <div>
        {activeSection === 'colors' && renderColorsSection()}
        {activeSection === 'typography' && renderTypographySection()}
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <button
          onClick={exportBranding}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Exporteer huisstijl
        </button>
        
        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={importBranding}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" />
            Importeer huisstijl
          </button>
        </div>
        
        <button
          onClick={resetToDefaults}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Reset naar standaard
        </button>
      </div>
    </div>
  )
}