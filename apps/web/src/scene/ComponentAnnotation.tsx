import { Html } from '@react-three/drei'
import { useState } from 'react'
import { useSceneStore } from '../store/sceneStore'

const COMPONENT_LABELS: Record<string, string> = {
  panel: 'Solar Panel',
  inverter: 'Inverter',
  battery: 'Battery',
  charge_controller: 'Charge Controller',
  combiner_box: 'Combiner Box',
}

type Props = {
  id: string
  type: string
  notes: string
  isSelected: boolean
}

export default function ComponentAnnotation({ id, type, notes, isSelected }: Props) {
  const updateComponentNotes = useSceneStore((s) => s.updateComponentNotes)
  const [expanded, setExpanded] = useState(false)

  const hasNotes = notes.trim().length > 0
  const label = COMPONENT_LABELS[type] ?? type

  return (
    <Html
      position={[0, 2.2, 0]}
      center
      distanceFactor={6}
      style={{ pointerEvents: 'auto' }}
    >
      <div style={{
        background: 'white',
        border: `1.5px solid ${isSelected ? '#185FA5' : '#ddd'}`,
        borderRadius: 8,
        padding: expanded ? '10px 12px' : '5px 10px',
        minWidth: expanded ? 200 : 'auto',
        maxWidth: 240,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        fontFamily: 'sans-serif',
        transition: 'all 0.15s ease',
        userSelect: 'none',
      }}>
        {/* Header row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
        }}
          onClick={() => setExpanded(!expanded)}
        >
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#185FA5',
            flex: 1,
            whiteSpace: 'nowrap',
          }}>
            {label}
          </span>
          {hasNotes && !expanded && (
            <span style={{
              fontSize: 9,
              background: '#E6F1FB',
              color: '#185FA5',
              padding: '1px 5px',
              borderRadius: 8,
              fontWeight: 500,
            }}>
              note
            </span>
          )}
          <span style={{
            fontSize: 10,
            color: '#999',
            transform: expanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s',
          }}>
            ▼
          </span>
        </div>

        {/* Expanded note area */}
        {expanded && (
          <div style={{ marginTop: 8 }}>
            <textarea
              value={notes}
              onChange={(e) => updateComponentNotes(id, e.target.value)}
              placeholder={`Add notes for this ${label.toLowerCase()}...\n\nExamples:\n• Connection: panel → MPPT port\n• Rating: 400W, 12V\n• Installed by: tech team`}
              rows={5}
              style={{
                width: '100%',
                fontSize: 11,
                border: '1px solid #e0e0e0',
                borderRadius: 5,
                padding: '6px 8px',
                resize: 'vertical',
                fontFamily: 'sans-serif',
                lineHeight: 1.5,
                color: '#333',
                boxSizing: 'border-box',
                outline: 'none',
              }}
              onClick={(e) => e.stopPropagation()}
            />
            {notes.trim().length > 0 && (
              <div style={{
                marginTop: 4,
                fontSize: 10,
                color: '#999',
                textAlign: 'right',
              }}>
                {notes.trim().split('\n').length} line{notes.trim().split('\n').length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}
      </div>
    </Html>
  )
}