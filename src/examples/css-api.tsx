import { Reality, World, Material, Box, Sphere, Cylinder } from '@webspatial/react-sdk'
import type { Example } from './types'

const center: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
}

/* ─── --xr-back ─────────────────────────────────────────────────────── */
function BackDemo({ back, rotateY }: { back: number; rotateY: number }) {
  return (
    <div style={{ ...center, perspective: '900px' }}>
      <div
        enable-xr
        style={{
          position: 'relative',
          '--xr-back': `${back}px`,
          '--xr-background-material': 'translucent',
          width: 260,
          padding: 24,
          borderRadius: 18,
          background:
            'linear-gradient(135deg, rgba(139,92,246,0.28), rgba(217,70,239,0.12))',
          border: '1px solid rgba(139,92,246,0.4)',
          boxShadow: '0 24px 60px rgba(124,58,237,0.35)',
          transform: `rotateX(8deg) rotateY(${rotateY}deg)`,
        }}
      >
        <h2 style={{ color: '#ede9fe', fontSize: 16, fontWeight: 700 }}>I'm floating ✨</h2>
        <p
          style={{
            color: 'rgba(237,233,254,0.7)',
            fontSize: 12,
            fontFamily: 'monospace',
            margin: '6px 0 16px',
          }}
        >
          --xr-back: {back}px
        </p>
        <button
          enable-xr
          style={{
            position: 'relative',
            '--xr-back': `${Math.round(back / 2)}px`,
            padding: '8px 14px',
            borderRadius: 10,
            color: '#fff',
            fontSize: 12,
            background: 'rgba(124,58,237,0.55)',
            border: '1px solid rgba(167,139,250,0.5)',
          }}
        >
          +{Math.round(back / 2)}px nested →
        </button>
      </div>
    </div>
  )
}

export const backExample: Example = {
  id: 'css-back',
  title: '--xr-back',
  subtitle: 'Lift elements along the Z-axis',
  docsUrl: 'https://webspatial.dev/docs/api/react-sdk/css-api/back',
  description:
    'A CSS custom property that lifts a spatialized HTML element forward on the Z-axis (toward the viewer), in front of the page plane. It requires a positioned element marked with enable-xr. Drag the sliders to push the card and its nested button further into space.',
  tags: ['--xr-back', 'z-axis', 'elevation'],
  controls: [
    { id: 'back', label: '--xr-back', type: 'slider', min: 0, max: 140, step: 2, default: 80, unit: 'px' },
    { id: 'rotateY', label: 'rotateY', type: 'slider', min: -40, max: 40, step: 1, default: -14, unit: 'deg' },
  ],
  render: (v) => <BackDemo back={Number(v.back)} rotateY={Number(v.rotateY)} />,
  code: (v) => `import "@webspatial/react-sdk" // enable-xr is compiled by the SDK

function BackDemo() {
  return (
    <div style={{ perspective: "900px" }}>
      <div
        enable-xr
        style={{
          position: "relative",
          "--xr-back": "${v.back}px",
          "--xr-background-material": "translucent",
          transform: "rotateX(8deg) rotateY(${v.rotateY}deg)",
        }}
      >
        <h2>I'm floating ✨</h2>
        <button enable-xr style={{ position: "relative", "--xr-back": "${Math.round(Number(v.back) / 2)}px" }}>
          nested +${Math.round(Number(v.back) / 2)}px →
        </button>
      </div>
    </div>
  )
}`,
}

/* ─── Spatial Transform ─────────────────────────────────────────────── */
function TransformDemo({ rotateX, rotateY, back }: { rotateX: number; rotateY: number; back: number }) {
  return (
    <div style={{ ...center, perspective: '800px' }}>
      <div
        enable-xr
        style={{
          '--xr-back': `${back}px`,
          '--xr-background-material': 'translucent',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          width: 200,
          padding: 22,
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(139,92,246,0.22), transparent)',
          border: '1px solid rgba(139,92,246,0.3)',
        }}
      >
        <div style={{ color: '#c4b5fd', fontFamily: 'monospace', fontSize: 11, marginBottom: 10 }}>
          rotateX({rotateX}deg)
          <br />
          rotateY({rotateY}deg)
        </div>
        <div style={{ height: 8, borderRadius: 4, background: 'rgba(167,139,250,0.4)' }} />
        <div style={{ height: 8, borderRadius: 4, marginTop: 8, width: '70%', background: 'rgba(167,139,250,0.25)' }} />
      </div>
    </div>
  )
}

export const transformExample: Example = {
  id: 'css-transform',
  title: 'Spatial Transform',
  subtitle: 'True 3D rotation, translation, scale',
  docsUrl: 'https://webspatial.dev/docs/api/react-sdk/css-api/transform',
  description:
    'On spatialized elements the standard CSS transform property produces true 3D spatial transforms instead of flat 2D projections — translateZ/translate3d, rotateX/Y/Z and scaleZ all act in real space. Rotate the panel with the sliders.',
  tags: ['transform', 'rotate3d', '3d'],
  controls: [
    { id: 'rotateX', label: 'rotateX', type: 'slider', min: -60, max: 60, step: 1, default: 10, unit: 'deg' },
    { id: 'rotateY', label: 'rotateY', type: 'slider', min: -60, max: 60, step: 1, default: 30, unit: 'deg' },
    { id: 'back', label: '--xr-back', type: 'slider', min: 0, max: 120, step: 2, default: 60, unit: 'px' },
  ],
  render: (v) => (
    <TransformDemo rotateX={Number(v.rotateX)} rotateY={Number(v.rotateY)} back={Number(v.back)} />
  ),
  code: (v) => `function TransformDemo() {
  return (
    <div enable-xr
      style={{
        "--xr-back": "${v.back}px",
        "--xr-background-material": "translucent",
        // Real 3D transform on spatial devices:
        transform: "rotateX(${v.rotateX}deg) rotateY(${v.rotateY}deg)",
      }}>
      <p>Spatial panel</p>
    </div>
  )
}`,
}

