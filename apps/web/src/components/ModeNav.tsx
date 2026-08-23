import { useNavigate, useLocation } from 'react-router-dom'
import { Sun, Wrench, HardHat, ArrowLeft } from 'lucide-react'

export default function ModeNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHobbyist = location.pathname === '/hobbyist'
  const isProfessional = location.pathname === '/professional'

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 48,
      background: 'white',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      zIndex: 50,
      fontFamily: 'sans-serif',
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
        }}
      >
        <div style={{
          width: 28,
          height: 28,
          background: '#185FA5',
          borderRadius: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Sun size={16} color="white" strokeWidth={1.5} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#185FA5' }}>
          SolarPV Tensor
        </span>
      </div>

      {/* Mode switcher */}
      <div style={{
        display: 'flex',
        gap: 4,
        background: '#f0f0f0',
        borderRadius: 8,
        padding: 3,
      }}>
        <button
          onClick={() => navigate('/hobbyist')}
          style={{
            padding: '5px 14px',
            fontSize: 12,
            fontWeight: isHobbyist ? 600 : 400,
            background: isHobbyist ? 'white' : 'transparent',
            color: isHobbyist ? '#185FA5' : '#666',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            boxShadow: isHobbyist ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Wrench size={13} strokeWidth={1.5} />
          Hobbyist
        </button>
        <button
          onClick={() => navigate('/professional')}
          style={{
            padding: '5px 14px',
            fontSize: 12,
            fontWeight: isProfessional ? 600 : 400,
            background: isProfessional ? 'white' : 'transparent',
            color: isProfessional ? '#185FA5' : '#666',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            boxShadow: isProfessional ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <HardHat size={13} strokeWidth={1.5} />
          Professional
        </button>
      </div>

      {/* Home link */}
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none',
          border: '1px solid #ddd',
          borderRadius: 6,
          padding: '5px 12px',
          fontSize: 12,
          color: '#666',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}
      >
        <ArrowLeft size={12} strokeWidth={2} />
        Home
      </button>
    </div>
  )
}