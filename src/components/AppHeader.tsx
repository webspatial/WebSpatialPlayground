import { BookOpen, Github, FileCode2 } from 'lucide-react'
import { docLinks } from '@/examples/snippets'
import { RuntimeBadge } from './RuntimeBanner'
import { ModeSwitcher, type AppMode } from './ModeSwitcher'

/**
 * The shared top bar: the WebSpatial logo, the Learn / Playground / Community
 * mode switch, the runtime badge and the documentation links. Extracted so the
 * full-screen Learn/Playground view and the Community gallery present an
 * identical chrome and the mode switch behaves the same everywhere.
 */
export function AppHeader({
  mode,
  onModeChange,
}: {
  mode: AppMode
  onModeChange: (mode: AppMode) => void
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-white/5 bg-[#0c0c14] px-5">
      <div className="flex items-center gap-3">
        <a href={docLinks.docs} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5">
          <img src="/webspatial-logo.svg" alt="WebSpatial" className="h-[18px] w-auto opacity-90" />
        </a>
        <ModeSwitcher mode={mode} onChange={onModeChange} />
      </div>

      <div className="flex items-center gap-2">
        <RuntimeBadge />
        <div className="mx-1 h-5 w-px bg-white/10" />
        <a href={docLinks.docs} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white/80">
          <BookOpen size={13} />Docs
        </a>
        {/* Heavier doc links stay in Playground Mode to keep Learn Mode quiet. */}
        {mode === 'playground' && (
          <>
            <a href={docLinks.llms} target="_blank" rel="noopener noreferrer"
              title="Full LLM-readable documentation"
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white/80">
              <FileCode2 size={13} />llms.txt
            </a>
            <a href={docLinks.sdk} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white/80">
              <Github size={13} />SDK
            </a>
          </>
        )}
      </div>
    </header>
  )
}
