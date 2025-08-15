import { createContext, useContext, useReducer, useEffect } from 'react'
import { projectService, pageService, elementService, templateService, templateLibraryService, assetService } from '../services/database.js'
import { migrationService } from '../services/migration.js'

// Initial state
const initialState = {
  currentProject: null,
  projects: [],
  templates: [],
  templateLibraries: [],
  assets: [],
  pages: [],
  activePage: null,
  currentTemplate: null,
  selectedTemplate: null,
  contextualData: {},
  isLoading: false,
  error: null,
  isMigrated: false,
  // Undo/Redo system
  history: [],
  historyIndex: -1,
  maxHistorySize: 50
}

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_MIGRATED: 'SET_MIGRATED',
  CREATE_PROJECT: 'CREATE_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  LOAD_PROJECT: 'LOAD_PROJECT',
  SET_TEMPLATE: 'SET_TEMPLATE',
  SET_CURRENT_TEMPLATE: 'SET_CURRENT_TEMPLATE',
  UPDATE_TEMPLATE_ELEMENT: 'UPDATE_TEMPLATE_ELEMENT',
  ADD_TEMPLATE_ELEMENT: 'ADD_TEMPLATE_ELEMENT',
  REMOVE_TEMPLATE_ELEMENT: 'REMOVE_TEMPLATE_ELEMENT',
  UNDO: 'UNDO',
  REDO: 'REDO',
  SAVE_STATE: 'SAVE_STATE',
  ADD_PAGE: 'ADD_PAGE',
  REMOVE_PAGE: 'REMOVE_PAGE',
  UPDATE_PAGE: 'UPDATE_PAGE',
  SET_ACTIVE_PAGE: 'SET_ACTIVE_PAGE',
  REORDER_PAGES: 'REORDER_PAGES',
  UPDATE_PAGE_POSITION: 'UPDATE_PAGE_POSITION',
  ADD_ELEMENT_TO_PAGE: 'ADD_ELEMENT_TO_PAGE',
  UPDATE_PAGE_ELEMENT: 'UPDATE_PAGE_ELEMENT',
  REMOVE_PAGE_ELEMENT: 'REMOVE_PAGE_ELEMENT',
  SET_CONTEXTUAL_DATA: 'SET_CONTEXTUAL_DATA',
  LOAD_PROJECTS: 'LOAD_PROJECTS',
  LOAD_TEMPLATES: 'LOAD_TEMPLATES',
  LOAD_TEMPLATE_LIBRARIES: 'LOAD_TEMPLATE_LIBRARIES',
  CREATE_TEMPLATE_LIBRARY: 'CREATE_TEMPLATE_LIBRARY',
  DELETE_TEMPLATE_LIBRARY: 'DELETE_TEMPLATE_LIBRARY',
  LOAD_ASSETS: 'LOAD_ASSETS',
  ADD_ASSET: 'ADD_ASSET',
  REMOVE_ASSET: 'REMOVE_ASSET',
  SAVE_PROJECT: 'SAVE_PROJECT',
  SYNC_PROJECT_WITH_CURRENT_STATE: 'SYNC_PROJECT_WITH_CURRENT_STATE'
}

