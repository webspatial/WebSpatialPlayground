import { useNavigate } from 'react-router-dom'
import { chapters } from '@/tutorial/chapters'
import { defaultPath, playgroundPath } from '@/lib/routes'
import { AppHeader } from './AppHeader'
import { CommunityShell } from './CommunityShell'
import type { AppMode } from './ModeSwitcher'

/**
 * The `/community` route: the shared chrome plus the showcase gallery. It has no
 * chapter rail and no per-concept id — it's a single page — so it lives outside
 * the Learn/Playground `App` shell. Switching back to Learn or Playground lands
 * on their default concept.
 */
export function CommunityPage() {
  const navigate = useNavigate()

  const onModeChange = (m: AppMode) => {
    if (m === 'community') return
    if (m === 'playground') {
      const firstDemo = chapters.find((c) => c.snippet)
      navigate(firstDemo ? playgroundPath(firstDemo.id) : defaultPath())
    } else {
      navigate(defaultPath())
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0f] text-white">
      <AppHeader mode="community" onModeChange={onModeChange} />
      <div className="flex min-h-0 flex-1">
        <CommunityShell />
      </div>
    </div>
  )
}
