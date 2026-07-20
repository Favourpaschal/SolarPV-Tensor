import {
  AreaChart, Area, BarChart, Bar,
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

type Props = { data: any }

export default function SimulationResults({ data }: Props) {
  if (!data) return null
  const { daily_simulation, monthly_forecast, battery_soc, summary, fault_detection } = data

  return (
    <div style={{ padding: '0 0 40px' }}>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Annual yield', value: `${summary.annual_yield_kwh} kWh` },
          { label: 'Self-sufficiency', value: `${summary.self_sufficiency_pct}%` },
          { label: 'Min battery SOC', value: `${summary.min_battery_soc_pct}%` },
          { label: 'Faults', value: fault_detection.has_critical ? 'Critical' : fault_detection.fault_count > 0 ? 'Warnings' : 'None', danger: fault_detection.has_critical },
        ].map((s: any) => (
          <div key={s.label} style={{ flex: 1, minWidth: 120, background: '#f5f5f5', borderRadius: 8, padding: '10px 14px' }}>
            <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: s.danger ? '#A32D2D' : '#111' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 500, margin: '20px 0 8px' }}>Daily energy flow</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={daily_simulation.hours}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="generation_w" stroke="#EF9F27" fill="#FAEEDA" name="Generation (W)" />
          <Area type="monotone" dataKey="load_w" stroke="#185FA5" fill="#E6F1FB" name="Load (W)" />
        </AreaChart>
      </ResponsiveContainer>

      <h3 style={{ fontSize: 14, fontWeight: 500, margin: '20px 0 8px' }}>Monthly energy yield</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={monthly_forecast.months}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="monthly_kwh" fill="#1D9E75" name="Yield (kWh)" />
        </BarChart>
      </ResponsiveContainer>

      <h3 style={{ fontSize: 14, fontWeight: 500, margin: '20px 0 8px' }}>Battery SOC over 7 days</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={battery_soc.days}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis domain={[0, 100]} unit="%" />
          <Tooltip />
          <Line type="monotone" dataKey="soc_pct" stroke="#D85A30" name="Battery SOC (%)" dot={{ fill: '#D85A30' }} />
        </LineChart>
      </ResponsiveContainer>

      {fault_detection.faults.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Fault detection</h3>
          {fault_detection.faults.map((f: any, i: number) => (
            <div key={i} style={{
              padding: '8px 12px', marginBottom: 6, borderRadius: 6, fontSize: 12,
              background: f.severity === 'critical' ? '#FCEBEB' : '#FAEEDA',
              color: f.severity === 'critical' ? '#A32D2D' : '#854F0B',
            }}>
              {f.message}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}