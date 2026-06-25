import { useMemo, useState } from 'react'
import './App.css'
import { docLinks } from './examples/snippets'
import { chapters, chapterById, nextLessonChapter } from './tutorial/chapters'
import { RuntimeBadge } from './components/RuntimeBanner'
import { ModeSwitcher, type AppMode } from './components/ModeSwitcher'
import { ChapterRail } from './components/ChapterRail'
import { TutorialShell } from './components/tutorial/TutorialShell'
import { PlaygroundShell } from './components/PlaygroundShell'
import { BookOpen, Github, FileCode2 } from 'lucide-react'

function App() {
  // The user's *preferred* mode; the chapter may not offer a lesson, in which
  // case we honour the preference but fall back to the playground (below).
  const [mode, setMode] = useState<AppMode>('learn')
  // The selected concept — shared by both modes, so flipping between Learn and
  // Playground keeps the user on the same chapter.
  const [chapterId, setChapterId] = useState(chapters[0].id)

  const chapter = useMemo(() => chapterById(chapterId), [chapterId])
  const canLearn = !!chapter.lesson
  // What's actually shown: Learn only when the chapter has a lesson to teach.
  const effectiveMode: AppMode = mode === 'learn' && canLearn ? 'learn' : 'playground'
  const nextChapter = useMemo(() => nextLessonChapter(chapterId), [chapterId])

  // Choosing Learn on a demo-only chapter jumps to the nearest one that teaches,
  // so the Learn toggle always lands on something to learn.
  const onModeChange = (m: AppMode) => {
    if (m === 'learn' && !canLearn) {
      const firstLesson = chapters.find((c) => c.lesson)
      if (firstLesson) setChapterId(firstLesson.id)
    }
    setMode(m)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0f] text-white">
      {/* ─── Shared top bar ─── */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-white/5 bg-[#0c0c14] px-5">
        <div className="flex items-center gap-3">
          <a href={docLinks.docs} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5">
            <img src="/webspatial-logo.svg" alt="WebSpatial" className="h-[18px] w-auto opacity-90" />
          </a>
          <ModeSwitcher mode={effectiveMode} onChange={onModeChange} />
        </div>

        <div className="flex items-center gap-2">
          <RuntimeBadge />
          <div className="mx-1 h-5 w-px bg-white/10" />
          <a href={docLinks.docs} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white/80">
            <BookOpen size={13} />Docs
          </a>
          {/* Heavier doc links stay in Playground Mode to keep Learn Mode quiet. */}
          {effectiveMode === 'playground' && (
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

      {/* ─── Body: shared chapter rail + the active mode ─── */}
      <div className="flex min-h-0 flex-1">
        <ChapterRail activeId={chapterId} mode={effectiveMode} onSelect={setChapterId} />
        <div className="flex min-h-0 flex-1 flex-col">
          {effectiveMode === 'learn' && chapter.lesson ? (
            <TutorialShell
              // Remount on lesson change so the shell reseeds its editor + phase.
              key={chapter.lesson.id}
              lesson={chapter.lesson}
              onOpenPlayground={() => setMode('playground')}
              onNextLesson={nextChapter ? () => setChapterId(nextChapter.id) : undefined}
            />
          ) : (
            <PlaygroundShell activeId={chapter.snippet.id} />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
