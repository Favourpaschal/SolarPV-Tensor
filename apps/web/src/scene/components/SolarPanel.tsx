type Props = { selected: boolean }

export default function SolarPanel({ selected }: Props) {
  return (
    <group>
      <mesh position={[0, 0.5, 0]} rotation={[-0.5, 0, 0]} castShadow>
        <boxGeometry args={[1.6, 0.04, 1.0]} />
        <meshStandardMaterial
          color={selected ? '#4a8fe8' : '#1a3a6b'}
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0, 0.5, 0]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[1.66, 0.005, 1.06]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}