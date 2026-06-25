import { useEffect } from 'react'
import { initScene, useMetrics } from '@webspatial/react-sdk'
import type { SpatialSceneType } from '@webspatial/core-sdk'
import { detectRuntime } from '@/lib/runtime'
import type { Example } from './types'

const center: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
}

/* ─── initScene ─────────────────────────────────────────────────────── */
function InitSceneDemo({ type, width, height }: { type: string; width: number; height: number }) {
  // Real SDK call: configure the "viewer3d" scene BEFORE it is opened with
  // window.open(). No-op visual in a flat browser; configures the native scene
  // on a spatial device.
  useEffect(() => {
    initScene(
      'viewer3d',
      (defaultConfig) => ({
        ...defaultConfig,
        defaultSize: { width, height, depth: 100 },
      }),
      { type: type as SpatialSceneType },
    )
  }, [type, width, height])

  return (
    <div style={{ ...center, flexDirection: 'column', gap: 16 }}>
      <div
        enable-xr
        style={{
          '--xr-back': '60px',
          '--xr-background-material': 'translucent',
          padding: 18,
          borderRadius: 14,
          width: 260,
          fontFamily: 'monospace',
          fontSize: 12,
          lineHeight: 1.7,
          color: '#a5f3fc',
          background: 'linear-gradient(135deg, rgba(6,182,212,0.1), transparent)',
          border: '1px solid rgba(6,182,212,0.3)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ color: '#67e8f9' }}>initScene("viewer3d")</div>
        <div>type: {type}</div>
        <div>width: {width}</div>
        <div>height: {height}</div>
        <div>depth: 100</div>
      </div>
      <button
        onClick={() => window.open('/', 'viewer3d')}
        style={{
          padding: '8px 16px',
          borderRadius: 10,
          cursor: 'pointer',
          color: '#ddd6fe',
          fontSize: 12,
          background: 'rgba(124,58,237,0.25)',
          border: '1px solid rgba(124,58,237,0.4)',
        }}
      >
        window.open("/", "viewer3d")
      </button>
    </div>
  )
}

export const initSceneExample: Example = {
  id: 'js-initscene',
  title: 'initScene',
  subtitle: 'Configure scenes before opening',
  docsUrl: 'https://webspatial.dev/docs/api/react-sdk/js-api/initScene',
  description:
    'The real initScene() applies configuration to a named Spatial Scene before it is created via window.open() — scene type (window/volume), default size, world scaling and more. Change the controls and the live initScene() call re-registers the config.',
  tags: ['initScene', 'window.open', 'config'],
  controls: [
    {
      id: 'type',
      label: 'Scene type',
      type: 'select',
      default: 'volume',
      options: [{ value: 'window' }, { value: 'volume' }],
    },
    { id: 'width', label: 'default width', type: 'slider', min: 200, max: 1200, step: 50, default: 600, unit: 'px' },
    { id: 'height', label: 'default height', type: 'slider', min: 200, max: 900, step: 50, default: 400, unit: 'px' },
  ],
  render: (v) => <InitSceneDemo type={String(v.type)} width={Number(v.width)} height={Number(v.height)} />,
  code: (v) => `import { initScene } from "@webspatial/react-sdk"

initScene(
  "viewer3d",
  (defaultConfig) => ({
    ...defaultConfig,
    defaultSize: { width: ${v.width}, height: ${v.height}, depth: 100 },
  }),
  { type: "${v.type}" },
)`,
}

/* ─── useMetrics ────────────────────────────────────────────────────── */
function MetricsDemo({ px }: { px: number }) {
  const { pointToPhysical, physicalToPoint } = useMetrics()
  let pxToM = 0
  let mToPx = 0
  try {
    pxToM = pointToPhysical(px)
    mToPx = physicalToPoint(1)
  } catch {
    // physicalToPoint/pointToPhysical may need a spatial runtime; show 0 in flat browsers.
  }
  return (
    <div style={center}>
      <div
        enable-xr
        style={{
          '--xr-back': '40px',
          '--xr-background-material': 'translucent',
          padding: 22,
          borderRadius: 16,
          width: 260,
          background: 'linear-gradient(135deg, rgba(139,92,246,0.1), transparent)',
          border: '1px solid rgba(139,92,246,0.25)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>useMetrics()</div>
        <div style={{ marginTop: 14, fontFamily: 'monospace', fontSize: 13 }}>
          <div style={{ color: '#34d399' }}>
            {px}px ≈ {pxToM.toFixed(3)}m
          </div>
          <div style={{ color: '#67e8f9', marginTop: 6 }}>1m ≈ {Math.round(mToPx)}px</div>
        </div>
      </div>
    </div>
  )
}

export const useMetricsExample: Example = {
  id: 'js-usemetrics',
  title: 'useMetrics',
  subtitle: 'Convert between px and meters',
  docsUrl: 'https://webspatial.dev/docs/api/react-sdk/js-api/useMetrics',
  description:
    'The real useMetrics() hook converts between point units (px, used by 2D GUI) and physical world units (m, used in 3D space) — essential for aligning 2D UI with 3D content. Slide the pixel value to convert live. Conversions resolve against the active spatial runtime.',
  tags: ['useMetrics', 'px-to-m', 'conversion'],
  controls: [
    { id: 'px', label: 'pixels', type: 'slider', min: 0, max: 2000, step: 20, default: 1360, unit: 'px' },
  ],
  render: (v) => <MetricsDemo px={Number(v.px)} />,
  code: (v) => `import { useMetrics } from "@webspatial/react-sdk"

function MetricsDemo() {
  const { pointToPhysical, physicalToPoint } = useMetrics()
  return (
    <div enable-xr>
      ${v.px}px ≈ {pointToPhysical(${v.px})}m
      1m ≈ {physicalToPoint(1)}px
    </div>
  )
}`,
}

/* ─── userAgent runtime detection ───────────────────────────────────── */
function UserAgentDemo() {
  const rt = detectRuntime()
  const checks = [
    { label: 'WebSpatial runtime', on: rt.isWebSpatial },
    { label: 'visionOS (Vision Pro)', on: rt.isVisionOS },
    { label: 'PICO OS', on: rt.isPico },
  ]
  return (
    <div style={{ ...center, flexDirection: 'column', gap: 12 }}>
      {checks.map((c) => (
        <div
          key={c.label}
          enable-xr
          style={{
            '--xr-back': '30px',
            '--xr-background-material': 'translucent',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: 260,
            padding: '10px 14px',
            borderRadius: 10,
            background: 'rgba(139,92,246,0.06)',
            border: '1px solid rgba(139,92,246,0.2)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span style={{ fontSize: 16 }}>{c.on ? '✅' : '⬜'}</span>
          <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>{c.label}</span>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 10,
              color: c.on ? '#34d399' : 'rgba(255,255,255,0.3)',
            }}
          >
            {c.on ? 'yes' : 'no'}
          </span>
        </div>
      ))}
      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontFamily: 'monospace' }}>
        build: {rt.buildEnv} · sdk {rt.sdkVersion}
      </div>
      <div
        style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: 9,
          fontFamily: 'monospace',
          maxWidth: 300,
          textAlign: 'center',
          wordBreak: 'break-all',
        }}
      >
        {rt.ua}
      </div>
    </div>
  )
}

