import { Check } from 'lucide-react'

/**
 * Quiet, friendly confirmation shown when a step's task is satisfied. No
 * gamification — just a calm "you got it" before moving on.
 */
export function CompletionMessage({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-2">
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-400/20">
        <Check size={11} className="text-emerald-300" />
      </span>
      <p className="m-0 text-[12.5px] leading-relaxed text-emerald-100/85">{message}</p>
    </div>
  )
}
