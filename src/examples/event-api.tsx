import { useEffect, useRef, useState } from 'react'
import type { Example } from './types'

const center: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
}

/* ─── Spatial Tap ───────────────────────────────────────────────────── */
function TapDemo({ back }: { back: number }) {
  const [taps, setTaps] = useState(0)
  const bump = () => setTaps((t) => t + 1)
  return (
    <div style={center}>
      <div
        enable-xr
        onSpatialTap={bump}
        onClick={bump}
        style={{
          '--xr-back': `${back}px`,
          '--xr-background-material': 'translucent',
          width: 200,
          padding: 24,
          borderRadius: 18,
          cursor: 'pointer',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.16), transparent)',
          border: '1px solid rgba(139,92,246,0.32)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 8 }}>🤏</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Tap / pinch me</div>
        <div style={{ color: '#c4b5fd', fontSize: 28, fontWeight: 700 }}>{taps}</div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>onSpatialTap</div>
      </div>
    </div>
  )
}

export const spatialTapExample: Example = {
  id: 'event-tap',
  title: 'Spatial Tap',
  subtitle: 'Gaze + pinch = tap',
  docsUrl: 'https://webspatial.dev/docs/api/react-sdk/event-api/spatial-tap',
  description:
    'onSpatialTap fires on a completed "select and activate" action — gaze + pinch on visionOS, touch on PICO. It carries local (offset) and global (client) X/Y/Z coordinates. onClick is wired alongside so the counter still works in a flat browser.',
  tags: ['onSpatialTap', 'pinch', 'click'],
  controls: [
    { id: 'back', label: '--xr-back', type: 'slider', min: 0, max: 100, step: 2, default: 50, unit: 'px' },
  ],
  render: (v) => <TapDemo back={Number(v.back)} />,
  code: () => `function TapDemo() {
  const [taps, setTaps] = useState(0)
  const bump = () => setTaps((t) => t + 1)
  return (
    <div enable-xr onSpatialTap={bump} onClick={bump}>
      pinch me — {taps}
    </div>
  )
}`,
}

