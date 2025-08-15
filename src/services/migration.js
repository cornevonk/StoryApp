import { projectService, pageService, elementService, templateService } from './database.js'
import { seedBuiltInTemplates } from './mockData.js'

// Migration utilities
export const migrationService = {
  // Migrate all localStorage data to Supabase
  async migrateAll() {
    console.log('🚀 Starting migration from localStorage to Supabase...')
    
    try {
      // Step 1: Seed built-in templates
      await seedBuiltInTemplates()
      
      // Step 2: Migrate custom templates
      await this.migrateCustomTemplates()
      
      // Step 3: Migrate projects
      await this.migrateProjects()
      
      // Step 4: Migrate current state
      await this.migrateCurrentState()
      
      console.log('✅ Migration completed successfully!')
      return true
    } catch (error) {
      console.error('❌ Migration failed:', error)
      throw error
    }
  },

  // Migrate custom templates
  async migrateCustomTemplates() {
    console.log('📋 Migrating custom templates...')
    
    const customTemplates = this.getFromLocalStorage('custom-templates')
    if (!customTemplates || customTemplates.length === 0) {
      console.log('No custom templates to migrate')
      return
    }

    const hiddenTemplates = this.getFromLocalStorage('hidden-templates') || []
    
    for (const template of customTemplates) {
      try {
        await templateService.create({
          name: template.name,
          description: template.description || '',
          category: template.category || 'Custom',
          elements: template.elements || []
        })
        console.log(`✅ Migrated template: ${template.name}`)
      } catch (error) {
        console.error(`❌ Failed to migrate template ${template.name}:`, error)
      }
    }

    console.log(`📋 Custom templates migration completed: ${customTemplates.length} templates`)
  },

  // Migrate projects
  async migrateProjects() {
    console.log('📁 Migrating projects...')
    
    const projects = this.getFromLocalStorage('page-template-configurator-projects')
    if (!projects || projects.length === 0) {
      console.log('No projects to migrate')
      return
    }

    const migratedProjects = []
    
    for (const project of projects) {
      try {
        // Create project
        const newProject = await projectService.create({
          name: project.name,
          branding: project.branding,
          contextualData: project.contextualData
        })

        // Migrate pages for this project
        if (project.pages && project.pages.length > 0) {
          const migratedPages = []
          
          for (let i = 0; i < project.pages.length; i++) {
            const page = project.pages[i]
            
            // Create page
            const newPage = await pageService.create({
              project_id: newProject.id,
              name: page.name,
              position: page.position || { x: 0, y: 0 },
              order_index: i
            })

            // Migrate elements for this page
            if (page.elements && page.elements.length > 0) {
              const elementsData = page.elements.map((element, elementIndex) => ({
                page_id: newPage.id,
                element_type: element.type,
                content: element.content || '',
                x: element.x || 0,
                y: element.y || 0,
                width: element.width || 250,
                height: element.height || 150,
                properties: this.extractElementProperties(element),
                order_index: elementIndex
              }))

              await elementService.createBulk(elementsData)
            }

            migratedPages.push(newPage)
          }

          // Set active page if specified
          if (project.activePage && migratedPages.length > 0) {
            const activePageIndex = project.pages.findIndex(p => p.id === project.activePage)
            if (activePageIndex >= 0 && migratedPages[activePageIndex]) {
              await projectService.update(newProject.id, {
                active_page_id: migratedPages[activePageIndex].id
              })
            }
          }
        }

        migratedProjects.push(newProject)
        console.log(`✅ Migrated project: ${project.name}`)
        
      } catch (error) {
        console.error(`❌ Failed to migrate project ${project.name}:`, error)
      }
    }

    console.log(`📁 Projects migration completed: ${migratedProjects.length} projects`)
    return migratedProjects
  },

  // Migrate current state
  async migrateCurrentState() {
    console.log('💾 Migrating current state...')
    
    const currentState = this.getFromLocalStorage('page-template-configurator-current-state')
    if (!currentState || !currentState.currentProject) {
      console.log('No current state to migrate')
      return
    }

    // The current state should already be migrated as part of projects migration
    // This is mainly for verification and cleanup
    console.log(`💾 Current state project: ${currentState.currentProject.name}`)
  },

  // Backup localStorage data before migration
  async backupLocalStorageData() {
    const backup = {
      timestamp: new Date().toISOString(),
      projects: this.getFromLocalStorage('page-template-configurator-projects'),
      currentState: this.getFromLocalStorage('page-template-configurator-current-state'),
      customTemplates: this.getFromLocalStorage('custom-templates'),
      hiddenTemplates: this.getFromLocalStorage('hidden-templates')
    }

    // Store backup in localStorage with a special key
    localStorage.setItem('supabase-migration-backup', JSON.stringify(backup))
    
    // Also download as JSON file
    this.downloadBackup(backup)
    
    console.log('📦 Backup created and downloaded')
    return backup
  },

  // Download backup as JSON file
  downloadBackup(backup) {
    const dataStr = JSON.stringify(backup, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `page-configurator-backup-${new Date().toISOString().slice(0, 10)}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  },

  // Clear localStorage after successful migration
  clearLocalStorageData() {
    const keys = [
      'page-template-configurator-projects',
      'page-template-configurator-current-state',
      'custom-templates',
      'hidden-templates'
    ]

    keys.forEach(key => {
      localStorage.removeItem(key)
      console.log(`🗑️ Cleared localStorage key: ${key}`)
    })
  },

  // Utility functions
  getFromLocalStorage(key) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error parsing localStorage key ${key}:`, error)
      return null
    }
  },

  extractElementProperties(element) {
    // Extract all properties except the core ones handled separately
    const coreProps = ['id', 'type', 'content', 'x', 'y', 'width', 'height']
    const properties = {}
    
    Object.keys(element).forEach(key => {
      if (!coreProps.includes(key)) {
        properties[key] = element[key]
      }
    })
    
    return properties
  },

  // Check if migration is needed
  async isMigrationNeeded() {
    const hasLocalStorageData = (
      localStorage.getItem('page-template-configurator-projects') ||
      localStorage.getItem('custom-templates')
    )

    if (!hasLocalStorageData) {
      return false
    }

    // Check if we already have data in Supabase
    const projects = await projectService.getAll()
    const templates = await templateService.getAll()

    return projects.length === 0 && templates.length === 0
  }
}