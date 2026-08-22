import { useState, useEffect } from 'react'
import SystemCanvas from '../scene/SystemCanvas'
import SchematicView from '../components/SchematicView'
import Toolbar from '../components/Toolbar'
import ModeNav from '../components/ModeNav'
import SaveShareButton from '../components/SaveShareButton'
import type { AppMode } from '../types'

export default function ProfessionalCanvas() {
  const [mode, setMode] = useState<AppMode>('select')
  const [wireType, setWireType] = useState<'positive' | 'negative'>('positive')
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024)

  useEffect(() => {
    function onResize() { setIsTablet(window.innerWidth < 1024) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* Top navigation bar */}
      <ModeNav />

      {/* Main content — pushed below the nav bar */}
      <div style={{
        display: 'flex',
        flexDirection: isTablet ? 'column' : 'row',
        flex: 1,
        marginTop: 48,
        overflow: 'hidden',
      }}>

        {/* 3D canvas side */}
        <div style={{
          position: 'relative',
          flex: isTablet ? 'none' : 2,
          height: isTablet ? '60vh' : '100%',
        }}>
          <Toolbar
            mode={mode}
            setMode={setMode}
            wireType={wireType}
            setWireType={setWireType}
          />
          <SystemCanvas mode={mode} wireType={wireType} />
        </div>

        {/* Right sidebar — schematic + save/share */}
        <div style={{
          flex: 1,
          padding: 16,
          overflowY: 'auto',
          borderLeft: '1px solid #e0e0e0',
          background: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>

          {/* Save and share button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#333' }}>
              Design
            </h3>
            <SaveShareButton />
          </div>

          {/* 2D schematic */}
          <div>
            <h3 style={{
              margin: '0 0 8px',
              fontSize: 13,
              fontWeight: 600,
              color: '#333',
            }}>
              Schematic view
            </h3>
            <SchematicView />
          </div>

          {/* Tips */}
          <div style={{
            background: '#E6F1FB',
            border: '1px solid #b0ccee',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 11,
            color: '#0C447C',
            lineHeight: 1.7,
          }}>
            <strong>Tips:</strong><br />
            • Select a tool then click the grid to place<br />
            • Click a component to select it, drag to move<br />
            • Orange ring → drag to rotate<br />
            • Wire mode → click two components to connect<br />
            • Click component label to add notes<br />
            • Design notes → bottom right of canvas
          </div>
        </div>
      </div>
    </div>
  )
}