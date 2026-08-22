import { useState } from 'react'
import { useSceneStore } from '../store/sceneStore'

export default function SceneNotepad() {
  const sceneNotes = useSceneStore((s) => s.sceneNotes)
  const updateSceneNotes = useSceneStore((s) => s.updateSceneNotes)
  const components = useSceneStore((s) => s.components)
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'general' | 'summary'>('general')

  const hasNotes = sceneNotes.trim().length > 0
  const componentWithNotes = components.filter((c) => c.notes.trim().length > 0)

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      right: 20,
      zIndex: 20,
      fontFamily: 'sans-serif',
    }}>
      {/* Toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            background: '#185FA5',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            padding: '8px 14px',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          📋 Design notes
          {hasNotes && (
            <span style={{
              background: '#EF9F27',
              color: 'white',
              borderRadius: 8,
              fontSize: 10,
              padding: '1px 6px',
              fontWeight: 600,
            }}>
              {sceneNotes.trim().split('\n').length}
            </span>
          )}
        </button>
      )}

      {/* Expanded notepad */}
      {open && (
        <div style={{
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: 12,
          width: 320,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: '#185FA5',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ color: 'white', fontSize: 13, fontWeight: 500 }}>
              📋 Design notes
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                borderRadius: 6,
                padding: '2px 8px',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #eee',
          }}>
            {(['general', 'summary'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: '8px',
                  fontSize: 12,
                  border: 'none',
                  background: tab === t ? '#f0f7ff' : 'white',
                  color: tab === t ? '#185FA5' : '#666',
                  fontWeight: tab === t ? 600 : 400,
                  cursor: 'pointer',
                  borderBottom: tab === t ? '2px solid #185FA5' : '2px solid transparent',
                  textTransform: 'capitalize',
                }}
              >
                {t === 'summary'
                  ? `Component notes (${componentWithNotes.length})`
                  : 'General notes'}
              </button>
            ))}
          </div>

          {/* General notes tab */}
          {tab === 'general' && (
            <div style={{ padding: 12 }}>
              <p style={{
                fontSize: 11,
                color: '#888',
                marginBottom: 8,
                lineHeight: 1.5,
              }}>
                Write your overall system design notes here. Visible to all team members — technical and non-technical.
              </p>
              <textarea
                value={sceneNotes}
                onChange={(e) => updateSceneNotes(e.target.value)}
                placeholder={
                  `System design overview\n` +
                  `─────────────────────\n` +
                  `Location: \n` +
                  `Total load: \n` +
                  `Array size: \n` +
                  `Battery bank: \n\n` +
                  `Connection sequence:\n` +
                  `1. Panels → Combiner box\n` +
                  `2. Combiner box → Charge controller\n` +
                  `3. Charge controller → Battery bank\n` +
                  `4. Battery bank → Inverter\n` +
                  `5. Inverter → Load panel\n\n` +
                  `Notes for installation team:\n`
                }
                rows={14}
                style={{
                  width: '100%',
                  fontSize: 12,
                  border: '1px solid #e0e0e0',
                  borderRadius: 6,
                  padding: '8px 10px',
                  resize: 'vertical',
                  fontFamily: 'monospace',
                  lineHeight: 1.6,
                  color: '#333',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
              <div style={{
                marginTop: 6,
                fontSize: 10,
                color: '#aaa',
                textAlign: 'right',
              }}>
                {sceneNotes.length} characters
              </div>
            </div>
          )}

          {/* Component notes summary tab */}
          {tab === 'summary' && (
            <div style={{
              padding: 12,
              maxHeight: 320,
              overflowY: 'auto',
            }}>
              {componentWithNotes.length === 0 ? (
                <p style={{
                  fontSize: 12,
                  color: '#aaa',
                  textAlign: 'center',
                  padding: '20px 0',
                  lineHeight: 1.6,
                }}>
                  No component notes yet. Click on a component in the 3D scene and expand its label to add notes.
                </p>
              ) : (
                componentWithNotes.map((c) => (
                  <div key={c.id} style={{
                    marginBottom: 12,
                    background: '#f9f9f9',
                    border: '1px solid #eee',
                    borderRadius: 7,
                    padding: '8px 10px',
                  }}>
                    <div style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#185FA5',
                      marginBottom: 4,
                      textTransform: 'capitalize',
                    }}>
                      {c.type.replace('_', ' ')}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: '#444',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.5,
                    }}>
                      {c.notes}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Footer */}
          <div style={{
            padding: '8px 12px',
            borderTop: '1px solid #eee',
            background: '#fafafa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: 10, color: '#aaa' }}>
              {components.length} component{components.length !== 1 ? 's' : ''} in scene
            </span>
            <button
              onClick={() => {
                const text =
                  `=== SOLARPV TENSOR — DESIGN NOTES ===\n\n` +
                  `GENERAL NOTES:\n${sceneNotes}\n\n` +
                  `COMPONENT NOTES:\n` +
                  componentWithNotes
                    .map((c) => `[${c.type.toUpperCase()}]\n${c.notes}`)
                    .join('\n\n')
                navigator.clipboard.writeText(text)
              }}
              style={{
                fontSize: 11,
                padding: '4px 10px',
                background: '#185FA5',
                color: 'white',
                border: 'none',
                borderRadius: 5,
                cursor: 'pointer',
              }}
            >
              Copy all notes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}