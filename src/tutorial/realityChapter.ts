/**
 * Story 6 — 3D Content Containers: `<Reality>`.
 *
 * `<Reality>` is too big for one lesson: it's a whole programmable 3D system —
 * a local scene with entities, materials, textures, model instances and
 * attached 2D UI. So, Apple-tutorial style, this chapter teaches it as five
 * short, focused lessons behind a calm overview and a chapter wrap-up:
 *
 *   6.1  Build your first Reality scene        (container, depth, scene root, one primitive)
 *   6.2  Place entities in 3D space            (position / rotation / scale, parent groups)
 *   6.3  Apply materials and textures          (material & texture resources, referenced by id)
 *   6.4  Load models with ModelAsset/ModelEntity (resource vs instance, reuse)
 *   6.5  Attach 2D UI with AttachmentAsset/AttachmentEntity (React UI in the scene)
 *
 * Every component, prop and value shape here is taken verbatim from the working
 * WebSpatial React SDK (`@webspatial/react-sdk`, v1.7) — `SceneGraph` as the
 * scene root, `UnlitMaterial` referenced by `materials={['id']}`, `Texture`
 * with a `url`, materials linking a texture via `textureId`, `ModelAsset` +
 * `ModelEntity model="id"`, and `AttachmentAsset name` + `AttachmentEntity`
 * with an `attachment`, a `[x, y, z]` `position` tuple and a required `size`.
 * Nothing is invented. The animated equalizer / dynamic updates are reserved
 * for Story 7 and never appear here.
 *
 * Like the single-lesson chapters, every guided step carries a "do it for me"
 * {@link AutoType} edit, so `finalCode` is *derived* from the starter + the
 * chain of those edits ({@link buildFinal}) — the finished scene is, by
 * construction, exactly what "do it for me" produces, step after step.
 */
import {
  resolveAutoType,
  type AutoType,
  type Lesson,
  type LessonChapter,
  type TutorialStep,
} from './lesson'

// A real, reachable prebuilt asset (Apple Quick Look sample) — the same one
// Story 5 loads with <Model>. Reused here so model paths are never invented.
const TEAPOT =
  'https://developer.apple.com/augmented-reality/quick-look/models/teapot/teapot.usdz'

/**
 * Fold a lesson's "do it for me" edits over its starter to produce the finished
 * code — the same edits, in order, that the user would apply step by step.
 */
function buildFinal(starter: string, steps: TutorialStep[]): string {
  let code = starter
  for (const step of steps) {
    if (!step.autoType) continue
    const target = resolveAutoType(code, step.autoType)
    if (!target) continue
    code = code.slice(0, target.at) + target.text + code.slice(target.at + target.removeLen)
  }
  return code
}

/** Small helper so step objects read cleanly. */
const at = (mode: AutoType['mode'], anchor: string, text: string): AutoType =>
  ({ mode, anchor, text }) as AutoType

/* ────────────────────────────────────────────────────────────────────── */
/*  Lesson 6.1 — Build your first Reality scene                            */
/* ────────────────────────────────────────────────────────────────────── */

const firstStarter = `export default function FirstScene() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
      <div style={{ textAlign: 'center', color: '#ede9fe' }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>A 3D scene goes here</h2>
        <p style={{ fontSize: 13, opacity: 0.65, margin: '8px 0 18px' }}>
          A normal React layout. The 3D scene will live in the region below.
        </p>

        {/* placeholder — the 2D area that will become a <Reality> scene */}
        <div
          style={{
            width: 360,
            height: 320,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 20,
            color: 'rgba(255,255,255,0.4)',
            background: 'linear-gradient(135deg, rgba(20,184,166,0.10), rgba(124,58,237,0.06))',
            border: '1px dashed rgba(20,184,166,0.35)',
          }}
        >
          reality placeholder
        </div>
      </div>
    </div>
  )
}`

