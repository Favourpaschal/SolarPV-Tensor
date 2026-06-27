import { Line } from '@react-three/drei'
import { useSceneStore } from '../store/sceneStore'

export default function WireConnections() {
  const wires = useSceneStore((s) => s.wires)
  const components = useSceneStore((s) => s.components)

  function findPos(id: string): [number, number, number] {
    const c = components.find((c) => c.id === id)
    return c ? c.position : [0, 0, 0]
  }

  return (
    <>
      {wires.map((w) => (
        <Line
          key={w.id}
          points={[findPos(w.fromId), findPos(w.toId)]}
          color="#e24b4a"
          lineWidth={2}
        />
      ))}
    </>
  )
}