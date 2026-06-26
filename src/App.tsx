import { useMemo } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import './App.css'
import { chapters, chapterCanLearn, nextLessonChapter } from './tutorial/chapters'
import { chapterPath, communityPath, defaultPath, learnPath, playgroundPath } from './lib/routes'
import { type AppMode } from './components/ModeSwitcher'
import { AppHeader } from './components/AppHeader'
import { ChapterRail } from './components/ChapterRail'
import { TutorialShell } from './components/tutorial/TutorialShell'
import { SetupShell } from './components/tutorial/SetupShell'
import { ChapterShell } from './components/tutorial/ChapterShell'
import { PlaygroundShell } from './components/PlaygroundShell'

// `mode` comes from the route (`/learn/...` vs `/playground/...`); the concept
// comes from the `:chapterId` URL param. The URL is the single source of truth
// for what's on screen, so every lesson and playground has its own shareable
// address and navigation is just a route change. (Community Mode is a separate
// gallery route, handled by `CommunityPage`.)
function App({ mode }: { mode: 'learn' | 'playground' }) {
  const navigate = useNavigate()
  const { chapterId = '' } = useParams()

  const chapter = useMemo(() => chapters.find((c) => c.id === chapterId), [chapterId])
  const nextChapter = useMemo(() => nextLessonChapter(chapterId), [chapterId])
  // The chapter immediately after this one, regardless of whether it teaches a
  // lesson — used by a multi-lesson chapter's "next story" link, which may point
  // at a demo-only chapter (it simply opens in Playground Mode).
  const rawNextChapter = useMemo(() => {
    const idx = chapters.findIndex((c) => c.id === chapterId)
    return chapters[idx + 1]
  }, [chapterId])

  // Unknown concept in the URL → bounce to the default landing route.
  if (!chapter) return <Navigate to={defaultPath()} replace />

  // A concept can teach as a single lesson, a multi-lesson chapter, or the
  // Story 0 setup walkthrough.
  const canLearn = chapterCanLearn(chapter)
  // Learn requested on a demo-only chapter → redirect to its playground so the
  // URL always reflects exactly what's shown.
  if (mode === 'learn' && !canLearn) {
    return <Navigate to={playgroundPath(chapter.id)} replace />
  }
  // Playground requested on a Learn-only chapter (Story 0 setup) → keep the URL
  // honest by bouncing to its lesson; there is no demo to show.
  if (mode === 'playground' && !chapter.snippet) {
    return <Navigate to={learnPath(chapter.id)} replace />
  }

  // Switching modes keeps the user on the same concept. Asking to Learn a
  // demo-only chapter jumps to the nearest one that teaches; asking for a demo
  // on a Learn-only chapter jumps to the nearest one that has one.
  const onModeChange = (m: AppMode) => {
    if (m === 'community') {
      navigate(communityPath())
    } else if (m === 'learn' && !canLearn) {
      const firstLesson = chapters.find(chapterCanLearn) ?? chapter
      navigate(learnPath(firstLesson.id))
    } else if (m === 'playground' && !chapter.snippet) {
      const firstDemo = chapters.find((c) => c.snippet) ?? chapter
      navigate(playgroundPath(firstDemo.id))
    } else {
      navigate(chapterPath(m, chapter.id))
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0f] text-white">
      {/* ─── Shared top bar ─── */}
      <AppHeader mode={mode} onModeChange={onModeChange} />

      {/* ─── Body: shared chapter rail + the active mode ─── */}
      <div className="flex min-h-0 flex-1">
        <ChapterRail
          activeId={chapter.id}
          mode={mode}
          onSelect={(id) => navigate(chapterPath(mode, id))}
        />
        <div className="flex min-h-0 flex-1 flex-col">
          {mode === 'learn' && chapter.setup ? (
            <SetupShell
              // Remount on chapter change so the shell reseeds its files + phase.
              key={chapter.setup.id}
              lesson={chapter.setup}
              onNextLesson={nextChapter ? () => navigate(learnPath(nextChapter.id)) : undefined}
            />
          ) : mode === 'learn' && chapter.lessonChapter ? (
            <ChapterShell
              // Remount on chapter change so cross-lesson state resets cleanly.
              key={chapter.lessonChapter.id}
              chapter={chapter.lessonChapter}
              onOpenPlayground={() => navigate(playgroundPath(chapter.id))}
              onNextStory={
                rawNextChapter
                  ? () => navigate(playgroundPath(rawNextChapter.id))
                  : undefined
              }
            />
          ) : mode === 'learn' && chapter.lesson ? (
            <TutorialShell
              // Remount on lesson change so the shell reseeds its editor + phase.
              key={chapter.lesson.id}
              lesson={chapter.lesson}
              onOpenPlayground={() => navigate(playgroundPath(chapter.id))}
              onNextLesson={nextChapter ? () => navigate(learnPath(nextChapter.id)) : undefined}
            />
          ) : chapter.snippet ? (
            <PlaygroundShell activeId={chapter.snippet.id} />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default App