// Reducer
function projectReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload }
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false }
    
    case ActionTypes.SET_MIGRATED:
      return { ...state, isMigrated: action.payload }
    
    case ActionTypes.CREATE_PROJECT:
      const newProject = action.payload
      return {
        ...state,
        currentProject: newProject,
        projects: [...state.projects, newProject],
        pages: [], // Clear pages for new project
        activePage: null
      }
    
    case ActionTypes.UPDATE_PROJECT:
      const updatedProject = action.payload
      return {
        ...state,
        currentProject: updatedProject,
        projects: state.projects.map(p => 
          p.id === updatedProject.id ? updatedProject : p
        )
      }
    
    case ActionTypes.LOAD_PROJECT:
      // Load project and its pages, or clear if null
      const loadedProject = action.payload
      
      // Handle project deletion / clearing
      if (!loadedProject || loadedProject.currentProject === null) {
        return {
          ...state,
          currentProject: null,
          pages: [],
          activePage: null
        }
      }
      
      // Convert Supabase structure to expected format
      const formattedPages = loadedProject.pages?.map(page => ({
        ...page,
        elements: page.elements || [] // Show all elements for now (was: .filter(el => el.is_visible))
      })) || []
      
      return {
        ...state,
        currentProject: loadedProject,
        pages: formattedPages,
        activePage: loadedProject.active_page_id || formattedPages[0]?.id || null
      }
    
    case ActionTypes.SET_TEMPLATE:
      return {
        ...state,
        selectedTemplate: action.payload
      }
    
    case ActionTypes.SET_CURRENT_TEMPLATE:
      return {
        ...state,
        currentTemplate: action.payload
      }
    
    case ActionTypes.UPDATE_TEMPLATE_ELEMENT:
      if (!state.currentTemplate) return state
      return {
        ...state,
        currentTemplate: {
          ...state.currentTemplate,
          elements: state.currentTemplate.elements.map(el =>
            el.id === action.payload.id ? { ...el, ...action.payload.updates } : el
          )
        }
      }
    
    case ActionTypes.ADD_TEMPLATE_ELEMENT:
      if (!state.currentTemplate) return state
      return {
        ...state,
        currentTemplate: {
          ...state.currentTemplate,
          elements: [...state.currentTemplate.elements, action.payload]
        }
      }
    
    case ActionTypes.REMOVE_TEMPLATE_ELEMENT:
      if (!state.currentTemplate) return state
      return {
        ...state,
        currentTemplate: {
          ...state.currentTemplate,
          elements: state.currentTemplate.elements.filter(el => el.id !== action.payload)
        }
      }
    
    case ActionTypes.ADD_PAGE:
      const newPage = action.payload
      return {
        ...state,
        pages: [...state.pages, newPage],
        activePage: newPage.id // Set new page as active
      }
    
    case ActionTypes.REMOVE_PAGE:
      return {
        ...state,
        pages: state.pages.filter(page => page.id !== action.payload),
        activePage: state.activePage === action.payload ? null : state.activePage
      }
    
    case ActionTypes.UPDATE_PAGE:
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === action.payload.id ? { ...page, ...action.payload.updates } : page
        )
      }
    
    case ActionTypes.SET_ACTIVE_PAGE:
      return {
        ...state,
        activePage: action.payload
      }
    
    case ActionTypes.REORDER_PAGES:
      return {
        ...state,
        pages: action.payload
      }
    
    case ActionTypes.UPDATE_PAGE_POSITION:
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === action.payload.pageId 
            ? { ...page, position: action.payload.position }
            : page
        )
      }
    
    case ActionTypes.ADD_ELEMENT_TO_PAGE:
      const { pageId, element } = action.payload
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === pageId 
            ? { ...page, elements: [...(page.elements || []), element] }
            : page
        )
      }

    case ActionTypes.UPDATE_PAGE_ELEMENT:
      const { pageId: updatePageId, elementId, updates } = action.payload
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === updatePageId 
            ? {
                ...page,
                elements: page.elements.map(el =>
                  el.id === elementId ? { ...el, ...updates } : el
                )
              }
            : page
        )
      }

    case ActionTypes.REMOVE_PAGE_ELEMENT:
      const { pageId: removePageId, elementId: removeElementId } = action.payload
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === removePageId 
            ? {
                ...page,
                elements: page.elements.filter(el => el.id !== removeElementId)
              }
            : page
        )
      }
    
    case ActionTypes.SET_CONTEXTUAL_DATA:
      return {
        ...state,
        contextualData: action.payload
      }
    
    case ActionTypes.LOAD_PROJECTS:
      return {
        ...state,
        projects: action.payload
      }
      
    case ActionTypes.LOAD_TEMPLATES:
      return {
        ...state,
        templates: action.payload
      }
      
    case ActionTypes.LOAD_TEMPLATE_LIBRARIES:
      return {
        ...state,
        templateLibraries: action.payload
      }
      
    case ActionTypes.CREATE_TEMPLATE_LIBRARY:
      return {
        ...state,
        templateLibraries: [...state.templateLibraries, action.payload]
      }
      
    case ActionTypes.DELETE_TEMPLATE_LIBRARY:
      return {
        ...state,
        templateLibraries: state.templateLibraries.filter(lib => lib.id !== action.payload)
      }
      
    case ActionTypes.LOAD_ASSETS:
      return {
        ...state,
        assets: action.payload
      }
      
    case ActionTypes.ADD_ASSET:
      return {
        ...state,
        assets: [action.payload, ...state.assets]
      }
      
    case ActionTypes.REMOVE_ASSET:
      return {
        ...state,
        assets: state.assets.filter(asset => asset.id !== action.payload)
      }
      
    case ActionTypes.SYNC_PROJECT_WITH_CURRENT_STATE:
      if (!state.currentProject) return state
      
      // This will be handled by auto-save to Supabase
      return state
    
    case ActionTypes.SAVE_STATE:
      const stateToSave = {
        currentProject: state.currentProject,
        pages: state.pages,
        activePage: state.activePage,
        contextualData: state.contextualData
      }
      
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(stateToSave)
      
      // Limit history size
      if (newHistory.length > state.maxHistorySize) {
        newHistory.shift()
      }
      
      return {
        ...state,
        history: newHistory,
        historyIndex: newHistory.length - 1
      }
    
    case ActionTypes.UNDO:
      if (state.historyIndex <= 0) return state
      
      const previousState = state.history[state.historyIndex - 1]
      return {
        ...state,
        ...previousState,
        history: state.history,
        historyIndex: state.historyIndex - 1,
        maxHistorySize: state.maxHistorySize
      }
    
    case ActionTypes.REDO:
      if (state.historyIndex >= state.history.length - 1) return state
      
      const nextState = state.history[state.historyIndex + 1]
      return {
        ...state,
        ...nextState,
        history: state.history,
        historyIndex: state.historyIndex + 1,
        maxHistorySize: state.maxHistorySize
      }
    
    default:
      return state
  }
}

