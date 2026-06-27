type Props = { selected: boolean }

export default function Battery({ selected }: Props) {
  return (
    <group>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.35, 0.5, 0.4]} />
        <meshStandardMaterial
          color={selected ? '#555555' : '#1c1c1c'}
          metalness={0.3}
          roughness={0.6}
        />
      </mesh>
      <mesh position={[0.08, 0.52, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.06, 8]} />
        <meshStandardMaterial color="#e74c3c" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.08, 0.52, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.06, 8]} />
        <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}