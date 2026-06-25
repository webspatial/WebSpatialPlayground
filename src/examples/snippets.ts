/**
 * Live, editable WebSpatial snippets.
 *
 * Each `code` string is REAL source. The playground transpiles it against the
 * WebSpatial JSX runtime (the same `jsxImportSource` a production `vite build`
 * uses), so `enable-xr`, `--xr-*` CSS and the <Model>/<Reality> components all
 * behave exactly as they would in a shipped app — true depth on Apple Vision
 * Pro / PICO OS 6, and a flat fallback in an ordinary browser.
 *
 * Snippets intentionally avoid template literals so they can live inside this
 * module without escaping; user edits in the editor have no such restriction.
 */

export interface DocLink {
  label: string
  url: string
}

export interface Snippet {
  id: string
  title: string
  blurb: string
  /** Documentation deep-links surfaced beside the example. */
  docs: DocLink[]
  /** Full, editable component source (default export = the live preview). */
  code: string
}

const DOCS = 'https://webspatial.dev/docs/api/react-sdk'

/* ────────────────────────────────────────────────────────────────────── */

const floatingCard: Snippet = {
  id: 'xr-back',
  title: 'Floating glass card',
  blurb:
    'Lift a spatialized element toward the viewer with the --xr-back CSS property and give it a native glass backplate with --xr-background-material. Drag the slider — the live component re-renders as you type or interact.',
  docs: [
    { label: '--xr-back', url: DOCS + '/css-api/back' },
    { label: '--xr-background-material', url: DOCS + '/css-api/background-material' },
    { label: 'enable-xr marker', url: DOCS + '/react-components/jsx-marker' },
  ],
  code: `import { useState } from 'react'

// 'enable-xr' marks an ordinary element for spatialization.
// On a headset it lifts off the page; in a browser it stays flat.
export default function FloatingCard() {
  const [back, setBack] = useState(80)

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%', perspective: 900 }}>
      <div
        enable-xr
        style={{
          '--xr-back': back + 'px',
          '--xr-background-material': 'translucent',
          width: 280,
          padding: 28,
          borderRadius: 22,
          color: '#ede9fe',
          transform: 'rotateX(8deg) rotateY(-14deg)',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.30), rgba(217,70,239,0.10))',
          border: '1px solid rgba(139,92,246,0.45)',
          boxShadow: '0 24px 60px rgba(124,58,237,0.35)',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>I'm floating ✨</h2>
        <p style={{ fontFamily: 'monospace', fontSize: 12, opacity: 0.75, margin: '8px 0 18px' }}>
          --xr-back: {back}px
        </p>
        <input
          type="range"
          min={0}
          max={160}
          value={back}
          onChange={(e) => setBack(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#a78bfa' }}
        />
      </div>
    </div>
  )
}`,
}

/* ────────────────────────────────────────────────────────────────────── */

const spatialTransform: Snippet = {
  id: 'transform',
  title: 'True 3D transform',
  blurb:
    'On a spatialized element the standard CSS transform becomes a real 3D transform — rotateX/Y/Z, translateZ and scaleZ act in actual space instead of a flat projection. Rotate the panel with the sliders.',
  docs: [
    { label: 'Spatial transform', url: DOCS + '/css-api/transform' },
    { label: '--xr-back', url: DOCS + '/css-api/back' },
  ],
  code: `import { useState } from 'react'

export default function SpatialTransform() {
  const [rx, setRx] = useState(12)
  const [ry, setRy] = useState(28)

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%', perspective: 800 }}>
      <div
        enable-xr
        style={{
          '--xr-back': '60px',
          '--xr-background-material': 'translucent',
          transform: 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)',
          width: 230,
          padding: 24,
          borderRadius: 18,
          color: '#c4b5fd',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.22), transparent)',
          border: '1px solid rgba(139,92,246,0.35)',
        }}
      >
        <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.7 }}>
          rotateX({rx}deg)<br />
          rotateY({ry}deg)
        </div>
        <div style={{ height: 8, borderRadius: 4, marginTop: 14, background: 'rgba(167,139,250,0.5)' }} />
        <div style={{ height: 8, width: '65%', borderRadius: 4, marginTop: 8, background: 'rgba(167,139,250,0.3)' }} />

        <label style={{ display: 'block', fontSize: 10, marginTop: 18, opacity: 0.7 }}>rotateX</label>
        <input type="range" min={-60} max={60} value={rx}
          onChange={(e) => setRx(Number(e.target.value))} style={{ width: '100%', accentColor: '#a78bfa' }} />
        <label style={{ display: 'block', fontSize: 10, marginTop: 8, opacity: 0.7 }}>rotateY</label>
        <input type="range" min={-60} max={60} value={ry}
          onChange={(e) => setRy(Number(e.target.value))} style={{ width: '100%', accentColor: '#a78bfa' }} />
      </div>
    </div>
  )
}`,
}

