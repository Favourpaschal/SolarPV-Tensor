import { useSceneStore } from '../store/sceneStore'

const ICONS: Record<string, string> = {
  panel: '▭', inverter: '▣', battery: '▮',
  charge_controller: '◫', combiner_box: '▢',
}

export default function SchematicView() {
  const components = useSceneStore((s) => s.components)
  const wires = useSceneStore((s) => s.wires)

  function pos(id: string) {
    const c = components.find((c) => c.id === id)
    if (!c) return { x: 0, y: 0 }
    return { x: c.position[0] * 40 + 200, y: c.position[2] * 40 + 200 }
  }

  return (
    <svg width="100%" height="400" viewBox="0 0 400 400" style={{ background: '#fafafa', border: '1px solid #ddd' }}>
      {wires.map((w) => {
        const a = pos(w.fromId)
        const b = pos(w.toId)
        return <line key={w.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#e24b4a" strokeWidth={2} />
      })}
      {components.map((c) => {
        const p = pos(c.id)
        return (
          <g key={c.id}>
            <circle cx={p.x} cy={p.y} r={16} fill="#fff" stroke="#185FA5" strokeWidth={1.5} />
            <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize={14}>{ICONS[c.type] ?? '?'}</text>
          </g>
        )
      })}
    </svg>
  )
}