export const userAgentExample: Example = {
  id: 'dom-useragent',
  title: 'userAgent Detection',
  subtitle: 'Detect WebSpatial runtime & platform',
  docsUrl: 'https://webspatial.dev/docs/api/react-sdk/dom-api/userAgent',
  description:
    'Detect the WebSpatial runtime and platform from navigator.userAgent: /WebSpatial\\/(\\S+)/ for the runtime, "Macintosh" + WSAppShell for visionOS, and /PicoWebApp\\/(\\S+)/ for PICO OS. This reads your real userAgent — in a flat browser all checks are "no", which is expected.',
  tags: ['userAgent', 'detection', 'platform'],
  controls: [],
  render: () => <UserAgentDemo />,
  code: () => `const ua = navigator.userAgent
const isWebSpatial = /WebSpatial\\/(\\S+)/.test(ua)
const isVisionOS = ua.includes("Macintosh") && ua.includes("WSAppShell")
const isPico = /PicoWebApp\\/(\\S+)/.test(ua)`,
}

/* ─── xr_main_scene manifest ────────────────────────────────────────── */
function ManifestDemo({ type, width, height }: { type: string; width: number; height: number }) {
  const manifest = {
    name: 'WebSpatial Playground',
    start_url: '/',
    display: 'standalone',
    xr_main_scene: {
      type,
      default_size: { width, height },
      resizability: { min_width: 900, min_height: 600 },
    },
  }
  return (
    <div style={center}>
      <pre
        enable-xr
        style={{
          '--xr-back': '40px',
          '--xr-background-material': 'translucent',
          margin: 0,
          padding: 20,
          borderRadius: 14,
          maxWidth: 360,
          fontFamily: 'monospace',
          fontSize: 12,
          lineHeight: 1.6,
          color: '#a5f3fc',
          whiteSpace: 'pre-wrap',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.1), transparent)',
          border: '1px solid rgba(139,92,246,0.25)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {JSON.stringify(manifest, null, 2)}
      </pre>
    </div>
  )
}

export const manifestExample: Example = {
  id: 'manifest-main-scene',
  title: 'xr_main_scene',
  subtitle: 'Configure the start scene in the manifest',
  docsUrl: 'https://webspatial.dev/docs/api/react-sdk/manifest-options/main-scene',
  description:
    "xr_main_scene in the Web App Manifest (app.webmanifest) configures this app's Start Scene — type, default_size, resizability, world_scaling, world_alignment, baseplate_visibility. This playground ships a real app.webmanifest with exactly this field. Edit the controls to preview the formatted manifest.",
  tags: ['manifest', 'xr_main_scene', 'PWA'],
  language: 'json',
  controls: [
    {
      id: 'type',
      label: 'Scene type',
      type: 'select',
      default: 'window',
      options: [{ value: 'window' }, { value: 'volume' }],
    },
    { id: 'width', label: 'width', type: 'slider', min: 600, max: 2000, step: 50, default: 1400, unit: 'px' },
    { id: 'height', label: 'height', type: 'slider', min: 400, max: 1400, step: 50, default: 900, unit: 'px' },
  ],
  render: (v) => <ManifestDemo type={String(v.type)} width={Number(v.width)} height={Number(v.height)} />,
  code: (v) => `// public/app.webmanifest
{
  "name": "WebSpatial Playground",
  "start_url": "/",
  "display": "standalone",
  "xr_main_scene": {
    "type": "${v.type}",
    "default_size": { "width": ${v.width}, "height": ${v.height} },
    "resizability": { "min_width": 900, "min_height": 600 }
  }
}`,
}
