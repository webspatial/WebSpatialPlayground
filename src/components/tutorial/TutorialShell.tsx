import { useMemo, useState } from 'react'
import { FileCode2, Play, Copy, Check } from 'lucide-react'
import { LiveEditor } from '../LiveEditor'
import { LivePreview } from '../LivePreview'
import { RuntimeBadge } from '../RuntimeBanner'
import { detectRuntime } from '@/lib/runtime'
import type { Lesson, TutorialStep } from '@/tutorial/lesson'
import { LessonIntro } from './LessonIntro'
import { StepCard } from './StepCard'
import { WrapUp } from './WrapUp'

type Phase = 'intro' | 'steps' | 'wrap'

/** Has the user's current code satisfied this step's lightweight validation? */
function isSatisfied(step: TutorialStep, code: string, sliderTouched: boolean): boolean {
  switch (step.validation.type) {
    case 'contains':
      return code.includes(step.validation.value)
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
}: {
  lesson: Lesson
  onOpenPlayground: () => void
}) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [stepIndex, setStepIndex] = useState(0)
  const [code, setCode] = useState(lesson.starterCode)
  // Code as it was when the current step began — the target for "Reset step".
  const [stepStartCode, setStepStartCode] = useState(lesson.starterCode)
  const [hintOpen, setHintOpen] = useState(false)
  const [notYet, setNotYet] = useState<string | null>(null)
  const [sliderTouched, setSliderTouched] = useState(false)
  const [copied, setCopied] = useState(false)

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

  // Honest fallback note once --xr-back is in play and we're in a flat browser.
  const annotation =
    !rt.isSpatial && code.includes('--xr-back')
      ? '--xr-back is active — flat here, lifted in the WebSpatial Runtime'
      : undefined

  const enterStep = (i: number) => {
    setStepIndex(i)
    setStepStartCode(code)
    setHintOpen(false)
    setNotYet(null)
    setSliderTouched(false)
  }

  const startLesson = () => {
    setPhase('steps')
    enterStep(0)
  }

  const onNext = () => {
    if (!step) return
    // `contains` steps gate progress; manual / slider steps always advance.
    if (step.validation.type === 'contains' && !code.includes(step.validation.value)) {
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
    setCode(stepStartCode)
    setHintOpen(false)
    setNotYet(null)
    setSliderTouched(false)
  }

  const resetLesson = () => {
    setCode(lesson.starterCode)
    setStepStartCode(lesson.starterCode)
    setPhase('intro')
    setStepIndex(0)
    setHintOpen(false)
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
          <LiveEditor value={code} onChange={setCode} language="tsx" highlightAnchors={anchors} />
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
            annotation={annotation}
            gentleErrors
          />
        </div>

        {/* Guided tutorial card */}
        <div className="max-h-[52%] shrink-0 overflow-auto border-t border-white/5 bg-[#0c0c14] px-5 py-4">
          {phase === 'intro' && <LessonIntro lesson={lesson} onStart={startLesson} />}
          {phase === 'steps' && step && (
            <StepCard
              lesson={lesson}
              step={step}
              index={stepIndex}
              total={total}
              hintOpen={hintOpen}
              onToggleHint={() => setHintOpen((v) => !v)}
              notYet={notYet}
              completed={completed}
              nextLabel={nextLabel}
              onReset={resetStep}
              onNext={onNext}
            />
          )}
          {phase === 'wrap' && (
            <WrapUp
              lesson={lesson}
              onCopyFinal={copyFinal}
              onResetLesson={resetLesson}
              onOpenPlayground={onOpenPlayground}
            />
          )}
        </div>
      </section>
    </div>
  )
}
