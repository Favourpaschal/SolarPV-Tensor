export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.2}
        castShadow
      />
      <hemisphereLight
        args={['#bfd6ff', '#444444', 0.4]}
      />
    </>
  );
}