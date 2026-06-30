import { useState } from 'react'
import Toolbar from '../components/Toolbar'
import SystemCanvas from '../scene/SystemCanvas'
import SchematicView from '../components/schematic/SchematicView'
import type { AppMode } from '../types'

export default function ProfessionalWorkspace() {
  const [mode, setMode] = useState<AppMode>('select')
  const [showSchematic, setShowSchematic] = useState(false)

  return (
    <div className="h-full relative">
      <Toolbar mode={mode} setMode={setMode} />
      <button
        onClick={() => setShowSchematic((v) => !v)}
        className="absolute top-3 left-3 z-10 text-sm border rounded px-3 py-1 bg-white"
      >
        {showSchematic ? '3D view' : '2D schematic'}
      </button>
      {showSchematic ? <SchematicView /> : <SystemCanvas mode={mode} />}
    </div>
  )
}