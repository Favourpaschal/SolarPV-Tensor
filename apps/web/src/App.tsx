import { useState } from 'react'
import SystemCanvas from './scene/SystemCanvas'
import Toolbar from './components/Toolbar'
import type { AppMode } from './types'

export default function App() {
  const [mode, setMode] = useState<AppMode>('select')

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Toolbar mode={mode} setMode={setMode} />
      <SystemCanvas mode={mode} />
    </div>
  )
}