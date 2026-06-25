import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import Lighting from './Lighting';

export default function SystemCanvas() {
  return (
    <div style={{ width: '100%', height: '80vh' }}>
      <Canvas
        shadows
        camera={{ position: [6, 6, 6], fov: 45 }}
      >
        <Lighting />
        <Grid args={[20, 20]} cellColor="#999" sectionColor="#555" />
        <OrbitControls makeDefault />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}