import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { FileCode2, Copy, Check, ListChecks } from 'lucide-react'
import { LiveEditor, type FreshRange } from '../LiveEditor'
import { RuntimeBadge } from '../RuntimeBanner'
import { detectRuntime } from '@/lib/runtime'
import { resolveAutoType, type TutorialStep } from '@/tutorial/lesson'
import { type SetupLesson, type SetupStep, setupTroubleshooting } from '@/tutorial/setup'
import { LessonIntro } from './LessonIntro'
import { StepCard } from './StepCard'
import { WrapUp } from './WrapUp'
import { SetupChecklist, type ChecklistItem } from './SetupChecklist'

type Phase = 'intro' | 'steps' | 'wrap'

/** Has the current setup step been satisfied by the file it targets? */
function isSatisfied(step: SetupStep, files: Record<string, string>): boolean {
  switch (step.validation.type) {
    case 'contains':
      return fileText(step, files).includes(step.validation.value)
    case 'containsAll':
      return step.validation.values.every((v) => fileText(step, files).includes(v))
    case 'sliderChanged':
      // Not used by setup steps, but keep the switch total.
      return false
    case 'manual':
      return true
  }
}

/** The text a step validates against: its target file, or all files joined. */
function fileText(step: SetupStep, files: Record<string, string>): string {
  if (step.file && files[step.file] != null) return files[step.file]
  return Object.values(files).join('\n')
}

/**
 * Story 0 (setup) shell. It mirrors the code-lesson {@link TutorialShell} — left
 * editor, right-top stage, right-bottom guided card — but the editor holds
 * several setup files (a tab strip) and the stage is a setup *checklist* instead
 * of a live render. The same intro / step / wrap-up cards are reused so Story 0
 * feels like the rest of Learn Mode.
 */
