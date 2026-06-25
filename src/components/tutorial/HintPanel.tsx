import { Lightbulb } from 'lucide-react'

/**
 * The hint's contents. Whether it's on screen — and the grow-open / collapse
 * motion around it — is owned by StepCard's AnimatePresence, so this just
 * renders the panel itself and reads clean by default.
 */
export function HintPanel({ hint }: { hint: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2">
      <Lightbulb size={13} className="mt-0.5 shrink-0 text-amber-300/80" />
      <p className="m-0 text-[12.5px] leading-relaxed text-amber-100/80">{hint}</p>
    </div>
  )
}
