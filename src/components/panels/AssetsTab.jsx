import { useState, useRef, useCallback } from 'react'
import { Upload, Plus, ImageIcon, FileImage, Trash2, Eye, Search, Grid, List, FolderOpen } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'
import { ConfirmationModal } from '../ui/ConfirmationModal'
import { useConfirmation } from '../../hooks/useConfirmation'

export function AssetsTab() {
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const { modalProps, showConfirmation, showAlert } = useConfirmation()

  const { 
    assets = [], 
    uploadAsset,
    deleteAsset,
    isLoading 
  } = useProject()

  // Asset categories for filtering
  const categories = ['all', 'system', 'user', 'images', 'icons', 'documents', 'other']

  // Filter assets based on search and category
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
                          asset.category === selectedCategory ||
                          asset.source === selectedCategory ||
                          (selectedCategory === 'images' && asset.type?.startsWith('image/')) ||
                          (selectedCategory === 'documents' && asset.type?.includes('pdf'))
    return matchesSearch && matchesCategory
  })

  // Handle file upload
  const handleFileUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return
    
    setUploading(true)
    try {
      for (const file of files) {
        await uploadAsset(file)
      }
    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      setUploading(false)
    }
  }, [uploadAsset])

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFileUpload(files)
  }, [handleFileUpload])

  // Handle click upload
  const handleClickUpload = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileInputChange = useCallback((e) => {
    const files = Array.from(e.target.files || [])
    handleFileUpload(files)
    // Reset input so same file can be uploaded again
    e.target.value = ''
  }, [handleFileUpload])

  // Handle asset drag start for canvas
  const handleAssetDragStart = (e, asset) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'asset',
      asset: asset
    }))
  }

  // Handle asset delete
  const handleDeleteAsset = async (asset) => {
    if (!asset.deletable) {
      await showAlert({
        title: 'Kan niet verwijderen',
        message: 'System assets kunnen niet verwijderd worden.',
        type: 'warning'
      })
      return
    }
    
    const confirmed = await showConfirmation({
      title: 'Asset verwijderen',
      message: `Weet je zeker dat je "${asset.name}" wilt verwijderen?`,
      type: 'warning',
      confirmText: 'Verwijderen',
      cancelText: 'Annuleren'
    })
    
    if (confirmed) {
      try {
        await deleteAsset(asset.id, asset.source)
      } catch (error) {
        console.error('Error deleting asset:', error)
        await showAlert({
          title: 'Fout',
          message: 'Error bij het verwijderen van het asset.',
          type: 'error'
        })
      }
    }
  }

  // Get file size in readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return FileImage
    return FolderOpen
  }

  return (
    <div className="p-4 space-y-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Assets Bibliotheek
        </h2>
        <button
          onClick={handleClickUpload}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {uploading ? 'Uploaden...' : 'Nieuw Asset'}
        </button>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-brand-blue bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className={`w-8 h-8 mx-auto mb-2 ${dragOver ? 'text-brand-blue' : 'text-gray-400'}`} />
        <p className={`text-sm ${dragOver ? 'text-brand-blue' : 'text-gray-600'}`}>
          {dragOver ? 'Laat bestanden hier vallen' : 'Sleep bestanden hierheen of'}
        </p>
        <button
          onClick={handleClickUpload}
          className="text-brand-blue hover:text-blue-700 text-sm font-medium mt-1"
        >
          klik om te uploaden
        </button>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
          <div className="flex gap-1 border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-brand-blue text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-l-lg transition-colors`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-brand-blue text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-r-lg transition-colors`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-brand-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'Alle' : 
               category === 'system' ? 'Systeem' :
               category === 'user' ? 'Mijn Assets' :
               category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid/List */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p>Assets laden...</p>
          </div>
        ) : filteredAssets.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-2 md:grid-cols-3 gap-4' 
            : 'space-y-2'
          }>
            {filteredAssets.map(asset => {
              const FileIcon = getFileIcon(asset.type)
              
              return viewMode === 'grid' ? (
                // Grid View
                <div
                  key={asset.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-brand-blue/30 transition-all cursor-move group"
                  draggable
                  onDragStart={(e) => handleAssetDragStart(e, asset)}
                >
                  {/* Asset Preview */}
                  <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                    {asset.type?.startsWith('image/') ? (
                      <img 
                        src={asset.url} 
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileIcon className="w-12 h-12 text-gray-400" />
                    )}
                    {/* System asset badge */}
                    {asset.source === 'system' && (
                      <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                        Systeem
                      </div>
                    )}
                  </div>
                  
                  {/* Asset Info */}
                  <div className="p-3">
                    <h4 className="font-medium text-gray-900 text-sm truncate group-hover:text-brand-blue transition-colors">
                      {asset.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(asset.size)}
                    </p>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(asset.url, '_blank')
                          }}
                          className="p-1 text-gray-400 hover:text-brand-blue transition-colors"
                          title="Bekijken"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {asset.deletable && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteAsset(asset)
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Verwijderen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // List View
                <div
                  key={asset.id}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm hover:border-brand-blue/30 transition-all cursor-move group"
                  draggable
                  onDragStart={(e) => handleAssetDragStart(e, asset)}
                >
                  <div className="relative w-10 h-10 bg-gray-50 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                    {asset.type?.startsWith('image/') ? (
                      <img 
                        src={asset.url} 
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileIcon className="w-5 h-5 text-gray-400" />
                    )}
                    {/* System asset indicator */}
                    {asset.source === 'system' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" title="Systeem asset" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate group-hover:text-brand-blue transition-colors">
                      {asset.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(asset.size)} • {new Date(asset.created_at).toLocaleDateString('nl-NL')}
                      {asset.source === 'system' && ' • Systeem'}
                    </p>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(asset.url, '_blank')
                      }}
                      className="p-1 text-gray-400 hover:text-brand-blue transition-colors"
                      title="Bekijken"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {asset.deletable && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteAsset(asset)
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Verwijderen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Nog geen assets</h3>
            <p className="text-sm mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Geen assets gevonden met de huidige filters' 
                : 'Upload je eerste afbeeldingen, documenten of andere bestanden'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <button
                onClick={handleClickUpload}
                className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Asset
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal {...modalProps} />
    </div>
  )
}