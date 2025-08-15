import { supabase } from '../config/supabase.js'

/**
 * Knowledge Document Service
 * Handles CRUD operations for knowledge documents and file uploads
 */
class KnowledgeDocumentService {
  
  /**
   * Upload a file to Supabase Storage and create document metadata
   */
  async upload(file, projectId) {
    try {
      console.log('📄 Uploading knowledge document:', { file: file.name, projectId })
      
      // Validate project exists
      if (!projectId) {
        throw new Error('Geen project geselecteerd. Selecteer eerst een project.')
      }

      // Check if project exists in database
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .single()

      if (projectError || !project) {
        console.error('Project validation error:', projectError)
        throw new Error(`Project met ID ${projectId} niet gevonden. Maak eerst een project aan.`)
      }

      console.log('✅ Project validated:', project.id)

      // Generate unique filename
      const fileExtension = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`
      const filePath = `${projectId}/${fileName}`

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('knowledge-documents')
        .upload(filePath, file)

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Extract text content (mock implementation for now)
      const extractedContent = await this.extractTextContent(file)

      // Create document metadata record
      const documentData = {
        project_id: projectId,
        name: fileName,
        original_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        content_preview: extractedContent.substring(0, 200) + (extractedContent.length > 200 ? '...' : ''),
        extraction_status: 'completed',
        extracted_content: extractedContent,
        metadata: {
          uploaded_at: new Date().toISOString(),
          file_extension: fileExtension
        }
      }

      console.log('💾 Saving document metadata to database:', documentData)

      const { data: documentRecord, error: dbError } = await supabase
        .from('knowledge_documents')
        .insert([documentData])
        .select()
        .single()

      if (dbError) {
        console.error('Database error details:', {
          error: dbError,
          data: documentData,
          projectId: projectId
        })
        
        // Clean up uploaded file if database insert fails
        await supabase.storage
          .from('knowledge-documents')
          .remove([filePath])
        
        throw new Error(`Database error: ${dbError.message}. Check console for details.`)
      }

      console.log('✅ Document saved successfully:', documentRecord)

      return documentRecord
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  /**
   * Get all documents for a project
   */
  async getByProject(projectId) {
    try {
      const { data, error } = await supabase
        .from('knowledge_documents')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to load documents: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error loading documents:', error)
      throw error
    }
  }

  /**
   * Get a single document by ID
   */
  async getById(documentId) {
    try {
      const { data, error } = await supabase
        .from('knowledge_documents')
        .select('*')
        .eq('id', documentId)
        .single()

      if (error) {
        throw new Error(`Failed to load document: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error loading document:', error)
      throw error
    }
  }

