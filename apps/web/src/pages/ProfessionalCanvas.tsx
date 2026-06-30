import { useState, useEffect } from 'react'
import SystemCanvas from '../scene/SystemCanvas'
import SchematicView from '../components/SchematicView'
import Toolbar from '../components/Toolbar'
import type { AppMode } from '../types'

export default function ProfessionalCanvas() {
  const [mode, setMode] = useState<AppMode>('select')
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024)

  useEffect(() => {
    function onResize() { setIsTablet(window.innerWidth < 1024) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: isTablet ? 'column' : 'row',
      height: '100vh',
    }}>
      <div style={{ position: 'relative', flex: isTablet ? 'none' : 2, height: isTablet ? '60vh' : '100%' }}>
        <Toolbar mode={mode} setMode={setMode} />
        <SystemCanvas mode={mode} />
      </div>
      <div style={{ flex: 1, padding: 12, overflowY: 'auto' }}>
        <h3>Schematic</h3>
        <SchematicView />
      </div>
    </div>
  )
}