// Context
const ProjectContext = createContext()

// Provider component
export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(projectReducer, initialState)

  // Check for migration and load initial data
  useEffect(() => {
    async function initializeData() {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true })
      
      try {
        // Check if migration is needed
        const needsMigration = await migrationService.isMigrationNeeded()
        
        if (needsMigration) {
          console.log('🔄 Migration needed - starting automatic migration...')
          
          // Backup localStorage data
          await migrationService.backupLocalStorageData()
          
          // Run migration
          await migrationService.migrateAll()
          
          // Clear localStorage after successful migration
          migrationService.clearLocalStorageData()
          
          dispatch({ type: ActionTypes.SET_MIGRATED, payload: true })
          console.log('✅ Migration completed successfully!')
        }

        // Load projects, templates, template libraries, and assets from Supabase
        await Promise.all([
          loadProjects(),
          loadTemplates(),
          loadTemplateLibraries(),
          loadAssets()
        ])

      } catch (error) {
        console.error('Initialization error:', error)
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false })
      }
    }

    initializeData()
  }, [])

  // Load projects from Supabase
  const loadProjects = async () => {
    try {
      const projects = await projectService.getAll()
      dispatch({ type: ActionTypes.LOAD_PROJECTS, payload: projects })
    } catch (error) {
      console.error('Error loading projects:', error)
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
    }
  }

  // Load templates from Supabase
  const loadTemplateLibraries = async () => {
    try {
      // TODO: Replace 'default-user' with actual user ID when auth is implemented
      const libraries = await templateLibraryService.getAll('default-user')
      dispatch({ type: ActionTypes.LOAD_TEMPLATE_LIBRARIES, payload: libraries })
    } catch (error) {
      console.error('Error loading template libraries:', error)
    }
  }

  const loadTemplates = async () => {
    try {
      const templates = await templateService.getAll()
      // Convert template_elements to elements for compatibility
      const formattedTemplates = templates.map(template => ({
        ...template,
        elements: template.template_elements?.map(el => ({
          id: el.id,
          type: el.element_type,
          content: el.content,
          x: el.x,
          y: el.y,
          width: el.width,
          height: el.height,
          ...el.properties
        })) || []
      }))
      dispatch({ type: ActionTypes.LOAD_TEMPLATES, payload: formattedTemplates })
    } catch (error) {
      console.error('Error loading templates:', error)
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
    }
  }

  // Load assets from Supabase
  const loadAssets = async () => {
    try {
      const assets = await assetService.getAll()
      dispatch({ type: ActionTypes.LOAD_ASSETS, payload: assets })
    } catch (error) {
      console.error('Error loading assets:', error)
      // Don't set error state for assets since the table might not exist yet
    }
  }


  // Actions
  const actions = {
    createProject: async (projectData) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true })
      try {
        const newProject = await projectService.create(projectData)
        dispatch({ type: ActionTypes.CREATE_PROJECT, payload: newProject })
        
        // Reload projects list
        await loadProjects()
      } catch (error) {
        console.error('Error creating project:', error)
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false })
      }
    },
    
    updateProject: async (updates) => {
      if (!state.currentProject) return
      
      try {
        const updatedProject = await projectService.update(state.currentProject.id, updates)
        dispatch({ type: ActionTypes.UPDATE_PROJECT, payload: updatedProject })
        
        // Reload projects list
        await loadProjects()
      } catch (error) {
        console.error('Error updating project:', error)
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
      }
    },

    deleteProject: async (projectId) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true })
      try {
        await projectService.delete(projectId)
        
        // Clear current project and pages if it was deleted
        if (state.currentProject && state.currentProject.id === projectId) {
          dispatch({ type: ActionTypes.LOAD_PROJECT, payload: null })
        }
        
        // Reload projects list
        await loadProjects()
      } catch (error) {
        console.error('Error deleting project:', error)
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false })
      }
    },
    
    loadProject: async (project) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true })
      try {
        const fullProject = await projectService.getById(project.id)
        dispatch({ type: ActionTypes.LOAD_PROJECT, payload: fullProject })
      } catch (error) {
        console.error('Error loading project:', error)
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false })
      }
    },
    
    setTemplate: (template) => {
      dispatch({ type: ActionTypes.SET_TEMPLATE, payload: template })
    },
    
    setContextualData: (data) => {
      dispatch({ type: ActionTypes.SET_CONTEXTUAL_DATA, payload: data })
    },
    
    setCurrentTemplate: (template) => {
      dispatch({ type: ActionTypes.SET_CURRENT_TEMPLATE, payload: template })
    },
    
    updateTemplateElement: (elementId, updates) => {
      dispatch({ 
        type: ActionTypes.UPDATE_TEMPLATE_ELEMENT, 
        payload: { id: elementId, updates }
      })
    },
    
    addTemplateElement: (element) => {
      dispatch({ type: ActionTypes.ADD_TEMPLATE_ELEMENT, payload: element })
    },
    
    removeTemplateElement: (elementId) => {
      dispatch({ type: ActionTypes.REMOVE_TEMPLATE_ELEMENT, payload: elementId })
    },
    
    addPage: async (template, position) => {
      if (!state.currentProject) return
      
      try {
        // Calculate next position
        const getNextPosition = () => {
          if (state.pages.length === 0) return { x: 0, y: 0 }
          
          const lastPage = state.pages[state.pages.length - 1]
          const pageWidth = 1200
          const pageHeight = 800
          const padding = 30
          
          return {
            x: 0,
            y: lastPage.position.y + pageHeight + padding
          }
        }

        // Extract page metadata from template elements
        let pageProperties = {}
        let filteredElements = []
        
        if (template && template.elements) {
          filteredElements = template.elements.filter(element => {
            if (element.type === '_page_meta' && element.content) {
              try {
                pageProperties = JSON.parse(element.content)
                return false // Don't include this element in final elements
              } catch (e) {
                console.warn('Could not parse page metadata:', element.content)
                return false
              }
            }
            return true // Include regular elements
          })
        }

        // Create page with extracted properties
        const newPage = await pageService.create({
          project_id: state.currentProject.id,
          name: template.name,
          position: position || getNextPosition(),
          order_index: state.pages.length
        })

        // Add page properties to the page object
        newPage.backgroundColor = pageProperties.backgroundColor || '#FFFFFF'

        // Create elements from template (excluding page metadata)
        if (filteredElements && filteredElements.length > 0) {
          const elementsData = filteredElements.map(el => ({
            page_id: newPage.id,
            element_type: el.type || el.element_type || 'text', // Support both formats
            content: el.content || '',
            x: el.x || 0,
            y: el.y || 0,
            width: el.width || 250,
            height: el.height || 150,
            properties: extractElementProperties(el),
            order_index: filteredElements.indexOf(el)
          }))

          const newElements = await elementService.createBulk(elementsData)
          newPage.elements = newElements || [] // Show all elements for now
        } else {
          newPage.elements = []
        }

        // Save state before making changes
        dispatch({ type: ActionTypes.SAVE_STATE })
        
        dispatch({ type: ActionTypes.ADD_PAGE, payload: newPage })
        
        // Update project's active page
        await projectService.update(state.currentProject.id, {
          active_page_id: newPage.id
        })
        
        // Make sure the new page becomes the active page in state
        dispatch({ type: ActionTypes.SET_ACTIVE_PAGE, payload: newPage.id })

      } catch (error) {
        console.error('Error adding page:', error)
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
      }
    },
    
    removePage: async (pageId) => {
      try {
        await pageService.delete(pageId)
        dispatch({ type: ActionTypes.REMOVE_PAGE, payload: pageId })
      } catch (error) {
        console.error('Error removing page:', error)
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
      }
    },
    
    updatePage: async (pageId, updates) => {
      try {
        await pageService.update(pageId, updates)
        dispatch({ 
          type: ActionTypes.UPDATE_PAGE, 
          payload: { id: pageId, updates }
        })
      } catch (error) {
        console.error('Error updating page:', error)
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
      }
    },
    
    setActivePage: async (pageId) => {
      dispatch({ type: ActionTypes.SET_ACTIVE_PAGE, payload: pageId })
      
      // Update in database if we have a current project
      if (state.currentProject) {
        try {
          await projectService.update(state.currentProject.id, {
            active_page_id: pageId
          })
        } catch (error) {
          console.error('Error setting active page:', error)
        }
      }
    },
    
    reorderPages: (newPageOrder) => {
      dispatch({ type: ActionTypes.REORDER_PAGES, payload: newPageOrder })
      // TODO: Update order in database
    },
    
    updatePagePosition: async (pageId, position) => {
      try {
        await pageService.update(pageId, { position })
        dispatch({ 
          type: ActionTypes.UPDATE_PAGE_POSITION, 
          payload: { pageId, position }
        })
      } catch (error) {
        console.error('Error updating page position:', error)
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
      }
    },
    
    addElementToPage: async (pageId, elementData) => {
      try {
        const newElement = await elementService.create({
          ...elementData,
          page_id: pageId
        })
        
        // Add all elements to state for now
        dispatch({ 
          type: ActionTypes.ADD_ELEMENT_TO_PAGE, 
          payload: { pageId, element: newElement }
        })
      } catch (error) {
        console.error('Error adding element to page:', error)
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
      }
    },

    updatePageElement: async (pageId, elementId, updates) => {
      try {
        await elementService.update(elementId, updates)
        dispatch({
          type: ActionTypes.UPDATE_PAGE_ELEMENT,
          payload: { pageId, elementId, updates }
        })
      } catch (error) {
        console.error('Error updating page element:', error)
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
      }
    },

    removePageElement: async (pageId, elementId) => {
      try {
        await elementService.delete(elementId)
        dispatch({
          type: ActionTypes.REMOVE_PAGE_ELEMENT,
          payload: { pageId, elementId }
        })
      } catch (error) {
        console.error('Error removing page element:', error)
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
      }
    },
    
    saveProject: async () => {
      if (state.currentProject) {
        // Auto-save is handled by individual operations
        console.log('Project auto-saved:', state.currentProject.name, 'with', state.pages.length, 'pages')
      }
    },
    
    syncCurrentStateToProject: () => {
      // No-op in Supabase version - data is always synced
    },
    
    setLoading: (loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading })
    },
    
    setError: (error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error })
    },
    
    // Undo/Redo functions
    saveState: () => {
      dispatch({ type: ActionTypes.SAVE_STATE })
    },
    
    undo: () => {
      dispatch({ type: ActionTypes.UNDO })
    },
    
    redo: () => {
      dispatch({ type: ActionTypes.REDO })
    },
    
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    
    // Asset management actions
    uploadAsset: async (file, projectId = null) => {
      try {
        const newAsset = await assetService.upload(file, projectId)
        dispatch({ type: ActionTypes.ADD_ASSET, payload: newAsset })
        return newAsset
      } catch (error) {
        console.error('Error uploading asset:', error)
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
        throw error
      }
    },
    
    deleteAsset: async (assetId) => {
      try {
        await assetService.delete(assetId)
        dispatch({ type: ActionTypes.REMOVE_ASSET, payload: assetId })
      } catch (error) {
        console.error('Error deleting asset:', error)
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
        throw error
      }
    },
    
    // Template Library functions
    createTemplateLibrary: async (libraryData) => {
      try {
        const newLibrary = await templateLibraryService.create(libraryData)
        if (newLibrary) {
          dispatch({ type: ActionTypes.CREATE_TEMPLATE_LIBRARY, payload: newLibrary })
        }
        return newLibrary
      } catch (error) {
        console.error('Error creating template library:', error)
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
        throw error
      }
    },
    
    deleteTemplateLibrary: async (libraryId) => {
      try {
        await templateLibraryService.delete(libraryId)
        dispatch({ type: ActionTypes.DELETE_TEMPLATE_LIBRARY, payload: libraryId })
      } catch (error) {
        console.error('Error deleting template library:', error)
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
        throw error
      }
    },

    moveTemplateToLibrary: async (templateId, libraryId) => {
      try {
        // Check if it's a mock template (string ID without UUID format) or Supabase template
        if (typeof templateId === 'string' && !templateId.includes('-')) {
          // Mock template - cannot be moved to libraries
          console.warn('Cannot move mock template to library:', templateId)
          alert('Mock templates kunnen niet verplaatst worden naar libraries. Maak eerst een eigen sjabloon aan.')
          return
        }
        
        // Supabase template - update in database
        await templateService.update(templateId, { 
          template_library_id: libraryId 
        })
        
        // Reload templates to reflect changes
        await loadTemplates()
      } catch (error) {
        console.error('Error moving template to library:', error)
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
        throw error
      }
    },
    
    loadTemplates: loadTemplates,
    loadAssets: loadAssets
  }

  return (
    <ProjectContext.Provider value={{ ...state, ...actions }}>
      {children}
    </ProjectContext.Provider>
  )
}

// Hook to use context
export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}

// Utility functions
function extractElementProperties(element) {
  // Extract all properties except the core ones handled separately
  const coreProps = ['id', 'type', 'content', 'x', 'y', 'width', 'height']
  const properties = {}
  
  Object.keys(element).forEach(key => {
    if (!coreProps.includes(key)) {
      properties[key] = element[key]
    }
  })
  
  return properties
}