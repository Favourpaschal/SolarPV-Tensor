import { useState } from 'react'
import { useSceneStore } from '../store/sceneStore'
import { ComponentRegistry } from './components'

type Props = { wiringMode: boolean; wireType: 'positive' | 'negative' }

export default function SceneObjects({ wiringMode, wireType }: Props) {
  const components = useSceneStore((s) => s.components)
  const selectedId = useSceneStore((s) => s.selectedId)
  const selectComponent = useSceneStore((s) => s.selectComponent)
  const addWire = useSceneStore((s) => s.addWire)
  const [wiringFrom, setWiringFrom] = useState<string | null>(null)

  function handleClick(id: string) {
    if (!wiringMode) {
      selectComponent(id)
      return
    }
    if (!wiringFrom) {
      setWiringFrom(id)
      return
    }
    if (wiringFrom !== id) {
    addWire(wiringFrom, id, wireType)
  }
    setWiringFrom(null)
  }

  return (
    <>
      {components.map((c) => {
        const Model = ComponentRegistry[c.type]
        const isFrom = wiringFrom === c.id
        return (
          <group
            key={c.id}
            position={c.position}
            onClick={(e) => {
              e.stopPropagation()
              handleClick(c.id)
            }}
          >
            <Model selected={selectedId === c.id} />
            {(selectedId === c.id || isFrom) && (
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <ringGeometry args={[0.8, 0.95, 32]} />
                <meshBasicMaterial color={isFrom ? '#e24b4a' : '#378ADD'} />
              </mesh>
            )}
          </group>
        )
      })}
    </>
  )
}