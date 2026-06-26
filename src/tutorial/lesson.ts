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
  /** Satisfied only when the code contains *every* listed substring. */
  | { type: 'containsAll'; values: string[] }
  | { type: 'sliderChanged' }

/**
 * A "do it for me" instruction: the exact edit a step is asking for, expressed
 * as a single change so Learn Mode can *type it in for you* — character by
 * character. Every guided step carries one, so the user can always hand the
 * edit to the tutorial instead of typing it themselves. Three shapes cover
 * every step:
 *  - `insertLineAfter` adds a whole new line (its own indentation included)
 *    right after the first line that matches `anchor`.
 *  - `insertBefore` splices `text` in-line, right before the first occurrence of
 *    `anchor` — used to grow an existing string (e.g. a transform list).
 *  - `replace` swaps the first occurrence of `anchor` for `text` — used to
 *    change an existing value or trade a placeholder block for real content.
 */
export type AutoType =
  | { mode: 'insertLineAfter'; anchor: string; text: string }
  | { mode: 'insertBefore'; anchor: string; text: string }
  | { mode: 'replace'; anchor: string; text: string }

/**
 * Resolve an {@link AutoType} against the current code into a concrete edit:
 * the character offset to type at, the exact text to type, and how many
 * existing characters to remove there first (`removeLen`, for `replace`).
 * Returns `null` when the anchor isn't present (the edit can't be placed yet),
 * so callers can fall back gracefully.
 */
export function resolveAutoType(
  code: string,
  a: AutoType,
): { at: number; text: string; removeLen: number } | null {
  if (a.mode === 'replace') {
    const idx = code.indexOf(a.anchor)
    return idx === -1 ? null : { at: idx, text: a.text, removeLen: a.anchor.length }
  }
  if (a.mode === 'insertBefore') {
    const idx = code.indexOf(a.anchor)
    return idx === -1 ? null : { at: idx, text: a.text, removeLen: 0 }
  }
  // insertLineAfter — prefer an exact (trimmed) line match, else the first line
  // that merely contains the anchor, so anchors stay forgiving.
  const lines = code.split('\n')
  let lineIdx = lines.findIndex((l) => l.trim() === a.anchor)
  if (lineIdx === -1) lineIdx = lines.findIndex((l) => l.includes(a.anchor))
  if (lineIdx === -1) return null
  let at = 0
  for (let i = 0; i < lineIdx; i++) at += lines[i].length + 1 // + newline
  at += lines[lineIdx].length // end of the anchor line, before its newline
  return { at, text: '\n' + a.text, removeLen: 0 }
}

/**
 * Fold the "do it for me" edits of `steps[0..uptoIndex]` over `starter` to get
 * the *canonical* code for that point in a lesson — the exact state the tutorial
 * intends after that step, independent of anything the user typed or experimented
 * with. Steps whose anchor can't be placed are simply skipped, mirroring how the
 * live auto-typer resolves edits.
 */
export function deriveStepCode(
  starter: string,
  steps: TutorialStep[],
  uptoIndex: number,
): string {
  let code = starter
  for (let i = 0; i <= uptoIndex && i < steps.length; i++) {
    const a = steps[i].autoType
    if (!a) continue
    const target = resolveAutoType(code, a)
    if (!target) continue
    code = code.slice(0, target.at) + target.text + code.slice(target.at + target.removeLen)
  }
  return code
}

/**
 * Express the change from `current` to `target` as a single contiguous edit
 * (the same `{ at, text, removeLen }` shape the auto-typer consumes) by trimming
 * the shared prefix and suffix. This lets "do it for me" reconcile drifted code
 * to a step's canonical result — typing only the region that actually differs —
 * when the step's exact-string anchor no longer matches. Returns `null` when the
 * code already equals the target.
 */
export function diffEdit(
  current: string,
  target: string,
): { at: number; text: string; removeLen: number } | null {
  if (current === target) return null
  const max = Math.min(current.length, target.length)
  let p = 0
  while (p < max && current[p] === target[p]) p++
  let s = 0
  while (
    s < max - p &&
    current[current.length - 1 - s] === target[target.length - 1 - s]
  ) {
    s++
  }
  return {
    at: p,
    text: target.slice(p, target.length - s),
    removeLen: current.length - p - s,
  }
}

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
  /**
   * Optional honest note for gestures the desktop preview can't trigger. Shown
   * only outside a spatial runtime, so the lesson never blocks on a headset.
   */
  fallbackNote?: string
  /**
   * The "do it for me" edit. When present, the step offers to type the change
   * into the editor for the user. Pure-observation steps (just "look at this"
   * or drag a slider) omit it — there "do it for me" simply carries the step.
   */
  autoType?: AutoType
  /** Optional, low-key "try this" prompt. */
  experiment?: string
  /** Shown briefly once the step's edit is detected. */
  completionMessage?: string
  /** Gentle copy shown when a `contains` check hasn't passed yet. */
  notYet?: string
  /**
   * A terminal command this step is really about (e.g. `npm install …`). Shown
   * as a copyable mono chip. Used by setup-style lessons where the action is a
   * command, not only a file edit.
   */
  command?: string
  /** Equivalent commands for other package managers (pnpm / yarn). */
  altCommands?: string[]
}

