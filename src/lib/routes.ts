/**
 * URL routing helpers.
 *
 * Every concept is reachable at a stable, shareable URL built from its chapter
 * id (the snippet id, e.g. `/learn/xr-back`, `/playground/transform`). The mode
 * — Learn or Playground — lives in the first path segment so the two views of a
 * concept have distinct addresses you can bookmark, link to, or land on directly.
 */
import { chapters } from '@/tutorial/chapters'
import type { AppMode } from '@/components/ModeSwitcher'

/** `/learn/<id>` or `/playground/<id>`. */
export const chapterPath = (mode: AppMode, id: string) => `/${mode}/${id}`
export const learnPath = (id: string) => chapterPath('learn', id)
export const playgroundPath = (id: string) => chapterPath('playground', id)

/**
 * Where `/` (and any unknown path) lands: the first chapter that teaches, in
 * Learn mode — falling back to its playground if, somehow, nothing has a lesson.
 */
export function defaultPath(): string {
  const first = chapters.find((c) => c.lesson) ?? chapters[0]
  return first.lesson ? learnPath(first.id) : playgroundPath(first.id)
}
