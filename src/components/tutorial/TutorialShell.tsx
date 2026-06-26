import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { FileCode2, Play, Copy, Check, ChevronLeft } from 'lucide-react'
import { LiveEditor, type FreshRange } from '../LiveEditor'
import { LivePreview } from '../LivePreview'
import { RuntimeBadge } from '../RuntimeBanner'
import { detectRuntime } from '@/lib/runtime'
import { resolveAutoType, type Lesson, type TutorialStep } from '@/tutorial/lesson'
import { LessonIntro } from './LessonIntro'
import { StepCard } from './StepCard'
import { WrapUp } from './WrapUp'

type Phase = 'intro' | 'steps' | 'wrap'

/** Has the user's current code satisfied this step's lightweight validation? */
function isSatisfied(step: TutorialStep, code: string, sliderTouched: boolean): boolean {
  switch (step.validation.type) {
    case 'contains':
      return code.includes(step.validation.value)
    case 'containsAll':
      return step.validation.values.every((v) => code.includes(v))
    case 'sliderChanged':
      return sliderTouched
    case 'manual':
      return true
  }
}

/**
 * Learn Mode: the guided tutorial layer around the live editor and preview.
 * Left = the code the user edits; right = the live WebSpatial preview on top
 * and the guided tutorial card below. The whole flow is driven by the lesson
 * data, so future chapters reuse this shell unchanged.
 */
