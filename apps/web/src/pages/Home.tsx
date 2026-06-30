import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      <button onClick={() => navigate('/hobbyist')} style={{ padding: '14px 28px', fontSize: 15 }}>
        I'm a hobbyist
      </button>
      <button onClick={() => navigate('/professional')} style={{ padding: '14px 28px', fontSize: 15 }}>
        I'm a professional
      </button>
    </div>
  )
}