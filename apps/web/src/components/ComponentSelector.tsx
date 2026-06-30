import { useEffect, useState } from 'react'

type Panel = {
  id: string
  manufacturer: string
  model: string
  pmax_w: number
  efficiency_pct: number
}

type Props = { onSelect: (p: Panel) => void }

export default function ComponentSelector({ onSelect }: Props) {
  const [panels, setPanels] = useState<Panel[]>([])
  const [search, setSearch] = useState('')
  const [compareIds, setCompareIds] = useState<string[]>([])

  useEffect(() => {
    fetch(`http://localhost:8000/components/panels?manufacturer=${search}&limit=20`)
      .then((r) => r.json())
      .then(setPanels)
  }, [search])

  function toggleCompare(id: string) {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id].slice(-3)
    )
  }

  return (
    <div>
      <input
        placeholder="Filter by manufacturer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 12, width: '100%' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {panels.map((p) => (
          <div key={p.id} style={{
            border: compareIds.includes(p.id) ? '2px solid #185FA5' : '1px solid #ddd',
            borderRadius: 8, padding: 12,
          }}>
            <strong>{p.manufacturer}</strong>
            <p style={{ fontSize: 13, margin: '4px 0' }}>{p.model}</p>
            <p style={{ fontSize: 12, color: '#666' }}>{p.pmax_w}W · {p.efficiency_pct}% eff.</p>
            <button onClick={() => onSelect(p)}>Select</button>
            <button onClick={() => toggleCompare(p.id)}>
              {compareIds.includes(p.id) ? 'Remove' : 'Compare'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}