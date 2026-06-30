import { useSceneStore } from '../../store/sceneStore'

const TYPE_COLOR: Record<string, string> = {
  panel: '#3b6d11',
  inverter: '#534ab7',
  battery: '#0c447c',
  charge_controller: '#993556',
  combiner_box: '#993c1d',
}

export default function SchematicView() {
  const { components, wires } = useSceneStore()

  const nodes = components.map((c, i) => ({
    ...c,
    sx: 60 + (i % 4) * 140,
    sy: 60 + Math.floor(i / 4) * 120,
  }))

  const find = (id: string) => nodes.find((n) => n.id === id)

  return (
    <svg viewBox="0 0 620 400" className="w-full h-full bg-white border rounded">
      {wires.map((w) => {
        const a = find(w.fromId)
        const b = find(w.toId)
        if (!a || !b) return null
        return <line key={w.id} x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy} stroke="#888" strokeWidth={2} />
      })}
      {nodes.map((n) => (
        <g key={n.id}>
          <rect
            x={n.sx - 40} y={n.sy - 20} width={80} height={40} rx={6}
            fill={TYPE_COLOR[n.type]} opacity={0.15} stroke={TYPE_COLOR[n.type]}
          />
          <text x={n.sx} y={n.sy + 4} textAnchor="middle" fontSize={10} fill={TYPE_COLOR[n.type]}>
            {n.type.replace('_', ' ')}
          </text>
        </g>
      ))}
    </svg>
  )
}