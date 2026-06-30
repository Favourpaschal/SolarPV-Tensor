import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoadForm from '../components/LoadForm'
import { calculateSystem } from '../lib/api'

const STEPS = ['location', 'appliances', 'results'] as const

export default function HobbyistWizard() {
  const [step, setStep] = useState(0)
  const [location, setLocation] = useState('abuja')
  const [result, setResult] = useState<any>(null)

  async function handleAppliances(appliances: any[]) {
    const res = await calculateSystem({
      appliances,
      location,
      panel_pmax_w: 400,
      system_voltage: 12,
      autonomy_days: 1,
      dod: 0.8,
      battery_capacity_ah: 100,
    })
    setResult(res)
    setStep(2)
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
          <motion.div key="loc" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
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
          <motion.div key="app" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2>What do you want to power?</h2>
            <LoadForm onSubmit={handleAppliances} />
          </motion.div>
        )}
        {step === 2 && result && (
          <motion.div key="res" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2>Your system</h2>
            <p>Daily load: {result.load.daily_wh} Wh</p>
            <p>Panels needed: {result.panel_array.panel_count} × 400W</p>
            <p>Batteries needed: {result.battery_bank.battery_count} × 100Ah</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}