const firstSteps: TutorialStep[] = [
  {
    id: 'placeholder',
    title: 'Start with a normal placeholder',
    explanation:
      'This starts as a normal layout. The 3D scene will live inside one rectangular area of the page.',
    task: 'Find the placeholder where the 3D scene should appear.',
    anchors: ['placeholder', 'reality placeholder'],
    validation: { type: 'manual' },
    completionMessage: 'This is the 2D area that will contain the 3D scene.',
  },
  {
    id: 'import',
    title: 'Import the Reality components',
    explanation:
      '<Reality> creates the container. The scene root holds the 3D entities inside it.',
    task: 'Import Reality, the scene root, and one primitive entity from the WebSpatial React SDK.',
    anchors: ['@webspatial/react-sdk', 'SceneGraph', 'BoxEntity'],
    validation: {
      type: 'containsAll',
      values: ['@webspatial/react-sdk', 'SceneGraph', 'BoxEntity'],
    },
    autoType: at(
      'insertBefore',
      'export default function FirstScene',
      "import {\n  Reality,\n  SceneGraph,\n  BoxEntity,\n} from '@webspatial/react-sdk'\n\n",
    ),
    completionMessage: 'You can now create a dynamic 3D scene.',
    notYet:
      "Not quite yet — import Reality, SceneGraph and BoxEntity from '@webspatial/react-sdk', then try Next again.",
  },
  {
    id: 'reality-container',
    title: 'Replace the placeholder with <Reality>',
    explanation: '<Reality> still takes up normal space in the page.',
    task: 'Replace the placeholder with a <Reality> container that keeps the same width and height.',
    anchors: ['<Reality', 'width: 360', 'height: 320'],
    validation: { type: 'contains', value: '<Reality' },
    autoType: at(
      'replace',
      `        {/* placeholder — the 2D area that will become a <Reality> scene */}
        <div
          style={{
            width: 360,
            height: 320,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 20,
            color: 'rgba(255,255,255,0.4)',
            background: 'linear-gradient(135deg, rgba(20,184,166,0.10), rgba(124,58,237,0.06))',
            border: '1px dashed rgba(20,184,166,0.35)',
          }}
        >
          reality placeholder
        </div>`,
      `        {/* the placeholder is now a local 3D scene */}
        <Reality
          style={{
            width: 360,
            height: 320,
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(20,184,166,0.10), rgba(124,58,237,0.06))',
            border: '1px solid rgba(20,184,166,0.25)',
          }}
        >
          {/* 3D entities go here */}
        </Reality>`,
    ),
    completionMessage: 'The page now has a Reality container.',
    notYet:
      'Not quite yet — replace the placeholder with a <Reality> container, then try Next again.',
  },
  {
    id: 'xr-depth',
    title: 'Add local depth',
    explanation:
      '--xr-depth gives the container local 3D space in front of its 2D plane.',
    task: "Add '--xr-depth': '240px' to the Reality container's style.",
    anchors: ['<Reality', '--xr-depth'],
    validation: { type: 'contains', value: '--xr-depth' },
    autoType: at('insertLineAfter', 'borderRadius: 20,', "            '--xr-depth': '240px',"),
    experiment: 'Try 120px, then 320px, and picture how much room the scene gets.',
    completionMessage: 'The container now has room for 3D content.',
    notYet:
      "Not quite yet — add '--xr-depth' to the Reality container's style, then try Next again.",
  },
  {
    id: 'scene-root',
    title: 'Add the scene root',
    explanation: 'The scene root is where visible 3D entities belong.',
    task: 'Add a <SceneGraph> inside <Reality>.',
    anchors: ['<SceneGraph', '<Reality'],
    validation: { type: 'contains', value: '<SceneGraph' },
    autoType: at(
      'replace',
      '          {/* 3D entities go here */}',
      '          <SceneGraph>\n            {/* 3D entities go here */}\n          </SceneGraph>',
    ),
    completionMessage: 'The Reality container now has a 3D scene root.',
    notYet:
      'Not quite yet — add a <SceneGraph> scene root inside <Reality>, then try Next again.',
  },
  {
    id: 'primitive',
    title: 'Add one primitive',
    explanation: 'Primitives are 3D entities. They do not use CSS layout.',
    task: 'Place one BoxEntity inside the scene root.',
    anchors: ['<BoxEntity', '<SceneGraph'],
    validation: { type: 'contains', value: '<BoxEntity' },
    autoType: at(
      'replace',
      '            {/* 3D entities go here */}',
      `            <BoxEntity
              width={0.2}
              height={0.2}
              depth={0.2}
              cornerRadius={0.02}
              position={{ x: 0, y: 0, z: 0.1 }}
            />`,
    ),
    fallbackNote:
      'The 3D shape renders inside a WebSpatial Runtime (Vision Pro / PICO). Here you see the 2D container; the entity is in the scene.',
    completionMessage: 'You rendered your first programmable 3D entity.',
    notYet:
      'Not quite yet — add a <BoxEntity> inside the <SceneGraph>, then try Next again.',
  },
]