export function TutorialShell({
  lesson,
  onOpenPlayground,
  onNextLesson,
  chapterNav,
}: {
  lesson: Lesson
  onOpenPlayground: () => void
  /** Advance to the next lesson, when one exists in the progression. */
  onNextLesson?: () => void
  /**
   * When this lesson is part of a multi-lesson chapter, a small breadcrumb is
   * shown above the card: which lesson this is, and a way back to the overview.
   */
  chapterNav?: { index: number; total: number; onOverview: () => void }
}) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [stepIndex, setStepIndex] = useState(0)
  const [code, setCode] = useState(lesson.starterCode)
  // Code as it was when the current step began — the target for "Reset step".
  const [stepStartCode, setStepStartCode] = useState(lesson.starterCode)
  const [notYet, setNotYet] = useState<string | null>(null)
  const [sliderTouched, setSliderTouched] = useState(false)
  const [copied, setCopied] = useState(false)
  // Whether the current editor source compiles + renders. Gates Next so the
  // user can't advance past code that doesn't run yet.
  const [previewValid, setPreviewValid] = useState(true)
  // "Do it for me" auto-typer: whether it's running, the range it's lighting up,
  // and where to keep the caret so the new code stays in view.
  const [autoTyping, setAutoTyping] = useState(false)
  const [freshRange, setFreshRange] = useState<FreshRange | null>(null)
  const [caretPos, setCaretPos] = useState<number | null>(null)
  const typeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const step = lesson.steps[stepIndex]
  const total = lesson.steps.length
  const isLast = stepIndex === total - 1
  const rt = detectRuntime()

  const completed = useMemo(
    () =>
      phase === 'steps' && step
        ? isSatisfied(step, code, sliderTouched)
        : false,
    [phase, step, code, sliderTouched],
  )

  // Spotlight the lines this step teaches.
  const anchors = phase === 'steps' ? step?.anchors : undefined

  // Honest fallback note in a flat browser: <Model>/--xr-depth lessons get a
  // model-specific reassurance, otherwise the --xr-back depth note. Keyed on the
  // code's own content, so it's correct for whichever lesson is loaded.
  const annotation = !rt.isSpatial
    ? code.includes('<Reality')
      ? 'The 3D scene renders inside a WebSpatial Runtime — here you see the 2D container and your code.'
      : code.includes('<Model') || code.includes('--xr-depth')
        ? 'The model container is set up — full spatial rendering needs a supported WebSpatial Runtime.'
        : code.includes('--xr-back')
          ? '--xr-back is active — flat here, lifted in the WebSpatial Runtime'
          : undefined
    : undefined

  // Any edit is a fresh attempt: dismiss the previous "not quite yet" nudge so a
  // stale message can't sit next to a now-valid preview and completion note.
  const onEditCode = (next: string) => {
    setCode(next)
    if (notYet) setNotYet(null)
  }

  // Stop any in-flight "do it for me" run and clear its transient UI.
  const cancelTyping = () => {
    if (typeTimer.current != null) {
      clearTimeout(typeTimer.current)
      typeTimer.current = null
    }
    setAutoTyping(false)
    setCaretPos(null)
    setFreshRange(null)
  }

  // Tidy up the timer if the shell unmounts mid-type.
  useEffect(() => () => cancelTyping(), [])

  /**
   * "Do it for me": every step offers this. Steps with a concrete edit get it
   * typed into the editor for the user, one character at a time, lighting up the
   * new text as it lands — the step's own validation then trips once the full
   * edit is in. Observation / slider steps have nothing to type, so "do it for
   * me" simply carries them forward.
   */
  const doItForMe = () => {
    if (autoTyping) return
    const target = step?.autoType ? resolveAutoType(code, step.autoType) : null
    if (!target) {
      // Nothing to type (or the anchor isn't present): just advance the step.
      onNext()
      return
    }

    setNotYet(null)
    setAutoTyping(true)
    const { at, text, removeLen } = target
    // For a `replace` edit, drop the anchored text first, then type into the gap.
    const base = code.slice(0, at) + code.slice(at + removeLen)

    let i = 0
    const tick = () => {
      i += 1
      setCode(base.slice(0, at) + text.slice(0, i) + base.slice(at))
      setFreshRange({ start: at, end: at + i })
      setCaretPos(at + i)
      if (i < text.length) {
        // A touch of cadence: linger after line breaks and commas.
        const justTyped = text[i - 1]
        const delay = justTyped === '\n' ? 150 : justTyped === ',' ? 110 : 24
        typeTimer.current = setTimeout(tick, delay)
      } else {
        setAutoTyping(false)
        setCaretPos(null)
        // Let the finished insertion glow a moment, then release the spotlight.
        typeTimer.current = setTimeout(() => {
          setFreshRange(null)
          typeTimer.current = null
        }, 1700)
      }
    }
    // A short wind-up so the eye catches where typing is about to begin.
    typeTimer.current = setTimeout(tick, 280)
  }

  const enterStep = (i: number) => {
    cancelTyping()
    setStepIndex(i)
    setStepStartCode(code)
    setNotYet(null)
    setSliderTouched(false)
  }

  const startLesson = () => {
    setPhase('steps')
    enterStep(0)
  }

  const onNext = () => {
    if (!step) return
    // Never advance while "do it for me" is still typing. A multi-line edit can
    // satisfy a step's check (e.g. "<Reality") long before the full block is in,
    // so cutting the typer off here would leave the code half-written and break
    // a later step's anchor. Let the edit finish; the button re-enables then.
    if (autoTyping) return
    cancelTyping()
    // Never advance past code that doesn't compile — point at the editor instead.
    if (!previewValid) {
      setNotYet('The preview is waiting for valid code. Fix the highlighted issue, then continue.')
      return
    }
    // `contains` / `containsAll` steps gate progress; manual / slider steps
    // always advance.
    const isCodeCheck =
      step.validation.type === 'contains' || step.validation.type === 'containsAll'
    if (isCodeCheck && !isSatisfied(step, code, sliderTouched)) {
      setNotYet(step.notYet ?? 'Not quite yet — make the edit above, then try Next again.')
      return
    }
    if (isLast) {
      setPhase('wrap')
      return
    }
    enterStep(stepIndex + 1)
  }

  const resetStep = () => {
    cancelTyping()
    setCode(stepStartCode)
    setNotYet(null)
    setSliderTouched(false)
  }

  const resetLesson = () => {
    cancelTyping()
    setCode(lesson.starterCode)
    setStepStartCode(lesson.starterCode)
    setPhase('intro')
    setStepIndex(0)
    setNotYet(null)
    setSliderTouched(false)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const copyFinal = () => navigator.clipboard.writeText(lesson.finalCode)

  const nextLabel = isLast
    ? completed
      ? 'Finish lesson'
      : 'Looks good'
    : 'Next'

  return (
    <MotionConfig reducedMotion="user">
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      {/* ─── Left: live code editor ─── */}
      <section className="flex min-h-0 flex-col border-b border-white/5 lg:w-[46%] lg:border-b-0 lg:border-r">
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/5 bg-[#0e0e18] px-4">
          <div className="flex items-center gap-2">
            <FileCode2 size={13} className="text-violet-400/80" />
            <span className="font-mono text-[11px] text-white/55">{lesson.fileName}</span>
            <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[9px] text-violet-300/80">
              editable · live
            </span>
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-white/45 transition-all hover:bg-white/5 hover:text-white/75"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy code'}
          </button>
        </div>
        <div className="min-h-0 flex-1">
          <LiveEditor
            value={code}
            onChange={onEditCode}
            language="tsx"
            highlightAnchors={anchors}
            freshRange={freshRange}
            caretPos={caretPos}
            readOnly={autoTyping}
          />
        </div>
      </section>

      {/* ─── Right: preview (top) + tutorial card (bottom) ─── */}
      <section className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/5 bg-[#0e0e18] px-4">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/55">
            <Play size={11} className="text-violet-400" />
            Live preview
          </span>
          <RuntimeBadge />
        </div>

        <div className="min-h-0 flex-1">
          <LivePreview
            source={code}
            onRangeInput={() => setSliderTouched(true)}
            onValidityChange={setPreviewValid}
            annotation={annotation}
            gentleErrors
          />
        </div>

        {/* Guided tutorial card. Phases (and steps within a phase) swap through
            a single AnimatePresence so each crossfades into the next instead of
            snapping — the spine of the whole flow's continuity. */}
        <div className="max-h-[52%] shrink-0 overflow-auto border-t border-white/5 bg-[#0c0c14] px-5 py-4">
          {chapterNav && (
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/5 pb-2.5">
              <button
                onClick={chapterNav.onOverview}
                className="inline-flex items-center gap-1 text-[11px] text-white/40 transition-colors hover:text-white/70"
              >
                <ChevronLeft size={12} />
                Chapter overview
              </button>
              <span className="text-[10.5px] font-medium uppercase tracking-wide text-white/35">
                Lesson {chapterNav.index + 1} of {chapterNav.total}
              </span>
            </div>
          )}
          <AnimatePresence mode="wait" initial={false}>
            {phase === 'intro' && (
              <LessonIntro key="intro" lesson={lesson} onStart={startLesson} />
            )}
            {phase === 'steps' && step && (
              <StepCard
                key={`step-${stepIndex}`}
                lesson={lesson}
                step={step}
                index={stepIndex}
                total={total}
                onDoItForMe={doItForMe}
                autoTyping={autoTyping}
                notYet={notYet}
                // Honest "this runs on a headset" note for gestures the flat
                // desktop preview can't trigger — never shown inside a runtime.
                fallbackNote={!rt.isSpatial ? step.fallbackNote : undefined}
                completed={completed}
                nextLabel={nextLabel}
                onReset={resetStep}
                onNext={onNext}
              />
            )}
            {phase === 'wrap' && (
              <WrapUp
                key="wrap"
                lesson={lesson}
                onCopyFinal={copyFinal}
                onResetLesson={resetLesson}
                onOpenPlayground={onOpenPlayground}
                onNextLesson={onNextLesson}
              />
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
    </MotionConfig>
  )
}
