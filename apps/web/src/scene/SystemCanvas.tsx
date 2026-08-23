import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import Lighting from './Lighting'
import SceneObjects from './SceneObjects'
import GroundPlane from './GroundPlane'
import WireConnections from './WireConnections'
import SceneNotepad from '../components/SceneNotepad'
import type { AppMode, ComponentModelType } from '../types'

type Props = {
  mode: AppMode
  wireType: 'positive' | 'negative'
}

const PLACING_TYPES: ComponentModelType[] = [
  'panel',
  'inverter',
  'battery',
  'charge_controller',
  'combiner_box',
]

export default function SystemCanvas({ mode, wireType }: Props) {
  const [orbitEnabled, setOrbitEnabled] = useState(true)

  const placingType = PLACING_TYPES.includes(mode as ComponentModelType)
    ? (mode as ComponentModelType)
    : null

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [6, 6, 6], fov: 45 }}
      >
        <Lighting />
        <Grid
          args={[20, 20]}
          cellColor="#888888"
          sectionColor="#444444"
          fadeDistance={30}
        />
        <OrbitControls makeDefault enabled={orbitEnabled} />
        <SceneObjects
          mode={mode}
          wireType={wireType}
          setOrbitEnabled={setOrbitEnabled}
        />
        <GroundPlane placingType={placingType} />
        <WireConnections />
      </Canvas>

      {/* Design notes button — top right, above the toolbar */}
      <SceneNotepad />
    </div>
  )
}