  /**
   * Delete a document and its file
   */
  async delete(documentId) {
    try {
      // Get document info first
      const document = await this.getById(documentId)
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('knowledge-documents')
        .remove([document.file_path])

      if (storageError) {
        console.warn('Storage deletion warning:', storageError.message)
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('knowledge_documents')
        .delete()
        .eq('id', documentId)

      if (dbError) {
        throw new Error(`Failed to delete document: ${dbError.message}`)
      }

      return true
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  }

  /**
   * Update document metadata
   */
  async update(documentId, updates) {
    try {
      const { data, error } = await supabase
        .from('knowledge_documents')
        .update(updates)
        .eq('id', documentId)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update document: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error updating document:', error)
      throw error
    }
  }

  /**
   * Get download URL for a document
   */
  async getDownloadUrl(filePath) {
    try {
      const { data, error } = await supabase.storage
        .from('knowledge-documents')
        .createSignedUrl(filePath, 3600) // 1 hour expiry

      if (error) {
        throw new Error(`Failed to get download URL: ${error.message}`)
      }

      return data.signedUrl
    } catch (error) {
      console.error('Error getting download URL:', error)
      throw error
    }
  }

  /**
   * Search documents by content
   */
  async search(projectId, query) {
    try {
      const { data, error } = await supabase
        .from('knowledge_documents')
        .select('*')
        .eq('project_id', projectId)
        .textSearch('extracted_content', query, {
          type: 'websearch',
          config: 'dutch'
        })
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Search failed: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error searching documents:', error)
      throw error
    }
  }

  /**
   * Extract text content from file using server-side processing
   */
  async extractTextContent(file) {
    try {
      console.log(`📄 Extracting content from ${file.type}: ${file.name}`)
      
      if (file.type === 'text/plain' || file.type === 'text/markdown') {
        return await this.extractPlainText(file)
      } else if (file.type === 'application/pdf') {
        return await this.extractPDFTextServerSide(file)
      } else if (file.type.includes('word')) {
        return await this.extractWordText(file)
      } else {
        console.warn(`⚠️ Unsupported file type: ${file.type}`)
        return `Document: ${file.name}\n\nContent extraction not yet implemented for this file type (${file.type}). File uploaded successfully for future processing.`
      }
    } catch (error) {
      console.error('Text extraction error:', error)
      return `Document: ${file.name}\n\nError extracting content: ${error.message}. File uploaded successfully.`
    }
  }

  /**
   * Extract text from plain text files
   */
  async extractPlainText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(new Error('Failed to read text file'))
      reader.readAsText(file)
    })
  }

  /**
   * Extract text from PDF files using server-side processing
   */
  async extractPDFTextServerSide(file) {
    try {
      console.log(`🚀 Sending PDF to server for processing: ${file.name}`)
      
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      
      // Send to server-side API
      const response = await fetch('http://localhost:3001/api/extract-pdf', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || `Server error: ${response.status}`)
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Server processing failed')
      }
      
      console.log(`✅ Server-side PDF extraction completed:`, {
        filename: result.data.metadata.filename,
        pages: result.data.metadata.pageCount,
        characters: result.data.metadata.characterCount,
        words: result.data.metadata.wordCount
      })
      
      return result.data.extractedContent
      
    } catch (error) {
      console.error('Server-side PDF extraction error:', error)
      
      // Provide helpful error messages
      if (error.message.includes('Failed to fetch') || error.message.includes('ECONNREFUSED')) {
        return `PDF Document: ${file.name}\n\nServer niet beschikbaar. Start de API server met 'npm run dev:api' of 'npm run dev'.\n\nTechnical error: ${error.message}`
      }
      
      if (error.message.includes('413') || error.message.includes('too large')) {
        return `PDF Document: ${file.name}\n\nBestand te groot. Maximum bestandsgrootte is 10MB.\n\nProbeer een kleiner PDF bestand te uploaden.`
      }
      
      return `PDF Document: ${file.name}\n\nServer-side PDF processing failed: ${error.message}\n\nDe server kan momenteel geen PDF bestanden verwerken. Upload het bestand als plain text of probeer later opnieuw.`
    }
  }

  /**
   * Extract text from Word documents (placeholder for future implementation)
   */
  async extractWordText(file) {
    console.warn('📝 Word document extraction not yet implemented, using placeholder')
    return `Word Document: ${file.name}\n\nWord document text extraction not yet implemented. Please save as PDF or plain text for full content extraction.\n\nDocument structure includes formatted text, headings, lists, and other rich content elements.`
  }

  /**
   * Get document statistics for a project
   */
  async getStats(projectId) {
    try {
      const { data, error } = await supabase
        .from('knowledge_documents_stats')
        .select('*')
        .eq('project_id', projectId)
        .single()

      if (error && error.code !== 'PGRST116') { // Not found is OK
        throw new Error(`Failed to get stats: ${error.message}`)
      }

      return data || {
        total_documents: 0,
        total_size_bytes: 0,
        processed_documents: 0,
        failed_documents: 0
      }
    } catch (error) {
      console.error('Error getting document stats:', error)
      throw error
    }
  }
}

export const knowledgeDocumentService = new KnowledgeDocumentService()