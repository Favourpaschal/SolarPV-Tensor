type Props = {
  position?: [number, number, number]
}

export default function PanelPlaceholder({ position = [0, 0, 0] }: Props) {
  return (
    <mesh position={position} rotation={[-0.3, 0, 0]} castShadow>
      <boxGeometry args={[1.6, 0.04, 1.0]} />
      <meshStandardMaterial color="#1a3a6b" metalness={0.3} roughness={0.4} />
    </mesh>
  )
}