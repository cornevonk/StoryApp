import { useState } from 'react'
import { ChevronDown, Plus, FolderOpen, Save, Trash2 } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'

export function ProjectDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [showProjectList, setShowProjectList] = useState(false)
  const { currentProject, projects, createProject, saveProject, loadProject, deleteProject, pages } = useProject()

  const handleNewProject = () => {
    const projectName = prompt('Naam voor nieuw project:')
    if (projectName && projectName.trim()) {
      // Save current project state before creating new one
      if (currentProject) {
        saveProject()
      }
      
      createProject({ 
        name: projectName.trim(),
        pages: [],
        branding: null
      })
      
      alert(`Nieuw project "${projectName}" is aangemaakt!`)
    }
    setIsOpen(false)
  }

  const handleOpenProject = () => {
    setShowProjectList(true)
  }

  const handleSelectProject = (project) => {
    // Save current project before switching
    if (currentProject) {
      saveProject()
    }
    
    loadProject(project)
    setShowProjectList(false)
    setIsOpen(false)
    
    alert(`Project "${project.name}" geladen!`)
  }

  const handleSaveProject = () => {
    if (currentProject) {
      saveProject()
      alert(`Project "${currentProject.name}" opgeslagen met ${pages.length} pagina's!`)
    } else {
      alert('Geen project om op te slaan. Maak eerst een nieuw project aan.')
    }
    setIsOpen(false)
  }

  const handleDeleteProject = (e, project) => {
    e.stopPropagation() // Prevent selecting the project when clicking delete
    
    const confirmDelete = confirm(
      `Weet je zeker dat je project "${project.name}" wilt verwijderen?\n\n` +
      `Dit verwijdert het project en alle bijbehorende pagina's en elementen permanent. ` +
      `Deze actie kan niet ongedaan worden gemaakt.`
    )
    
    if (confirmDelete) {
      deleteProject(project.id)
      alert(`Project "${project.name}" is verwijderd.`)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Project
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => { setIsOpen(false); setShowProjectList(false); }} 
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
            {!showProjectList ? (
              // Main menu
              <>
                <button
                  onClick={handleNewProject}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Nieuw project...
                </button>
                
                <button
                  onClick={handleOpenProject}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FolderOpen className="w-4 h-4" />
                  Open project...
                </button>
                
                <hr className="my-2 border-gray-200" />
                
                <button
                  onClick={handleSaveProject}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Opslaan
                </button>
              </>
            ) : (
              // Project list
              <>
                <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b border-gray-200">
                  Selecteer project om te openen:
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {projects.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Geen opgeslagen projecten gevonden
                    </div>
                  ) : (
                    projects.map((project) => (
                      <div
                        key={project.id}
                        className={`group flex items-center border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          currentProject?.id === project.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <button
                          onClick={() => handleSelectProject(project)}
                          className={`flex-1 text-left px-4 py-3 ${
                            currentProject?.id === project.id ? 'text-brand-blue' : 'text-gray-700'
                          }`}
                        >
                          <div className="font-medium">{project.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {project.page_count || 0} pagina's • 
                            Gewijzigd: {new Date(project.updated_at || project.created_at).toLocaleDateString('nl-NL')}
                          </div>
                        </button>
                        
                        <button
                          onClick={(e) => handleDeleteProject(e, project)}
                          className="p-2 mx-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                          title={`Verwijder project "${project.name}"`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <button
                    onClick={() => setShowProjectList(false)}
                    className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    ← Terug
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}