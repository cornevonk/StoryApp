import { useState } from 'react'
import { Plus, FolderOpen, FileText } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'

export function ProjectSelectionScreen() {
  const { projects, createProject, loadProject } = useProject()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateProject = () => {
    const projectName = prompt('Naam voor nieuw project:')
    if (projectName && projectName.trim()) {
      createProject({ 
        name: projectName.trim(),
        pages: [],
        branding: null
      })
    }
  }

  const handleSelectProject = (project) => {
    loadProject(project)
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="max-w-4xl w-full mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welkom bij Page Template Configurator
          </h1>
          <p className="text-gray-600 text-lg">
            Selecteer een bestaand project of maak een nieuw project aan
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={handleCreateProject}
            disabled={isCreating}
            className="flex items-center gap-3 px-8 py-4 bg-brand-blue text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-lg shadow-lg hover:shadow-xl"
          >
            <Plus className="w-6 h-6" />
            Nieuw Project
          </button>
          
          {projects.length > 0 && (
            <div className="text-center text-gray-500 flex items-center px-4">
              <span className="text-sm">of</span>
            </div>
          )}
        </div>

        {/* Existing Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Bestaande Projecten
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleSelectProject(project)}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:border-brand-blue hover:shadow-lg transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                      <FolderOpen className="w-6 h-6 text-gray-600 group-hover:text-brand-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {project.page_count || 0} pagina's
                      </p>
                      <p className="text-xs text-gray-500">
                        Gewijzigd: {new Date(project.updated_at || project.created_at).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nog geen projecten
            </h3>
            <p className="text-gray-600 mb-6">
              Maak je eerste project aan om te beginnen met het configureren van templates
            </p>
          </div>
        )}
      </div>
    </div>
  )
}