export function SetupShell({
  lesson,
  onNextLesson,
}: {
  lesson: SetupLesson
  /** Advance to the next lesson (Story 1), when it exists. */
  onNextLesson?: () => void
}) {
  // Seed editable file contents from the lesson's starters, keyed by file name.
  const seed = useMemo(() => {
    const m: Record<string, string> = {}
    for (const f of lesson.files) m[f.name] = f.content
    return m
  }, [lesson])

  const [phase, setPhase] = useState<Phase>('intro')
  const [stepIndex, setStepIndex] = useState(0)
  const [files, setFiles] = useState<Record<string, string>>(seed)
  // Files as they were when the current step began — the target for "Reset step".
  const [stepStartFiles, setStepStartFiles] = useState<Record<string, string>>(seed)
  const [activeFile, setActiveFile] = useState(lesson.files[0]?.name ?? '')
  const [notYet, setNotYet] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  // "Do it for me" auto-typer state, identical in spirit to TutorialShell.
  const [autoTyping, setAutoTyping] = useState(false)
  const [freshRange, setFreshRange] = useState<FreshRange | null>(null)
  const [caretPos, setCaretPos] = useState<number | null>(null)
  const typeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const step = lesson.steps[stepIndex]
  const total = lesson.steps.length
  const isLast = stepIndex === total - 1
  const rt = detectRuntime()

  const activeFileMeta = lesson.files.find((f) => f.name === activeFile)
  const activeCode = files[activeFile] ?? ''

  const completed = useMemo(
    () => (phase === 'steps' && step ? isSatisfied(step, files) : false),
    [phase, step, files],
  )

  // Spotlight the step's lines only while the step's own file is showing.
  const anchors =
    phase === 'steps' && step && (!step.file || step.file === activeFile)
      ? step.anchors
      : undefined

  // Live checklist for the right-hand stage — every step with its current state.
  const checklist: ChecklistItem[] = useMemo(
    () =>
      lesson.steps.map((s, i) => ({
        id: s.id,
        title: s.title,
        manual: s.validation.type === 'manual',
        satisfied: isSatisfied(s, files),
        active: phase === 'steps' && i === stepIndex,
      })),
    [lesson.steps, files, phase, stepIndex],
  )

  const setActiveCode = (next: string) => {
    setFiles((m) => ({ ...m, [activeFile]: next }))
    if (notYet) setNotYet(null)
  }

  const cancelTyping = () => {
    if (typeTimer.current != null) {
      clearTimeout(typeTimer.current)
      typeTimer.current = null
    }
    setAutoTyping(false)
    setCaretPos(null)
    setFreshRange(null)
  }

  useEffect(() => () => cancelTyping(), [])

  /**
   * "Do it for me": type this step's edit into its target file, one character at
   * a time. Manual steps (no autoType) simply advance. We switch to the target
   * file first so the user watches the edit land where it belongs.
   */
  const doItForMe = () => {
    if (autoTyping) return
    if (!step?.autoType) {
      onNext()
      return
    }
    const targetFile = step.file ?? activeFile
    if (targetFile !== activeFile) setActiveFile(targetFile)
    const source = files[targetFile] ?? ''
    const target = resolveAutoType(source, step.autoType)
    if (!target) {
      onNext()
      return
    }

    setNotYet(null)
    setAutoTyping(true)
    const { at, text, removeLen } = target
    const base = source.slice(0, at) + source.slice(at + removeLen)

    let i = 0
    const tick = () => {
      i += 1
      const nextContent = base.slice(0, at) + text.slice(0, i) + base.slice(at)
      setFiles((m) => ({ ...m, [targetFile]: nextContent }))
      setFreshRange({ start: at, end: at + i })
      setCaretPos(at + i)
      if (i < text.length) {
        const justTyped = text[i - 1]
        const delay = justTyped === '\n' ? 150 : justTyped === ',' ? 110 : 24
        typeTimer.current = setTimeout(tick, delay)
      } else {
        setAutoTyping(false)
        setCaretPos(null)
        typeTimer.current = setTimeout(() => {
          setFreshRange(null)
          typeTimer.current = null
        }, 1700)
      }
    }
    typeTimer.current = setTimeout(tick, 280)
  }

  const enterStep = (i: number) => {
    cancelTyping()
    setStepIndex(i)
    setStepStartFiles(files)
    setNotYet(null)
    // Bring the step's file forward so the editor shows what it's teaching.
    const f = lesson.steps[i]?.file
    if (f) setActiveFile(f)
  }

  const startLesson = () => {
    setPhase('steps')
    enterStep(0)
  }

  const onNext = () => {
    if (!step) return
    cancelTyping()
    const isCodeCheck =
      step.validation.type === 'contains' || step.validation.type === 'containsAll'
    if (isCodeCheck && !isSatisfied(step, files)) {
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
    setFiles(stepStartFiles)
    setNotYet(null)
  }

  const resetLesson = () => {
    cancelTyping()
    setFiles(seed)
    setStepStartFiles(seed)
    setActiveFile(lesson.files[0]?.name ?? '')
    setPhase('intro')
    setStepIndex(0)
    setNotYet(null)
  }

  const copyActive = () => {
    navigator.clipboard.writeText(activeCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  // "Copy final code" gives the whole finished setup — every file, headed by its
  // name — so a beginner can diff their project against the target end state.
  const copyFinal = () => {
    const out = lesson.files
      .map((f) => `// === ${f.name} ===\n${f.final ?? f.content}`)
      .join('\n\n')
    navigator.clipboard.writeText(out)
  }

  const nextLabel = isLast ? (completed ? 'Finish lesson' : 'Looks good') : 'Next'

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* ─── Left: multi-file setup editor ─── */}
        <section className="flex min-h-0 flex-col border-b border-white/5 lg:w-[46%] lg:border-b-0 lg:border-r">
          {/* File tab strip */}
          <div className="flex h-10 shrink-0 items-center gap-1 overflow-x-auto border-b border-white/5 bg-[#0e0e18] px-2">
            {lesson.files.map((f) => {
              const isActive = f.name === activeFile
              return (
                <button
                  key={f.name}
                  onClick={() => setActiveFile(f.name)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors ${
                    isActive
                      ? 'bg-violet-500/15 text-violet-100'
                      : 'text-white/45 hover:bg-white/5 hover:text-white/75'
                  }`}
                >
                  <FileCode2 size={11} className={isActive ? 'text-violet-400/80' : 'text-white/30'} />
                  {f.name}
                </button>
              )
            })}
          </div>
          <div className="flex h-8 shrink-0 items-center justify-between border-b border-white/5 bg-[#0c0c14] px-4">
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[9px] text-violet-300/80">
              editable
            </span>
            <button
              onClick={copyActive}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-white/45 transition-all hover:bg-white/5 hover:text-white/75"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy file'}
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <LiveEditor
              // Remount per file so caret + scroll reset cleanly on tab switch.
              key={activeFile}
              value={activeCode}
              onChange={setActiveCode}
              language={activeFileMeta?.language ?? 'tsx'}
              highlightAnchors={anchors}
              freshRange={freshRange}
              caretPos={caretPos}
              readOnly={autoTyping}
            />
          </div>
        </section>

        {/* ─── Right: setup checklist (top) + guided card (bottom) ─── */}
        <section className="flex min-h-0 flex-1 flex-col">
          <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/5 bg-[#0e0e18] px-4">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/55">
              <ListChecks size={12} className="text-violet-400" />
              Setup preview
            </span>
            <RuntimeBadge />
          </div>

          <div className="min-h-0 flex-1">
            <SetupChecklist
              items={checklist}
              isSpatial={rt.isSpatial}
              currentSdkNote={lesson.currentSdkNote}
              troubleshooting={setupTroubleshooting}
            />
          </div>

          <div className="max-h-[52%] shrink-0 overflow-auto border-t border-white/5 bg-[#0c0c14] px-5 py-4">
            <AnimatePresence mode="wait" initial={false}>
              {phase === 'intro' && (
                <LessonIntro key="intro" lesson={lesson} onStart={startLesson} />
              )}
              {phase === 'steps' && step && (
                <StepCard
                  key={`step-${stepIndex}`}
                  lesson={lesson}
                  step={step as TutorialStep}
                  index={stepIndex}
                  total={total}
                  onDoItForMe={doItForMe}
                  autoTyping={autoTyping}
                  notYet={notYet}
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
