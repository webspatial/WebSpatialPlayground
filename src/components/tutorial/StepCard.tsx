import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, ArrowRight, RotateCcw, Lightbulb, Wand2, Target } from 'lucide-react'
import type { Lesson, TutorialStep } from '@/tutorial/lesson'
import { StepProgress } from './StepProgress'
import { HintPanel } from './HintPanel'
import { CompletionMessage } from './CompletionMessage'
import { phaseContainer, riseItem, disclosure, pressable, EASE_OUT } from './motion'

/**
 * One tutorial step, Apple-style: chapter label, lesson title, a step counter,
 * a short explanation, one concrete task, an optional experiment, and the small
 * set of actions — Show hint, Reset step, Next. Only one job is on screen at a
 * time; everything else stays quiet.
 *
 * Motion gives the step a sense of place: the card's blocks settle in on a
 * gentle stagger when the step opens (it's keyed per-step in the parent's
 * AnimatePresence, so step-to-step crossfades), and the conditional pieces —
 * hint, "not yet", completion — grow open and collapse rather than snapping.
 */
export function StepCard({
  lesson,
  step,
  index,
  total,
  hintOpen,
  onToggleHint,
  notYet,
  completed,
  nextLabel,
  onReset,
  onNext,
}: {
  lesson: Lesson
  step: TutorialStep
  index: number
  total: number
  /** Whether the hint is currently revealed. */
  hintOpen: boolean
  onToggleHint: () => void
  /** Gentle "not quite yet" copy to show after a failed Next, if any. */
  notYet: string | null
  /** Whether this step's task has been satisfied (shows completion message). */
  completed: boolean
  /** Label for the primary action (e.g. "Next", "Looks good", "Finish"). */
  nextLabel: string
  onReset: () => void
  onNext: () => void
}) {
  return (
    <motion.div
      className="flex flex-col gap-3"
      variants={phaseContainer}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* Chapter label + step counter */}
      <motion.div variants={riseItem} className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-violet-300/70">
          <Sparkles size={11} />
          {lesson.chapter}
        </div>
        <StepProgress current={index} total={total} />
      </motion.div>

      {/* Lesson title + step title */}
      <motion.div variants={riseItem}>
        <p className="m-0 text-[11px] font-medium text-white/35">{lesson.title}</p>
        <h2 className="mt-0.5 text-[15px] font-semibold text-white">{step.title}</h2>
      </motion.div>

      {/* Explanation */}
      <motion.p variants={riseItem} className="m-0 text-[13px] leading-relaxed text-white/60">
        {step.explanation}
      </motion.p>

      {/* Task */}
      <motion.div
        variants={riseItem}
        className="flex items-start gap-2 rounded-lg border border-violet-400/15 bg-violet-500/[0.07] px-3 py-2"
      >
        <Target size={13} className="mt-0.5 shrink-0 text-violet-300/80" />
        <p className="m-0 text-[12.5px] font-medium leading-relaxed text-violet-50/90">{step.task}</p>
      </motion.div>

      {/* Optional experiment */}
      {step.experiment && (
        <motion.div
          variants={riseItem}
          className="flex items-start gap-2 px-1 text-[12px] leading-relaxed text-white/40"
        >
          <Wand2 size={12} className="mt-0.5 shrink-0 text-white/30" />
          <span>
            <span className="text-white/55">Experiment (optional):</span> {step.experiment}
          </span>
        </motion.div>
      )}

      {/* Hint (revealed on request) — grows open and collapses away. */}
      {step.hint && (
        <AnimatePresence initial={false}>
          {hintOpen && (
            <motion.div
              key="hint"
              variants={disclosure}
              initial="hidden"
              animate="show"
              exit="exit"
              className="overflow-hidden"
            >
              <HintPanel hint={step.hint} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Gentle not-yet copy — appears after a failed Next, eases out when fixed. */}
      <AnimatePresence initial={false}>
        {notYet && (
          <motion.div
            key="not-yet"
            variants={disclosure}
            initial="hidden"
            animate="show"
            exit="exit"
            className="overflow-hidden"
          >
            <p className="m-0 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2 text-[12.5px] leading-relaxed text-amber-100/80">
              {notYet}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion confirmation — a soft spring pop the moment the task is met. */}
      <AnimatePresence initial={false}>
        {completed && step.completionMessage && (
          <CompletionMessage key="done" message={step.completionMessage} />
        )}
      </AnimatePresence>

      {/* Actions */}
      <motion.div variants={riseItem} className="mt-0.5 flex items-center gap-2">
        {step.hint && (
          <motion.button
            {...pressable}
            onClick={onToggleHint}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] text-white/45 transition-colors hover:bg-white/5 hover:text-white/75"
          >
            <Lightbulb size={12} />
            {hintOpen ? 'Hide hint' : 'Show hint'}
          </motion.button>
        )}
        <motion.button
          {...pressable}
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] text-white/45 transition-colors hover:bg-white/5 hover:text-white/75"
        >
          <RotateCcw size={12} />
          Reset step
        </motion.button>
        <motion.button
          {...pressable}
          onClick={onNext}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-violet-400/30 bg-violet-500/20 px-3.5 py-1.5 text-[13px] font-medium text-violet-100 transition-colors hover:bg-violet-500/30"
        >
          <span className="relative inline-flex items-center gap-1.5">
            {nextLabel}
            <motion.span
              aria-hidden
              animate={completed ? { x: [0, 3, 0] } : { x: 0 }}
              transition={completed ? { duration: 0.9, ease: EASE_OUT, repeat: Infinity, repeatDelay: 1.4 } : { duration: 0.2 }}
              className="inline-flex"
            >
              <ArrowRight size={14} />
            </motion.span>
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
