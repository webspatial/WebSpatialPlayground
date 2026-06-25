import { useState } from 'react'
import { motion } from 'framer-motion'
import { PartyPopper, Copy, Check, RotateCcw, Lock, ArrowRight } from 'lucide-react'
import type { LessonMeta } from '@/tutorial/lesson'
import { PlaygroundModeLink } from './PlaygroundModeLink'
import { phaseContainer, riseItem, pressable, softSpring } from './motion'

/**
 * The lesson wrap-up: a short Apple-style summary of what was built, a tight
 * concept recap, and the few next actions — copy the final code, reset, jump to
 * Playground, or peek at the next (locked) lesson.
 *
 * Same staggered settle as the rest of the flow, with one small flourish: the
 * popper gives a single, restrained celebratory tilt as the summary lands.
 */
export function WrapUp({
  lesson,
  onCopyFinal,
  onResetLesson,
  onOpenPlayground,
  onNextLesson,
}: {
  lesson: LessonMeta
  onCopyFinal: () => void
  onResetLesson: () => void
  /** Jump to this concept's Playground — omitted for Learn-only chapters. */
  onOpenPlayground?: () => void
  /** When set, the next lesson is unlocked and the row becomes a Start button. */
  onNextLesson?: () => void
}) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    onCopyFinal()
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <motion.div
      className="flex flex-col gap-3"
      variants={phaseContainer}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <motion.div
        variants={riseItem}
        className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-emerald-300/70"
      >
        <motion.span
          initial={{ rotate: -12, scale: 0.7 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ ...softSpring, delay: 0.18 }}
          className="inline-flex"
        >
          <PartyPopper size={12} />
        </motion.span>
        {lesson.chapter}
      </motion.div>

      <motion.div variants={riseItem}>
        <h2 className="text-[15px] font-semibold text-white">{lesson.wrapUp.title}</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-white/55">{lesson.wrapUp.copy}</p>
      </motion.div>

      <motion.div
        variants={riseItem}
        className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3"
      >
        <p className="m-0 mb-2 text-[11px] font-medium uppercase tracking-wide text-white/40">
          Concepts
        </p>
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {lesson.wrapUp.concepts.map((c) => (
            <li key={c} className="flex items-start gap-2 text-[12.5px] leading-snug text-white/65">
              <Check size={13} className="mt-0.5 shrink-0 text-emerald-400/70" />
              <span className="font-mono text-[12px]">{c}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div variants={riseItem} className="flex flex-wrap items-center gap-2">
        <motion.button
          {...pressable}
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/30 bg-violet-500/20 px-3 py-1.5 text-[12.5px] font-medium text-violet-100 transition-colors hover:bg-violet-500/30"
        >
          {copied ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy final code'}
        </motion.button>
        <motion.button
          {...pressable}
          onClick={onResetLesson}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[12.5px] text-white/60 transition-colors hover:bg-white/10 hover:text-white/85"
        >
          <RotateCcw size={12} />
          Reset lesson
        </motion.button>
        {onOpenPlayground && <PlaygroundModeLink onOpen={onOpenPlayground} />}
      </motion.div>

      {lesson.next &&
        (onNextLesson ? (
          // The next lesson is built — let the user walk straight into it.
          <motion.button
            variants={riseItem}
            {...pressable}
            onClick={onNextLesson}
            className="mt-1 flex items-center gap-2 rounded-lg border border-violet-400/25 bg-violet-500/10 px-3 py-2 text-[12px] text-violet-100/90 transition-colors hover:bg-violet-500/20"
          >
            <span>
              Next lesson:{' '}
              <span className="font-medium text-white">{lesson.next.title}</span>
            </span>
            <ArrowRight size={13} className="ml-auto shrink-0 text-violet-300/80" />
          </motion.button>
        ) : (
          // Not built yet — shown quietly as "coming next", never distracting.
          <motion.div
            variants={riseItem}
            className="mt-1 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[12px] text-white/40"
          >
            <Lock size={12} className="shrink-0" />
            <span>
              Next lesson:{' '}
              <span className="text-white/55">{lesson.next.title}</span>
            </span>
            {lesson.next.note && (
              <span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/35">
                {lesson.next.note}
              </span>
            )}
          </motion.div>
        ))}
    </motion.div>
  )
}
