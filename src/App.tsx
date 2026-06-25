import { useState } from 'react'
import './App.css'
import { docLinks } from './examples/snippets'
import { liftCardLesson } from './tutorial/lesson'
import { RuntimeBadge } from './components/RuntimeBanner'
import { ModeSwitcher, type AppMode } from './components/ModeSwitcher'
import { TutorialShell } from './components/tutorial/TutorialShell'
import { PlaygroundShell } from './components/PlaygroundShell'
import { BookOpen, Github, FileCode2 } from 'lucide-react'

function App() {
  const [mode, setMode] = useState<AppMode>('learn')

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0f] text-white">
      {/* ─── Shared top bar ─── */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-white/5 bg-[#0c0c14] px-5">
        <div className="flex items-center gap-3">
          <a href={docLinks.docs} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5">
            <img src="/webspatial-logo.svg" alt="WebSpatial" className="h-[18px] w-auto opacity-90" />
          </a>
          <ModeSwitcher mode={mode} onChange={setMode} />
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

      {/* ─── Mode body ─── */}
      {mode === 'learn' ? (
        <TutorialShell lesson={liftCardLesson} onOpenPlayground={() => setMode('playground')} />
      ) : (
        <PlaygroundShell />
      )}
    </div>
  )
}

export default App
