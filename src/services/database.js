import { supabase, TABLES, BUCKETS, handleSupabaseError } from '../config/supabase.js'

// Project operations
export const projectService = {
  // Get all projects with page count
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .select(`
        *,
        pages!pages_project_id_fkey (
          id
        )
      `)
      .order('updated_at', { ascending: false })
    
    handleSupabaseError(error, 'fetching projects')
    
    // Transform the data to include page count
    return (data || []).map(project => ({
      ...project,
      page_count: project.pages?.length || 0
    }))
  },

  // Get project by ID with pages and elements
  async getById(projectId) {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .select(`
        *,
        pages!pages_project_id_fkey (
          *,
          elements!elements_page_id_fkey (
            *
          )
        )
      `)
      .eq('id', projectId)
      .single()
    
    handleSupabaseError(error, 'fetching project')
    
    // Flatten element properties for compatibility
    if (data?.pages) {
      data.pages = data.pages.map(page => ({
        ...page,
        elements: (page.elements || []).map(element => ({
          ...element,
          ...(element.properties || {}),
          type: element.element_type, // Add type alias for compatibility
        }))
      }))
    }
    
    return data
  },

  // Create new project
  async create(projectData) {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .insert([{
        name: projectData.name || 'Nieuw Project',
        branding: projectData.branding || getDefaultBranding(),
        contextual_data: projectData.contextualData || {},
      }])
      .select()
      .single()
    
    handleSupabaseError(error, 'creating project')
    return data
  },

  // Update project
  async update(projectId, updates) {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .update(updates)
      .eq('id', projectId)
      .select()
      .single()
    
    handleSupabaseError(error, 'updating project')
    return data
  },

  // Delete project
  async delete(projectId) {
    const { error } = await supabase
      .from(TABLES.PROJECTS)
      .delete()
      .eq('id', projectId)
    
    handleSupabaseError(error, 'deleting project')
  },
}

// Page operations
export const pageService = {
  // Get pages for a project
  async getByProject(projectId) {
    const { data, error } = await supabase
      .from(TABLES.PAGES)
      .select(`
        *,
        elements (
          *
        )
      `)
      .eq('project_id', projectId)
      .order('order_index')
    
    handleSupabaseError(error, 'fetching pages')
    return data || []
  },

  // Create new page
  async create(pageData) {
    const { data, error } = await supabase
      .from(TABLES.PAGES)
      .insert([{
        project_id: pageData.project_id,
        name: pageData.name,
        position: pageData.position || { x: 0, y: 0 },
        order_index: pageData.order_index || 0,
      }])
      .select()
      .single()
    
    handleSupabaseError(error, 'creating page')
    return data
  },

  // Update page
  async update(pageId, updates) {
    const { data, error } = await supabase
      .from(TABLES.PAGES)
      .update(updates)
      .eq('id', pageId)
      .select()
      .single()
    
    handleSupabaseError(error, 'updating page')
    return data
  },

  // Delete page
  async delete(pageId) {
    const { error } = await supabase
      .from(TABLES.PAGES)
      .delete()
      .eq('id', pageId)
    
    handleSupabaseError(error, 'deleting page')
  },
}

