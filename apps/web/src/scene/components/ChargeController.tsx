type Props = { selected: boolean }

export default function ChargeController({ selected }: Props) {
  return (
    <group>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.1]} />
        <meshStandardMaterial
          color={selected ? '#4a8fe8' : '#2c3e50'}
          metalness={0.2}
          roughness={0.7}
        />
      </mesh>
      <mesh position={[0, 0.38, 0.056]}>
        <boxGeometry args={[0.35, 0.2, 0.01]} />
        <meshStandardMaterial color="#0a3d62" emissive="#1a8cff" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.18, 0.056]}>
        <boxGeometry args={[0.3, 0.06, 0.01]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>
    </group>
  )
}