import { useSceneStore } from '../store/sceneStore'
import type { ComponentModelType } from '../types'

type Props = { placingType: ComponentModelType | null }

export default function GroundPlane({ placingType }: Props) {
  const addComponent = useSceneStore((s) => s.addComponent)
  const selectComponent = useSceneStore((s) => s.selectComponent)

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      visible={false}
      onClick={(e) => {
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