const firstScene: Lesson = {
  id: 'reality-first-scene',
  chapter: '3D Content Containers: <Reality>',
  title: 'Build your first Reality scene',
  intro:
    'Start with a normal rectangular area in the page, then turn it into a local 3D scene.',
  learn: [
    'How <Reality> participates in normal HTML layout',
    'How width and height define the 2D container',
    'How --xr-depth defines local 3D depth',
    'How the scene root holds visible 3D entities',
    'How primitive entities render in 3D, not with CSS layout',
  ],
  fileName: 'FirstScene.tsx',
  starterCode: firstStarter,
  finalCode: buildFinal(firstStarter, firstSteps),
  steps: firstSteps,
  wrapUp: {
    title: 'What you built',
    copy: 'You created a Reality container, gave it local depth, added a scene root, and placed one primitive entity inside it.',
    concepts: [
      '<Reality> participates in normal HTML layout.',
      'width and height define the 2D container.',
      '--xr-depth defines local 3D depth.',
      '<SceneGraph> is the scene root for visible entities.',
      'Primitive entities render in 3D, not with CSS layout.',
    ],
  },
  next: { title: 'Place entities in 3D space' },
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Lesson 6.2 — Place entities in 3D space                                */
/* ────────────────────────────────────────────────────────────────────── */

/*
 * A lightweight 2D "axes" overlay is baked into the lesson code itself (an SVG
 * layered over the container with a Show-axes toggle), so the coordinate system
 * is teachable right here in a flat browser — without building a real 3D editor.
 * The box starts at the origin with no transform; each step adds exactly one
 * transform prop, then a second box and a parent group.
 */

const transformsStarter = `import { useState } from 'react'
import { Reality, SceneGraph, Entity, BoxEntity } from '@webspatial/react-sdk'

// A 2D learning aid drawn over the scene: the origin and the +X / +Y / +Z
// directions. It is only a guide — the real entities live in 3D inside <Reality>.
function AxesGuide() {
  return (
    <svg width="360" height="320" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <line x1="180" y1="56" x2="180" y2="264" stroke="rgba(167,139,250,0.5)" strokeWidth="1" />
      <line x1="56" y1="160" x2="304" y2="160" stroke="rgba(20,184,166,0.5)" strokeWidth="1" />
      <circle cx="180" cy="160" r="4" fill="#a78bfa" />
      <text x="308" y="164" fill="rgba(20,184,166,0.9)" fontSize="11" fontFamily="monospace">+X</text>
      <text x="172" y="50" fill="rgba(167,139,250,0.9)" fontSize="11" fontFamily="monospace">+Y</text>
      <text x="190" y="178" fill="rgba(255,255,255,0.55)" fontSize="11" fontFamily="monospace">origin</text>
      <text x="112" y="300" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">+Z toward you</text>
    </svg>
  )
}

export default function PlaceEntities() {
  const [showAxes, setShowAxes] = useState(true)

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%', gap: 12 }}>
      <div style={{ position: 'relative', width: 360, height: 320 }}>
        <Reality
          style={{
            width: 360,
            height: 320,
            borderRadius: 20,
            '--xr-depth': '240px',
            background: 'linear-gradient(135deg, rgba(20,184,166,0.10), rgba(124,58,237,0.06))',
            border: '1px solid rgba(20,184,166,0.25)',
          }}
        >
          <SceneGraph>
            <BoxEntity
              width={0.18}
              height={0.18}
              depth={0.18}
              cornerRadius={0.02}
            />
            {/* add a second entity here */}
          </SceneGraph>
        </Reality>
        {showAxes && <AxesGuide />}
      </div>

      <button
        onClick={() => setShowAxes((v) => !v)}
        style={{
          padding: '6px 14px', borderRadius: 9, fontSize: 12, cursor: 'pointer',
          color: '#ede9fe', background: 'rgba(124,58,237,0.35)',
          border: '1px solid rgba(167,139,250,0.45)',
        }}
      >
        {showAxes ? 'Hide axes' : 'Show axes'}
      </button>
    </div>
  )
}`

const transformsSteps: TutorialStep[] = [
  {
    id: 'origin',
    title: 'Show the origin',
    explanation: 'The origin is the center point of this local Reality scene.',
    task: 'Use the "Show axes" toggle under the preview to see the coordinate guide.',
    anchors: ['AxesGuide', 'showAxes'],
    validation: { type: 'manual' },
    completionMessage:
      'The center marker shows where position { x: 0, y: 0, z: 0 } begins.',
  },
  {
    id: 'position',
    title: 'Move an entity with position',
    explanation: 'position moves an entity in local 3D space.',
    task: 'Add position={{ x: 0.1, y: 0, z: 0 }} to the BoxEntity.',
    anchors: ['<BoxEntity', 'position={'],
    validation: { type: 'contains', value: 'position={' },
    autoType: at('insertLineAfter', 'cornerRadius={0.02}', '              position={{ x: 0.1, y: 0, z: 0 }}'),
    experiment: 'Try x: 0.2, then a negative x, and read it against the +X axis.',
    completionMessage: 'The entity now has an explicit 3D position.',
    notYet: 'Not quite yet — add a position prop to the BoxEntity, then try Next again.',
  },
  {
    id: 'rotation',
    title: 'Rotate the entity',
    explanation: 'Rotation values are expressed in radians. Math.PI / 2 is 90 degrees.',
    task: 'Add rotation={{ x: 0, y: Math.PI / 6, z: 0 }} to the BoxEntity.',
    anchors: ['<BoxEntity', 'rotation={'],
    validation: { type: 'contains', value: 'rotation={' },
    autoType: at(
      'insertLineAfter',
      'position={{ x: 0.1, y: 0, z: 0 }}',
      '              rotation={{ x: 0, y: Math.PI / 6, z: 0 }}',
    ),
    completionMessage: 'The entity now rotates in the scene.',
    notYet: 'Not quite yet — add a rotation prop to the BoxEntity, then try Next again.',
  },
  {
    id: 'scale',
    title: 'Scale the entity',
    explanation:
      'Scale changes the size of the entity without changing the 2D container.',
    task: 'Add scale={{ x: 1, y: 1.5, z: 1 }} to the BoxEntity.',
    anchors: ['<BoxEntity', 'scale={'],
    validation: { type: 'contains', value: 'scale={' },
    autoType: at(
      'insertLineAfter',
      'rotation={{ x: 0, y: Math.PI / 6, z: 0 }}',
      '              scale={{ x: 1, y: 1.5, z: 1 }}',
    ),
    completionMessage: 'You changed the entity’s size with a 3D transform.',
    notYet: 'Not quite yet — add a scale prop to the BoxEntity, then try Next again.',
  },
  {
    id: 'second-entity',
    title: 'Add a second entity',
    explanation: 'Multiple entities can share the same local 3D space.',
    task: 'Add a second BoxEntity at a different position.',
    anchors: ['<BoxEntity'],
    validation: { type: 'manual' },
    autoType: at(
      'replace',
      '            {/* add a second entity here */}',
      `            <BoxEntity
              width={0.12}
              height={0.12}
              depth={0.12}
              cornerRadius={0.02}
              position={{ x: -0.12, y: 0, z: 0 }}
            />`,
    ),
    completionMessage: 'You placed multiple entities in one scene.',
  },
  {
    id: 'parent',
    title: 'Group entities under a parent',
    explanation: 'A parent entity moves its children together.',
    task: 'Wrap the two boxes in a parent <Entity> and move the parent.',
    anchors: ['<Entity', '<BoxEntity'],
    validation: { type: 'contains', value: '<Entity' },
    autoType: at(
      'replace',
      `            <BoxEntity
              width={0.18}
              height={0.18}
              depth={0.18}
              cornerRadius={0.02}
              position={{ x: 0.1, y: 0, z: 0 }}
              rotation={{ x: 0, y: Math.PI / 6, z: 0 }}
              scale={{ x: 1, y: 1.5, z: 1 }}
            />
            <BoxEntity
              width={0.12}
              height={0.12}
              depth={0.12}
              cornerRadius={0.02}
              position={{ x: -0.12, y: 0, z: 0 }}
            />`,
      `            <Entity position={{ x: 0, y: 0.05, z: 0.1 }}>
              <BoxEntity
                width={0.18}
                height={0.18}
                depth={0.18}
                cornerRadius={0.02}
                position={{ x: 0.1, y: 0, z: 0 }}
                rotation={{ x: 0, y: Math.PI / 6, z: 0 }}
                scale={{ x: 1, y: 1.5, z: 1 }}
              />
              <BoxEntity
                width={0.12}
                height={0.12}
                depth={0.12}
                cornerRadius={0.02}
                position={{ x: -0.12, y: 0, z: 0 }}
              />
            </Entity>`,
    ),
    completionMessage: 'You created a simple scene hierarchy.',
    notYet: 'Not quite yet — wrap the boxes in a parent <Entity>, then try Next again.',
  },
]

const transforms: Lesson = {
  id: 'reality-transforms',
  chapter: '3D Content Containers: <Reality>',
  title: 'Place entities in 3D space',
  intro:
    'Now move, rotate, and scale entities using 3D transform props instead of CSS layout.',
  learn: [
    'How the Reality scene has a local coordinate system',
    'How the origin sits at the center of the local 3D space',
    'How position moves entities along X, Y and Z in physical units',
    'How rotation is expressed in radians',
    'How child transforms are relative to their parent entity',
  ],
  fileName: 'PlaceEntities.tsx',
  starterCode: transformsStarter,
  finalCode: buildFinal(transformsStarter, transformsSteps),
  steps: transformsSteps,
  wrapUp: {
    title: 'What you built',
    copy: 'You moved, rotated, scaled, and grouped entities in local 3D space.',
    concepts: [
      'The Reality scene has a local coordinate system with the origin at its center.',
      'position uses physical units (meters); +Z points toward the viewer.',
      'rotation is expressed in radians.',
      'scale resizes an entity without touching the 2D container.',
      'A parent <Entity> moves its children together; child transforms are relative to it.',
    ],
  },
  next: { title: 'Apply materials and textures' },
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Lesson 6.3 — Apply materials and textures                              */
/* ────────────────────────────────────────────────────────────────────── */

const materialsStarter = `import {
  Reality,
  SceneGraph,
  UnlitMaterial,
  Texture,
  BoxEntity,
  PlaneEntity,
} from '@webspatial/react-sdk'

export default function Materials() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
      <Reality
        style={{
          width: 360,
          height: 320,
          borderRadius: 20,
          '--xr-depth': '240px',
          background: 'linear-gradient(135deg, rgba(20,184,166,0.10), rgba(124,58,237,0.06))',
          border: '1px solid rgba(20,184,166,0.25)',
        }}
      >
        {/* resources go here, above the scene root */}
        <SceneGraph>
          <BoxEntity
            width={0.18}
            height={0.18}
            depth={0.18}
            cornerRadius={0.02}
            position={{ x: -0.12, y: 0, z: 0.1 }}
          />
          {/* more scene entities go here */}
        </SceneGraph>
      </Reality>
    </div>
  )
}`

const materialsSteps: TutorialStep[] = [
  {
    id: 'declare-material',
    title: 'Declare a simple material',
    explanation:
      'Materials are resources. Declare them near the top of <Reality>, outside the scene root.',
    task: 'Add <UnlitMaterial id="teal" color="#14b8a6" /> as a top-level child of <Reality>.',
    anchors: ['<UnlitMaterial', '<SceneGraph'],
    validation: { type: 'contains', value: '<UnlitMaterial' },
    autoType: at(
      'insertLineAfter',
      '{/* resources go here, above the scene root */}',
      '        <UnlitMaterial id="teal" color="#14b8a6" />',
    ),
    completionMessage: 'You declared a reusable material.',
    notYet:
      'Move this resource directly under <Reality>, outside the scene root, then try Next again.',
  },
  {
    id: 'apply-material',
    title: 'Apply the material to a primitive',
    explanation: 'Entities use material ids to choose their appearance.',
    task: "Add materials={['teal']} to the BoxEntity.",
    anchors: ['<BoxEntity', 'materials={'],
    validation: { type: 'contains', value: 'materials={' },
    autoType: at('insertLineAfter', 'cornerRadius={0.02}', "            materials={['teal']}"),
    fallbackNote:
      'The color shows on a WebSpatial Runtime. Here the material is wired up; the 3D surface renders in a headset.',
    completionMessage: 'The entity now uses your material.',
    notYet:
      "Not quite yet — reference the material id with materials={['teal']}, then try Next again.",
  },
  {
    id: 'transparent-material',
    title: 'Add a transparent material',
    explanation:
      'Transparent materials are useful for glassy panels, overlays, and previews.',
    task: 'Declare a second material with transparency.',
    anchors: ['<UnlitMaterial', 'transparent', 'opacity'],
    validation: { type: 'containsAll', values: ['transparent', 'opacity'] },
    autoType: at(
      'insertLineAfter',
      '<UnlitMaterial id="teal" color="#14b8a6" />',
      '        <UnlitMaterial id="glass" color="#22d3ee" transparent opacity={0.5} />',
    ),
    completionMessage: 'You added a transparent material resource.',
    notYet:
      'Not quite yet — add a second material with transparent and opacity, then try Next again.',
  },
  {
    id: 'declare-texture',
    title: 'Declare a texture resource',
    explanation: 'A texture loads image data that a material can use.',
    task: 'Add a <Texture> resource directly inside <Reality>.',
    anchors: ['<Texture', 'url='],
    validation: { type: 'containsAll', values: ['<Texture', 'url='] },
    autoType: at(
      'insertLineAfter',
      '<UnlitMaterial id="glass" color="#22d3ee" transparent opacity={0.5} />',
      '        <Texture id="grid" url="/textures/grid.png" />',
    ),
    completionMessage: 'You loaded a texture resource.',
    notYet: 'Not quite yet — add a <Texture> resource with a url, then try Next again.',
  },
  {
    id: 'connect-texture',
    title: 'Connect the texture to a material',
    explanation: 'The texture becomes visible when a material references it.',
    task: 'Add a material that uses the texture with textureId.',
    anchors: ['textureId', '<UnlitMaterial'],
    validation: { type: 'contains', value: 'textureId' },
    autoType: at(
      'insertLineAfter',
      '<Texture id="grid" url="/textures/grid.png" />',
      '        <UnlitMaterial id="surface" textureId="grid" />',
    ),
    notYet:
      'The texture is declared, but it will not appear until a material references it with textureId. Add that, then try Next again.',
    completionMessage: 'The material now uses image data.',
  },
  {
    id: 'apply-texture',
    title: 'Apply the textured material',
    explanation:
      'Textured materials help 3D surfaces show detail without adding more geometry.',
    task: 'Add a PlaneEntity floor that uses the textured material.',
    anchors: ['<PlaneEntity', 'materials={'],
    validation: { type: 'contains', value: '<PlaneEntity' },
    autoType: at(
      'replace',
      '          {/* more scene entities go here */}',
      `          <PlaneEntity
            materials={['surface']}
            width={0.5}
            height={0.5}
            position={{ x: 0, y: -0.16, z: 0.1 }}
            rotation={{ x: -Math.PI / 2, y: 0, z: 0 }}
          />`,
    ),
    fallbackNote:
      'The texture shows on a WebSpatial Runtime. Here the material chain is complete; the surface renders in a headset.',
    completionMessage: 'You applied a texture through a material.',
    notYet:
      'Not quite yet — add a <PlaneEntity> that references the textured material, then try Next again.',
  },
]

const materials: Lesson = {
  id: 'reality-materials',
  chapter: '3D Content Containers: <Reality>',
  title: 'Apply materials and textures',
  intro: 'Now give your 3D entities color, transparency, and image-based texture.',
  learn: [
    'How materials and textures are resources, not entities',
    'How resources belong inside <Reality>, outside the scene root',
    'How entities reference materials by id',
    'How a texture connects to a material before appearing on an entity',
    'How opaque, transparent, and textured materials differ',
  ],
  fileName: 'Materials.tsx',
  starterCode: materialsStarter,
  finalCode: buildFinal(materialsStarter, materialsSteps),
  steps: materialsSteps,
  wrapUp: {
    title: 'What you built',
    copy: 'You declared material and texture resources, then applied them to entities by reference.',
    concepts: [
      'Materials and textures are resources, declared inside <Reality> outside the scene root.',
      "Entities reference materials by id with materials={['id']}.",
      'transparent + opacity make a see-through material.',
      'A <Texture> loads image data from a url.',
      'A material points at a texture with textureId, then entities use that material.',
    ],
  },
  next: { title: 'Load models with ModelAsset and ModelEntity' },
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Lesson 6.4 — Load models with ModelAsset and ModelEntity               */
/* ────────────────────────────────────────────────────────────────────── */

const modelsStarter = `import {
  Reality,
  SceneGraph,
} from '@webspatial/react-sdk'

// A real, reachable prebuilt asset (Apple Quick Look sample).
const TEAPOT = '${TEAPOT}'

export default function ModelEntities() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
      <Reality
        style={{
          width: 360,
          height: 320,
          borderRadius: 20,
          '--xr-depth': '240px',
          background: 'linear-gradient(135deg, rgba(20,184,166,0.10), rgba(124,58,237,0.06))',
          border: '1px solid rgba(20,184,166,0.25)',
        }}
      >
        {/* model assets go here, above the scene root */}
        <SceneGraph>
          {/* model entities go here */}
        </SceneGraph>
      </Reality>
    </div>
  )
}`

const modelsSteps: TutorialStep[] = [
  {
    id: 'start',
    title: 'Start from the Reality scene',
    explanation:
      'Model assets are declared with resources. Model entities are placed with other entities.',
    task: 'Find the top-level resources area and the scene root in the editor.',
    anchors: ['model assets go here', 'model entities go here', '<SceneGraph'],
    validation: { type: 'manual' },
    completionMessage: 'You’re ready to add a model resource.',
  },
  {
    id: 'import',
    title: 'Import model components',
    explanation:
      'ModelAsset loads the resource; ModelEntity places a visible instance.',
    task: 'Import ModelAsset and ModelEntity from the WebSpatial React SDK.',
    anchors: ['ModelAsset', 'ModelEntity'],
    validation: { type: 'containsAll', values: ['ModelAsset', 'ModelEntity'] },
    autoType: at('insertLineAfter', 'SceneGraph,', '  ModelAsset,\n  ModelEntity,'),
    completionMessage: 'You can now load and place models inside Reality.',
    notYet: 'Not quite yet — import ModelAsset and ModelEntity, then try Next again.',
  },
  {
    id: 'declare-asset',
    title: 'Declare a ModelAsset',
    explanation:
      'ModelAsset loads the model resource, but it does not appear by itself.',
    task: 'Add <ModelAsset id="teapot" src={TEAPOT} /> inside <Reality>, outside the scene root.',
    anchors: ['<ModelAsset', 'src='],
    validation: { type: 'containsAll', values: ['<ModelAsset', 'src='] },
    autoType: at(
      'replace',
      '        {/* model assets go here, above the scene root */}',
      '        <ModelAsset id="teapot" src={TEAPOT} />',
    ),
    completionMessage: 'The model asset is loaded as a resource.',
    notYet: 'Not quite yet — add a <ModelAsset> with an id and src, then try Next again.',
  },
  {
    id: 'add-entity',
    title: 'Add a ModelEntity',
    explanation: 'ModelEntity is the visible instance of the loaded model.',
    task: 'Add a <ModelEntity> inside the scene root and reference the asset.',
    anchors: ['<ModelEntity', 'model='],
    validation: { type: 'containsAll', values: ['<ModelEntity', 'model='] },
    autoType: at(
      'replace',
      '          {/* model entities go here */}',
      `          <ModelEntity
            model="teapot"
          />`,
    ),
    notYet:
      'The model asset is declared, but it will not appear until a ModelEntity references it. Add one, then try Next again.',
    completionMessage: 'The model now appears inside the Reality scene.',
  },
  {
    id: 'transform',
    title: 'Position and scale the model',
    explanation: 'Model entities use the same transform props as other scene entities.',
    task: 'Add position and scale to the ModelEntity.',
    anchors: ['<ModelEntity', 'position={', 'scale={'],
    validation: { type: 'containsAll', values: ['position={', 'scale={'] },
    autoType: at(
      'insertLineAfter',
      'model="teapot"',
      '            position={{ x: -0.12, y: 0, z: 0.1 }}\n            scale={{ x: 1, y: 1, z: 1 }}',
    ),
    completionMessage: 'You placed the model in 3D space.',
    notYet: 'Not quite yet — add position and scale to the ModelEntity, then try Next again.',
  },
  {
    id: 'reuse',
    title: 'Reuse the same asset',
    explanation: 'One model asset can be loaded once and placed multiple times.',
    task: 'Add a second ModelEntity using the same asset id.',
    anchors: ['<ModelEntity'],
    validation: { type: 'manual' },
    autoType: at(
      'insertLineAfter',
      '/>',
      `          <ModelEntity
            model="teapot"
            position={{ x: 0.14, y: 0, z: 0.1 }}
            scale={{ x: 0.6, y: 0.6, z: 0.6 }}
          />`,
    ),
    completionMessage: 'You reused one model asset as multiple scene instances.',
  },
  {
    id: 'compare',
    title: 'Compare with standalone <Model>',
    explanation:
      'Use standalone <Model> for a simple single model. Use ModelAsset and ModelEntity when the model belongs inside a programmable Reality scene.',
    task: 'Read the comparison note, then continue.',
    anchors: ['<ModelEntity', '<ModelAsset'],
    validation: { type: 'manual' },
    completionMessage:
      'You now know when to use <Model> and when to use model entities inside <Reality>.',
  },
]

const models: Lesson = {
  id: 'reality-models',
  chapter: '3D Content Containers: <Reality>',
  title: 'Load models with ModelAsset and ModelEntity',
  intro:
    'Use ModelAsset to load a model once, then place one or more ModelEntity instances in the scene.',
  learn: [
    'How ModelAsset loads a model resource and is invisible by itself',
    'How ModelEntity is the visible scene instance',
    'How multiple ModelEntity instances can reuse one asset',
    'How ModelAsset belongs inside <Reality> and ModelEntity inside the scene root',
    'When standalone <Model> is the simpler choice',
  ],
  fileName: 'ModelEntities.tsx',
  starterCode: modelsStarter,
  finalCode: buildFinal(modelsStarter, modelsSteps),
  steps: modelsSteps,
  wrapUp: {
    title: 'What you built',
    copy: 'You loaded a model resource, placed model instances in the scene, transformed them, and reused the same asset.',
    concepts: [
      'ModelAsset loads a model resource and is invisible on its own.',
      'ModelEntity is the visible instance; model="id" links it to the asset.',
      'One ModelAsset can back many ModelEntity instances.',
      'ModelAsset goes inside <Reality>; ModelEntity goes inside the scene root.',
      'Standalone <Model> is best for a simple single-asset display.',
    ],
  },
  next: { title: 'Attach 2D UI to a 3D entity' },
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Lesson 6.5 — Attach 2D UI with AttachmentAsset and AttachmentEntity     */
/* ────────────────────────────────────────────────────────────────────── */

const attachStarter = `import { useState } from 'react'
import {
  Reality,
  SceneGraph,
  Entity,
  UnlitMaterial,
  BoxEntity,
} from '@webspatial/react-sdk'

export default function Attachments() {
  const [selected, setSelected] = useState(false)

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
      <Reality
        style={{
          width: 360,
          height: 320,
          borderRadius: 20,
          '--xr-depth': '240px',
          background: 'linear-gradient(135deg, rgba(20,184,166,0.10), rgba(124,58,237,0.06))',
          border: '1px solid rgba(20,184,166,0.25)',
        }}
      >
        <UnlitMaterial id="teal" color="#14b8a6" />
        {/* attachment assets go here */}
        <SceneGraph>
          {/* the object that will get a label */}
          <BoxEntity
            materials={['teal']}
            width={0.18}
            height={0.18}
            depth={0.18}
            cornerRadius={0.02}
            position={{ x: 0, y: 0, z: 0.1 }}
          />
          {/* attachment entities go here */}
        </SceneGraph>
      </Reality>
    </div>
  )
}`

const attachSteps: TutorialStep[] = [
  {
    id: 'find-object',
    title: 'Start with a 3D object that needs a label',
    explanation:
      'This scene already has a 3D object. Now you’ll add a small 2D label near it.',
    task: 'Find the BoxEntity that will become the attachment anchor.',
    anchors: ['the object that will get a label', '<BoxEntity'],
    validation: { type: 'manual' },
    completionMessage: 'This is the object your UI will attach to.',
  },
  {
    id: 'import',
    title: 'Import the attachment components',
    explanation:
      'AttachmentAsset declares the UI; AttachmentEntity places it in the scene.',
    task: 'Import AttachmentAsset and AttachmentEntity from the WebSpatial React SDK.',
    anchors: ['AttachmentAsset', 'AttachmentEntity'],
    validation: { type: 'containsAll', values: ['AttachmentAsset', 'AttachmentEntity'] },
    autoType: at('insertLineAfter', 'BoxEntity,', '  AttachmentAsset,\n  AttachmentEntity,'),
    completionMessage: 'You can now declare and place attachment UI.',
    notYet:
      'Not quite yet — import AttachmentAsset and AttachmentEntity, then try Next again.',
  },
  {
    id: 'declare-asset',
    title: 'Declare the attachment UI',
    explanation:
      'AttachmentAsset is the UI template. It does not appear until an AttachmentEntity references it.',
    task: 'Add an <AttachmentAsset name="info"> with a small card inside <Reality>, outside the scene root.',
    anchors: ['<AttachmentAsset', 'name='],
    validation: { type: 'containsAll', values: ['<AttachmentAsset', 'name='] },
    autoType: at(
      'replace',
      '        {/* attachment assets go here */}',
      `        <AttachmentAsset name="info">
          <div style={{ width: '100%', padding: 12, borderRadius: 12, color: '#ede9fe', background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(20,184,166,0.4)' }}>
            <strong>Product preview</strong>
            <p style={{ margin: '6px 0 0', fontSize: 12, opacity: 0.7 }}>Tap or inspect this object.</p>
          </div>
        </AttachmentAsset>`,
    ),
    completionMessage: 'You declared a reusable 2D UI template.',
    notYet:
      'Move this resource directly under <Reality>, outside the scene root, then try Next again.',
  },
  {
    id: 'place-entity',
    title: 'Place the attachment in the scene',
    explanation: 'AttachmentEntity creates the visible UI surface in the 3D scene.',
    task: 'Add an <AttachmentEntity> inside the scene root and point it to the attachment name.',
    anchors: ['<AttachmentEntity', 'attachment='],
    validation: { type: 'containsAll', values: ['<AttachmentEntity', 'attachment='] },
    autoType: at(
      'replace',
      '          {/* attachment entities go here */}',
      `          <AttachmentEntity
            attachment="info"
            position={[0, 0.2, 0]}
            size={{ width: 180, height: 110 }}
          />`,
    ),
    notYet:
      'The attachment names do not match yet. Make the asset name and the entity attachment use the same value, then try Next again.',
    completionMessage: 'The 2D panel now has a place in the 3D scene.',
  },
  {
    id: 'parent',
    title: 'Parent the attachment to a 3D object',
    explanation:
      'When an attachment is parented under an entity, it moves with that entity.',
    task: 'Wrap the BoxEntity and the AttachmentEntity in a parent <Entity> so the label follows the object.',
    anchors: ['<Entity', '<AttachmentEntity'],
    validation: { type: 'contains', value: '<Entity' },
    autoType: at(
      'replace',
      `          {/* the object that will get a label */}
          <BoxEntity
            materials={['teal']}
            width={0.18}
            height={0.18}
            depth={0.18}
            cornerRadius={0.02}
            position={{ x: 0, y: 0, z: 0.1 }}
          />
          <AttachmentEntity
            attachment="info"
            position={[0, 0.2, 0]}
            size={{ width: 180, height: 110 }}
          />`,
      `          {/* the box and its label share a parent, so the label follows it */}
          <Entity position={{ x: 0, y: 0, z: 0.1 }}>
            <BoxEntity
              materials={['teal']}
              width={0.18}
              height={0.18}
              depth={0.18}
              cornerRadius={0.02}
              position={{ x: 0, y: 0, z: 0 }}
            />
            <AttachmentEntity
              attachment="info"
              position={[0, 0.2, 0]}
              size={{ width: 180, height: 110 }}
            />
          </Entity>`,
    ),
    completionMessage: 'The label now follows the object.',
    notYet:
      'Not quite yet — wrap the box and attachment in a parent <Entity>, then try Next again.',
  },
  {
    id: 'state',
    title: 'Share React state with the attachment',
    explanation:
      'Attachment content is still React UI. It can share state with the parent component.',
    task: 'Add a button inside the AttachmentAsset that toggles React state with setSelected.',
    anchors: ['useState', 'onClick', 'setSelected'],
    validation: { type: 'containsAll', values: ['useState', 'onClick', 'setSelected'] },
    autoType: at(
      'insertLineAfter',
      '<p style={{ margin: \'6px 0 0\', fontSize: 12, opacity: 0.7 }}>Tap or inspect this object.</p>',
      `            <button onClick={() => setSelected((value) => !value)} style={{ marginTop: 10, padding: '4px 10px', borderRadius: 8, cursor: 'pointer', color: '#ede9fe', background: 'rgba(124,58,237,0.4)', border: '1px solid rgba(167,139,250,0.5)' }}>
              {selected ? 'Selected' : 'Select'}
            </button>`,
    ),
    fallbackNote:
      'The panel renders as a real React surface in a WebSpatial Runtime. The state wiring is plain React and works the same.',
    completionMessage: 'You attached interactive React UI to a 3D entity.',
    notYet:
      'Not quite yet — add a button that calls setSelected inside the AttachmentAsset, then try Next again.',
  },
  {
    id: 'reuse',
    title: 'Reuse one attachment asset',
    explanation:
      'One AttachmentAsset can render into multiple AttachmentEntity placements.',
    task: 'Add a second AttachmentEntity that uses the same attachment name.',
    anchors: ['<AttachmentEntity'],
    validation: { type: 'manual' },
    autoType: at(
      'insertLineAfter',
      '</Entity>',
      `          <AttachmentEntity
            attachment="info"
            position={[0.22, -0.1, 0.1]}
            size={{ width: 150, height: 90 }}
          />`,
    ),
    completionMessage: 'You reused one UI template in multiple 3D positions.',
  },
]

const attachments: Lesson = {
  id: 'reality-attachments',
  chapter: '3D Content Containers: <Reality>',
  title: 'Attach 2D UI to a 3D entity',
  intro:
    'Use AttachmentAsset to define a small React UI panel, then use AttachmentEntity to place that panel inside the 3D scene.',
  learn: [
    'How AttachmentAsset declares what 2D UI should render',
    'How AttachmentEntity declares where that UI appears in the scene',
    'How the asset name must match the entity attachment reference',
    'How attachments are 2D React surfaces, not nested 3D scenes',
    'How attachment UI shares React state and one asset feeds many entities',
  ],
  fileName: 'Attachments.tsx',
  starterCode: attachStarter,
  finalCode: buildFinal(attachStarter, attachSteps),
  steps: attachSteps,
  wrapUp: {
    title: 'What you built',
    copy: 'You declared a React UI template with AttachmentAsset, placed it in the scene with AttachmentEntity, parented it to a 3D object, and shared React state with the attached panel.',
    concepts: [
      'AttachmentAsset declares 2D React UI; it is invisible until referenced.',
      'AttachmentEntity places that UI in the scene; attachment must match the asset name.',
      'AttachmentAsset goes inside <Reality>; AttachmentEntity goes inside the scene root.',
      'Attachments are 2D React surfaces and can share state with the parent component.',
      'One AttachmentAsset can feed many AttachmentEntity placements.',
    ],
  },
  next: { title: 'What you built' },
}

/* ────────────────────────────────────────────────────────────────────── */
/*  The chapter                                                             */
/* ────────────────────────────────────────────────────────────────────── */

export const realityChapter: LessonChapter = {
  id: 'reality',
  chapter: '3D Content Containers: <Reality>',
  overview: {
    title: '3D Content Containers: <Reality>',
    subtitle: 'Build programmable 3D content inside a normal web layout.',
    mentalModel:
      '<Model> drops one prebuilt 3D asset into the page. <Reality> is a local 3D scene where you place primitives, materials, textures, model instances, and attached 2D UI.',
    copy: 'Reality is WebSpatial’s programmable 3D container. In this chapter, you’ll build a small scene, place entities in 3D coordinates, apply materials and textures, load model assets, and attach 2D React UI to 3D objects.',
    cards: [
      {
        title: 'Build your first Reality scene',
        description:
          'Turn a rectangular area into a local 3D scene with a scene root and one primitive.',
        estTime: '4–6 min',
      },
      {
        title: 'Place entities in 3D space',
        description: 'Move, rotate, scale, and group entities with 3D transform props.',
        estTime: '5–7 min',
      },
      {
        title: 'Apply materials and textures',
        description: 'Declare material and texture resources and reference them by id.',
        estTime: '5–7 min',
      },
      {
        title: 'Load models with ModelAsset and ModelEntity',
        description: 'Load a model once, then place and reuse instances in the scene.',
        estTime: '5–7 min',
      },
      {
        title: 'Attach 2D UI with AttachmentAsset and AttachmentEntity',
        description: 'Declare a React UI panel and place it on a 3D object.',
        estTime: '6–7 min',
      },
    ],
  },
  lessons: [firstScene, transforms, materials, models, attachments],
  wrapUp: {
    title: 'What you built',
    copy: 'You created a Reality scene, placed primitive entities in 3D space, applied materials and textures, loaded model assets, and attached 2D React UI to 3D objects.',
    concepts: [
      '<Reality> is a programmable 3D container.',
      'The scene root contains visible 3D entities.',
      'Materials, textures, model assets, and attachment assets are declared directly inside <Reality>.',
      'Entities use position, rotation, and scale instead of CSS layout.',
      'Materials and textures are referenced by id.',
      'ModelAsset loads a model resource; ModelEntity places an instance of it.',
      'AttachmentAsset defines a 2D UI template; AttachmentEntity places it in the scene.',
      'Standalone <Model> is best for simple single-asset display; <Reality> is best for a programmable scene.',
    ],
    nextStory: { title: 'Dynamic 3D Containers: Animation', note: 'Story 7' },
  },
}
