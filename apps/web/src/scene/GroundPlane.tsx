import { useSceneStore } from '../store/sceneStore'
import { useRef } from 'react'
import type { ComponentModelType } from '../types'

type Props = { placingType: ComponentModelType | null }

export default function GroundPlane({ placingType }: Props) {
  const addComponent = useSceneStore((s) => s.addComponent)
  const selectComponent = useSceneStore((s) => s.selectComponent)
  const downPos = useRef<{ x: number; y: number } | null>(null)

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      visible={false}
      onPointerDown={(e) => {
        downPos.current = { x: e.clientX, y: e.clientY }
      }}
      onPointerUp={(e) => {
        if (!downPos.current) return
        const dx = e.clientX - downPos.current.x
        const dy = e.clientY - downPos.current.y
        const movedDistance = Math.sqrt(dx * dx + dy * dy)
        downPos.current = null

        // If the mouse moved more than 5px, treat it as a drag/orbit, not a click
        if (movedDistance > 5) return

        e.stopPropagation()
        if (!placingType) {
          selectComponent(null)
          return
        }
        const p = e.point
        const snapped: [number, number, number] = [
          Math.round(p.x),
          0,
          Math.round(p.z),
        ]
        addComponent({
          id: crypto.randomUUID(),
          type: placingType,
          position: snapped,
          rotation: [0, 0, 0],
        })
      }}
    >
      <planeGeometry args={[40, 40]} />
      <meshBasicMaterial />
    </mesh>
  )
}