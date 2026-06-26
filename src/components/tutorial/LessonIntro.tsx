import { motion } from 'framer-motion'
import { Sparkles, Check, ArrowRight } from 'lucide-react'
import type { LessonMeta } from '@/tutorial/lesson'
import { phaseContainer, riseItem, pressable } from './motion'

/**
 * The calm "what you'll build" opener for a lesson — a short intro line and a
 * few "what you'll learn" bullets, then a single Start action. Sits in the
 * tutorial-card slot so the code and preview stay visible the whole time.
 *
 * Each block settles in just behind the one before it (phaseContainer stagger),
 * giving the opener a soft, deliberate reveal instead of a hard cut.
 */
export function LessonIntro({ lesson, onStart }: { lesson: LessonMeta; onStart: () => void }) {
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
        className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-violet-300/70"
      >
        <Sparkles size={11} />
        {lesson.chapter}
      </motion.div>

      <motion.div variants={riseItem}>
        <h2 className="text-[15px] font-semibold text-white">{lesson.title}</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-white/55">{lesson.intro}</p>
      </motion.div>

      <motion.div
        variants={riseItem}
        className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3"
      >
        <p className="m-0 mb-2 text-[11px] font-medium uppercase tracking-wide text-white/40">
          What you'll learn
        </p>
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {lesson.learn.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[12.5px] leading-snug text-white/65">
              <Check size={13} className="mt-0.5 shrink-0 text-violet-400/70" />
              {item}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.button
        variants={riseItem}
        {...pressable}
        onClick={onStart}
        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-violet-400/30 bg-violet-500/20 px-3.5 py-1.5 text-[13px] font-medium text-violet-100 transition-colors hover:bg-violet-500/30"
      >
        Start lesson
        <ArrowRight size={14} />
      </motion.button>
    </motion.div>
  )
}
