import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import HobbyistWizard from './pages/HobbyistWizard'

const ProfessionalCanvas = lazy(() => import('./pages/ProfessionalCanvas'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hobbyist" element={<HobbyistWizard />} />
        <Route path="/professional" element={
          <Suspense fallback={<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading 3D canvas...</div>}>
            <ProfessionalCanvas />
          </Suspense>
        } />
      </Routes>
    </BrowserRouter>
  )
}