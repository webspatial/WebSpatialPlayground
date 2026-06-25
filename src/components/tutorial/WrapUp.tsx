import { useState } from 'react'
import { PartyPopper, Copy, Check, RotateCcw, Lock } from 'lucide-react'
import type { Lesson } from '@/tutorial/lesson'
import { PlaygroundModeLink } from './PlaygroundModeLink'

/**
 * The lesson wrap-up: a short Apple-style summary of what was built, a tight
 * concept recap, and the few next actions — copy the final code, reset, jump to
 * Playground, or peek at the next (locked) lesson.
 */
export function WrapUp({
  lesson,
  onCopyFinal,
  onResetLesson,
  onOpenPlayground,
}: {
  lesson: Lesson
  onCopyFinal: () => void
  onResetLesson: () => void
  onOpenPlayground: () => void
}) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    onCopyFinal()
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-emerald-300/70">
        <PartyPopper size={12} />
        {lesson.chapter}
      </div>

      <div>
        <h2 className="text-[15px] font-semibold text-white">{lesson.wrapUp.title}</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-white/55">{lesson.wrapUp.copy}</p>
      </div>

      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3">
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
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/30 bg-violet-500/20 px-3 py-1.5 text-[12.5px] font-medium text-violet-100 transition-colors hover:bg-violet-500/30"
        >
          {copied ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy final code'}
        </button>
        <button
          onClick={onResetLesson}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[12.5px] text-white/60 transition-colors hover:bg-white/10 hover:text-white/85"
        >
          <RotateCcw size={12} />
          Reset lesson
        </button>
        <PlaygroundModeLink onOpen={onOpenPlayground} />
      </div>

      {lesson.next && (
        <div className="mt-1 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[12px] text-white/40">
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
        </div>
      )}
    </div>
  )
}
