import { Model, Reality, World, Material, Box, Sphere, Cone, Cylinder, Plane } from '@webspatial/react-sdk'
import type { Example } from './types'

const center: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
}

/* ─── JSX Markers ───────────────────────────────────────────────────── */
function MarkerDemo({ back }: { back: number }) {
  const cardBase: React.CSSProperties = {
    width: 300,
    padding: '12px 18px',
    borderRadius: 12,
    background: 'linear-gradient(135deg, rgba(139,92,246,0.16), transparent)',
    border: '1px solid rgba(139,92,246,0.28)',
    backdropFilter: 'blur(8px)',
  }
  return (
    <div style={{ ...center, flexDirection: 'column', gap: 14 }}>
      {/* 1. enable-xr attribute (recommended) */}
      <div enable-xr style={{ ...cardBase, '--xr-back': `${back}px`, '--xr-background-material': 'translucent' }}>
        <code style={{ color: '#c4b5fd', fontFamily: 'monospace', fontSize: 12 }}>enable-xr</code>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 4 }}>attribute (recommended)</div>
      </div>
      {/* 2. __enableXr__ className */}
      <div
        className="__enableXr__"
        style={{ ...cardBase, '--xr-back': `${back}px`, '--xr-background-material': 'translucent' }}
      >
        <code style={{ color: '#c4b5fd', fontFamily: 'monospace', fontSize: 12 }}>className="__enableXr__"</code>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 4 }}>class name</div>
      </div>
      {/* 3. enableXr inline style */}
      <div style={{ ...cardBase, enableXr: true, '--xr-back': `${back}px`, '--xr-background-material': 'translucent' }}>
        <code style={{ color: '#c4b5fd', fontFamily: 'monospace', fontSize: 12 }}>style={'{{ enableXr: true }}'}</code>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 4 }}>inline style</div>
      </div>
    </div>
  )
}

export const jsxMarkerExample: Example = {
  id: 'comp-jsx-marker',
  title: 'JSX Markers',
  subtitle: 'Mark elements for spatialization',
  docsUrl: 'https://webspatial.dev/docs/api/react-sdk/react-components/jsx-marker',
  description:
    'Three equivalent ways to turn an ordinary HTML element into a spatialized HTML element: the enable-xr attribute (recommended), the __enableXr__ className, or the enableXr inline style. All three are compiled by the SDK JSX runtime into the same spatialized element. Lift them all with the slider.',
  tags: ['enable-xr', '__enableXr__', 'marker'],
  controls: [
    { id: 'back', label: '--xr-back', type: 'slider', min: 0, max: 90, step: 2, default: 30, unit: 'px' },
  ],
  render: (v) => <MarkerDemo back={Number(v.back)} />,
  code: () => `// All three markers compile to a spatialized HTML element.
<div enable-xr>attribute (recommended)</div>
<div className="__enableXr__">class name</div>
<div style={{ enableXr: true }}>inline style</div>`,
}

/* ─── <Model> ────────────────────────────────────────────────────────── */
const SAMPLE_MODELS = [
  'https://developer.apple.com/augmented-reality/quick-look/models/retrotv/tv_retro.usdz',
  'https://developer.apple.com/augmented-reality/quick-look/models/teapot/teapot.usdz',
  'https://developer.apple.com/augmented-reality/quick-look/models/drummertoy/toy_drummer_idle.usdz',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb',
]

function ModelDemo({ src, depth, autoPlay }: { src: string; depth: number; autoPlay: boolean }) {
  return (
    <div style={{ ...center, flexDirection: 'column', gap: 14 }}>
      <Model
        enable-xr
        key={src}
        src={src}
        autoPlay={autoPlay}
        loop
        style={{
          width: 300,
          height: 300,
          borderRadius: 18,
          '--xr-depth': `${depth}px`,
          '--xr-background-material': 'translucent',
          background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(124,58,237,0.06))',
          border: '1px solid rgba(245,158,11,0.25)',
        }}
        onLoad={() => console.log('[Model] loaded:', src)}
        onError={() => console.warn('[Model] failed to load:', src)}
      />
      <div
        style={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: 10,
          fontFamily: 'monospace',
          maxWidth: 320,
          textAlign: 'center',
          wordBreak: 'break-all',
        }}
      >
        src: {src || '(empty)'}
      </div>
    </div>
  )
}

