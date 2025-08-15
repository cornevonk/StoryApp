import { useState, useRef } from 'react'
import { Upload, X, File, AlertCircle, CheckCircle } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'
import { knowledgeDocumentService } from '../../services/knowledgeDocumentService'

export function KnowledgeDocumentUpload({ isOpen, onClose }) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState([])
  const fileInputRef = useRef(null)
  const { currentProject } = useProject()

  if (!isOpen) return null

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    handleFiles(selectedFiles)
  }

  const handleFiles = (newFiles) => {
    // Filter for supported file types
    const supportedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown'
    ]

    const validFiles = newFiles.filter(file => {
      if (supportedTypes.includes(file.type)) {
        return true
      }
      // Also check file extensions for additional support
      const extension = file.name.toLowerCase().split('.').pop()
      return ['pdf', 'doc', 'docx', 'txt', 'md'].includes(extension)
    })

    const invalidFiles = newFiles.filter(file => !validFiles.includes(file))

    if (invalidFiles.length > 0) {
      alert(`Niet-ondersteunde bestanden genegeerd: ${invalidFiles.map(f => f.name).join(', ')}`)
    }

    setFiles(prev => [...prev, ...validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending'
    }))])
  }

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setUploadResults([])

    // Upload each file
    for (const fileItem of files) {
      try {
        // Update file status to uploading
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'uploading' } : f
        ))

        // Upload to Supabase
        const uploadResult = await knowledgeDocumentService.upload(fileItem.file, currentProject.id)
        
        setUploadResults(prev => [...prev, {
          id: fileItem.id,
          name: fileItem.file.name,
          status: 'success',
          message: 'Upload succesvol',
          documentId: uploadResult.id
        }])

        // Update file status
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'success' } : f
        ))

      } catch (error) {
        console.error('Upload error for file:', fileItem.file.name, error)
        
        setUploadResults(prev => [...prev, {
          id: fileItem.id,
          name: fileItem.file.name,
          status: 'error',
          message: error.message || 'Upload gefaald'
        }])

        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'error' } : f
        ))
      }
    }

    setUploading(false)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const canUpload = files.length > 0 && !uploading

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Kennis Documenten Uploaden
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Project: {currentProject?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${
              isDragging ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                Sleep bestanden hierheen
              </p>
              <p className="text-sm text-gray-600">
                of{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  klik om te selecteren
                </button>
              </p>
              <p className="text-xs text-gray-500">
                Ondersteund: PDF, Word, Tekst, Markdown (max 10MB per bestand)
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.md"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Geselecteerde Bestanden ({files.length})
              </h3>
              <div className="space-y-3">
                {files.map((fileItem) => (
                  <div
                    key={fileItem.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <File className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {fileItem.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(fileItem.file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {fileItem.status === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {fileItem.status === 'error' && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      {fileItem.status === 'pending' && (
                        <button
                          onClick={() => removeFile(fileItem.id)}
                          className="p-1 text-gray-400 hover:text-red-500 rounded"
                          disabled={uploading}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Results */}
          {uploadResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Upload Resultaten
              </h3>
              <div className="space-y-2">
                {uploadResults.map((result) => (
                  <div
                    key={result.id}
                    className={`p-3 rounded-lg ${
                      result.status === 'success'
                        ? 'bg-green-50 text-green-800'
                        : 'bg-red-50 text-red-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {result.status === 'success' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {result.name}: {result.message}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {files.length > 0 && `${files.length} bestand(en) geselecteerd`}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuleren
            </button>
            <button
              onClick={handleUpload}
              disabled={!canUpload}
              className={`px-6 py-2 rounded-lg font-medium ${
                canUpload
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {uploading ? 'Uploaden...' : 'Upload Documenten'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}