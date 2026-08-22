import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoadForm from '../components/LoadForm'
import SimulationResults from '../components/SimulationResults'
import ReportExporter from '../components/ReportExporter'
import ModeNav from '../components/ModeNav'
import { getRecommendations, runSimulation } from '../lib/api'

const STEPS = ['location', 'appliances', 'results'] as const

export default function HobbyistWizard() {
  const [step, setStep] = useState(0)
  const [location, setLocation] = useState('abuja')
  const [result, setResult] = useState<any>(null)
  const [simResult, setSimResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [simLoading, setSimLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAppliances(appliances: any[]) {
    setLoading(true)
    setError(null)
    try {
      const res = await getRecommendations({
        appliances,
        location,
        system_voltage: 12,
        autonomy_days: 1,
        dod: 0.8,
      })
      setResult(res)
      setStep(2)
    } catch {
      setError('Could not reach the server. Make sure the backend is running.')
    }
    setLoading(false)
  }

  async function handleSimulate() {
    setSimLoading(true)
    setError(null)
    try {
      const sim = await runSimulation({
        total_array_w: result.panel_array.total_array_w,
        daily_wh: result.load.daily_wh,
        battery_capacity_wh: result.battery_bank.battery_count * 100 * 12,
        location,
        system_voltage: 12,
        dod: 0.8,
        panel_count: result.panel_array.panel_count,
        inverter_rating_w:
          result.top_inverters?.[0]?.power_rating_w ??
          result.inverter_sizing?.recommended_standard_w ??
          1000,
        peak_load_w: result.load.peak_load_w,
      })
      setSimResult(sim)
    } catch {
      setError('Simulation failed. Make sure the backend is running.')
    }
    setSimLoading(false)
  }

  function handleReset() {
    setStep(0)
    setResult(null)
    setSimResult(null)
    setError(null)
    setLoading(false)
    setSimLoading(false)
  }

  return (
    <div>
      <ModeNav />

      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: '80px 20px 60px',
        fontFamily: 'sans-serif',
      }}>

        {/* Progress bar */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
          {STEPS.map((s, i) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background: i <= step ? '#185FA5' : '#e5e5e5',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* Step 0 — Location */}
          {step === 0 && (
            <motion.div
              key="loc"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
                Where are you installing?
              </h2>
              <p style={{ fontSize: 13, color: '#666', marginBottom: 20, lineHeight: 1.6 }}>
                This determines the peak sun hours used to size your solar array.
                Locations further north in Nigeria typically get more sunlight.
              </p>

              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 14,
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  marginBottom: 20,
                  background: 'white',
                  cursor: 'pointer',
                }}
              >
                <option value="abuja">Abuja (5.5 peak sun hours)</option>
                <option value="lagos">Lagos (4.8 peak sun hours)</option>
                <option value="kano">Kano (6.2 peak sun hours)</option>
                <option value="port harcourt">Port Harcourt (4.5 peak sun hours)</option>
              </select>

              <button
                onClick={() => setStep(1)}
                style={{
                  padding: '10px 28px',
                  background: '#185FA5',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Next →
              </button>
            </motion.div>
          )}

          {/* Step 1 — Appliances */}
          {step === 1 && (
            <motion.div
              key="app"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
                What do you want to power?
              </h2>
              <p style={{ fontSize: 13, color: '#666', marginBottom: 20, lineHeight: 1.6 }}>
                Add every appliance you want to run on solar. Include the wattage,
                how many hours per day it runs, and how many units you have.
              </p>

              {error && (
                <div style={{
                  padding: '10px 14px',
                  background: '#FCEBEB',
                  color: '#A32D2D',
                  borderRadius: 8,
                  fontSize: 13,
                  marginBottom: 16,
                  lineHeight: 1.5,
                }}>
                  {error}
                </div>
              )}

              <LoadForm onSubmit={handleAppliances} />

              {loading && (
                <p style={{ fontSize: 13, color: '#666', marginTop: 12 }}>
                  Calculating your system — this may take a few seconds...
                </p>
              )}

              <button
                onClick={() => setStep(0)}
                style={{
                  marginTop: 12,
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  fontSize: 13,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                ← Back
              </button>
            </motion.div>
          )}

          {/* Step 2 — Results */}
          {step === 2 && result && (
            <motion.div
              key="res"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>
                Your system
              </h2>

              {/* Summary cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                marginBottom: 20,
              }}>
                {[
                  {
                    label: 'Daily load',
                    value: `${result.load.daily_wh} Wh`,
                    sub: `Peak demand: ${result.load.peak_load_w}W`,
                    color: '#185FA5',
                    bg: '#f0f7ff',
                    border: '#d0e0f5',
                  },
                  {
                    label: 'Solar array',
                    value: `${result.panel_array.panel_count} panels`,
                    sub: `${result.panel_array.total_array_w}W total`,
                    color: '#EF9F27',
                    bg: '#fffaf0',
                    border: '#f0d9a0',
                  },
                  {
                    label: 'Battery bank',
                    value: `${result.battery_bank.battery_count} batteries`,
                    sub: `${result.battery_bank.total_capacity_ah}Ah @ 12V`,
                    color: '#1c1c1c',
                    bg: '#f5f5f5',
                    border: '#ddd',
                  },
                  {
                    label: 'Estimated cost',
                    value: result.bom ? `$${result.bom.total_usd}` : 'N/A',
                    sub: 'Approximate USD',
                    color: '#1D9E75',
                    bg: '#f0faf5',
                    border: '#b0ddc8',
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    style={{
                      background: card.bg,
                      border: `1px solid ${card.border}`,
                      borderRadius: 10,
                      padding: '12px 14px',
                    }}
                  >
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>
                      {card.label}
                    </div>
                    <div style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: card.color,
                      marginBottom: 2,
                    }}>
                      {card.value}
                    </div>
                    <div style={{ fontSize: 11, color: '#888' }}>
                      {card.sub}
                    </div>
                  </div>
                ))}
              </div>

              {/* Inverter sizing */}
              {result.inverter_sizing && (
                <div style={{
                  background: '#EAF3DE',
                  border: '1px solid #b8d99a',
                  borderRadius: 10,
                  padding: '12px 14px',
                  marginBottom: 14,
                }}>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#27500A',
                    marginBottom: 6,
                  }}>
                    ⚡ Inverter sizing
                  </div>
                  <div style={{ fontSize: 13, color: '#333', marginBottom: 4 }}>
                    Minimum required:{' '}
                    <strong>{result.inverter_sizing.min_rating_w}W</strong>
                    {' '}(peak load {result.load.peak_load_w}W × {result.inverter_sizing.safety_margin} safety margin)
                  </div>
                  <div style={{ fontSize: 13, color: '#333' }}>
                    Recommended standard size:{' '}
                    <strong>{result.inverter_sizing.recommended_standard_w}W</strong>
                  </div>
                  {result.top_inverters && result.top_inverters.length > 0 && (
                    <div style={{
                      marginTop: 8,
                      paddingTop: 8,
                      borderTop: '1px solid #b8d99a',
                      fontSize: 13,
                      color: '#333',
                    }}>
                      Best match:{' '}
                      <strong>
                        {result.top_inverters[0].manufacturer}{' '}
                        {result.top_inverters[0].model}
                      </strong>
                      {' '}— {result.top_inverters[0].power_rating_w}W,{' '}
                      {result.top_inverters[0].efficiency_pct}% efficiency,{' '}
                      {result.top_inverters[0].inverter_type}
                    </div>
                  )}
                  {result.top_inverters && result.top_inverters.length === 0 && (
                    <div style={{ marginTop: 6, fontSize: 12, color: '#666' }}>
                      No inverter match in database — seed inverter data in Supabase.
                    </div>
                  )}
                </div>
              )}

              {/* Recommended panel */}
              {result.top_panels && result.top_panels[0] && (
                <div style={{
                  background: '#FAEEDA',
                  border: '1px solid #f0c97a',
                  borderRadius: 10,
                  padding: '12px 14px',
                  marginBottom: 14,
                }}>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#854F0B',
                    marginBottom: 6,
                  }}>
                    ☀️ Recommended panel
                  </div>
                  <div style={{ fontSize: 13, color: '#333' }}>
                    <strong>
                      {result.top_panels[0].manufacturer}{' '}
                      {result.top_panels[0].model}
                    </strong>
                    {' '}— {result.top_panels[0].pmax_w}W
                    {result.top_panels[0].efficiency_pct
                      ? `, ${result.top_panels[0].efficiency_pct}% efficiency`
                      : ''}
                  </div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                    You need {result.panel_array.panel_count} of these
                    ({result.panel_array.total_array_w}W array total)
                  </div>
                </div>
              )}

              {/* Wire sizing */}
              {result.wire_recommendations &&
                Object.keys(result.wire_recommendations).length > 0 && (
                <div style={{
                  background: '#f9f9f9',
                  border: '1px solid #eee',
                  borderRadius: 10,
                  padding: '12px 14px',
                  marginBottom: 14,
                }}>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#333',
                    marginBottom: 8,
                  }}>
                    🔌 Wire sizing
                  </div>
                  {Object.values(result.wire_recommendations).map((w: any) => (
                    <div
                      key={w.run}
                      style={{
                        fontSize: 12,
                        color: '#444',
                        marginBottom: 5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span style={{ color: '#666' }}>{w.run}</span>
                      <span style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {w.awg} ({w.mm2}mm²) — {w.voltage_drop_pct}% drop
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* System alerts */}
              {result.alerts && result.alerts.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#333',
                    marginBottom: 6,
                  }}>
                    ⚠️ System alerts
                  </div>
                  {result.alerts.map((a: any, i: number) => (
                    <div
                      key={i}
                      style={{
                        padding: '8px 12px',
                        marginBottom: 6,
                        borderRadius: 8,
                        fontSize: 12,
                        lineHeight: 1.5,
                        background:
                          a.level === 'error' ? '#FCEBEB'
                          : a.level === 'warning' ? '#FAEEDA'
                          : '#E6F1FB',
                        color:
                          a.level === 'error' ? '#A32D2D'
                          : a.level === 'warning' ? '#854F0B'
                          : '#0C447C',
                      }}
                    >
                      {a.message}
                    </div>
                  ))}
                </div>
              )}

              {/* Tool checklist */}
              {result.tool_checklist && result.tool_checklist.length > 0 && (
                <div style={{
                  background: '#f9f9f9',
                  border: '1px solid #eee',
                  borderRadius: 10,
                  padding: '12px 14px',
                  marginBottom: 20,
                }}>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#333',
                    marginBottom: 8,
                  }}>
                    🔧 Tools you will need
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {result.tool_checklist.map((t: any) => (
                      <li
                        key={t.tool}
                        style={{
                          fontSize: 12,
                          color: '#444',
                          marginBottom: 4,
                          lineHeight: 1.5,
                        }}
                      >
                        <strong>{t.tool}</strong> — {t.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Simulation button */}
              {!simResult && (
                <button
                  onClick={handleSimulate}
                  disabled={simLoading}
                  style={{
                    width: '100%',
                    padding: '11px',
                    background: simLoading ? '#aaa' : '#1D9E75',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: simLoading ? 'not-allowed' : 'pointer',
                    marginBottom: 16,
                    transition: 'background 0.2s',
                  }}
                >
                  {simLoading
                    ? 'Running simulation...'
                    : '▶ Run system simulation'}
                </button>
              )}

              {error && (
                <div style={{
                  padding: '10px 14px',
                  background: '#FCEBEB',
                  color: '#A32D2D',
                  borderRadius: 8,
                  fontSize: 13,
                  marginBottom: 16,
                }}>
                  {error}
                </div>
              )}

              {/* Simulation results and report exporter */}
              {simResult && (
                <>
                  <SimulationResults data={simResult} />
                  <ReportExporter
                    result={result}
                    simResult={simResult}
                    location={location}
                  />
                </>
              )}

              {/* Start over */}
              <button
                onClick={handleReset}
                style={{
                  marginTop: 24,
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  fontSize: 13,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  display: 'block',
                }}
              >
                ← Start over
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}