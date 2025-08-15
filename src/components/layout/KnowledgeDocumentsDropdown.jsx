import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Upload, Eye, FileText } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'
import { KnowledgeDocumentUpload } from '../modals/KnowledgeDocumentUpload'
import { KnowledgeDocumentViewer } from '../modals/KnowledgeDocumentViewer'

export function KnowledgeDocumentsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { currentProject } = useProject()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleUploadClick = () => {
    setIsOpen(false)
    setUploadModalOpen(true)
  }

  const handleViewClick = () => {
    setIsOpen(false)
    setViewModalOpen(true)
  }

  // Don't show dropdown if no project is selected
  if (!currentProject) {
    return null
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
        >
          <FileText className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-gray-700">
            Kennis Documenten
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="py-2">
              <button
                onClick={handleUploadClick}
                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Upload Document
                  </div>
                  <div className="text-xs text-gray-500">
                    Voeg kennis documenten toe
                  </div>
                </div>
              </button>

              <button
                onClick={handleViewClick}
                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4 text-green-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    View Documents
                  </div>
                  <div className="text-xs text-gray-500">
                    Bekijk geüploade documenten
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <KnowledgeDocumentUpload 
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />

      {/* View Modal */}
      <KnowledgeDocumentViewer 
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
      />
    </>
  )
}