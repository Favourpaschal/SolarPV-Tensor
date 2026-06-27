import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Environment } from '@react-three/drei'
import Lighting from './Lighting'
import SceneObjects from './SceneObjects'
import GroundPlane from './GroundPlane'
import WireConnections from './WireConnections'
import type { AppMode, ComponentModelType } from '../types'

type Props = { mode: AppMode }

const PLACING_TYPES: ComponentModelType[] = [
  'panel', 'inverter', 'battery', 'charge_controller', 'combiner_box',
]

export default function SystemCanvas({ mode }: Props) {
  const placingType = PLACING_TYPES.includes(mode as ComponentModelType)
    ? (mode as ComponentModelType)
    : null

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas shadows camera={{ position: [6, 6, 6], fov: 45 }}>
        <Lighting />
        <Grid
          args={[20, 20]}
          cellColor="#888888"
          sectionColor="#444444"
          fadeDistance={30}
        />
        <Environment preset="city" />
        <OrbitControls makeDefault />
        <SceneObjects wiringMode={mode === 'wire'} />
        <GroundPlane placingType={placingType} />
        <WireConnections />
      </Canvas>
    </div>
  )
}