/* ────────────────────────────────────────────────────────────────────── */

const backgroundMaterial: Snippet = {
  id: 'background-material',
  title: 'Background materials',
  blurb:
    'Swap a solid background for a real-time rendered backplate material. Cycle through the supported values — on visionOS / PICO OS these render as native glass.',
  docs: [{ label: '--xr-background-material', url: DOCS + '/css-api/background-material' }],
  code: `import { useState } from 'react'

const MATERIALS = ['none', 'transparent', 'thin', 'translucent', 'regular', 'thick']

export default function BackgroundMaterial() {
  const [i, setI] = useState(3)
  const material = MATERIALS[i]

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%', gap: 18 }}>
      <div
        enable-xr
        style={{
          '--xr-back': '50px',
          '--xr-background-material': material,
          width: 260,
          padding: 28,
          borderRadius: 22,
          color: '#fff',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))',
          border: '1px solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ fontSize: 12, opacity: 0.6 }}>--xr-background-material</div>
        <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 700, marginTop: 6, color: '#c4b5fd' }}>
          {material}
        </div>
      </div>
      <button
        onClick={() => setI((i + 1) % MATERIALS.length)}
        style={{
          padding: '8px 18px', borderRadius: 10, color: '#ede9fe', cursor: 'pointer',
          background: 'rgba(124,58,237,0.4)', border: '1px solid rgba(167,139,250,0.5)',
        }}
      >
        Next material →
      </button>
    </div>
  )
}`,
}

/* ────────────────────────────────────────────────────────────────────── */

const spatialEvents: Snippet = {
  id: 'events',
  title: 'Spatial gestures',
  blurb:
    'Spatial events map natural input to familiar handlers: onSpatialTap fires on gaze + pinch (visionOS) or touch (PICO), onSpatialDrag streams a translation. Pointer events are wired alongside so it all works on desktop too.',
  docs: [
    { label: 'onSpatialTap', url: DOCS + '/event-api/spatial-tap' },
    { label: 'onSpatialDrag', url: DOCS + '/event-api/spatial-drag' },
  ],
  code: `import { useRef, useState } from 'react'

export default function SpatialGestures() {
  const [taps, setTaps] = useState(0)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const start = useRef({ x: 0, y: 0, ox: 0, oy: 0 })

  return (
    <div
      style={{ position: 'relative', height: '100%', width: '100%' }}
      onPointerMove={(e) => {
        if (e.buttons !== 1) return
        setPos({ x: start.current.ox + e.clientX - start.current.x, y: start.current.oy + e.clientY - start.current.y })
      }}
    >
      <div
        enable-xr
        onSpatialTap={() => setTaps((t) => t + 1)}
        onClick={() => setTaps((t) => t + 1)}
        onSpatialDrag={(e) => setPos({ x: e.translationX, y: e.translationY })}
        onPointerDown={(e) => { start.current = { x: e.clientX, y: e.clientY, ox: pos.x, oy: pos.y } }}
        style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%) translate(' + pos.x + 'px, ' + pos.y + 'px)',
          '--xr-back': (40 + taps * 6) + 'px',
          '--xr-background-material': 'translucent',
          width: 210, padding: 26, borderRadius: 20, cursor: 'grab', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.18), transparent)',
          border: '1px solid rgba(139,92,246,0.35)', backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ fontSize: 30 }}>🤏</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 6 }}>tap, or drag me</div>
        <div style={{ color: '#c4b5fd', fontSize: 30, fontWeight: 700 }}>{taps}</div>
        <div style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', fontSize: 10 }}>
          back grows with every tap
        </div>
      </div>
    </div>
  )
}`,
}

/* ────────────────────────────────────────────────────────────────────── */

const model3d: Snippet = {
  id: 'model',
  title: '<Model> — 3D asset',
  blurb:
    'The <Model> component renders a static 3D asset (.usdz / .glb / .reality) as real volumetric content on a headset while laying out as a 2D plane in the page. Change the src to load any model live.',
  docs: [
    { label: '<Model>', url: DOCS + '/react-components/Model' },
    { label: '--xr-depth', url: DOCS + '/css-api/depth' },
  ],
  code: `import { Model } from '@webspatial/react-sdk'

const TEAPOT = 'https://developer.apple.com/augmented-reality/quick-look/models/teapot/teapot.usdz'

export default function ModelDemo() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
      <Model
        enable-xr
        src={TEAPOT}
        autoPlay
        loop
        style={{
          width: 320, height: 320, borderRadius: 20,
          '--xr-depth': '160px',
          '--xr-background-material': 'translucent',
          background: 'linear-gradient(135deg, rgba(245,158,11,0.10), rgba(124,58,237,0.06))',
          border: '1px solid rgba(245,158,11,0.25)',
        }}
        onLoad={() => console.log('model loaded')}
        onError={() => console.warn('model failed')}
      />
    </div>
  )
}`,
}