export const modelExample: Example = {
  id: 'comp-model',
  title: '<Model>',
  subtitle: 'Embed static 3D models',
  docsUrl: 'https://webspatial.dev/docs/api/react-sdk/react-components/Model',
  description:
    'The real <Model> component renders a static 3D asset (.usdz / .glb / .reality) as volumetric 3D content on spatial devices, while participating in CSS layout as a 2D plane. Paste any model URL below — the live <Model> updates instantly. In a flat browser it falls back to the Web standard <model> element.',
  tags: ['<Model>', 'usdz', 'glb'],
  controls: [
    {
      id: 'src',
      label: '3D model URL (.usdz / .glb / .reality)',
      type: 'text',
      default: SAMPLE_MODELS[0],
      placeholder: 'https://…/model.usdz',
      suggestions: SAMPLE_MODELS,
      hint: 'Paste a real model URL — the <Model> below reloads live.',
    },
    { id: 'depth', label: '--xr-depth', type: 'slider', min: 0, max: 240, step: 10, default: 120, unit: 'px' },
    { id: 'autoPlay', label: 'autoPlay', type: 'toggle', default: true },
  ],
  render: (v) => (
    <ModelDemo src={String(v.src)} depth={Number(v.depth)} autoPlay={Boolean(v.autoPlay)} />
  ),
  code: (v) => `import { Model } from "@webspatial/react-sdk"

function ModelDemo() {
  return (
    <Model
      enable-xr
      src="${v.src}"
      autoPlay={${Boolean(v.autoPlay)}}
      loop
      style={{ width: 300, height: 300, "--xr-depth": "${v.depth}px" }}
      onLoad={(e) => console.log("loaded", e)}
      onError={(e) => console.warn("failed", e)}
    />
  )
}`,
}

/* ─── <Reality> ──────────────────────────────────────────────────────── */
function RealityDemo({
  shape,
  color,
  size,
  depth,
}: {
  shape: string
  color: string
  size: number
  depth: number
}) {
  const r = size / 2
  return (
    <div style={center}>
      <Reality style={{ width: 360, height: 300, '--xr-depth': `${depth}px` }}>
        <Material type="unlit" id="main" color={color} />
        <Material type="unlit" id="accent" color="#3b82f6" />
        <World>
          {shape === 'box' && (
            <Box materials={['main']} width={size} height={size} depth={size} position={{ x: 0, y: 0, z: 0 }} />
          )}
          {shape === 'sphere' && <Sphere materials={['main']} radius={r} position={{ x: 0, y: 0, z: 0 }} />}
          {shape === 'cylinder' && (
            <Cylinder materials={['main']} radius={r * 0.8} height={size * 1.2} position={{ x: 0, y: 0, z: 0 }} />
          )}
          {shape === 'cone' && (
            <Cone materials={['main']} radius={r} height={size * 1.3} position={{ x: 0, y: 0, z: 0 }} />
          )}
          {shape === 'plane' && (
            <Plane materials={['main']} width={size * 1.6} height={size * 1.6} position={{ x: 0, y: 0, z: 0 }} />
          )}
        </World>
      </Reality>
    </div>
  )
}

export const realityExample: Example = {
  id: 'comp-reality',
  title: '<Reality>',
  subtitle: 'Dynamic programmable 3D scenes',
  docsUrl: 'https://webspatial.dev/docs/api/react-sdk/react-components/Reality',
  description:
    'The real <Reality> container renders arbitrary 3D content with the SDK 3D-engine API: declare Materials, then compose primitive Entities (Box, Sphere, Cone, Cylinder, Plane) inside <World>. Change the primitive, its colour and size — the real scene graph rebuilds live.',
  tags: ['<Reality>', 'Material', 'World'],
  controls: [
    {
      id: 'shape',
      label: 'Primitive',
      type: 'select',
      default: 'box',
      options: [
        { value: 'box' },
        { value: 'sphere' },
        { value: 'cylinder' },
        { value: 'cone' },
        { value: 'plane' },
      ],
    },
    { id: 'color', label: 'Material color', type: 'color', default: '#a78bfa' },
    { id: 'size', label: 'Size (m)', type: 'slider', min: 0.1, max: 0.4, step: 0.02, default: 0.24, unit: 'm' },
    { id: 'depth', label: '--xr-depth', type: 'slider', min: 40, max: 320, step: 10, default: 200, unit: 'px' },
  ],
  render: (v) => (
    <RealityDemo
      shape={String(v.shape)}
      color={String(v.color)}
      size={Number(v.size)}
      depth={Number(v.depth)}
    />
  ),
  code: (v) => `import { Reality, World, Material, Box } from "@webspatial/react-sdk"

function RealityDemo() {
  return (
    <Reality style={{ width: 360, height: 300, "--xr-depth": "${v.depth}px" }}>
      <Material type="unlit" id="main" color="${v.color}" />
      <World>
        <${(String(v.shape).charAt(0).toUpperCase() + String(v.shape).slice(1))} materials={["main"]} ${
          v.shape === 'sphere'
            ? `radius={${Number(v.size) / 2}}`
            : `width={${v.size}} height={${v.size}}`
        } position={{ x: 0, y: 0, z: 0 }} />
      </World>
    </Reality>
  )
}`,
}
