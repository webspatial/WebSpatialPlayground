import { Lightbulb } from 'lucide-react'

/**
 * A hint that stays hidden until asked for, so the step reads clean by default.
 * Toggled by the parent's "Show hint" action.
 */
export function HintPanel({ hint, open }: { hint: string; open: boolean }) {
  if (!open) return null
  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2">
      <Lightbulb size={13} className="mt-0.5 shrink-0 text-amber-300/80" />
      <p className="m-0 text-[12.5px] leading-relaxed text-amber-100/80">{hint}</p>
    </div>
  )
}
