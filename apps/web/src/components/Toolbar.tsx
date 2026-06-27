import { useSceneStore } from '../store/sceneStore'
import type { AppMode } from '../types'

type Props = {
  mode: AppMode
  setMode: (m: AppMode) => void
}

const tools: { label: string; value: AppMode }[] = [
  { label: 'Select', value: 'select' },
  { label: 'Panel', value: 'panel' },
  { label: 'Inverter', value: 'inverter' },
  { label: 'Battery', value: 'battery' },
  { label: 'Charge controller', value: 'charge_controller' },
  { label: 'Combiner box', value: 'combiner_box' },
  { label: 'Wire', value: 'wire' },
]

export default function Toolbar({ mode, setMode }: Props) {
  const selectedId = useSceneStore((s) => s.selectedId)
  const removeComponent = useSceneStore((s) => s.removeComponent)
  const selectComponent = useSceneStore((s) => s.selectComponent)

  function handleDelete() {
    if (!selectedId) return
    removeComponent(selectedId)
    selectComponent(null)
  }

  return (
    <div style={{
      position: 'absolute',
      top: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 6,
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: 10,
      padding: '8px 10px',
      zIndex: 10,
      flexWrap: 'wrap',
      maxWidth: '90vw',
    }}>
      {tools.map((t) => (
        <button
          key={t.value}
          onClick={() => setMode(t.value)}
          style={{
            padding: '5px 11px',
            fontSize: 12,
            fontWeight: mode === t.value ? 500 : 400,
            background: mode === t.value ? '#185FA5' : 'transparent',
            color: mode === t.value ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          {t.label}
        </button>
      ))}
      {selectedId && (
        <button
          onClick={handleDelete}
          style={{
            padding: '5px 11px',
            fontSize: 12,
            background: '#e24b4a',
            color: 'white',
            border: '1px solid #e24b4a',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Delete
        </button>
      )}
    </div>
  )
}