// Element operations
export const elementService = {
  // Get elements for a page
  async getByPage(pageId) {
    const { data, error } = await supabase
      .from(TABLES.ELEMENTS)
      .select('*')
      .eq('page_id', pageId)
      .order('order_index')
    
    handleSupabaseError(error, 'fetching elements')
    // Flatten properties to top level for compatibility
    return (data || []).map(element => ({
      ...element,
      ...(element.properties || {}),
      type: element.element_type, // Add type alias for compatibility
    }))
  },

  // Create new element
  async create(elementData) {
    // Separate database fields from properties
    const { page_id, template_id, element_type, content, x, y, width, height, order_index, ...properties } = elementData
    
    const { data, error } = await supabase
      .from(TABLES.ELEMENTS)
      .insert([{
        page_id: elementData.page_id,
        template_id: elementData.template_id || null,
        element_type: elementData.element_type,
        content: elementData.content || '',
        x: Math.round((elementData.x || 0) * 100) / 100, // Round to 2 decimals
        y: Math.round((elementData.y || 0) * 100) / 100, // Round to 2 decimals
        width: Math.round((elementData.width || 250) * 100) / 100,
        height: Math.round((elementData.height || 150) * 100) / 100,
        properties: { 
          ...(elementData.properties || {}),
          ...properties // Include src, alt, assetId, etc. in properties
        },
        is_visible: true, // All elements visible like original localStorage version
        order_index: elementData.order_index || 0,
      }])
      .select()
      .single()
    
    handleSupabaseError(error, 'creating element')
    // Flatten properties to top level for compatibility
    return {
      ...data,
      ...(data.properties || {}),
      type: data.element_type, // Add type alias for compatibility
    }
  },

  // Update element
  async update(elementId, updates) {
    const { data, error } = await supabase
      .from(TABLES.ELEMENTS)
      .update(updates)
      .eq('id', elementId)
      .select()
      .single()
    
    handleSupabaseError(error, 'updating element')
    // Flatten properties to top level for compatibility
    return {
      ...data,
      ...(data.properties || {}),
      type: data.element_type, // Add type alias for compatibility
    }
  },

  // Delete element
  async delete(elementId) {
    const { error } = await supabase
      .from(TABLES.ELEMENTS)
      .delete()
      .eq('id', elementId)
    
    handleSupabaseError(error, 'deleting element')
  },

  // Bulk create elements (for template instantiation)
  async createBulk(elementsData) {
    const { data, error } = await supabase
      .from(TABLES.ELEMENTS)
      .insert(elementsData.map(el => ({
        ...el,
        x: Math.round((el.x || 0) * 100) / 100,
        y: Math.round((el.y || 0) * 100) / 100,
        width: Math.round((el.width || 250) * 100) / 100,
        height: Math.round((el.height || 150) * 100) / 100,
        is_visible: true, // Make all elements visible for now (was: el.element_type === 'text')
      })))
      .select()
    
    handleSupabaseError(error, 'creating elements')
    // Flatten properties to top level for compatibility
    return (data || []).map(element => ({
      ...element,
      ...(element.properties || {}),
      type: element.element_type, // Add type alias for compatibility
    }))
  },
}


// Template operations
export const templateService = {
  // Get all templates
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.TEMPLATES)
      .select(`
        *,
        template_elements (
          *
        )
      `)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
    
    handleSupabaseError(error, 'fetching templates')
    return data || []
  },

  // Create new template
  async create(templateData) {
    const { data: template, error: templateError } = await supabase
      .from(TABLES.TEMPLATES)
      .insert([{
        name: templateData.name,
        description: templateData.description || '',
        category: templateData.category || 'Custom',
        is_custom: templateData.is_custom !== undefined ? templateData.is_custom : true,
        is_hidden: false
      }])
      .select()
      .single()
    
    handleSupabaseError(templateError, 'creating template')

    // Create template elements if provided
    if (templateData.elements && templateData.elements.length > 0) {
      const elementsData = templateData.elements.map((el, index) => ({
        template_id: template.id,
        element_type: el.type,
        content: el.content || '',
        x: Math.round((el.x || 0) * 100) / 100,
        y: Math.round((el.y || 0) * 100) / 100,
        width: Math.round((el.width || 250) * 100) / 100,
        height: Math.round((el.height || 150) * 100) / 100,
        properties: el,
        order_index: index,
      }))

      const { error: elementsError } = await supabase
        .from(TABLES.TEMPLATE_ELEMENTS)
        .insert(elementsData)
      
      handleSupabaseError(elementsError, 'creating template elements')
    }

    return template
  },

  // Update template
  async update(templateId, templateData) {
    const { data, error } = await supabase
      .from(TABLES.TEMPLATES)
      .update({
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
      })
      .eq('id', templateId)
      .select()
      .single()
    
    handleSupabaseError(error, 'updating template')

    // Update template elements if provided
    if (templateData.elements) {
      // Delete existing elements
      await supabase
        .from(TABLES.TEMPLATE_ELEMENTS)
        .delete()
        .eq('template_id', templateId)

      // Create new elements
      if (templateData.elements.length > 0) {
        const elementsData = templateData.elements.map((el, index) => ({
          template_id: templateId,
          element_type: el.type,
          content: el.content || '',
          x: Math.round((el.x || 0) * 100) / 100,
          y: Math.round((el.y || 0) * 100) / 100,
          width: Math.round((el.width || 250) * 100) / 100,
          height: Math.round((el.height || 150) * 100) / 100,
          properties: el,
          order_index: index,
        }))

        const { error: elementsError } = await supabase
          .from(TABLES.TEMPLATE_ELEMENTS)
          .insert(elementsData)
        
        handleSupabaseError(elementsError, 'updating template elements')
      }
    }

    return data
  },

  // Delete template
  async delete(templateId) {
    const { error } = await supabase
      .from(TABLES.TEMPLATES)
      .delete()
      .eq('id', templateId)
    
    handleSupabaseError(error, 'deleting template')
  },

  // Hide template (for built-in templates)
  async hide(templateId) {
    const { data, error } = await supabase
      .from(TABLES.TEMPLATES)
      .update({ is_hidden: true })
      .eq('id', templateId)
      .select()
      .single()
    
    handleSupabaseError(error, 'hiding template')
    return data
  },
}

