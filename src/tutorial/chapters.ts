/**
 * The app's table of contents.
 *
 * A "chapter" is one WebSpatial concept (e.g. "Spatialized HTML Elements"). Each
 * concept can be approached two ways: a guided Learn lesson and/or an open
 * Playground example. They've always been the same concepts under two names —
 * a lesson's `chapter` equals the matching snippet's `title` — so this module
 * joins them into a single, ordered list that both modes navigate from. That's
 * what lets the user pick a concept once and switch between learning it and
 * tinkering with it without losing their place.
 */
import { lessons, type Lesson, type LessonChapter } from './lesson'
import { setupLesson, type SetupLesson } from './setup'
import { realityChapter } from './realityChapter'
import { snippets, type Snippet } from '@/examples/snippets'

export interface Chapter {
  /** Stable key — reuses the snippet id (or the setup lesson id for Story 0). */
  id: string
  /** The concept name, shown in navigation. */
  title: string
  /** The guided lesson for this concept, when one exists. */
  lesson?: Lesson
  /**
   * A multi-lesson chapter for this concept, when the concept is too big for a
   * single lesson (e.g. `<Reality>`). Mutually exclusive with `lesson`.
   */
  lessonChapter?: LessonChapter
  /**
   * The Story 0 setup walkthrough, when this chapter is the setup chapter. It's
   * a Learn-only chapter, so it has no snippet — Playground falls back to Learn.
   */
  setup?: SetupLesson
  /** The open playground example for this concept, when one exists. */
  snippet?: Snippet
}

/** Story 0 — a Learn-only setup chapter that sits before the first concept. */
const setupChapter: Chapter = {
  id: setupLesson.id,
  title: setupLesson.chapter,
  setup: setupLesson,
}

/** Multi-lesson chapters, keyed by the concept id they teach. */
const lessonChapters: LessonChapter[] = [realityChapter]

/**
 * Concept-ordered chapters. Story 0 (setup) leads, then the snippet order is the
 * teaching progression: we walk it and attach the guided lesson — single-lesson
 * or multi-lesson — that teaches the same concept (matched by name / id).
 */
export const chapters: Chapter[] = [
  setupChapter,
  ...snippets.map((snippet) => ({
    id: snippet.id,
    title: snippet.title,
    snippet,
    lesson: lessons.find((l) => l.chapter === snippet.title),
    lessonChapter: lessonChapters.find((c) => c.id === snippet.id),
  })),
]

/** Does this chapter offer something to learn, in any form? */
export function chapterCanLearn(c: Chapter): boolean {
  return !!c.lesson || !!c.lessonChapter || !!c.setup
}

/**
 * A one-line description of a chapter, pulled from whichever form it carries —
 * the setup intro, a multi-lesson chapter's subtitle, a single lesson's intro,
 * or the playground snippet's blurb. Used by the splash screen so each chapter
 * card explains itself without duplicating copy.
 */
export function chapterBlurb(c: Chapter): string {
  if (c.setup) return c.setup.intro
  if (c.lessonChapter) return c.lessonChapter.overview.subtitle
  if (c.lesson) return c.lesson.intro
  return c.snippet?.blurb ?? ''
}

/** Look up a chapter by id, falling back to the first chapter. */
export function chapterById(id: string): Chapter {
  return chapters.find((c) => c.id === id) ?? chapters[0]
}

/**
 * The lesson to walk into after `id` — but only when it's the *immediately*
 * following chapter. We don't leap over an unbuilt chapter to a later lesson:
 * if the next concept has no lesson yet, the wrap-up keeps its calm "coming
 * next" lock instead of offering a button that would skip ahead. (Today this
 * keeps the last built lesson, Story 5, pointing at "<Reality>" as a locked
 * "coming next" rather than jumping past it to some later lesson.)
 */
export function nextLessonChapter(id: string): Chapter | undefined {
  const idx = chapters.findIndex((c) => c.id === id)
  const next = chapters[idx + 1]
  return next && chapterCanLearn(next) ? next : undefined
}
