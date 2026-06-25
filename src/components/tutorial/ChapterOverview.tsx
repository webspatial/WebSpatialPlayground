import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Check, CircleDot, Circle, Clock } from 'lucide-react'
import type { ChapterOverview as ChapterOverviewData } from '@/tutorial/lesson'
import { phaseContainer, riseItem, pressable } from './motion'

/** Per-lesson progress, mirrored from the chapter shell's state. */
export type LessonStatus = 'todo' | 'progress' | 'done'

const STATUS_META: Record<LessonStatus, { label: string; className: string; icon: typeof Check }> = {
  done: { label: 'Complete', className: 'text-emerald-300', icon: Check },
  progress: { label: 'In progress', className: 'text-violet-300', icon: CircleDot },
  todo: { label: 'Not started', className: 'text-white/35', icon: Circle },
}

/**
 * The calm chapter opener, Apple-tutorial style: a one-line mental model, a short
 * framing paragraph, and a card per lesson with its estimated time and status.
 * Each card is a button — start at the top, or jump straight to any lesson.
 */
export function ChapterOverview({
  overview,
  statuses,
  onSelectLesson,
  onStart,
}: {
  overview: ChapterOverviewData
  /** One status per lesson, in order. */
  statuses: LessonStatus[]
  onSelectLesson: (index: number) => void
  /** Begin the chapter from the first lesson. */
  onStart: () => void
}) {
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
        Chapter overview
      </motion.div>

      <motion.div variants={riseItem}>
        <h2 className="text-[15px] font-semibold text-white">{overview.title}</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-white/55">{overview.subtitle}</p>
      </motion.div>

      {/* The chapter's mental model — one sentence, set apart so it lands. */}
      <motion.div
        variants={riseItem}
        className="rounded-xl border border-violet-400/15 bg-violet-500/[0.06] px-3.5 py-2.5 text-[12.5px] leading-relaxed text-violet-50/80"
      >
        {overview.mentalModel}
      </motion.div>

      <motion.p variants={riseItem} className="m-0 text-[12.5px] leading-relaxed text-white/55">
        {overview.copy}
      </motion.p>

      {/* Lesson cards */}
      <motion.div variants={riseItem} className="flex flex-col gap-2">
        {overview.cards.map((card, i) => {
          const status = statuses[i] ?? 'todo'
          const meta = STATUS_META[status]
          const StatusIcon = meta.icon
          return (
            <motion.button
              key={card.title}
              {...pressable}
              onClick={() => onSelectLesson(i)}
              className="group flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3 text-left transition-colors hover:border-violet-400/25 hover:bg-violet-500/[0.06]"
            >
              <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/5 text-[11px] font-semibold tabular-nums text-white/50 group-hover:bg-violet-500/25 group-hover:text-violet-100">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-medium leading-snug text-white/85">
                  {card.title}
                </span>
                <span className="mt-0.5 block text-[12px] leading-snug text-white/45">
                  {card.description}
                </span>
                <span className="mt-1.5 flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 text-[10.5px] ${meta.className}`}>
                    <StatusIcon size={11} />
                    {meta.label}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10.5px] text-white/35">
                    <Clock size={10} />
                    {card.estTime}
                  </span>
                </span>
              </span>
              <ArrowRight
                size={14}
                className="mt-1 shrink-0 text-white/20 transition-colors group-hover:text-violet-300/80"
              />
            </motion.button>
          )
        })}
      </motion.div>

      <motion.button
        variants={riseItem}
        {...pressable}
        onClick={onStart}
        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-violet-400/30 bg-violet-500/20 px-3.5 py-1.5 text-[13px] font-medium text-violet-100 transition-colors hover:bg-violet-500/30"
      >
        Start chapter
        <ArrowRight size={14} />
      </motion.button>
    </motion.div>
  )
}
