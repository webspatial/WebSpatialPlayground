import { useMemo } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import './App.css'
import { docLinks } from './examples/snippets'
import { chapters, nextLessonChapter } from './tutorial/chapters'
import { chapterPath, defaultPath, learnPath, playgroundPath } from './lib/routes'
import { RuntimeBadge } from './components/RuntimeBanner'
import { ModeSwitcher, type AppMode } from './components/ModeSwitcher'
import { ChapterRail } from './components/ChapterRail'
import { TutorialShell } from './components/tutorial/TutorialShell'
import { PlaygroundShell } from './components/PlaygroundShell'
import { BookOpen, Github, FileCode2 } from 'lucide-react'

// `mode` comes from the route (`/learn/...` vs `/playground/...`); the concept
// comes from the `:chapterId` URL param. The URL is the single source of truth
// for what's on screen, so every lesson and playground has its own shareable
// address and navigation is just a route change.
function App({ mode }: { mode: AppMode }) {
  const navigate = useNavigate()
  const { chapterId = '' } = useParams()

  const chapter = useMemo(() => chapters.find((c) => c.id === chapterId), [chapterId])
  const nextChapter = useMemo(() => nextLessonChapter(chapterId), [chapterId])

  // Unknown concept in the URL → bounce to the default landing route.
  if (!chapter) return <Navigate to={defaultPath()} replace />

  const canLearn = !!chapter.lesson
  // Learn requested on a demo-only chapter → redirect to its playground so the
  // URL always reflects exactly what's shown.
  if (mode === 'learn' && !canLearn) {
    return <Navigate to={playgroundPath(chapter.id)} replace />
  }

  // Switching modes keeps the user on the same concept. Asking to Learn a
  // demo-only chapter instead jumps to the nearest one that actually teaches.
  const onModeChange = (m: AppMode) => {
    if (m === 'learn' && !canLearn) {
      const firstLesson = chapters.find((c) => c.lesson) ?? chapter
      navigate(learnPath(firstLesson.id))
    } else {
      navigate(chapterPath(m, chapter.id))
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0f] text-white">
      {/* ─── Shared top bar ─── */}
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

      {/* ─── Body: shared chapter rail + the active mode ─── */}
      <div className="flex min-h-0 flex-1">
        <ChapterRail
          activeId={chapter.id}
          mode={mode}
          onSelect={(id) => navigate(chapterPath(mode, id))}
        />
        <div className="flex min-h-0 flex-1 flex-col">
          {mode === 'learn' && chapter.lesson ? (
            <TutorialShell
              // Remount on lesson change so the shell reseeds its editor + phase.
              key={chapter.lesson.id}
              lesson={chapter.lesson}
              onOpenPlayground={() => navigate(playgroundPath(chapter.id))}
              onNextLesson={nextChapter ? () => navigate(learnPath(nextChapter.id)) : undefined}
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
