import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import HobbyistWizard from './pages/HobbyistWizard'
import ProfessionalCanvas from './pages/ProfessionalCanvas'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hobbyist" element={<HobbyistWizard />} />
        <Route path="/professional" element={<ProfessionalCanvas />} />
      </Routes>
    </BrowserRouter>
  )
}