const API_BASE = 'http://localhost:8000'

export async function calculateSystem(payload: any) {
  const res = await fetch(`${API_BASE}/calculate/system`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Calculation failed')
  return res.json()
}