/** A future lesson surfaced as "coming next" — present but never distracting. */
export interface LockedLesson {
  title: string
  note?: string
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Multi-lesson chapters                                                   */
/* ────────────────────────────────────────────────────────────────────── */

/*
 * Most chapters teach one concept in a single lesson. Some concepts are too big
 * for that — `<Reality>` is a whole programmable 3D system — so they're taught
 * as a *chapter of several short lessons*, Apple-tutorial style: a chapter
 * overview, a handful of focused lessons, then a chapter wrap-up. These types
 * describe that container; each inner lesson is an ordinary {@link Lesson}, so
 * the same shell, editor and preview drive it unchanged.
 */

/** One clickable lesson card on the chapter overview. */
export interface LessonCard {
  title: string
  /** One-sentence description. */
  description: string
  /** Rough effort, e.g. "3–5 min". */
  estTime: string
}

/** The calm chapter overview shown before the first lesson. */
export interface ChapterOverview {
  title: string
  subtitle: string
  /** A single sentence framing the whole chapter's mental model. */
  mentalModel: string
  /** Short paragraph describing what the chapter builds. */
  copy: string
  /** One card per lesson, in order. */
  cards: LessonCard[]
}

/** The chapter-level wrap-up after the final lesson. */
export interface ChapterWrapUp {
  title: string
  copy: string
  concepts: string[]
  /** The story this chapter leads into. */
  nextStory?: { title: string; note?: string }
}

/**
 * A chapter taught as several lessons: an overview, the ordered lessons, and a
 * chapter wrap-up. The lessons share one `chapter` name; the shell walks them in
 * sequence and only celebrates the chapter wrap once the last lesson is done.
 */
export interface LessonChapter {
  /** Stable key — reuses the matching snippet id. */
  id: string
  /** The docs-aligned concept name, shared by every inner lesson. */
  chapter: string
  overview: ChapterOverview
  lessons: Lesson[]
  wrapUp: ChapterWrapUp
}

/**
 * The display-only fields shared by every lesson kind — the guided code lessons
 * (Lesson), multi-lesson chapters, and the setup walkthrough (SetupLesson in
 * ./setup). The intro / step / wrap-up cards render from just these, so every
 * kind reuses the exact same Learn Mode chrome.
 */
export interface LessonMeta {
  /** Docs-aligned chapter title — the WebSpatial concept, not a demo name. */
  chapter: string
  /** The lesson's own title. */
  title: string
  /** Short "what you'll build" line. */
  intro: string
  /** A few "what you'll learn" bullets. */
  learn: string[]
  wrapUp: {
    title: string
    copy: string
    concepts: string[]
  }
  /** The next lesson, shown disabled / "coming next". */
  next?: LockedLesson
}

export interface Lesson extends LessonMeta {
  id: string
  fileName: string
  /** The step-1 baseline the editor seeds from. */
  starterCode: string
  /** The completed lesson, used by "Copy final code". */
  finalCode: string
  steps: TutorialStep[]
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
      autoType: { mode: 'insertLineAfter', anchor: '<div', text: '        enable-xr' },
      completionMessage: 'Good — this card can now become spatial.',
      notYet: 'Not quite yet — add enable-xr to the card <div>, then try Next again.',
    },
    {
      id: 'xr-back',
      title: 'Move it on the Z axis',
      explanation: '--xr-back moves the spatialized element away from the page plane.',
      task: "Add '--xr-back': back + 'px' to the card's style object. CSS custom properties are quoted string keys in JS.",
      anchors: ['width: 280', '--xr-back'],
      validation: { type: 'contains', value: "'--xr-back'" },
      autoType: { mode: 'insertLineAfter', anchor: 'style={{', text: "          '--xr-back': back + 'px'," },
      experiment: 'Try 40px, then 120px, and watch how the preview changes.',
      completionMessage: 'Now the card has depth.',
      notYet: "Not quite yet — add '--xr-back': back + 'px' to the style object, then try Next again.",
    },
    {
      id: 'xr-material',
      title: 'Add a material background',
      explanation:
        'Material backgrounds let the card use a native-feeling spatial surface when WebSpatial is available.',
      task: "Add '--xr-background-material': 'translucent' next to --xr-back. The key stays quoted, just like --xr-back.",
      anchors: ['--xr-back', '--xr-background-material'],
      validation: { type: 'contains', value: "'--xr-background-material'" },
      autoType: {
        mode: 'insertLineAfter',
        anchor: "'--xr-back'",
        text: "          '--xr-background-material': 'translucent',",
      },
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

/* ────────────────────────────────────────────────────────────────────── */
/*  Chapter: CSS API: Spatial Transform · Lesson 2                         */
/* ────────────────────────────────────────────────────────────────────── */

/*
 * Story 1 lifted the card away from the page. Story 2 turns and moves that same
 * spatial card using normal CSS `transform` syntax — no new `--xr-` property.
 * The starter is the completed card from Story 1 (enable-xr + --xr-back +
 * material); each step adds one transform idea to the very same style object.
 * This is the old "True 3D transform" demo, reframed as a guided lesson.
 */

const rotateStarterCode = `export default function SpatialCard() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%', perspective: 800 }}>
      {/* the spatial card — already lifted off the page in Story 1 */}
      <div
        enable-xr
        style={{
          '--xr-back': '60px',
          '--xr-background-material': 'translucent',
          width: 240,
          padding: 26,
          borderRadius: 20,
          color: '#ede9fe',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.30), rgba(217,70,239,0.10))',
          border: '1px solid rgba(139,92,246,0.45)',
          boxShadow: '0 24px 60px rgba(124,58,237,0.35)',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Spatial card</h2>
        <p style={{ fontSize: 13, opacity: 0.7, margin: '10px 0 0' }}>
          Lifted off the page with --xr-back. Now turn it in space.
        </p>
      </div>
    </div>
  )
}`

const rotateFinalCode = `export default function SpatialCard() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%', perspective: 800 }}>
      {/* the spatial card — already lifted off the page in Story 1 */}
      <div
        enable-xr
        style={{
          '--xr-back': '60px',
          '--xr-background-material': 'translucent',
          // Spatial Transform: plain CSS transform syntax, no --xr- prefix.
          transform: 'translateZ(40px) rotateX(8deg) rotateY(-14deg)',
          transformOrigin: 'center center',
          width: 240,
          padding: 26,
          borderRadius: 20,
          color: '#ede9fe',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.30), rgba(217,70,239,0.10))',
          border: '1px solid rgba(139,92,246,0.45)',
          boxShadow: '0 24px 60px rgba(124,58,237,0.35)',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Spatial card</h2>
        <p style={{ fontSize: 13, opacity: 0.7, margin: '10px 0 0' }}>
          Turned in true 3D with a normal CSS transform.
        </p>
      </div>
    </div>
  )
}`

export const rotateCardLesson: Lesson = {
  id: 'rotate-card',
  chapter: 'CSS API: Spatial Transform',
  title: 'Rotate a spatial card in true 3D',
  intro:
    'Now that the card can float in space, rotate it with standard CSS transform syntax.',
  learn: [
    'How Spatial Transform builds on enable-xr',
    'How rotateY() turns a spatialized element',
    'How rotateX() tilts a spatialized element',
    'How transform-origin changes the pivot',
    'How translateZ() differs from --xr-back',
  ],
  fileName: 'SpatialCard.tsx',
  starterCode: rotateStarterCode,
  finalCode: rotateFinalCode,
  steps: [
    {
      id: 'start-spatial',
      title: 'Start from a spatial card',
      explanation:
        'This card is already spatial. Now you’ll use normal CSS transform to rotate it in space.',
      task: 'Find the card’s style object in the editor.',
      anchors: ['the spatial card', 'enable-xr', '--xr-back'],
      validation: { type: 'manual' },
      completionMessage: 'This is your starting point: a spatial card ready for transform.',
    },
    {
      id: 'rotate-y',
      title: 'Rotate around the Y axis',
      explanation: 'rotateY() turns the card left or right around its vertical axis.',
      task: "Add rotateY(-14deg) to the card’s transform.",
      anchors: ['--xr-background-material', 'transform:'],
      validation: { type: 'contains', value: 'rotateY' },
      autoType: {
        mode: 'insertLineAfter',
        anchor: "'--xr-background-material'",
        text: "          transform: 'rotateY(-14deg)',",
      },
      experiment: 'Try rotateY(14deg), then rotateY(-24deg).',
      completionMessage: 'The card now turns in true 3D.',
      notYet: 'Not quite yet — add rotateY() to the card’s transform, then try Next again.',
    },
    {
      id: 'rotate-x',
      title: 'Tilt around the X axis',
      explanation:
        'rotateX() tilts the card forward or backward around its horizontal axis.',
      task: 'Add rotateX(8deg) before or after the Y rotation.',
      anchors: ['transform:'],
      validation: { type: 'contains', value: 'rotateX' },
      autoType: { mode: 'insertBefore', anchor: 'rotateY(', text: 'rotateX(8deg) ' },
      experiment: 'Try a small value first. Large rotations can make UI harder to read.',
      completionMessage: 'Now the card has a more natural spatial angle.',
      notYet: 'Not quite yet — add rotateX() to the same transform string, then try Next again.',
    },
    {
      id: 'transform-origin',
      title: 'Change the pivot with transform-origin',
      explanation: 'transform-origin controls the point the card rotates around.',
      task: "Set transformOrigin to 'center center'.",
      anchors: ['transform:', 'transformOrigin'],
      validation: { type: 'contains', value: 'transformOrigin' },
      autoType: {
        mode: 'insertLineAfter',
        anchor: 'transform:',
        text: "          transformOrigin: 'center center',",
      },
      experiment: 'Try top left, then return to center center.',
      completionMessage: 'The card now rotates around a clear pivot.',
      notYet:
        "Not quite yet — add transformOrigin: 'center center' next to transform, then try Next again.",
    },
    {
      id: 'translate-z',
      title: 'Compare --xr-back and translateZ()',
      explanation:
        '--xr-back positions the spatial element along Z. translateZ() visually shifts it from that position as part of the transform.',
      task: 'Add translateZ(40px) to the transform and compare it with --xr-back.',
      anchors: ['--xr-back', 'transform:'],
      validation: { type: 'contains', value: 'translateZ' },
      autoType: { mode: 'insertBefore', anchor: 'rotateX(', text: 'translateZ(40px) ' },
      experiment: 'Try translateZ(-20px) and notice how it differs from changing --xr-back.',
      completionMessage:
        'You used normal CSS transform syntax to move and rotate a spatialized element.',
      notYet:
        'Not quite yet — add translateZ() inside the transform string, then try Next again.',
    },
  ],
  wrapUp: {
    title: 'What you built',
    copy: 'You started with a spatial card, then rotated it around the X and Y axes, changed its pivot, and compared layout depth with visual transform depth.',
    concepts: [
      'Spatial Transform uses normal CSS transform.',
      'rotateX() and rotateY() rotate a spatialized element in true 3D.',
      'transform-origin controls the pivot.',
      '--xr-back positions the element on the Z axis.',
      'translateZ() visually shifts the element as part of its transform.',
      'Spatial Transform changes appearance, not the element’s normal layout bounds.',
    ],
  },
  next: {
    title: 'CSS API: background-material',
    note: 'coming next',
  },
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Chapter: CSS API: background-material · Lesson 3                        */
/* ────────────────────────────────────────────────────────────────────── */

/*
 * Story 1 made the card spatial; Story 2 rotated it in space. Story 3 changes
 * the *surface behind* the card so it feels native to spatial computing. This is
 * the old "Background materials" demo, reframed as a guided lesson: the user
 * starts from a spatial card painted with a flat CSS color, adds a translucent
 * material backplate, makes the painted layer transparent enough to reveal it,
 * shapes it with radius + border, then compares `transparent` vs `translucent`.
 *
 * The starter deliberately omits `--xr-background-material` (unlike Stories 1–2)
 * because adding it is the whole point of this chapter.
 */

const materialStarterCode = `export default function MaterialCard() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%', perspective: 800 }}>
      {/* a spatial card painted with a flat, opaque CSS background */}
      <div
        enable-xr
        style={{
          '--xr-back': '60px',
          width: 260,
          padding: 26,
          borderRadius: 12,
          color: '#ede9fe',
          background: '#241a3d',
          boxShadow: '0 24px 60px rgba(124,58,237,0.35)',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Spatial card</h2>
        <p style={{ fontSize: 13, opacity: 0.7, margin: '10px 0 0' }}>
          Painted with a flat CSS color. Give it a material next.
        </p>
      </div>
    </div>
  )
}`

const materialFinalCode = `export default function MaterialCard() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%', perspective: 800 }}>
      {/* a spatial card resting on a translucent material backplate */}
      <div
        enable-xr
        style={{
          '--xr-back': '60px',
          // Use a real-time material backplate instead of a flat painted color.
          '--xr-background-material': 'translucent',
          width: 260,
          padding: 26,
          borderRadius: 22,
          color: '#ede9fe',
          // Low alpha so the material shows through the painted layer.
          background: 'rgba(30, 20, 60, 0.18)',
          border: '1px solid rgba(139, 92, 246, 0.45)',
          boxShadow: '0 24px 60px rgba(124,58,237,0.35)',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Spatial card</h2>
        <p style={{ fontSize: 13, opacity: 0.7, margin: '10px 0 0' }}>
          Resting on a translucent material instead of a flat color.
        </p>
      </div>
    </div>
  )
}`

export const materialCardLesson: Lesson = {
  id: 'material-card',
  chapter: 'CSS API: background-material',
  title: 'Give a spatial card a native-feeling material',
  intro:
    'Now that the card floats in space, give it a material surface instead of a flat painted background.',
  learn: [
    'How --xr-background-material changes a spatialized element’s surface',
    'How translucent creates a material backplate',
    'Why transparent CSS backgrounds matter',
    'How border radius and borders shape the material',
    'How to keep floating UI readable',
  ],
  fileName: 'MaterialCard.tsx',
  starterCode: materialStarterCode,
  finalCode: materialFinalCode,
  steps: [
    {
      id: 'baseline',
      title: 'Start from a spatial card',
      explanation: 'This card is already spatial. Now you’ll change the surface behind it.',
      task: 'Find the card’s background styles in the editor.',
      anchors: ['painted with a flat', 'background:'],
      validation: { type: 'manual' },
      completionMessage: 'This is the baseline: a spatial card with a regular CSS background.',
    },
    {
      id: 'add-material',
      title: 'Add a translucent material',
      explanation:
        'translucent adds a real-time material backplate when WebSpatial is available.',
      task: "Add '--xr-background-material': 'translucent' to the card style.",
      anchors: ['--xr-back', '--xr-background-material'],
      validation: { type: 'contains', value: '--xr-background-material' },
      autoType: {
        mode: 'insertLineAfter',
        anchor: "'--xr-back'",
        text: "          '--xr-background-material': 'translucent',",
      },
      experiment: 'Try turning the property off and on to compare the difference.',
      completionMessage: 'The card now has a material backplate.',
      notYet:
        "Not quite yet — add '--xr-background-material': 'translucent' to the card’s style object, then try Next again.",
    },
    {
      id: 'transparent-bg',
      title: 'Make the CSS background transparent enough',
      explanation:
        'An opaque CSS background can cover the material. Make the painted layer transparent so the material remains visible.',
      task: "Change the card’s background to a low-alpha color, e.g. 'rgba(30, 20, 60, 0.18)'.",
      anchors: ['background:'],
      validation: { type: 'manual' },
      autoType: {
        mode: 'replace',
        anchor: "background: '#241a3d',",
        text: "background: 'rgba(30, 20, 60, 0.18)',",
      },
      experiment: 'Try alpha values like 0.1, 0.3, and 0.6.',
      completionMessage: 'Now the material can actually be seen.',
    },
    {
      id: 'shape-material',
      title: 'Shape the material with radius and border',
      explanation:
        'Radius and borders help the material read as a real surface instead of a flat rectangle.',
      task: "Raise borderRadius and add a subtle border, e.g. border: '1px solid rgba(139, 92, 246, 0.45)'.",
      anchors: ['borderRadius', 'border:'],
      validation: { type: 'contains', value: 'border:' },
      autoType: {
        mode: 'insertLineAfter',
        anchor: 'background:',
        text: "          border: '1px solid rgba(139, 92, 246, 0.45)',",
      },
      experiment: 'Try a smaller radius, then a larger one, and compare how the panel feels.',
      completionMessage: 'The material now has a clear shape.',
      notYet:
        "Not quite yet — add a border to the card’s style object (and raise borderRadius), then try Next again.",
    },
    {
      id: 'compare',
      title: 'Compare transparent and translucent',
      explanation:
        'transparent removes the material surface. translucent gives the element a material backplate.',
      task: "Switch '--xr-background-material' between 'transparent' and 'translucent' to feel the difference.",
      anchors: ['--xr-background-material'],
      validation: { type: 'manual' },
      completionMessage:
        'You compared a frameless spatial element with one that has a material surface.',
    },
  ],
  wrapUp: {
    title: 'What you built',
    copy: 'You started with a spatial card, added a material backplate, made the CSS background transparent enough to reveal it, and shaped the surface with radius and border.',
    concepts: [
      '--xr-background-material controls the spatial surface.',
      'translucent adds a material backplate.',
      'transparent removes the surface effect.',
      'Opaque CSS backgrounds can hide the material.',
      'Border radius and borders help floating UI feel intentional.',
      'Materials are useful when spatial UI needs readability and separation.',
    ],
  },
  next: {
    title: 'Natural Interactions',
    note: 'coming next',
  },
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Chapter: Natural Interactions · Lesson 4                                */
/* ────────────────────────────────────────────────────────────────────── */

/*
 * Stories 1–3 made a floating card visible and readable in space. Story 4 makes
 * that same card feel touchable. This is the old "Spatial gestures" demo,
 * reframed as a guided lesson: the user starts from a spatial card with a status
 * label, keeps normal web click working, then layers on spatial tap, drag, and
 * finally rotate + magnify — one gesture family per step, feedback first.
 *
 * Event names and payload fields are taken verbatim from the WebSpatial SDK and
 * the existing demo: onSpatialTap, onSpatialDrag(e.translationX/Y),
 * onSpatialRotate, onSpatialMagnify(e.magnification). Nothing is invented. This
 * lesson teaches interaction only — no <Model>, <Reality>, or 3D scenes.
 */

const gestureStarterCode = `import { useState } from 'react'

export default function GestureCard() {
  // The status label reflects the most recent interaction.
  const [status, setStatus] = useState('Ready')

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%', perspective: 800 }}>
      {/* the spatial card — already lifted, materialized and readable in Stories 1–3 */}
      <div
        enable-xr
        style={{
          '--xr-back': '60px',
          '--xr-background-material': 'translucent',
          width: 240,
          padding: 26,
          borderRadius: 22,
          color: '#ede9fe',
          textAlign: 'center',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.22), rgba(217,70,239,0.08))',
          border: '1px solid rgba(139,92,246,0.45)',
          boxShadow: '0 24px 60px rgba(124,58,237,0.35)',
        }}
      >
        <div style={{ fontSize: 30 }}>🤏</div>
        <h2 style={{ margin: '8px 0 0', fontSize: 17, fontWeight: 700 }}>Touch me</h2>
        {/* the status label — interaction feedback appears here */}
        <p style={{ fontFamily: 'monospace', fontSize: 12, opacity: 0.75, margin: '10px 0 0' }}>
          {status}
        </p>
      </div>
    </div>
  )
}`

const gestureFinalCode = `import { useState } from 'react'

export default function GestureCard() {
  // The status label reflects the most recent interaction.
  const [status, setStatus] = useState('Ready')

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%', perspective: 800 }}>
      {/* the spatial card — already lifted, materialized and readable in Stories 1–3 */}
      <div
        enable-xr
        // Normal web click still works — keeps the card useful in any browser.
        onClick={() => setStatus('Clicked')}
        // Spatial tap: the gesture-native way to select a spatial element.
        onSpatialTap={() => setStatus('Spatial tap')}
        // Spatial drag streams a translation (px) from where the drag began.
        onSpatialDragStart={() => setStatus('Drag started')}
        onSpatialDrag={(e) => setStatus('Dragging ' + Math.round(e.translationX) + ', ' + Math.round(e.translationY))}
        onSpatialDragEnd={() => setStatus('Drag ended')}
        // Rotate and magnify: turning and resizing gestures.
        onSpatialRotate={() => setStatus('Rotating')}
        onSpatialRotateEnd={() => setStatus('Rotate ended')}
        onSpatialMagnify={(e) => setStatus('Magnify ' + Math.round(e.magnification * 100) + '%')}
        onSpatialMagnifyEnd={() => setStatus('Magnify ended')}
        style={{
          '--xr-back': '60px',
          '--xr-background-material': 'translucent',
          width: 240,
          padding: 26,
          borderRadius: 22,
          color: '#ede9fe',
          textAlign: 'center',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.22), rgba(217,70,239,0.08))',
          border: '1px solid rgba(139,92,246,0.45)',
          boxShadow: '0 24px 60px rgba(124,58,237,0.35)',
        }}
      >
        <div style={{ fontSize: 30 }}>🤏</div>
        <h2 style={{ margin: '8px 0 0', fontSize: 17, fontWeight: 700 }}>Touch me</h2>
        {/* the status label — interaction feedback appears here */}
        <p style={{ fontFamily: 'monospace', fontSize: 12, opacity: 0.75, margin: '10px 0 0' }}>
          {status}
        </p>
      </div>
    </div>
  )
}`

export const gestureCardLesson: Lesson = {
  id: 'gesture-card',
  chapter: 'Natural Interactions',
  title: 'Make a spatial card respond to gestures',
  intro:
    'Now that your card floats in space, make it respond when someone taps, drags, rotates, or magnifies it.',
  learn: [
    'How normal web interactions still work',
    'How spatial tap differs from a regular click',
    'How to listen for spatial drag',
    'How to expose rotate and magnify gestures',
    'How to show feedback without overwhelming the UI',
  ],
  fileName: 'GestureCard.tsx',
  starterCode: gestureStarterCode,
  finalCode: gestureFinalCode,
  steps: [
    {
      id: 'baseline',
      title: 'Start with a touchable spatial card',
      explanation:
        'This card is already spatial. Now you’ll make its interaction state visible.',
      task: 'Find the card element and the small status label in the editor.',
      anchors: ['enable-xr', 'const [status, setStatus]', '{status}'],
      validation: { type: 'manual' },
      completionMessage:
        'This is the baseline: a spatial card with a place to show interaction feedback.',
    },
    {
      id: 'web-click',
      title: 'Keep normal web interaction',
      explanation:
        'Natural interaction still respects normal web patterns. A spatial element can remain a regular clickable React element.',
      task: "Add a regular onClick handler that updates the status label, e.g. onClick={() => setStatus('Clicked')}.",
      anchors: ['enable-xr', 'onClick'],
      validation: { type: 'contains', value: 'onClick' },
      autoType: {
        mode: 'insertLineAfter',
        anchor: 'enable-xr',
        text: "        onClick={() => setStatus('Clicked')}",
      },
      experiment: 'Change the status text and click again.',
      completionMessage: 'Good — the card still works like normal web UI.',
      notYet:
        'Not quite yet — add an onClick handler to the spatial card, then try Next again.',
    },
    {
      id: 'spatial-tap',
      title: 'Add spatial tap',
      explanation:
        'Spatial tap is the gesture-specific version of selecting a spatial element.',
      task: "Add a spatial tap handler to the card, e.g. onSpatialTap={() => setStatus('Spatial tap')}.",
      anchors: ['onClick', 'onSpatialTap'],
      validation: { type: 'contains', value: 'onSpatialTap' },
      autoType: {
        mode: 'insertLineAfter',
        anchor: 'onClick',
        text: "        onSpatialTap={() => setStatus('Spatial tap')}",
      },
      experiment:
        'Keep both onClick and onSpatialTap so the example works in browser fallback and spatial runtime.',
      fallbackNote:
        'This gesture runs in a supported spatial runtime. You can still review the handler here, then continue.',
      completionMessage: 'The card now listens for spatial tap.',
      notYet:
        'Not quite yet — add onSpatialTap to the spatial card, then try Next again.',
    },
    {
      id: 'spatial-drag',
      title: 'Add spatial drag feedback',
      explanation:
        'Spatial drag lets a user hold and move a spatial element instead of only selecting it.',
      task: 'Add onSpatialDragStart, onSpatialDrag, and onSpatialDragEnd handlers that update the status label. The drag event exposes e.translationX and e.translationY.',
      anchors: ['onSpatialDragStart', 'onSpatialDrag', 'onSpatialDragEnd'],
      validation: { type: 'contains', value: 'onSpatialDrag' },
      autoType: {
        mode: 'insertLineAfter',
        anchor: 'onSpatialTap',
        text:
          "        onSpatialDragStart={() => setStatus('Drag started')}\n" +
          "        onSpatialDrag={(e) => setStatus('Dragging ' + Math.round(e.translationX) + ', ' + Math.round(e.translationY))}\n" +
          "        onSpatialDragEnd={() => setStatus('Drag ended')}",
      },
      experiment: 'Show drag feedback in the card before trying to move the card itself.',
      fallbackNote:
        'This gesture runs in a supported spatial runtime. You can still review the handlers here, then continue.',
      completionMessage: 'The card now responds while it is being dragged.',
      notYet:
        'Not quite yet — add an onSpatialDrag handler to the spatial card, then try Next again.',
    },
    {
      id: 'rotate-magnify',
      title: 'Compare rotate and magnify',
      explanation:
        'Rotate and magnify are spatial gestures for turning and resizing content.',
      task: 'Add onSpatialRotate and onSpatialMagnify handlers that update the status label. The magnify event exposes e.magnification (1 = 100%).',
      anchors: ['onSpatialRotate', 'onSpatialMagnify'],
      validation: { type: 'containsAll', values: ['onSpatialRotate', 'onSpatialMagnify'] },
      autoType: {
        mode: 'insertLineAfter',
        anchor: 'onSpatialDragEnd',
        text:
          "        onSpatialRotate={() => setStatus('Rotating')}\n" +
          "        onSpatialRotateEnd={() => setStatus('Rotate ended')}\n" +
          "        onSpatialMagnify={(e) => setStatus('Magnify ' + Math.round(e.magnification * 100) + '%')}\n" +
          "        onSpatialMagnifyEnd={() => setStatus('Magnify ended')}",
      },
      fallbackNote:
        'Rotate and magnify run in a supported spatial runtime. Review the handlers here, then continue.',
      completionMessage:
        'You connected tap, drag, rotate, and magnify gestures to a spatial card.',
      notYet:
        'Not quite yet — add onSpatialRotate and onSpatialMagnify to the spatial card, then try Next again.',
    },
  ],
  wrapUp: {
    title: 'What you built',
    copy: 'You started with a spatial card, kept normal web click behavior, then added spatial tap, drag, rotate, and magnify feedback.',
    concepts: [
      'Natural interactions make spatial UI feel touchable.',
      'Normal web interactions still matter.',
      'onClick keeps the example useful in regular browsers.',
      'onSpatialTap handles spatial selection.',
      'onSpatialDrag handles movement-like interaction.',
      'onSpatialRotate and onSpatialMagnify handle turning and resizing.',
      'Gesture handlers should give clear visual feedback.',
    ],
  },
  next: {
    title: '3D Content Containers: <Model>',
    note: 'coming next',
  },
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Chapter: 3D Content Containers: <Model> · Lesson 5                      */
/* ────────────────────────────────────────────────────────────────────── */

/*
 * Stories 1–4 taught spatialized HTML: a normal element made spatial, rotated,
 * given a material, and made interactive. Story 5 introduces the first 3D
 * *content container* — <Model>, a normal-looking element in the page that can
 * hold a real, prebuilt 3D asset. This is the old "<Model> — 3D asset" demo,
 * reframed as a guided lesson.
 *
 * The arc mirrors that demo exactly — same import, same Apple Quick Look teapot
 * asset, same props (enable-xr, src, --xr-depth, --xr-background-material,
 * onLoad/onError) — but builds it one concept at a time: start from a 2D
 * placeholder, import <Model>, point src at the asset, mark it spatial, give it
 * local depth, then wire load/error feedback. It deliberately stops at static
 * model placement; <Reality> and programmable 3D come next.
 *
 * Every step auto-types ("Do it for me"): the import lands first, the next step
 * trades the placeholder block for a <Model>, and each later step anchors on
 * that typed-in shape (the <Model> tag, the src line) to grow it one prop at a
 * time — so the whole lesson can be completed entirely by the tutorial.
 */

// Preserve the exact asset the existing playground demo loads — a real,
// reachable Apple Quick Look sample, not an invented URL.
const MODEL_ASSET =
  "https://developer.apple.com/augmented-reality/quick-look/models/teapot/teapot.usdz"

const modelStarterCode = `import { useState } from 'react'

// The prebuilt 3D asset we'll place in the page (Apple Quick Look sample).
const TEAPOT = '${MODEL_ASSET}'

export default function ModelLesson() {
  const [status, setStatus] = useState('')

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
      <div style={{ textAlign: 'center', color: '#ede9fe' }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>A 3D model goes here</h2>
        <p style={{ fontSize: 13, opacity: 0.65, margin: '8px 0 18px' }}>
          A normal React layout. The model will live in the region below.
        </p>

        {/* placeholder — the 2D region where the <Model> will go */}
        <div
          style={{
            width: 320,
            height: 320,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 20,
            color: 'rgba(255,255,255,0.4)',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.10), rgba(124,58,237,0.06))',
            border: '1px dashed rgba(245,158,11,0.35)',
          }}
        >
          model placeholder
        </div>

        {status && (
          <p style={{ fontFamily: 'monospace', fontSize: 12, opacity: 0.7, margin: '14px 0 0' }}>
            {status}
          </p>
        )}
      </div>
    </div>
  )
}`

const modelFinalCode = `import { useState } from 'react'
import { Model } from '@webspatial/react-sdk'

// The prebuilt 3D asset we'll place in the page (Apple Quick Look sample).
const TEAPOT = '${MODEL_ASSET}'

export default function ModelLesson() {
  const [status, setStatus] = useState('')

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
      <div style={{ textAlign: 'center', color: '#ede9fe' }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>A 3D model in the page</h2>
        <p style={{ fontSize: 13, opacity: 0.65, margin: '8px 0 18px' }}>
          A normal React layout — with a real 3D model inside it.
        </p>

        {/* <Model> lays out as a 2D plane, but holds real volumetric 3D content.
            On a headset it renders in space; in a browser it falls back flat. */}
        <Model
          enable-xr
          src={TEAPOT}
          style={{
            width: 320,
            height: 320,
            borderRadius: 20,
            '--xr-depth': '160px',
            '--xr-background-material': 'translucent',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.10), rgba(124,58,237,0.06))',
            border: '1px solid rgba(245,158,11,0.25)',
          }}
          onLoad={() => setStatus('Model loaded')}
          onError={() => setStatus('Model failed to load')}
        />

        {status && (
          <p style={{ fontFamily: 'monospace', fontSize: 12, opacity: 0.7, margin: '14px 0 0' }}>
            {status}
          </p>
        )}
      </div>
    </div>
  )
}`

export const modelLesson: Lesson = {
  id: 'place-model',
  // Docs-aligned title — equals the matching snippet's title so chapters.ts
  // joins the guided lesson and the open demo into one concept.
  chapter: '3D Content Containers: <Model>',
  title: 'Place a 3D asset inside the page',
  intro:
    "Now that you can make HTML spatial, add a prebuilt 3D model with WebSpatial's <Model> component.",
  learn: [
    'How <Model> fits into normal React layout',
    'How src loads a model asset',
    'How enable-xr makes the model spatial',
    'How --xr-depth gives the model local 3D space',
    'How to keep browser fallback understandable',
  ],
  fileName: 'ModelLesson.tsx',
  starterCode: modelStarterCode,
  finalCode: modelFinalCode,
  steps: [
    {
      id: 'placeholder',
      title: 'Start with a model placeholder',
      explanation:
        'This starts as a normal React layout. The model will live inside one region of the page.',
      task: 'Find the placeholder where the 3D model should appear.',
      anchors: ['placeholder'],
      validation: { type: 'manual' },
      completionMessage: 'This is the 2D space where the model will go.',
    },
    {
      id: 'import-model',
      title: 'Import the <Model> component',
      explanation:
        "<Model> is WebSpatial's static 3D content container for prebuilt model files.",
      task: 'Import Model from the WebSpatial React SDK.',
      anchors: ["import { useState }", '@webspatial/react-sdk'],
      validation: { type: 'contains', value: '@webspatial/react-sdk' },
      autoType: {
        mode: 'insertLineAfter',
        anchor: "import { useState } from 'react'",
        text: "import { Model } from '@webspatial/react-sdk'",
      },
      completionMessage: 'You can now render a WebSpatial model container.',
      notYet:
        "Not quite yet — import { Model } from '@webspatial/react-sdk', then try Next again.",
    },
    {
      id: 'add-model',
      title: 'Add the model asset',
      explanation: 'src points to the prebuilt 3D asset the container should display.',
      task: 'Replace the placeholder with a <Model> and set its src to the asset.',
      anchors: ['placeholder', '<Model', 'src='],
      validation: { type: 'contains', value: 'src=' },
      autoType: {
        mode: 'replace',
        anchor: `        {/* placeholder — the 2D region where the <Model> will go */}
        <div
          style={{
            width: 320,
            height: 320,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 20,
            color: 'rgba(255,255,255,0.4)',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.10), rgba(124,58,237,0.06))',
            border: '1px dashed rgba(245,158,11,0.35)',
          }}
        >
          model placeholder
        </div>`,
        text: `        {/* <Model> holds real 3D content inside a normal React layout */}
        <Model
          src={TEAPOT}
        />`,
      },
      experiment: 'Try giving the <Model> a width and height and watch how the layout changes.',
      completionMessage: 'The page now contains a 3D model container.',
      notYet:
        'Not quite yet — replace the placeholder with <Model src={TEAPOT} />, then try Next again.',
    },
    {
      id: 'enable-xr',
      title: 'Make the model spatial',
      explanation:
        'enable-xr lets the model render as spatial content when the WebSpatial Runtime is available.',
      task: 'Add enable-xr to the <Model>.',
      anchors: ['<Model', 'enable-xr', 'src='],
      validation: { type: 'contains', value: 'enable-xr' },
      autoType: {
        mode: 'insertLineAfter',
        anchor: '<Model',
        text: '          enable-xr',
      },
      completionMessage: 'The model is now marked for spatial rendering.',
      notYet: 'Not quite yet — add enable-xr to the <Model>, then try Next again.',
    },
    {
      id: 'xr-depth',
      title: 'Give the model local depth',
      explanation:
        'Width and height define the 2D layout region. --xr-depth gives the model room to exist in 3D.',
      task: 'Add a style with width, height, and --xr-depth to the <Model>.',
      anchors: ['<Model', 'style=', '--xr-depth', 'width:', 'height:'],
      validation: { type: 'contains', value: '--xr-depth' },
      autoType: {
        mode: 'insertLineAfter',
        anchor: 'src={TEAPOT}',
        text: `          style={{
            width: 320,
            height: 320,
            borderRadius: 20,
            '--xr-depth': '160px',
            '--xr-background-material': 'translucent',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.10), rgba(124,58,237,0.06))',
            border: '1px solid rgba(245,158,11,0.25)',
          }}`,
      },
      experiment: 'Try a smaller and a larger --xr-depth value. Keep the model readable.',
      completionMessage: 'You gave the model a 2D layout box and a 3D local space.',
      notYet:
        "Not quite yet — add a style with a size and '--xr-depth' to the <Model>, then try Next again.",
    },
    {
      id: 'load-feedback',
      title: 'Add load and error feedback',
      explanation:
        "Model assets can take time to load. Clear feedback helps the user understand what's happening.",
      task: 'Add onLoad and onError handlers that update the status label.',
      anchors: ['status', 'onLoad', 'onError', 'setStatus'],
      validation: { type: 'contains', value: 'onError' },
      autoType: {
        mode: 'insertLineAfter',
        anchor: 'src={TEAPOT}',
        text:
          "          onLoad={() => setStatus('Model loaded')}\n" +
          "          onError={() => setStatus('Model failed to load')}",
      },
      completionMessage: 'The model now gives useful loading feedback.',
      notYet: 'Not quite yet — add onLoad and onError handlers to the <Model>, then try Next again.',
    },
  ],
  wrapUp: {
    title: 'What you built',
    copy: 'You replaced a normal placeholder with a WebSpatial <Model>, loaded a prebuilt 3D asset, marked it for spatial rendering, gave it local depth, and added loading feedback.',
    concepts: [
      '<Model> is for static, prebuilt 3D model assets.',
      'src points to the model file.',
      'enable-xr marks the model for spatial rendering.',
      'Width and height still control the 2D layout area.',
      '--xr-depth gives the model local 3D space.',
      'onLoad and onError help explain asset loading.',
      'Use <Model> before <Reality> when you only need a prebuilt asset.',
    ],
  },
  next: {
    title: '3D Content Containers: <Reality>',
    note: 'coming next',
  },
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Chapter: Dynamic 3D Containers: Animation · Story 7                     */
/* ────────────────────────────────────────────────────────────────────── */

/*
 * Story 6 built a *static* <Reality> scene. This story makes one move: it drives
 * that scene every frame. The lesson starts from a finished but frozen miniature
 * solar system — a star and three planets parked at fixed points — and turns it
 * into a live orbit with a single, ordinary React animation loop: a `t` clock in
 * state, a requestAnimationFrame tick, and planet positions computed from `t`.
 *
 * The idea the whole lesson protects is "animate transforms, not geometry":
 * every frame changes only each planet's position, so the SDK moves an existing
 * entity with a cheap transform update and the sphere mesh is built once, never
 * rebuilt. Animating geometry (radius / shape) would destroy and recreate the
 * mesh every frame. finalCode is derived from the starter + the chain of "do it
 * for me" edits, and matches the `reality-animated` Playground snippet so Learn
 * and Playground stay in step.
 */

const animStarterCode = `import { Reality, SceneGraph, UnlitMaterial, SphereEntity } from '@webspatial/react-sdk'

// A miniature solar system — but a STATIC one. The star sits at the center and
// each planet is parked at a fixed point. Nothing moves yet: there's no clock
// and no animation loop. We'll add both, and let the loop drive only the
// planets' POSITION every frame.
const PLANETS = [
  { id: 'mercury', orbit: 0.10, speed: 1.6, size: 0.018, hue: 35 },
  { id: 'venus', orbit: 0.15, speed: 1.1, size: 0.026, hue: 200 },
  { id: 'earth', orbit: 0.21, speed: 0.8, size: 0.030, hue: 280 },
]

// Center of the volume, pushed toward the viewer so the orbit has depth.
const CENTER_Z = 0.22

export default function SolarSystem() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
      <Reality style={{ width: 380, height: 320 }}>
        <UnlitMaterial id="sun" color="#fbbf24" />
        {PLANETS.map((p) => (
          <UnlitMaterial key={p.id} id={p.id}
            color={'hsl(' + p.hue + ', 80%, 65%)'} />
        ))}
        <SceneGraph>
          {/* The star, fixed at the center of the volume. */}
          <SphereEntity materials={['sun']} radius={0.05}
            position={{ x: 0, y: 0, z: CENTER_Z }} />
          {/* Planets, parked at a fixed angle for now. */}
          {PLANETS.map((p) => (
            <SphereEntity key={p.id} materials={[p.id]} radius={p.size}
              position={{ x: p.orbit, y: 0, z: CENTER_Z }} />
          ))}
        </SceneGraph>
      </Reality>
    </div>
  )
}`

const animSteps: TutorialStep[] = [
  {
    id: 'static-scene',
    title: 'Start from a static scene',
    explanation:
      'This is a finished Reality scene from Story 6 — a star and three planets — but it is completely frozen. There is no clock and no animation loop, so the planets just sit at a fixed angle.',
    task: 'Find the planets that are parked at a fixed position.',
    anchors: ['parked at a fixed angle', 'x: p.orbit, y: 0, z: CENTER_Z'],
    validation: { type: 'manual' },
    completionMessage: 'This is the static scene we will bring to life.',
  },
  {
    id: 'import-hooks',
    title: 'Import the React hooks',
    explanation:
      'Animation here is just ordinary React: state to hold the current time, and an effect to advance it every frame. Both come from react itself — there is no special SDK animation API.',
    task: 'Import useEffect and useState from react.',
    anchors: ['useEffect', 'useState', "from 'react'"],
    validation: { type: 'containsAll', values: ['useEffect', 'useState'] },
    autoType: {
      mode: 'insertBefore',
      anchor: 'import { Reality,',
      text: "import { useEffect, useState } from 'react'\n",
    },
    completionMessage: 'The animation will be driven by plain React state.',
    notYet:
      "Not quite yet — import useEffect and useState from 'react', then try Next again.",
  },
  {
    id: 'time-state',
    title: 'Add a clock in state',
    explanation:
      'A single number t is the whole clock. Storing it in state means every change re-renders the scene, so the entities follow t as it advances.',
    task: 'Add a t state value, starting at 0, at the top of the component.',
    anchors: ['const [t, setT]', 'useState(0)'],
    validation: { type: 'contains', value: 'useState(0)' },
    autoType: {
      mode: 'insertLineAfter',
      anchor: 'export default function SolarSystem() {',
      text: '  const [t, setT] = useState(0)',
    },
    completionMessage: 'The scene now has a clock to follow.',
    notYet:
      'Not quite yet — add const [t, setT] = useState(0) to the component, then try Next again.',
  },
  {
    id: 'animation-loop',
    title: 'Advance the clock every frame',
    explanation:
      'requestAnimationFrame calls back once per display frame. Each tick nudges t forward (~0.016s, one frame at 60fps) and schedules the next. The cleanup cancels the loop when the component unmounts, so it never leaks.',
    task: 'Add a useEffect that runs a requestAnimationFrame loop and cancels it on cleanup.',
    anchors: ['useEffect', 'requestAnimationFrame', 'cancelAnimationFrame'],
    validation: {
      type: 'containsAll',
      values: ['requestAnimationFrame', 'cancelAnimationFrame'],
    },
    autoType: {
      mode: 'insertLineAfter',
      anchor: 'const [t, setT] = useState(0)',
      text: `  useEffect(() => {
    let raf = 0
    const tick = () => { setT((v) => v + 0.016); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
`,
    },
    fallbackNote:
      'The loop runs in any browser — but the orbit only renders as real volumetric 3D inside a WebSpatial Runtime (Vision Pro / PICO). Here the scene container stays flat.',
    completionMessage: 'The clock now ticks every frame.',
    notYet:
      'Not quite yet — add the useEffect with a requestAnimationFrame loop and cancelAnimationFrame cleanup, then try Next again.',
  },
  {
    id: 'orbit-position',
    title: 'Make the planets orbit',
    explanation:
      'Now derive each planet’s position from t. Sweeping the angle with cos/sin walks it around a circle in the horizontal x/z plane, so it swings through real depth — passing in front of and behind the star.',
    task: 'Replace the fixed planet position with one computed from t, the orbit radius, and the speed.',
    anchors: ['Math.cos(t * p.speed)', 'Math.sin(t * p.speed)'],
    validation: { type: 'contains', value: 'Math.cos(t * p.speed)' },
    autoType: {
      mode: 'replace',
      anchor: `          {/* Planets, parked at a fixed angle for now. */}
          {PLANETS.map((p) => (
            <SphereEntity key={p.id} materials={[p.id]} radius={p.size}
              position={{ x: p.orbit, y: 0, z: CENTER_Z }} />
          ))}`,
      text: `          {/* Planets orbit in the horizontal x/z plane — they swing through
              real depth, passing in front of and behind the star. */}
          {PLANETS.map((p) => (
            <SphereEntity key={p.id} materials={[p.id]} radius={p.size}
              position={{
                x: Math.cos(t * p.speed) * p.orbit,
                y: 0,
                z: CENTER_Z + Math.sin(t * p.speed) * p.orbit,
              }} />
          ))}`,
    },
    fallbackNote:
      'On a headset the planets now circle the star in real 3D. In a flat browser the container stays empty — the motion is happening in the scene, just off-screen.',
    completionMessage: 'The planets are in orbit.',
    notYet:
      'Not quite yet — drive the planet position from Math.cos / Math.sin of t, then try Next again.',
  },
  {
    id: 'transforms-not-geometry',
    title: 'Animate transforms, not geometry',
    explanation:
      'Each frame changes only position. radius stays constant, so the sphere mesh is built once and the SDK just moves it — a cheap transform update. Animating the geometry instead (the radius or shape) would destroy and rebuild the mesh on every single frame.',
    task: 'Notice that the loop touches position, never radius — that is what keeps a per-frame animation cheap.',
    anchors: ['radius={p.size}', 'position={{'],
    validation: { type: 'manual' },
    experiment:
      'For contrast, try pulsing the geometry: radius={p.size * (1 + 0.3 * Math.sin(t * 4))}. It works, but now every frame rebuilds each mesh instead of just moving it — prefer animating transforms.',
    fallbackNote:
      'The cost difference is real on-device: moving an entity reuses its mesh, while resizing it rebuilds the mesh each frame.',
    completionMessage: 'You built a frame-driven 3D scene the efficient way.',
  },
]

export const animationLesson: Lesson = {
  id: 'reality-animated',
  chapter: 'Dynamic 3D Containers: Animation',
  title: 'Animate a 3D scene frame by frame',
  intro:
    'Take a static Reality scene and bring it to life: a miniature solar system whose planets orbit on a per-frame animation loop.',
  learn: [
    'How a plain requestAnimationFrame loop drives a 3D scene',
    'How React state (a time value) flows into entity positions',
    'How to compute an orbit with cos / sin in the x/z plane',
    'Why animating an entity’s transform is cheap',
    'Why animating an entity’s geometry rebuilds the mesh every frame',
    'How to clean up the animation loop so it never leaks',
  ],
  fileName: 'SolarSystem.tsx',
  starterCode: animStarterCode,
  finalCode: deriveStepCode(animStarterCode, animSteps, animSteps.length - 1),
  steps: animSteps,
  wrapUp: {
    title: 'What you built',
    copy: 'You turned a frozen Reality scene into a live one: a requestAnimationFrame loop advances a time value in state, and each planet’s position is computed from it, so the whole scene graph animates every frame — driven entirely by ordinary React.',
    concepts: [
      'Dynamic 3D is just a render loop feeding new values into the scene.',
      'A requestAnimationFrame loop in useEffect advances a time value in state.',
      'Always cancelAnimationFrame on cleanup so the loop never leaks.',
      'Entity positions are computed from that time value each render.',
      'cos / sin over an angle traces an orbit in the x/z plane — real depth.',
      'Animate transforms (position / rotation / scale): the mesh is reused.',
      'Animating geometry (radius / shape) rebuilds the mesh every frame — avoid it.',
    ],
  },
}

/** Lessons in order — Learn Mode walks them as a chapter-based progression. */
export const lessons: Lesson[] = [
  liftCardLesson,
  rotateCardLesson,
  materialCardLesson,
  gestureCardLesson,
  modelLesson,
  animationLesson,
]

/** Future chapters, listed quietly so the path ahead is visible but not noisy. */
export const upcomingLessons: LockedLesson[] = []
