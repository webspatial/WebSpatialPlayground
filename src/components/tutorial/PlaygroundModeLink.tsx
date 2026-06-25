import { FlaskConical, ArrowUpRight } from 'lucide-react'

/**
 * An always-available escape hatch to Playground Mode for advanced users — kept
 * understated so it never competes with the lesson.
 */
export function PlaygroundModeLink({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11.5px] text-white/55 transition-colors hover:bg-white/10 hover:text-white/80"
    >
      <FlaskConical size={12} />
      Open Playground Mode
      <ArrowUpRight size={11} className="opacity-50" />
    </button>
  )
}