/* ─── Spatial Drag ──────────────────────────────────────────────────── */
function DragDemo({ back }: { back: number }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null)
  const onDown = (e: React.PointerEvent) => {
    drag.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y }
  }
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    setPos({
      x: drag.current.ox + e.clientX - drag.current.sx,
      y: drag.current.oy + e.clientY - drag.current.sy,
    })
  }
  const onUp = () => {
    drag.current = null
  }
  return (
    <div
      onPointerMove={onMove}
      onPointerUp={onUp}
      style={{ ...center, position: 'relative' }}
    >
      <div
        enable-xr
        onPointerDown={onDown}
        onSpatialDrag={(e) => setPos({ x: e.translationX, y: e.translationY })}
        onSpatialDragEnd={() => undefined}
        style={{
          '--xr-back': `${back + Math.abs(pos.x) / 4}px`,
          '--xr-background-material': 'translucent',
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          width: 170,
          padding: 20,
          borderRadius: 18,
          cursor: 'grab',
          textAlign: 'center',
          background: 'rgba(59,130,246,0.1)',
          border: '1px solid rgba(59,130,246,0.35)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ fontSize: 28 }}>🫳</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 4 }}>Drag me around</div>
        <div style={{ color: '#93c5fd', fontFamily: 'monospace', fontSize: 10, marginTop: 4 }}>
          x:{Math.round(pos.x)} y:{Math.round(pos.y)}
        </div>
      </div>
    </div>
  )
}

export const spatialDragExample: Example = {
  id: 'event-drag',
  title: 'Spatial Drag',
  subtitle: 'Grab and move in 3D space',
  docsUrl: 'https://webspatial.dev/docs/api/react-sdk/event-api/spatial-drag',
  description:
    'A "select, hold and move" gesture in three phases: onSpatialDragStart, onSpatialDrag (provides translationX/Y/Z from the start point) and onSpatialDragEnd. Pointer events mirror it so you can drag on desktop too.',
  tags: ['onSpatialDrag', 'translation', 'move'],
  controls: [
    { id: 'back', label: 'base --xr-back', type: 'slider', min: 0, max: 100, step: 2, default: 50, unit: 'px' },
  ],
  render: (v) => <DragDemo back={Number(v.back)} />,
  code: () => `function DragDemo() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  return (
    <div enable-xr
      onSpatialDrag={(e) => setPos({ x: e.translationX, y: e.translationY })}
      style={{ transform: \`translate(\${pos.x}px, \${pos.y}px)\` }}>
      drag me
    </div>
  )
}`,
}

/* ─── Spatial Rotate ────────────────────────────────────────────────── */
function RotateDemo({ angle }: { angle: number }) {
  const [live, setLive] = useState(angle)
  useEffect(() => setLive(angle), [angle])
  return (
    <div style={{ ...center, perspective: '700px' }}>
      <div
        enable-xr
        onSpatialRotate={(e) => {
          const q = e.quaternion
          setLive(Math.round((2 * Math.atan2(q.y, q.w) * 180) / Math.PI))
        }}
        style={{
          '--xr-back': '50px',
          '--xr-background-material': 'translucent',
          width: 160,
          padding: 22,
          borderRadius: 16,
          textAlign: 'center',
          transform: `rotateY(${live}deg)`,
          background: 'rgba(244,63,94,0.08)',
          border: '1px solid rgba(244,63,94,0.32)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ fontSize: 26 }}>🤲</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 4 }}>Two-handed rotate</div>
        <div style={{ color: '#fda4af', fontFamily: 'monospace', fontSize: 11, marginTop: 4 }}>{live}deg</div>
      </div>
    </div>
  )
}

export const spatialRotateExample: Example = {
  id: 'event-rotate',
  title: 'Spatial Rotate',
  subtitle: 'Two-handed rotation gesture',
  docsUrl: 'https://webspatial.dev/docs/api/react-sdk/event-api/spatial-rotate',
  description:
    'A two-handed interaction producing rotation. onSpatialRotate fires continuously with a quaternion relative to the start, and onSpatialRotateEnd when released. The slider drives the same rotateY transform so you can preview it in a flat browser.',
  tags: ['onSpatialRotate', 'quaternion', 'two-handed'],
  controls: [
    { id: 'angle', label: 'rotateY', type: 'slider', min: 0, max: 360, step: 1, default: 35, unit: 'deg' },
  ],
  render: (v) => <RotateDemo angle={Number(v.angle)} />,
  code: () => `function RotateDemo() {
  const [angle, setAngle] = useState(0)
  return (
    <div enable-xr
      onSpatialRotate={(e) => {
        const q = e.quaternion
        setAngle(2 * Math.atan2(q.y, q.w) * 180 / Math.PI)
      }}
      style={{ transform: \`rotateY(\${angle}deg)\` }}>
      rotate me
    </div>
  )
}`,
}

/* ─── Spatial Magnify ───────────────────────────────────────────────── */
function MagnifyDemo({ scale }: { scale: number }) {
  const [live, setLive] = useState(scale)
  useEffect(() => setLive(scale), [scale])
  return (
    <div style={center}>
      <div
        enable-xr
        onSpatialMagnify={(e) => setLive(Number(e.magnification.toFixed(2)))}
        style={{
          '--xr-back': '50px',
          '--xr-background-material': 'translucent',
          width: 150,
          padding: 22,
          borderRadius: 16,
          textAlign: 'center',
          transform: `scale(${live})`,
          transformOrigin: 'center',
          background: 'rgba(20,184,166,0.08)',
          border: '1px solid rgba(20,184,166,0.32)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ fontSize: 26 }}>🤏</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 4 }}>Pinch to scale</div>
        <div style={{ color: '#5eead4', fontFamily: 'monospace', fontSize: 11, marginTop: 4 }}>{live.toFixed(2)}x</div>
      </div>
    </div>
  )
}

export const spatialMagnifyExample: Example = {
  id: 'event-magnify',
  title: 'Spatial Magnify',
  subtitle: 'Two-handed pinch-to-scale',
  docsUrl: 'https://webspatial.dev/docs/api/react-sdk/event-api/spatial-magnify',
  description:
    'A two-handed interaction producing scaling. onSpatialMagnify fires continuously with a magnification factor (1.5 = 150% of original) and onSpatialMagnifyEnd when released. The slider drives the same scale transform for flat-browser preview.',
  tags: ['onSpatialMagnify', 'scale', 'pinch'],
  controls: [
    { id: 'scale', label: 'scale', type: 'slider', min: 0.5, max: 2, step: 0.05, default: 1, unit: 'x' },
  ],
  render: (v) => <MagnifyDemo scale={Number(v.scale)} />,
  code: () => `function MagnifyDemo() {
  const [scale, setScale] = useState(1)
  return (
    <div enable-xr
      onSpatialMagnify={(e) => setScale(e.magnification)}
      style={{ transform: \`scale(\${scale})\` }}>
      pinch me
    </div>
  )
}`,
}
