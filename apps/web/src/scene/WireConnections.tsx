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

        // Calculate perpendicular direction in the XZ plane
        const dx = end[0] - start[0]
        const dz = end[2] - start[2]
        const len = Math.sqrt(dx * dx + dz * dz) || 1

        // Perpendicular unit vector
        const px = (-dz / len) * 0.12
        const pz = (dx / len) * 0.12

        // Positive wire offsets one way, negative wire offsets the other
        const sign = w.wireType === 'positive' ? 1 : -1

        const offsetStart: [number, number, number] = [
          start[0] + px * sign,
          start[1] + 0.5,
          start[2] + pz * sign,
        ]
        const offsetEnd: [number, number, number] = [
          end[0] + px * sign,
          end[1] + 0.5,
          end[2] + pz * sign,
        ]

        // Mid point sags downward for natural cable droop
        const mid: [number, number, number] = [
          (offsetStart[0] + offsetEnd[0]) / 2,
          Math.min(offsetStart[1], offsetEnd[1]) - 0.3,
          (offsetStart[2] + offsetEnd[2]) / 2,
        ]

        return (
          <QuadraticBezierLine
            key={w.id}
            start={offsetStart}
            end={offsetEnd}
            mid={mid}
            color={w.wireType === 'positive' ? '#e24b4a' : '#1c1c1c'}
            lineWidth={2.5}
          />
        )
      })}
    </>
  )
}