/**
 * URL routing helpers.
 *
 * Every concept is reachable at a stable, shareable URL built from its chapter
 * id (the snippet id, e.g. `/learn/xr-back`, `/playground/transform`). The mode
 * — Learn or Playground — lives in the first path segment so the two views of a
 * concept have distinct addresses you can bookmark, link to, or land on directly.
 */
import { chapters } from '@/tutorial/chapters'

/** `/learn/<id>` or `/playground/<id>`. */
export const chapterPath = (mode: 'learn' | 'playground', id: string) => `/${mode}/${id}`
export const learnPath = (id: string) => chapterPath('learn', id)
export const playgroundPath = (id: string) => chapterPath('playground', id)

/**
 * The community showcase. Unlike Learn / Playground it has no per-concept id —
 * it's a single gallery page — so it gets its own top-level address.
 */
export const communityPath = () => '/community'

/**
 * Where `/` (and any unknown path) lands: the first chapter that teaches, in
 * Learn mode — falling back to its playground if, somehow, nothing has a lesson.
 */
export function defaultPath(): string {
  const first = chapters.find((c) => c.lesson || c.setup) ?? chapters[0]
  return first.lesson || first.setup ? learnPath(first.id) : playgroundPath(first.id)
}
