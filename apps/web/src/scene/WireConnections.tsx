import { QuadraticBezierLine } from '@react-three/drei'
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
      {wires.map((w) => {
        const start = findPos(w.fromId)
        const end = findPos(w.toId)
        // midpoint pulled slightly downward — gives a natural cable sag
        const mid: [number, number, number] = [
          (start[0] + end[0]) / 2,
          Math.min(start[1], end[1]) - 0.15,
          (start[2] + end[2]) / 2,
        ]
        return (
          <QuadraticBezierLine
            key={w.id}
            start={start}
            end={end}
            mid={mid}
            color={w.wireType === 'positive' ? '#e24b4a' : '#1c1c1c'}
            lineWidth={2.5}
          />
        )
      })}
    </>
  )
}