// System Assets operations (for platform templates)
export const systemAssetService = {
  // Get all system assets
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.SYSTEM_ASSETS)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.warn('System assets table not available yet:', error)
      return []
    }
    
    return data || []
  },

  // Upload system asset (admin only)
  async upload(file, description = null) {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `system/${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKETS.SYSTEM_ASSETS)
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKETS.SYSTEM_ASSETS)
        .getPublicUrl(filePath)

      // Save asset metadata to database
      const { data: assetData, error: dbError } = await supabase
        .from(TABLES.SYSTEM_ASSETS)
        .insert([{
          name: file.name,
          original_name: file.name,
          file_path: filePath,
          url: publicUrl,
          type: file.type,
          size: file.size,
          description: description,
          category: getCategoryFromType(file.type)
        }])
        .select()
        .single()

      if (dbError) {
        // If database save fails, clean up uploaded file
        await supabase.storage.from(BUCKETS.SYSTEM_ASSETS).remove([filePath])
        throw dbError
      }

      return assetData
    } catch (error) {
      console.error('Error uploading system asset:', error)
      throw error
    }
  }
}

// User Assets operations (for user uploads)
export const userAssetService = {
  // Get all user assets
  async getAll(projectId = null) {
    let query = supabase
      .from(TABLES.USER_ASSETS)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (projectId) {
      query = query.eq('project_id', projectId)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.warn('User assets table not available yet:', error)
      return []
    }
    
    return data || []
  },

  // Upload user asset (private with signed URLs)
  async upload(file, projectId = null, userId = null) {
    try {
      // Generate unique filename with user folder for RLS
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const userFolder = userId || 'anonymous' // TODO: use real user ID when auth is implemented
      const filePath = `user/${userFolder}/${fileName}`

      // Upload to private Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKETS.USER_ASSETS)
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Create signed URL (valid for 24 hours)
      const { data: { signedUrl }, error: urlError } = await supabase.storage
        .from(BUCKETS.USER_ASSETS)
        .createSignedUrl(filePath, 24 * 60 * 60) // 24 hours

      if (urlError) {
        // Clean up uploaded file if URL creation fails
        await supabase.storage.from(BUCKETS.USER_ASSETS).remove([filePath])
        throw urlError
      }

      // Save asset metadata to database (store file_path, not the signed URL)
      const { data: assetData, error: dbError } = await supabase
        .from(TABLES.USER_ASSETS)
        .insert([{
          name: file.name,
          original_name: file.name,
          file_path: filePath,
          url: signedUrl, // Temporary signed URL for immediate use
          type: file.type,
          size: file.size,
          project_id: projectId,
          user_id: userId,
          category: getCategoryFromType(file.type)
        }])
        .select()
        .single()

      if (dbError) {
        // If database save fails, clean up uploaded file
        await supabase.storage.from(BUCKETS.USER_ASSETS).remove([filePath])
        throw dbError
      }

      return assetData
    } catch (error) {
      console.error('Error uploading user asset:', error)
      throw error
    }
  },
  
  // Get fresh signed URL for a user asset
  async getSignedUrl(filePath, expiresIn = 3600) {
    try {
      const { data: { signedUrl }, error } = await supabase.storage
        .from(BUCKETS.USER_ASSETS)
        .createSignedUrl(filePath, expiresIn)
      
      if (error) throw error
      return signedUrl
    } catch (error) {
      console.error('Error creating signed URL:', error)
      throw error
    }
  },
  
  // Refresh URLs for user assets (call this periodically or when URLs expire)
  async refreshAssetUrls(assets) {
    try {
      const refreshedAssets = await Promise.all(
        assets
          .filter(asset => asset.source === 'user')
          .map(async (asset) => {
            try {
              const signedUrl = await this.getSignedUrl(asset.file_path)
              return { ...asset, url: signedUrl }
            } catch (error) {
              console.warn(`Failed to refresh URL for asset ${asset.id}:`, error)
              return asset // Keep original URL if refresh fails
            }
          })
      )
      
      // Merge refreshed user assets back with system assets
      const systemAssets = assets.filter(asset => asset.source === 'system')
      return [...systemAssets, ...refreshedAssets]
    } catch (error) {
      console.error('Error refreshing asset URLs:', error)
      return assets // Return original assets if refresh fails
    }
  },

  // Delete user asset
  async delete(assetId) {
    try {
      // First get the asset to find the file path
      const { data: asset, error: fetchError } = await supabase
        .from(TABLES.USER_ASSETS)
        .select('file_path')
        .eq('id', assetId)
        .single()

      if (fetchError) {
        throw fetchError
      }

      // Delete from storage
      if (asset.file_path) {
        const { error: storageError } = await supabase.storage
          .from(BUCKETS.USER_ASSETS)
          .remove([asset.file_path])

        if (storageError) {
          console.warn('Could not delete file from storage:', storageError)
        }
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from(TABLES.USER_ASSETS)
        .delete()
        .eq('id', assetId)

      if (dbError) {
        throw dbError
      }
    } catch (error) {
      console.error('Error deleting user asset:', error)
      throw error
    }
  }
}

// Template Library operations
export const templateLibraryService = {
  // Get all template libraries
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.TEMPLATE_LIBRARIES)
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) {
      console.warn('Template libraries table not available yet:', error)
      return []
    }
    
    return data || []
  },

  // Create new template library
  async create(libraryData) {
    const { data, error } = await supabase
      .from(TABLES.TEMPLATE_LIBRARIES)
      .insert([{
        name: libraryData.name,
        description: libraryData.description || '',
        icon: libraryData.icon || '📁',
        is_default: libraryData.is_default || false
      }])
      .select()
      .single()
    
    if (error) {
      console.warn('Could not create template library:', error)
      return null
    }
    
    return data
  },

  // Update template library
  async update(libraryId, updates) {
    const { data, error } = await supabase
      .from(TABLES.TEMPLATE_LIBRARIES)
      .update(updates)
      .eq('id', libraryId)
      .select()
      .single()
    
    if (error) {
      console.warn('Could not update template library:', error)
      return null
    }
    
    return data
  },

  // Delete template library
  async delete(libraryId) {
    const { error } = await supabase
      .from(TABLES.TEMPLATE_LIBRARIES)
      .delete()
      .eq('id', libraryId)
    
    if (error) {
      console.warn('Could not delete template library:', error)
      throw error
    }
  },

  // Get templates for a specific library
  async getTemplates(libraryId) {
    const { data, error } = await supabase
      .from(TABLES.TEMPLATES)
      .select(`
        *,
        template_elements (
          *
        )
      `)
      .eq('template_library_id', libraryId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.warn('Could not get templates for library:', error)
      return []
    }
    
    return data || []
  }
}

// Combined asset service for backward compatibility and unified interface
export const assetService = {
  // Get all assets (system + user) with fresh signed URLs
  async getAll(projectId = null) {
    const [systemAssets, userAssets] = await Promise.all([
      systemAssetService.getAll(),
      userAssetService.getAll(projectId)
    ])
    
    const allAssets = [
      ...systemAssets.map(asset => ({ ...asset, source: 'system', deletable: false })),
      ...userAssets.map(asset => ({ ...asset, source: 'user', deletable: true }))
    ]
    
    // Refresh signed URLs for user assets
    return await userAssetService.refreshAssetUrls(allAssets)
  },
  
  // Get only system assets
  getSystemAssets: systemAssetService.getAll,
  
  // Get only user assets
  getUserAssets: userAssetService.getAll,
  
  // Upload user asset (main upload function)
  upload: userAssetService.upload,
  
  // Delete asset (only user assets can be deleted)
  async delete(assetId, source = 'user') {
    if (source === 'system') {
      throw new Error('System assets cannot be deleted by users')
    }
    return userAssetService.delete(assetId)
  }
}

// Presentation Publishing Service
export const presentationService = {
  // Copy user assets to public presentation bucket for sharing
  async publishPresentation(projectId, presentationId) {
    try {
      // Get all user assets for this project
      const userAssets = await userAssetService.getAll(projectId)
      
      const publishedAssets = []
      
      for (const asset of userAssets) {
        try {
          // Download the file from private bucket
          const { data: fileData, error: downloadError } = await supabase.storage
            .from(BUCKETS.USER_ASSETS)
            .download(asset.file_path)
          
          if (downloadError) {
            console.warn(`Failed to download asset ${asset.name}:`, downloadError)
            continue
          }
          
          // Generate new path for published presentation
          const fileExt = asset.name.split('.').pop()
          const newFileName = `${asset.id}.${fileExt}`
          const publishedPath = `presentations/${presentationId}/${newFileName}`
          
          // Upload to public presentations bucket
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from(BUCKETS.PUBLISHED_PRESENTATIONS)
            .upload(publishedPath, fileData)
          
          if (uploadError) {
            console.warn(`Failed to publish asset ${asset.name}:`, uploadError)
            continue
          }
          
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from(BUCKETS.PUBLISHED_PRESENTATIONS)
            .getPublicUrl(publishedPath)
          
          publishedAssets.push({
            originalAssetId: asset.id,
            publishedPath,
            publicUrl,
            name: asset.name,
            type: asset.type
          })
          
        } catch (error) {
          console.error(`Error publishing asset ${asset.name}:`, error)
          continue
        }
      }
      
      return publishedAssets
      
    } catch (error) {
      console.error('Error publishing presentation:', error)
      throw error
    }
  },
  
  // Clean up published presentation assets
  async unpublishPresentation(presentationId) {
    try {
      // List all files in the presentation folder
      const { data: files, error: listError } = await supabase.storage
        .from(BUCKETS.PUBLISHED_PRESENTATIONS)
        .list(`presentations/${presentationId}`)
      
      if (listError) {
        console.warn('Error listing presentation files:', listError)
        return
      }
      
      if (!files || files.length === 0) return
      
      // Delete all files in the presentation folder
      const filePaths = files.map(file => `presentations/${presentationId}/${file.name}`)
      const { error: deleteError } = await supabase.storage
        .from(BUCKETS.PUBLISHED_PRESENTATIONS)
        .remove(filePaths)
      
      if (deleteError) {
        console.warn('Error deleting presentation files:', deleteError)
      }
      
    } catch (error) {
      console.error('Error unpublishing presentation:', error)
      throw error
    }
  }
}

// Utility functions
function getCategoryFromType(type) {
  if (type?.startsWith('image/')) {
    if (type.includes('svg')) return 'icons'
    return 'images'
  }
  if (type?.includes('pdf')) return 'documents'
  return 'other'
}

function getDefaultBranding() {
  return {
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
}