/**
 * Data-driven WebSpatial tutorial schema.
 *
 * Learn Mode renders entirely from this data so future chapters can reuse the
 * exact same shell, editor and preview. A lesson is a short, Apple-style guided
 * flow: a "what you'll build" intro, a handful of one-job steps, and a calm
 * wrap-up. Each step points at the precise code it teaches and validates the
 * user's edit with the lightest possible check.
 */

/** How a step decides the user is ready to move on. */
export type Validation =
  | { type: 'manual' }
  | { type: 'contains'; value: string }
  | { type: 'sliderChanged' }

export interface TutorialStep {
  id: string
  /** One short lesson-step title, e.g. "Mark the element as spatial". */
  title: string
  /** Calm explanation — kept under two sentences. */
  explanation: string
  /** One concrete thing to do. */
  task: string
  /**
   * Substrings of code lines to spotlight in the editor for this step. Every
   * line that contains any anchor is highlighted; anchors that don't yet exist
   * (because the user hasn't typed them) simply highlight nothing.
   */
  anchors?: string[]
  validation: Validation
  hint?: string
  /** Optional, low-key "try this" prompt. */
  experiment?: string
  /** Shown briefly once the step's edit is detected. */
  completionMessage?: string
  /** Gentle copy shown when a `contains` check hasn't passed yet. */
  notYet?: string
}

/** A future lesson surfaced as "coming next" — present but never distracting. */
export interface LockedLesson {
  title: string
  note?: string
}

