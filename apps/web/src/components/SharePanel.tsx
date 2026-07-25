import QRCode from 'react-qr-code'
import { useState } from 'react'

type Props = { projectId: string | null }

export default function SharePanel({ projectId }: Props) {
  const [copied, setCopied] = useState(false)

  if (!projectId) return null

  const shareUrl = `${window.location.origin}/project/${projectId}`

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, marginTop: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Share this project</h3>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <QRCode value={shareUrl} size={100} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 8, wordBreak: 'break-all' }}>
            {shareUrl}
          </p>
          <button onClick={handleCopy} style={{ fontSize: 12, padding: '5px 12px' }}>
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      </div>
    </div>
  )
}