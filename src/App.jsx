import { MainLayout } from './components/layout/MainLayout'
import { ProjectProvider } from './contexts/ProjectContext'

function App() {
  return (
    <ProjectProvider>
      <MainLayout />
    </ProjectProvider>
  )
}

export default App
