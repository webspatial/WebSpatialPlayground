import { useMemo, useState } from 'react'
import type { LessonChapter } from '@/tutorial/lesson'
import { TutorialShell } from './TutorialShell'
import { LearnLayout } from './LearnLayout'
import { ChapterOverview, type LessonStatus } from './ChapterOverview'
import { ChapterWrap } from './ChapterWrap'

type View = 'overview' | 'lesson' | 'wrap'

/**
 * Learn Mode for a multi-lesson chapter (Story 6, `<Reality>`).
 *
 * It sequences three views while the editor and preview stay visible the whole
 * time: a calm chapter *overview* (with a card per lesson and live progress),
 * each *lesson* driven by the unchanged {@link TutorialShell}, and a chapter
 * *wrap-up* once the last lesson is done. The shell owns only the cross-lesson
 * state — which lesson is active and which are complete — so every lesson reuses
 * the same guided flow, editor and preview as a single-lesson chapter.
 */
export function ChapterShell({
  chapter,
  onOpenPlayground,
  onNextStory,
}: {
  chapter: LessonChapter
  onOpenPlayground: () => void
  /** Navigate to the next story's chapter, when one exists. */
  onNextStory?: () => void
}) {
  const { lessons } = chapter
  const lastIndex = lessons.length - 1

  const [view, setView] = useState<View>('overview')
  const [index, setIndex] = useState(0)
  const [completed, setCompleted] = useState<Set<number>>(() => new Set())
  const [visited, setVisited] = useState<Set<number>>(() => new Set())

  const statuses: LessonStatus[] = useMemo(
    () =>
      lessons.map((_, i) =>
        completed.has(i) ? 'done' : visited.has(i) ? 'progress' : 'todo',
      ),
    [lessons, completed, visited],
  )

  const openLesson = (i: number) => {
    setIndex(i)
    setVisited((prev) => new Set(prev).add(i))
    setView('lesson')
  }

  // Start at the first lesson that isn't already complete, so returning to the
  // overview and pressing Start picks up where the user left off.
  const startChapter = () => {
    const next = lessons.findIndex((_, i) => !completed.has(i))
    openLesson(next === -1 ? 0 : next)
  }

  const finishLesson = () => {
    setCompleted((prev) => new Set(prev).add(index))
    if (index < lastIndex) openLesson(index + 1)
    else setView('wrap')
  }

  const resetChapter = () => {
    setCompleted(new Set())
    setVisited(new Set())
    setIndex(0)
    setView('overview')
  }

  const copyFinal = () =>
    navigator.clipboard.writeText(lessons[lastIndex].finalCode)

  if (view === 'lesson') {
    const lesson = lessons[index]
    return (
      <TutorialShell
        key={lesson.id}
        lesson={lesson}
        onOpenPlayground={onOpenPlayground}
        onNextLesson={finishLesson}
        chapterNav={{
          index,
          total: lessons.length,
          onOverview: () => setView('overview'),
        }}
      />
    )
  }

  if (view === 'wrap') {
    return (
      <LearnLayout
        fileName={lessons[lastIndex].fileName}
        code={lessons[lastIndex].finalCode}
        card={
          <ChapterWrap
            wrapUp={chapter.wrapUp}
            onCopyFinal={copyFinal}
            onResetChapter={resetChapter}
            onOpenPlayground={onOpenPlayground}
            onNextStory={onNextStory}
          />
        }
      />
    )
  }

  // Overview — seed the editor/preview with the first lesson's starting point.
  return (
    <LearnLayout
      fileName={lessons[0].fileName}
      code={lessons[0].starterCode}
      card={
        <ChapterOverview
          overview={chapter.overview}
          statuses={statuses}
          onSelectLesson={openLesson}
          onStart={startChapter}
        />
      }
    />
  )
}
