import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap,
  FlaskConical,
  ArrowRight,
  Check,
  X,
  Sparkles,
} from 'lucide-react'
import { chapters, chapterCanLearn, chapterBlurb } from '@/tutorial/chapters'
import { learnPath, playgroundPath, defaultPath } from '@/lib/routes'
import { getCookie, setCookie } from '@/lib/cookies'
import { phaseContainer, riseItem, pressable } from './tutorial/motion'

/**
 * The cookie that remembers a "don't show again" choice. Presence (value `'1'`)
 * is all that matters; it expires on its own after a year.
 */
const SPLASH_COOKIE = 'ws-splash-dismissed'

/** Has the user opted out of the splash on a previous visit? */
function alreadyDismissed(): boolean {
  return getCookie(SPLASH_COOKIE) === '1'
}

/**
 * A big, calm welcome screen shown on first load. It explains what the
 * WebSpatial Playground is, lets the user launch straight into any chapter, and
 * offers a cookie-backed "Don't show this again" so returning visitors drop
 * directly into the tutorials.
 *
 * Mounted once, above the router outlet: it owns its own visibility (seeded from
 * the cookie) and simply navigates + fades away when the user picks a way in.
 */
export function SplashScreen() {
  // Decide visibility once, synchronously, from the cookie — so a returning
  // visitor never sees a flash of the splash before it's dismissed.
  const [visible, setVisible] = useState(() => !alreadyDismissed())
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const navigate = useNavigate()

  // Esc closes the splash for this session (without persisting the choice).
  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  /** Honor "don't show again", then hide the splash. */
  function close() {
    if (dontShowAgain) setCookie(SPLASH_COOKIE, '1')
    setVisible(false)
  }

  /** Close, then navigate into the chosen chapter / mode. */
  function launch(path: string) {
    close()
    navigate(path)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#08080d]/85 px-4 py-8 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Welcome to WebSpatial Playground"
        >
          {/* Soft violet aura behind the panel. */}
          <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_50%_28%,rgba(124,58,237,0.22),transparent_60%)]" />

          <motion.div
            // Stop backdrop clicks from closing when they land on the panel.
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c16]/95 shadow-[0_40px_120px_rgba(124,58,237,0.25)]"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/5 hover:text-white/80"
            >
              <X size={16} />
            </button>

            <motion.div
              className="flex flex-col gap-7 px-7 py-9 sm:px-10 sm:py-11"
              variants={phaseContainer}
              initial="hidden"
              animate="show"
            >
              {/* ─── Headline ─── */}
              <motion.div variants={riseItem} className="flex flex-col gap-4">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/webspatial-logo.svg"
                    alt="WebSpatial"
                    className="h-5 w-auto opacity-90"
                  />
                  <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-500/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-violet-200">
                    <Sparkles size={10} />
                    Playground
                  </span>
                </div>
                <h1 className="text-[28px] font-bold leading-tight text-white sm:text-[34px]">
                  Learn spatial web,
                  <br className="hidden sm:block" /> one card at a time.
                </h1>
                <p className="max-w-xl text-[14px] leading-relaxed text-white/55">
                  A live editor for{' '}
                  <span className="text-white/80">WebSpatial</span>. In{' '}
                  <span className="inline-flex items-center gap-1 text-violet-200">
                    <GraduationCap size={13} />Learn Mode
                  </span>{' '}
                  a guided lesson types real code beside a genuine spatial
                  preview; in{' '}
                  <span className="inline-flex items-center gap-1 text-violet-200">
                    <FlaskConical size={13} />Playground Mode
                  </span>{' '}
                  every example is open for tinkering. Pick a chapter to begin.
                </p>
              </motion.div>

              {/* ─── Chapter launcher ─── */}
              <motion.div variants={riseItem} className="flex flex-col gap-2.5">
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/35">
                  Jump into a chapter
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {chapters.map((ch, i) => {
                    const canLearn = chapterCanLearn(ch)
                    const path = canLearn
                      ? learnPath(ch.id)
                      : playgroundPath(ch.id)
                    return (
                      <button
                        key={ch.id}
                        onClick={() => launch(path)}
                        className="group flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3 text-left transition-colors hover:border-violet-400/30 hover:bg-violet-500/[0.08]"
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[11px] font-semibold tabular-nums text-white/45 transition-colors group-hover:bg-violet-500/25 group-hover:text-violet-100">
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5">
                            <span className="text-[13px] font-medium leading-snug text-white/85">
                              {ch.title}
                            </span>
                            {canLearn ? (
                              <GraduationCap
                                size={11}
                                className="shrink-0 text-violet-300/60"
                              />
                            ) : (
                              <FlaskConical
                                size={11}
                                className="shrink-0 text-white/30"
                              />
                            )}
                          </span>
                          <span className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-white/45">
                            {chapterBlurb(ch)}
                          </span>
                        </span>
                        <ArrowRight
                          size={14}
                          className="mt-1 shrink-0 text-white/15 transition-colors group-hover:text-violet-300"
                        />
                      </button>
                    )
                  })}
                </div>
              </motion.div>

              {/* ─── Footer: don't-show-again + primary action ─── */}
              <motion.div
                variants={riseItem}
                className="flex flex-col-reverse items-stretch gap-4 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <button
                  onClick={() => setDontShowAgain((v) => !v)}
                  className="flex items-center gap-2 text-[12.5px] text-white/50 transition-colors hover:text-white/75"
                >
                  <span
                    className={`flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border transition-colors ${
                      dontShowAgain
                        ? 'border-violet-400/60 bg-violet-500/30 text-violet-100'
                        : 'border-white/15 bg-white/5'
                    }`}
                  >
                    {dontShowAgain && <Check size={12} strokeWidth={3} />}
                  </span>
                  Don't show this again
                </button>

                <motion.button
                  {...pressable}
                  onClick={() => launch(defaultPath())}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-violet-400/30 bg-violet-500/25 px-5 py-2.5 text-[13.5px] font-semibold text-violet-50 transition-colors hover:bg-violet-500/35"
                >
                  Start learning
                  <ArrowRight size={15} />
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
