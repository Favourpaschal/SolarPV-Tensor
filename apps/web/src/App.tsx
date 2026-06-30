import { useUIStore } from './store/uiStore'
import ModeSwitcher from './components/ModeSwitcher'
import HobbyistWizard from './pages/HobbyistWizard'
import ProfessionalWorkspace from './pages/ProfessionalWorkspace'

export default function App() {
  const { mode } = useUIStore()

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <ModeSwitcher />
      {mode === 'hobbyist' ? <HobbyistWizard /> : <ProfessionalWorkspace />}
    </div>
  )
}