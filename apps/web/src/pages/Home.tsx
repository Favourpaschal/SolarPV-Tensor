import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f5e9 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      padding: '0 20px',
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>☀️</div>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          color: '#185FA5',
          margin: '0 0 8px',
        }}>
          SolarPV Tensor
        </h1>
        <p style={{
          fontSize: 15,
          color: '#666',
          margin: 0,
          maxWidth: 400,
          lineHeight: 1.6,
        }}>
          Design, simulate, and share solar PV systems before mounting a single panel.
        </p>
      </div>

      {/* Mode cards */}
      <div style={{
        display: 'flex',
        gap: 20,
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: 700,
      }}>

        {/* Hobbyist card */}
        <div
          onClick={() => navigate('/hobbyist')}
          style={{
            background: 'white',
            border: '2px solid #d0e0f5',
            borderRadius: 16,
            padding: '28px 32px',
            width: 280,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = '#185FA5'
            ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 24px rgba(24,95,165,0.15)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = '#d0e0f5'
            ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 14 }}>🧑‍🔧</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#185FA5', margin: '0 0 8px' }}>
            Hobbyist wizard
          </h2>
          <p style={{ fontSize: 13, color: '#666', margin: '0 0 20px', lineHeight: 1.6 }}>
            Step-by-step guided setup. Enter your appliances, get your panel and battery
            count, run a simulation, and download a report. No technical knowledge needed.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 20 }}>
            {[
              '✓ Load calculator',
              '✓ Component recommendations',
              '✓ System simulation',
              '✓ PDF report & BOM export',
            ].map((f) => (
              <div key={f} style={{ fontSize: 12, color: '#1D9E75', fontWeight: 500 }}>
                {f}
              </div>
            ))}
          </div>
          <button style={{
            width: '100%',
            padding: '10px',
            background: '#185FA5',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            Start wizard →
          </button>
        </div>

        {/* Professional card */}
        <div
          onClick={() => navigate('/professional')}
          style={{
            background: 'white',
            border: '2px solid #d0e0f5',
            borderRadius: 16,
            padding: '28px 32px',
            width: 280,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = '#1D9E75'
            ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 24px rgba(29,158,117,0.15)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = '#d0e0f5'
            ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 14 }}>👷</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1D9E75', margin: '0 0 8px' }}>
            Professional canvas
          </h2>
          <p style={{ fontSize: 13, color: '#666', margin: '0 0 20px', lineHeight: 1.6 }}>
            Full 3D design environment. Place components, wire them up, annotate
            each part, simulate energy flow, and share with your installation team.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 20 }}>
            {[
              '✓ 3D component placement',
              '✓ Drag, move, rotate components',
              '✓ Red/black wire routing',
              '✓ Design notes & team sharing',
            ].map((f) => (
              <div key={f} style={{ fontSize: 12, color: '#1D9E75', fontWeight: 500 }}>
                {f}
              </div>
            ))}
          </div>
          <button style={{
            width: '100%',
            padding: '10px',
            background: '#1D9E75',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            Open canvas →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 48,
        fontSize: 12,
        color: '#aaa',
        textAlign: 'center',
      }}>
        SolarPV Tensor · Built for solar installers and hobbyists around the globe.
      </div>
    </div>
  )
}