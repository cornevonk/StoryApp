import { useState, useEffect } from 'react'
import { X, Search, Download, Eye, FileText, Calendar, Tag, Filter, Trash2 } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'
import { knowledgeDocumentService } from '../../services/knowledgeDocumentService'

export function KnowledgeDocumentViewer({ isOpen, onClose }) {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [filterType, setFilterType] = useState('all')
  const { currentProject } = useProject()

  useEffect(() => {
    if (isOpen && currentProject) {
      loadDocuments()
    }
  }, [isOpen, currentProject])

  const loadDocuments = async () => {
    setLoading(true)
    try {
      const docs = await knowledgeDocumentService.getByProject(currentProject.id)
      
      // Convert Supabase format to expected format (add mock tags for now)
      const formattedDocs = docs.map(doc => ({
        ...doc,
        tags: doc.tags || [] // Use actual tags if available, empty array as fallback
      }))
      
      setDocuments(formattedDocs)
    } catch (error) {
      console.error('Error loading documents:', error)
      // Fallback to empty array on error
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content_preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'pdf' && doc.mime_type === 'application/pdf') ||
                         (filterType === 'word' && doc.mime_type.includes('word')) ||
                         (filterType === 'text' && doc.mime_type === 'text/plain')
    
    return matchesSearch && matchesFilter
  })

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (mimeType) => {
    if (mimeType === 'application/pdf') return '📄'
    if (mimeType.includes('word')) return '📝'
    if (mimeType === 'text/plain') return '📃'
    if (mimeType === 'text/markdown') return '📋'
    return '📁'
  }

  const handleDocumentClick = (document) => {
    setSelectedDocument(document)
  }

  const handleDownload = async (document, e) => {
    e.stopPropagation()
    try {
      const downloadUrl = await knowledgeDocumentService.getDownloadUrl(document.file_path)
      
      // Create download link
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = document.original_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download error:', error)
      alert('Download gefaald: ' + error.message)
    }
  }

  const handlePreview = async (document, e) => {
    e.stopPropagation()
    try {
      const previewUrl = await knowledgeDocumentService.getDownloadUrl(document.file_path)
      window.open(previewUrl, '_blank')
    } catch (error) {
      console.error('Preview error:', error)
      alert('Preview niet beschikbaar: ' + error.message)
    }
  }

  const handleDelete = async (document, e) => {
    e.stopPropagation()
    
    const confirmDelete = window.confirm(
      `Weet je zeker dat je het document "${document.original_name}" wilt verwijderen?\n\nDeze actie kan niet ongedaan worden gemaakt.`
    )
    
    if (confirmDelete) {
      try {
        await knowledgeDocumentService.delete(document.id)
        
        // Refresh document list
        await loadDocuments()
        
        // Clear selected document if it was deleted
        if (selectedDocument?.id === document.id) {
          setSelectedDocument(null)
        }
        
        console.log('Document deleted successfully:', document.original_name)
      } catch (error) {
        console.error('Error deleting document:', error)
        alert('Fout bij het verwijderen van het document: ' + error.message)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Kennis Documenten
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Project: {currentProject?.name} • {filteredDocuments.length} document(en)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Zoek in documenten..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Alle types</option>
                <option value="pdf">PDF</option>
                <option value="word">Word</option>
                <option value="text">Tekst</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-200px)]">
          {/* Document List */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Documenten laden...</div>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FileText className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">Geen documenten gevonden</p>
                <p className="text-sm">Upload documenten om te beginnen</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    onClick={() => handleDocumentClick(document)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedDocument?.id === document.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-2xl">{getFileIcon(document.mime_type)}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {document.original_name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {document.content_preview}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(document.created_at)}
                            </span>
                            <span>{formatFileSize(document.file_size)}</span>
                          </div>
                          {document.tags.length > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              <Tag className="w-3 h-3 text-gray-400" />
                              <div className="flex gap-1">
                                {document.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={(e) => handlePreview(document, e)}
                          className="p-1 text-gray-400 hover:text-green-600 rounded"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDownload(document, e)}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(document, e)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                          title="Verwijderen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Document Preview */}
          <div className="w-1/2 overflow-y-auto">
            {selectedDocument ? (
              <div className="p-6">
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{getFileIcon(selectedDocument.mime_type)}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedDocument.original_name}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>{formatFileSize(selectedDocument.file_size)}</span>
                        <span>{formatDate(selectedDocument.created_at)}</span>
                      </div>
                      {selectedDocument.tags.length > 0 && (
                        <div className="flex items-center gap-2 mt-3">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <div className="flex gap-1">
                            {selectedDocument.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Inhoud Preview</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedDocument.content_preview}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={(e) => handlePreview(selectedDocument, e)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Eye className="w-4 h-4" />
                    Volledig Bekijken
                  </button>
                  <button
                    onClick={(e) => handleDownload(selectedDocument, e)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={(e) => handleDelete(selectedDocument, e)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Verwijderen
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-lg font-medium">Selecteer een document</p>
                  <p className="text-sm">Klik op een document om details te bekijken</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}