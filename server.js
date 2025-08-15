import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import os from 'os'

const app = express()
const PORT = 3001

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  credentials: true
}))

app.use(express.json())

// Configure multer for file upload handling
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed'), false)
    }
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'PDF extraction API server is running',
    timestamp: new Date().toISOString()
  })
})

// PDF extraction endpoint
app.post('/api/extract-pdf', upload.single('file'), async (req, res) => {
  try {
    console.log(`📄 Processing PDF: ${req.file.originalname} (${req.file.size} bytes)`)

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please upload a PDF file'
      })
    }

    console.log('🔧 Configuring PDF.js for server-side processing...')

    // Extract text using proper PDF.js configuration
    const result = await extractPDFContent(req.file.buffer, req.file.originalname)

    console.log(`✅ PDF processed successfully: ${result.extractedContent.length} characters from ${result.pageCount} pages`)

    // Return structured response compatible with future expansions
    return res.status(200).json({
      success: true,
      data: {
        extractedContent: result.extractedContent,
        originalText: result.rawText,
        metadata: {
          filename: req.file.originalname,
          fileSize: req.file.size,
          pageCount: result.pageCount,
          wordCount: result.rawText.split(/\s+/).filter(w => w.length > 0).length,
          characterCount: result.rawText.length,
          pdfMetadata: result.pdfInfo,
          processingTime: result.processingTime,
          // Future: will include images, tables, etc.
          contentTypes: ['text'] // Future: ['text', 'images', 'tables']
        }
      }
    })

  } catch (error) {
    console.error('PDF extraction error:', error)

    // Handle specific error types
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'File too large',
        message: 'PDF file must be smaller than 10MB'
      })
    }

    if (error.message.includes('Only PDF files')) {
      return res.status(400).json({
        error: 'Invalid file type',
        message: 'Only PDF files are supported'
      })
    }

    // Generic error response
    return res.status(500).json({
      error: 'PDF processing failed',
      message: 'Could not extract text from PDF. Please ensure the PDF contains readable text.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

/**
 * Extract PDF content using PyMuPDF via Python subprocess
 * Robust and future-ready for multimedia extraction
 */
async function extractPDFContent(buffer, filename) {
  const startTime = Date.now()
  const tempPath = path.join(os.tmpdir(), `pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.pdf`)
  
  try {
    console.log('📖 Processing PDF with PyMuPDF...')
    
    // Write buffer to temporary file
    fs.writeFileSync(tempPath, buffer)
    
    // Extract text and metadata using Python/PyMuPDF
    const pythonScript = `
import fitz
import json
import sys

try:
    doc = fitz.open('${tempPath}')
    
    # Extract basic info
    data = {
        'text': '',
        'page_count': doc.page_count,
        'metadata': doc.metadata or {}
    }
    
    # Extract text from all pages
    for page_num in range(doc.page_count):
        page = doc[page_num]
        page_text = page.get_text()
        if page_text.strip():
            data['text'] += page_text + '\\n\\n'
    
    # Clean up text
    data['text'] = data['text'].strip()
    
    doc.close()
    print(json.dumps(data))
    
except Exception as e:
    error_data = {
        'error': str(e),
        'text': '',
        'page_count': 0,
        'metadata': {}
    }
    print(json.dumps(error_data))
    sys.exit(1)
`
    
    console.log(`📄 Extracting text from PDF: ${filename}`)
    
    // Execute Python script
    const result = execSync(`python3 -c "${pythonScript}"`, { 
      encoding: 'utf8',
      timeout: 30000 // 30 second timeout
    })
    
    const data = JSON.parse(result.trim())
    
    // Check for Python errors
    if (data.error) {
      throw new Error(`Python extraction failed: ${data.error}`)
    }
    
    const processingTime = Date.now() - startTime
    console.log(`⏱️ PDF processing completed in ${processingTime}ms`)
    console.log(`📊 Extracted ${data.text.length} characters from ${data.page_count} pages`)
    
    // Format extracted content
    const extractedContent = formatExtractedContent(data.text, data.page_count, filename)

    return {
      extractedContent,
      rawText: data.text,
      pageCount: data.page_count,
      pdfInfo: data.metadata,
      processingTime,
      // Future: ready for multimedia extraction
      images: [], // Future: PyMuPDF image extraction
      tables: [], // Future: PyMuPDF table detection  
      contentTypes: ['text'], // Future: ['text', 'images', 'tables']
      // Expansion ready - no API changes needed
    }

  } catch (error) {
    console.error('❌ PDF processing failed:', error)
    throw new Error(`PDF processing failed: ${error.message}`)
  } finally {
    // Cleanup temporary file
    try {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath)
        console.log('🧹 Cleaned up temporary file')
      }
    } catch (cleanupError) {
      console.warn('⚠️ Failed to cleanup temp file:', cleanupError.message)
    }
  }
}

/**
 * Format extracted content for better readability
 */
function formatExtractedContent(text, pageCount, filename) {
  if (!text || text.trim().length === 0) {
    return `PDF Document: ${filename}\n\nNo readable text content found in this PDF. The document may contain only images or scanned text.`
  }

  // Clean up the text
  let cleanedText = text
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Reduce excessive line breaks
    .replace(/\s{2,}/g, ' ') // Normalize spaces
    .trim()

  // Add document header
  const header = `PDF Document: ${filename} (${pageCount} page${pageCount !== 1 ? 's' : ''})\n\n`
  
  return header + cleanedText
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error)
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'File too large',
        message: 'PDF file must be smaller than 10MB'
      })
    }
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on the server'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PDF extraction API server running on http://localhost:${PORT}`)
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`)
  console.log(`📄 PDF extraction: POST http://localhost:${PORT}/api/extract-pdf`)
})