/* ────────────────────────────────────────────────────────────────────── */

const reality3d: Snippet = {
  id: 'reality',
  title: '<Reality> — programmable 3D',
  blurb:
    'The <Reality> container renders arbitrary 3D with the SDK engine API: declare <Material>s, then compose primitive entities (Box, Sphere, Cone, Cylinder, Plane) inside <World>. Change the shape and colour — the scene graph rebuilds live.',
  docs: [
    { label: '<Reality>', url: DOCS + '/react-components/Reality' },
    { label: '--xr-depth', url: DOCS + '/css-api/depth' },
  ],
  code: `import { useState } from 'react'
import { Reality, World, Material, Box, Sphere, Cylinder, Cone } from '@webspatial/react-sdk'

export default function RealityDemo() {
  const [shape, setShape] = useState('box')
  const [color, setColor] = useState('#a78bfa')
  const s = 0.26

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%', gap: 16 }}>
      <Reality style={{ width: 360, height: 300, '--xr-depth': '220px' }}>
        <Material type="unlit" id="main" color={color} />
        <World>
          {shape === 'box' && <Box materials={['main']} width={s} height={s} depth={s} />}
          {shape === 'sphere' && <Sphere materials={['main']} radius={s / 2} />}
          {shape === 'cylinder' && <Cylinder materials={['main']} radius={s / 2} height={s * 1.4} />}
          {shape === 'cone' && <Cone materials={['main']} radius={s / 2} height={s * 1.4} />}
        </World>
      </Reality>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {['box', 'sphere', 'cylinder', 'cone'].map((sh) => (
          <button key={sh} onClick={() => setShape(sh)}
            style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
              color: shape === sh ? '#ede9fe' : 'rgba(255,255,255,0.5)',
              background: shape === sh ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.05)',
              border: '1px solid ' + (shape === sh ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.1)'),
            }}>
            {sh}
          </button>
        ))}
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
          style={{ width: 34, height: 30, background: 'none', border: 'none', cursor: 'pointer' }} />
      </div>
    </div>
  )
}`,
}

/* ────────────────────────────────────────────────────────────────────── */

const animatedReality: Snippet = {
  id: 'reality-animated',
  title: '<Reality> — animated equalizer',
  blurb:
    'A live scene graph driven by an animation loop. Each bar is a Box entity whose scale and colour update every frame — the same React state that drives a 2D chart drives real 3D geometry. Inspired by the SDK test-server reality samples.',
  docs: [
    { label: '<Reality>', url: DOCS + '/react-components/Reality' },
    { label: 'Entities & Materials', url: DOCS + '/react-components' },
  ],
  code: `import { useEffect, useState } from 'react'
import { Reality, World, Material, Box } from '@webspatial/react-sdk'

const BARS = 12

export default function Equalizer() {
  const [t, setT] = useState(0)
  useEffect(() => {
    let raf = 0
    const tick = () => { setT((v) => v + 0.05); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const bars = Array.from({ length: BARS }, (_, i) => {
    const h = 0.06 + 0.16 * (0.5 + 0.5 * Math.sin(t + i * 0.6))
    return { i, h, x: (i - (BARS - 1) / 2) * 0.05 }
  })

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
      <Reality style={{ width: 380, height: 300, '--xr-depth': '240px' }}>
        {bars.map((b) => (
          <Material key={'m' + b.i} type="unlit" id={'m' + b.i}
            color={'hsl(' + (260 + b.i * 8) + ', 80%, 65%)'} />
        ))}
        <World>
          {bars.map((b) => (
            <Box key={b.i} materials={['m' + b.i]}
              width={0.03} height={b.h} depth={0.03}
              position={{ x: b.x, y: 0, z: 0 }} />
          ))}
        </World>
      </Reality>
    </div>
  )
}`,
}

/* ────────────────────────────────────────────────────────────────────── */

export const snippets: Snippet[] = [
  floatingCard,
  spatialTransform,
  backgroundMaterial,
  spatialEvents,
  model3d,
  reality3d,
  animatedReality,
]

/** Cross-cutting documentation links shown in the header / footer. */
export const docLinks = {
  llms: 'https://webspatial.dev/llms-full.txt',
  docs: 'https://webspatial.dev/docs',
  sdk: 'https://github.com/webspatial/webspatial-sdk',
  testServer: 'https://webspatial-sdk-test-server.vercel.app/#/',
  reactSdk: DOCS,
}
