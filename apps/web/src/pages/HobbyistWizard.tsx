import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoadForm from '../components/LoadForm'
import SimulationResults from '../components/SimulationResults'
import { getRecommendations, runSimulation } from '../lib/api'

const STEPS = ['location', 'appliances', 'results'] as const

export default function HobbyistWizard() {
  const [step, setStep] = useState(0)
  const [location, setLocation] = useState('abuja')
  const [result, setResult] = useState<any>(null)
  const [simResult, setSimResult] = useState<any>(null)

  async function handleAppliances(appliances: any[]) {
    const res = await getRecommendations({
      appliances,
      location,
      system_voltage: 12,
      autonomy_days: 1,
      dod: 0.8,
    })
    setResult(res)
    setStep(2)
  }

  async function handleSimulate() {
    const sim = await runSimulation({
      total_array_w: result.panel_array.total_array_w,
      daily_wh: result.load.daily_wh,
      battery_capacity_wh: result.battery_bank.battery_count * 100 * 12,
      location,
      system_voltage: 12,
      dod: 0.8,
      panel_count: result.panel_array.panel_count,
      inverter_rating_w: result.top_inverters[0]?.power_rating_w ?? 1000,
      peak_load_w: result.load.peak_load_w,
    })
    setSimResult(sim)
  }

  return (
    <div style={{ maxWidth: 560, margin: '60px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= step ? '#185FA5' : '#e5e5e5',
          }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="loc"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2>Where are you installing?</h2>
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="abuja">Abuja</option>
              <option value="lagos">Lagos</option>
              <option value="kano">Kano</option>
              <option value="port harcourt">Port Harcourt</option>
            </select>
            <br /><br />
            <button onClick={() => setStep(1)}>Next</button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="app"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2>What do you want to power?</h2>
            <LoadForm onSubmit={handleAppliances} />
          </motion.div>
        )}

        {step === 2 && result && (
          <motion.div
            key="res"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2>Your system</h2>
            <p>Daily load: <strong>{result.load.daily_wh} Wh</strong></p>
            <p>Panels needed: <strong>{result.panel_array.panel_count} × 400W</strong></p>
            <p>Batteries needed: <strong>{result.battery_bank.battery_count} × 100Ah</strong></p>

            {result.bom && (
              <p>Estimated cost: <strong>${result.bom.total_usd}</strong></p>
            )}

            {result.alerts && result.alerts.length > 0 && (
              <div style={{ marginTop: 16 }}>
                {result.alerts.map((a: any, i: number) => (
                  <div key={i} style={{
                    padding: '8px 12px', marginBottom: 6,
                    borderRadius: 6, fontSize: 12,
                    background: a.level === 'error' ? '#FCEBEB'
                      : a.level === 'warning' ? '#FAEEDA' : '#E6F1FB',
                    color: a.level === 'error' ? '#A32D2D'
                      : a.level === 'warning' ? '#854F0B' : '#0C447C',
                  }}>
                    {a.message}
                  </div>
                ))}
              </div>
            )}

            {result.top_panels && result.top_panels[0] && (
              <>
                <h3 style={{ marginTop: 20 }}>Recommended panel</h3>
                <p>{result.top_panels[0].manufacturer} {result.top_panels[0].model} — {result.top_panels[0].pmax_w}W</p>
              </>
            )}

            {result.tool_checklist && (
              <>
                <h3>Tools you will need</h3>
                <ul>
                  {result.tool_checklist.map((t: any) => (
                    <li key={t.tool}>{t.tool}</li>
                  ))}
                </ul>
              </>
            )}

            <button onClick={handleSimulate} style={{ marginTop: 16 }}>
              Run system simulation
            </button>

            {simResult && <SimulationResults data={simResult} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}