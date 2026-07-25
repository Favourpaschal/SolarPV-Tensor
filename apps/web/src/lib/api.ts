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

export async function getRecommendations(payload: any) {
  const res = await fetch(`${API_BASE}/recommend/system`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Recommendation failed')
  return res.json()
}

export async function runSimulation(payload: any) {
  const res = await fetch(`${API_BASE}/simulate/full`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Simulation failed')
  return res.json()
}

export async function listProjects() {
  const res = await fetch(`${API_BASE}/projects/list`)
  if (!res.ok) throw new Error('Failed to fetch projects')
  return res.json()
}

export async function getProject(id: string) {
  const res = await fetch(`${API_BASE}/projects/${id}`)
  if (!res.ok) throw new Error('Failed to fetch project')
  return res.json()
}