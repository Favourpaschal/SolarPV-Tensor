import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useSceneStore } from '../store/sceneStore'
import { ComponentRegistry } from './components'
import ComponentAnnotation from './ComponentAnnotation'
import type { AppMode } from '../types'

type Props = {
  mode: AppMode
  wireType: 'positive' | 'negative'
  setOrbitEnabled: (enabled: boolean) => void
}

export default function SceneObjects({ mode, wireType, setOrbitEnabled }: Props) {
  const components = useSceneStore((s) => s.components)
  const selectedId = useSceneStore((s) => s.selectedId)
  const selectComponent = useSceneStore((s) => s.selectComponent)
  const addWire = useSceneStore((s) => s.addWire)
  const moveComponent = useSceneStore((s) => s.moveComponent)
  const rotateComponent = useSceneStore((s) => s.rotateComponent)

  const [wiringFrom, setWiringFrom] = useState<string | null>(null)

  const { camera, gl } = useThree()

  const isDragging = useRef(false)
  const dragId = useRef<string | null>(null)
  const groundPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0))
  const intersection = useRef(new THREE.Vector3())
  const raycaster = useRef(new THREE.Raycaster())

  const isRotating = useRef(false)
  const rotateId = useRef<string | null>(null)
  const rotateStartX = useRef(0)
  const rotateStartY = useRef(0)

  const downPos = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = gl.domElement

    function onMouseMove(e: MouseEvent) {
      if (isDragging.current && dragId.current) {
        const rect = canvas.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.current.setFromCamera(new THREE.Vector2(x, y), camera)
        raycaster.current.ray.intersectPlane(
          groundPlane.current,
          intersection.current
        )
        const snapped: [number, number, number] = [
          Math.round(intersection.current.x),
          0,
          Math.round(intersection.current.z),
        ]
        moveComponent(dragId.current, snapped)
      }

      if (isRotating.current && rotateId.current) {
        const deltaX = e.clientX - rotateStartX.current
        const newRotY = rotateStartY.current + deltaX * 0.02
        rotateComponent(rotateId.current, [0, newRotY, 0])
      }
    }

    function onMouseUp() {
      if (isDragging.current || isRotating.current) {
        isDragging.current = false
        dragId.current = null
        isRotating.current = false
        rotateId.current = null
        setOrbitEnabled(true)
      }
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onMouseUp)
    return () => {
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseup', onMouseUp)
    }
  }, [camera, gl, moveComponent, rotateComponent, setOrbitEnabled])

  function handlePointerDown(id: string, e: any) {
    e.stopPropagation()
    downPos.current = { x: e.clientX, y: e.clientY }
    if (mode === 'select' && selectedId === id) {
      isDragging.current = true
      dragId.current = id
      setOrbitEnabled(false)
    }
  }

  function handleClick(id: string, e: any) {
    e.stopPropagation()

    if (downPos.current) {
      const dx = e.clientX - downPos.current.x
      const dy = e.clientY - downPos.current.y
      if (Math.sqrt(dx * dx + dy * dy) > 5) return
    }

    if (mode === 'wire') {
      if (!wiringFrom) {
        setWiringFrom(id)
        return
      }
      if (wiringFrom !== id) {
        addWire(wiringFrom, id, wireType)
      }
      setWiringFrom(null)
      return
    }

    selectComponent(id)
  }

  return (
    <>
      {components.map((c) => {
        const Model = ComponentRegistry[c.type]
        const isSelected = selectedId === c.id
        const isFrom = wiringFrom === c.id

        return (
          <group key={c.id}>
            {/* Component mesh with drag and click handlers */}
            <group
              position={c.position}
              rotation={c.rotation as any}
              onPointerDown={(e) => handlePointerDown(c.id, e)}
              onClick={(e) => handleClick(c.id, e)}
            >
              <Model selected={isSelected} />

              {/* Floating annotation label above each component */}
              <ComponentAnnotation
                id={c.id}
                type={c.type}
                notes={c.notes}
                isSelected={isSelected}
              />

              {/* Blue selection ring / red wiring-from ring */}
              {(isSelected || isFrom) && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                  <ringGeometry args={[0.8, 0.95, 32]} />
                  <meshBasicMaterial
                    color={isFrom ? '#e24b4a' : '#378ADD'}
                  />
                </mesh>
              )}
            </group>

            {/* Orange rotation torus — independent of component rotation */}
            {isSelected && mode === 'select' && (
              <group position={c.position}>
                <mesh
                  rotation={[-Math.PI / 2, 0, 0]}
                  position={[0, 0.05, 0]}
                  onPointerDown={(e) => {
                    e.stopPropagation()
                    const comp = useSceneStore
                      .getState()
                      .components.find((comp) => comp.id === c.id)
                    isRotating.current = true
                    rotateId.current = c.id
                    rotateStartX.current = e.clientX
                    rotateStartY.current = comp?.rotation[1] ?? 0
                    setOrbitEnabled(false)
                  }}
                >
                  <torusGeometry args={[1.3, 0.06, 8, 48]} />
                  <meshBasicMaterial color="#EF9F27" />
                </mesh>
              </group>
            )}
          </group>
        )
      })}
    </>
  )
}