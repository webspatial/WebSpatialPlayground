import { useState } from 'react'
import { motion } from 'framer-motion'
import { PartyPopper, Copy, Check, RotateCcw, ArrowRight } from 'lucide-react'
import type { ChapterWrapUp } from '@/tutorial/lesson'
import { PlaygroundModeLink } from './PlaygroundModeLink'
import { phaseContainer, riseItem, pressable, softSpring } from './motion'

/**
 * The chapter-level wrap-up shown after the last lesson: a short summary of the
 * whole chapter, a concept recap, and the chapter's final actions — copy the
 * finished scene, reset the chapter, open Playground Mode, or move on to the
 * next story.
 */
export function ChapterWrap({
  wrapUp,
  onCopyFinal,
  onResetChapter,
  onOpenPlayground,
  onNextStory,
}: {
  wrapUp: ChapterWrapUp
  onCopyFinal: () => void
  onResetChapter: () => void
  onOpenPlayground: () => void
  /** Navigate to the next story, when one exists. */
  onNextStory?: () => void
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
        3D Content Containers: &lt;Reality&gt;
      </motion.div>

      <motion.div variants={riseItem}>
        <h2 className="text-[15px] font-semibold text-white">{wrapUp.title}</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-white/55">{wrapUp.copy}</p>
      </motion.div>

      <motion.div
        variants={riseItem}
        className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3"
      >
        <p className="m-0 mb-2 text-[11px] font-medium uppercase tracking-wide text-white/40">
          Concepts
        </p>
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {wrapUp.concepts.map((c) => (
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
          onClick={onResetChapter}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[12.5px] text-white/60 transition-colors hover:bg-white/10 hover:text-white/85"
        >
          <RotateCcw size={12} />
          Reset chapter
        </motion.button>
        <PlaygroundModeLink onOpen={onOpenPlayground} />
      </motion.div>

      {wrapUp.nextStory && (
        <motion.button
          variants={riseItem}
          {...pressable}
          onClick={onNextStory}
          className="mt-1 flex items-center gap-2 rounded-lg border border-violet-400/25 bg-violet-500/10 px-3 py-2 text-[12px] text-violet-100/90 transition-colors hover:bg-violet-500/20"
        >
          <span>
            Next story:{' '}
            <span className="font-medium text-white">{wrapUp.nextStory.title}</span>
          </span>
          <ArrowRight size={13} className="ml-auto shrink-0 text-violet-300/80" />
        </motion.button>
      )}
    </motion.div>
  )
}