/* ─── --xr-background-material ───────────────────────────────────────── */
function MaterialDemo({ material, back }: { material: string; back: number }) {
  return (
    <div style={{ ...center, position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 36,
          width: 150,
          height: 150,
          borderRadius: '50%',
          filter: 'blur(34px)',
          background: 'radial-gradient(circle, rgba(6,182,212,0.45), transparent)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          right: 36,
          width: 170,
          height: 170,
          borderRadius: '50%',
          filter: 'blur(34px)',
          background: 'radial-gradient(circle, rgba(236,72,153,0.35), transparent)',
        }}
      />
      <div
        enable-xr
        style={{
          position: 'relative',
          '--xr-back': `${back}px`,
          '--xr-background-material': material,
          width: 250,
          padding: 24,
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.16)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        }}
      >
        <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>
          --xr-background-material
        </div>
        <div style={{ color: '#c4b5fd', fontFamily: 'monospace', fontSize: 12, marginTop: 4 }}>
          {material}
        </div>
      </div>
    </div>
  )
}

export const backgroundMaterialExample: Example = {
  id: 'css-background-material',
  title: '--xr-background-material',
  subtitle: 'Glass & transparent backplates',
  docsUrl: 'https://webspatial.dev/docs/api/react-sdk/css-api/background-material',
  description:
    'Replace a solid background with a real-time rendered backplate material that reacts to the environment. "none" keeps your CSS background, "transparent" removes the backplate so the element floats, and "translucent" renders a native glass material on visionOS / PICO OS.',
  tags: ['translucent', 'transparent', 'glass'],
  controls: [
    {
      id: 'material',
      label: 'Material',
      type: 'select',
      default: 'translucent',
      options: [{ value: 'none' }, { value: 'transparent' }, { value: 'translucent' }],
    },
    { id: 'back', label: '--xr-back', type: 'slider', min: 0, max: 120, step: 2, default: 50, unit: 'px' },
  ],
  render: (v) => <MaterialDemo material={String(v.material)} back={Number(v.back)} />,
  code: (v) => `function MaterialDemo() {
  return (
    <div enable-xr
      style={{
        "--xr-back": "${v.back}px",
        // "none" | "transparent" | "translucent"
        "--xr-background-material": "${v.material}",
      }}>
      <p>material: ${v.material}</p>
    </div>
  )
}`,
}

/* ─── --xr-depth ─────────────────────────────────────────────────────── */
function DepthDemo({ depth, shape }: { depth: number; shape: string }) {
  return (
    <div style={{ ...center, gap: 22, flexWrap: 'wrap' }}>
      <Reality style={{ width: 280, height: 240, '--xr-depth': `${depth}px` }}>
        <Material type="unlit" id="violet" color="#a78bfa" />
        <Material type="unlit" id="cyan" color="#22d3ee" />
        <World>
          {shape === 'box' && <Box materials={['violet']} width={0.24} height={0.24} depth={0.24} />}
          {shape === 'sphere' && <Sphere materials={['cyan']} radius={0.16} />}
          {shape === 'cylinder' && <Cylinder materials={['violet']} radius={0.12} height={0.3} />}
        </World>
      </Reality>
    </div>
  )
}
// (Material, Reality, World and primitives are imported at the top of the file.)

export const depthExample: Example = {
  id: 'css-depth',
  title: '--xr-depth',
  subtitle: 'Control 3D container thickness',
  docsUrl: 'https://webspatial.dev/docs/api/react-sdk/css-api/depth',
  description:
    'For 3D content containers (<Model> and <Reality>), --xr-depth sets the thickness of the local 3D space in front of the 2D backplate — the volume that holds the 3D content. Increase the depth to give the real <Reality> scene more room.',
  tags: ['--xr-depth', 'volume', '3d-container'],
  controls: [
    { id: 'depth', label: '--xr-depth', type: 'slider', min: 0, max: 320, step: 10, default: 200, unit: 'px' },
    {
      id: 'shape',
      label: 'Primitive',
      type: 'select',
      default: 'box',
      options: [{ value: 'box' }, { value: 'sphere' }, { value: 'cylinder' }],
    },
  ],
  render: (v) => <DepthDemo depth={Number(v.depth)} shape={String(v.shape)} />,
  code: (v) => `import { Reality, World, Material, Box } from "@webspatial/react-sdk"

function DepthDemo() {
  return (
    <Reality style={{ width: 280, height: 240, "--xr-depth": "${v.depth}px" }}>
      <Material type="unlit" id="violet" color="#a78bfa" />
      <World>
        <Box materials={["violet"]} width={0.24} height={0.24} depth={0.24} />
      </World>
    </Reality>
  )
}`,
}
