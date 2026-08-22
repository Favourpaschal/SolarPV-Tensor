import { useState } from 'react'
import QRCode from 'react-qr-code'
import { useSceneStore } from '../store/sceneStore'

export default function SaveShareButton() {
  const components = useSceneStore((s) => s.components)
  const wires = useSceneStore((s) => s.wires)
  const sceneNotes = useSceneStore((s) => s.sceneNotes)

  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const shareUrl = projectId
    ? `${window.location.origin}/project/${projectId}`
    : null

  async function handleSave() {
    if (!projectName.trim()) {
      setError('Please enter a project name before saving.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:8000/projects/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName.trim(),
          components,
          wires,
          notes: sceneNotes,
        }),
      })
      const data = await res.json()
      if (data.id) {
        setProjectId(data.id)
      } else {
        setError('Save failed — check that the backend is running.')
      }
    } catch {
      setError('Could not reach the server.')
    }
    setSaving(false)
  }

  function handleCopy() {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '6px 14px',
          fontSize: 12,
          fontWeight: 500,
          background: '#1D9E75',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}
      >
        💾 Save & Share
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 14,
              padding: 24,
              width: 360,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              fontFamily: 'sans-serif',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                Save & Share project
              </h3>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: 6,
                  padding: '3px 9px',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                ✕
              </button>
            </div>

            {/* Scene summary */}
            <div style={{
              background: '#f5f8ff',
              border: '1px solid #d0e0f5',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 16,
              fontSize: 12,
              color: '#444',
            }}>
              <div style={{ marginBottom: 3 }}>
                📦 {components.length} component{components.length !== 1 ? 's' : ''} in scene
              </div>
              <div style={{ marginBottom: 3 }}>
                🔌 {wires.length} wire connection{wires.length !== 1 ? 's' : ''}
              </div>
              <div>
                📋 {sceneNotes.trim().length > 0 ? 'Design notes included' : 'No design notes'}
              </div>
            </div>

            {/* Project name input */}
            {!projectId && (
              <>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#333', display: 'block', marginBottom: 6 }}>
                  Project name
                </label>
                <input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Abuja residence — 1.6kW system"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    fontSize: 13,
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    boxSizing: 'border-box',
                    marginBottom: 12,
                    outline: 'none',
                  }}
                />
              </>
            )}

            {/* Error */}
            {error && (
              <div style={{
                background: '#FCEBEB',
                color: '#A32D2D',
                borderRadius: 7,
                padding: '8px 12px',
                fontSize: 12,
                marginBottom: 12,
              }}>
                {error}
              </div>
            )}

            {/* Save button */}
            {!projectId && (
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: saving ? '#aaa' : '#1D9E75',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  marginBottom: 12,
                }}
              >
                {saving ? 'Saving...' : '💾 Save project'}
              </button>
            )}

            {/* Share section — only after save */}
            {projectId && shareUrl && (
              <div>
                <div style={{
                  background: '#E6F1FB',
                  border: '1px solid #b0ccee',
                  borderRadius: 8,
                  padding: '10px 14px',
                  marginBottom: 14,
                  fontSize: 12,
                  color: '#0C447C',
                  fontWeight: 500,
                }}>
                  ✓ Project saved successfully
                </div>

                <div style={{ fontSize: 12, fontWeight: 500, color: '#333', marginBottom: 10 }}>
                  Share this design
                </div>

                {/* QR code */}
                <div style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                  marginBottom: 14,
                }}>
                  <div style={{
                    background: 'white',
                    padding: 8,
                    border: '1px solid #eee',
                    borderRadius: 8,
                    flexShrink: 0,
                  }}>
                    <QRCode value={shareUrl} size={90} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 11,
                      color: '#666',
                      wordBreak: 'break-all',
                      marginBottom: 8,
                      lineHeight: 1.5,
                    }}>
                      {shareUrl}
                    </div>
                    <button
                      onClick={handleCopy}
                      style={{
                        width: '100%',
                        padding: '7px',
                        background: copied ? '#1D9E75' : '#185FA5',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      {copied ? '✓ Copied!' : 'Copy link'}
                    </button>
                  </div>
                </div>

                {/* Save another */}
                <button
                  onClick={() => {
                    setProjectId(null)
                    setProjectName('')
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'none',
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#666',
                    cursor: 'pointer',
                  }}
                >
                  Save as new project
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}