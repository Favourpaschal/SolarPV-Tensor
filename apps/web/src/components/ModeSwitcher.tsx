import { useUIStore } from '../store/uiStore'

export default function ModeSwitcher() {
  const { mode, setMode } = useUIStore()
  return (
     <div className="absolute right-3 z-10 flex border rounded overflow-hidden bg-white text-sm top-3 max-md:top-auto max-md:bottom-3">
      <button onClick={() => setMode('hobbyist')} className={`px-3 py-1 ${mode === 'hobbyist' ? 'bg-green-700 text-white' : ''}`}>
        Hobbyist
      </button>
      <button onClick={() => setMode('professional')} className={`px-3 py-1 ${mode === 'professional' ? 'bg-green-700 text-white' : ''}`}>
        Professional
      </button>
    </div>
  )
}