export interface Lesson {
  id: string
  /** Docs-aligned chapter title — the WebSpatial concept, not a demo name. */
  chapter: string
  /** The lesson's own title. */
  title: string
  /** Short "what you'll build" line. */
  intro: string
  /** A few "what you'll learn" bullets. */
  learn: string[]
  fileName: string
  /** The step-1 baseline the editor seeds from. */
  starterCode: string
  /** The completed lesson, used by "Copy final code". */
  finalCode: string
  steps: TutorialStep[]
  wrapUp: {
    title: string
    copy: string
    concepts: string[]
  }
  /** The next lesson, shown disabled / "coming next". */
  next?: LockedLesson
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Chapter: Spatialized HTML Elements · Lesson 1                          */
/* ────────────────────────────────────────────────────────────────────── */

const starterCode = `import { useState } from 'react'

export default function FloatingCard() {
  const [back, setBack] = useState(80)

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%', perspective: 900 }}>
      {/* the card */}
      <div
        style={{
          width: 280,
          padding: 28,
          borderRadius: 22,
          color: '#ede9fe',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.30), rgba(217,70,239,0.10))',
          border: '1px solid rgba(139,92,246,0.45)',
          boxShadow: '0 24px 60px rgba(124,58,237,0.35)',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>A normal card</h2>
        <p style={{ fontSize: 13, opacity: 0.7, margin: '10px 0 18px' }}>
          Regular HTML, CSS, and React. Depth: {back}
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
}`

const finalCode = `import { useState } from 'react'

// 'enable-xr' marks an ordinary element for spatialization.
// On a headset it lifts off the page; in a browser it stays flat.
export default function FloatingCard() {
  const [back, setBack] = useState(80)

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%', perspective: 900 }}>
      {/* the card */}
      <div
        enable-xr
        style={{
          '--xr-back': back + 'px',
          '--xr-background-material': 'translucent',
          width: 280,
          padding: 28,
          borderRadius: 22,
          color: '#ede9fe',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.30), rgba(217,70,239,0.10))',
          border: '1px solid rgba(139,92,246,0.45)',
          boxShadow: '0 24px 60px rgba(124,58,237,0.35)',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>I'm floating ✨</h2>
        <p style={{ fontSize: 13, opacity: 0.7, margin: '10px 0 18px' }}>
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
}`

export const liftCardLesson: Lesson = {
  id: 'lift-card',
  chapter: 'Spatialized HTML Elements',
  title: 'Lift a normal card into space',
  intro:
    'Start with a regular React card, then make it spatial with one attribute and a few WebSpatial CSS properties.',
  learn: [
    'How a normal HTML element becomes spatial',
    'How enable-xr marks an element for WebSpatial',
    'How --xr-back moves an element away from the page plane',
    'How --xr-background-material gives the card a spatial material',
    'How React state can control spatial position live',
  ],
  fileName: 'FloatingCard.tsx',
  starterCode,
  finalCode,
  steps: [
    {
      id: 'normal-html',
      title: 'Start with normal HTML',
      explanation: 'This starts as a normal card. It still uses regular HTML, CSS, and React.',
      task: 'Look at the card element in the editor.',
      anchors: ['the card', 'width: 280'],
      validation: { type: 'manual' },
      completionMessage: 'This is the baseline: a regular web card.',
    },
    {
      id: 'enable-xr',
      title: 'Mark the element as spatial',
      explanation:
        'enable-xr marks this element so WebSpatial can lift it into space when the runtime is available. In a normal browser, it still behaves like regular HTML.',
      task: 'Add enable-xr to the card element.',
      anchors: ['the card', 'enable-xr'],
      validation: { type: 'contains', value: 'enable-xr' },
      hint: 'Add enable-xr to the same <div> that styles the card.',
      completionMessage: 'Good — this card can now become spatial.',
      notYet: 'Not quite yet — add enable-xr to the card <div>, then try Next again.',
    },
    {
      id: 'xr-back',
      title: 'Move it on the Z axis',
      explanation: '--xr-back moves the spatialized element away from the page plane.',
      task: "Set --xr-back to 80px inside the card's style object.",
      anchors: ['width: 280', '--xr-back'],
      validation: { type: 'contains', value: '--xr-back' },
      hint: "Add --xr-back inside the card's style object.",
      experiment: 'Try 40px, then 120px, and watch how the preview changes.',
      completionMessage: 'Now the card has depth.',
      notYet: "Not quite yet — add '--xr-back': back + 'px' to the style object, then try Next again.",
    },
    {
      id: 'xr-material',
      title: 'Add a material background',
      explanation:
        'Material backgrounds let the card use a native-feeling spatial surface when WebSpatial is available.',
      task: 'Set --xr-background-material to translucent.',
      anchors: ['--xr-back', '--xr-background-material'],
      validation: { type: 'contains', value: '--xr-background-material' },
      hint: 'Place this next to --xr-back in the style object.',
      completionMessage: 'The card now has a spatial backplate.',
      notYet:
        "Not quite yet — add '--xr-background-material': 'translucent' to the style object, then try Next again.",
    },
    {
      id: 'interactive',
      title: 'Make depth interactive',
      explanation:
        'React state updates the CSS variable, and the preview updates live as you drag.',
      task: "Bind --xr-back to back + 'px', then drag the slider and watch the card move.",
      anchors: ['useState(80)', '--xr-back', 'type="range"'],
      validation: { type: 'sliderChanged' },
      hint: 'The slider changes React state. That state becomes the value of --xr-back.',
      completionMessage:
        'You just made a normal React card spatial, moved it in depth, added a material, and controlled it with state.',
    },
  ],
  wrapUp: {
    title: 'What you built',
    copy: 'You started with a normal React card. Then you marked it as spatial, moved it away from the page plane, added a material background, and connected depth to React state.',
    concepts: [
      'enable-xr marks an element for WebSpatial.',
      '--xr-back controls depth.',
      '--xr-background-material controls the spatial surface.',
      'React state can drive spatial properties live.',
    ],
  },
  next: {
    title: 'CSS API: Spatial Transform',
    note: 'coming next',
  },
}

/** Future chapters, listed quietly so the path ahead is visible but not noisy. */
export const upcomingLessons: LockedLesson[] = [
  { title: 'CSS API: Spatial Transform', note: 'coming next' },
  { title: 'CSS API: background-material', note: 'locked' },
  { title: 'Natural Interactions', note: 'locked' },
  { title: '3D Content Containers: <Model>', note: 'locked' },
  { title: '3D Content Containers: <Reality>', note: 'locked' },
]
