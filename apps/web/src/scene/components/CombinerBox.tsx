type Props = { selected: boolean }

export default function CombinerBox({ selected }: Props) {
  return (
    <group>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.2]} />
        <meshStandardMaterial
          color={selected ? '#aaaaaa' : '#7f8c8d'}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0.15, 0.15, 0.11]}>
        <boxGeometry args={[0.03, 0.08, 0.02]} />
        <meshStandardMaterial color="#444444" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  )
}