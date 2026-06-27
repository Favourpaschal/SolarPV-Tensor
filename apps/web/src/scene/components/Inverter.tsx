type Props = { selected: boolean }

export default function Inverter({ selected }: Props) {
  return (
    <group>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.25]} />
        <meshStandardMaterial
          color={selected ? '#b5d4f4' : '#e8e8e8'}
          metalness={0.15}
          roughness={0.7}
        />
      </mesh>
      <mesh position={[0, 0.33, 0.128]}>
        <boxGeometry args={[0.25, 0.15, 0.01]} />
        <meshStandardMaterial color="#0a1628" roughness={0.9} />
      </mesh>
      <mesh position={[0.1, 0.52, 0.128]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#00cc44" emissive="#00cc44" emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}