import { useState } from 'react'
import BOMTable from './BOMTable'
import SharePanel from './SharePanel'
import SimulationResults from './SimulationResults'
import { exportReportPDF, exportBOMCSV } from '../lib/exportPDF'

type Props = {
  result: any
  simResult: any
  location: string
}

export default function ReportExporter({ result, simResult, location }: Props) {
  const [projectId, setProjectId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('http://localhost:8000/projects/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${location} system — ${new Date().toLocaleDateString()}`,
          location,
          appliances: result.load,
          sizing_result: result,
          simulation_result: simResult,
        }),
      })
      const data = await res.json()
      setProjectId(data.id)
    } catch (e) {
      console.error('Save failed', e)
    }
    setSaving(false)
  }

  return (
    <div>
      <div id="printable-report" style={{ background: '#fff', padding: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
          SolarPV Tensor — Design Report
        </h2>
        <p style={{ fontSize: 12, color: '#666', marginBottom: 20 }}>
          Location: {location} · Generated: {new Date().toLocaleDateString()}
        </p>

        <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>System sizing</h3>
        <p style={{ fontSize: 13 }}>Daily load: <strong>{result.load.daily_wh} Wh</strong></p>
        <p style={{ fontSize: 13 }}>Panel array: <strong>{result.panel_array.panel_count} panels × {result.top_panels?.[0]?.pmax_w ?? 400}W = {result.panel_array.total_array_w}W</strong></p>
        <p style={{ fontSize: 13 }}>Battery bank: <strong>{result.battery_bank.battery_count} × 100Ah</strong></p>

        {result.bom && (
          <>
            <h3 style={{ fontSize: 14, fontWeight: 500, margin: '20px 0 8px' }}>Bill of materials</h3>
            <BOMTable items={result.bom.items} total={result.bom.total_usd} />
          </>
        )}

        {simResult && (
          <>
            <h3 style={{ fontSize: 14, fontWeight: 500, margin: '20px 0 8px' }}>Simulation results</h3>
            <SimulationResults data={simResult} />
          </>
        )}

        {result.tool_checklist && (
          <>
            <h3 style={{ fontSize: 14, fontWeight: 500, margin: '20px 0 8px' }}>Tools required</h3>
            <ul style={{ fontSize: 13 }}>
              {result.tool_checklist.map((t: any) => (
                <li key={t.tool}>{t.tool} — {t.reason}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
        <button onClick={() => exportReportPDF('printable-report', `solarpv-${location}.pdf`)}>
          Download PDF report
        </button>
        {result.bom && (
          <button onClick={() => exportBOMCSV(result.bom.items, `bom-${location}.csv`)}>
            Export BOM as CSV
          </button>
        )}
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : projectId ? 'Saved ✓' : 'Save project'}
        </button>
      </div>

      <SharePanel projectId={projectId} />
    </div>
  )
}