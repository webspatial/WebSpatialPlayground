import type { Transition, Variants } from 'framer-motion'

/**
 * The shared motion language for Learn Mode.
 *
 * The goal is Apple-like calm: motion that's quick to start and gentle to
 * settle, never bouncy, always purposeful. Everything routes through these
 * tokens so the whole tutorial — phases, steps, disclosures, the editor
 * spotlight — moves as one coherent system rather than a pile of one-off
 * transitions. Reduced-motion is honored globally via <MotionConfig
 * reducedMotion="user"> in TutorialShell, which collapses these transforms to
 * simple opacity fades for anyone who asks for less movement.
 */

// Smooth ease-out (quint-ish): fast off the line, soft landing. The default
// for anything entering the screen.
export const EASE_OUT = [0.22, 1, 0.36, 1] as const
// Symmetric ease for exits and reversible motion (collapsing disclosures).
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

/**
 * A phase or step container: fades up as a whole, then staggers its children
 * into place just behind it. Keyed in an AnimatePresence so swapping steps
 * crossfades cleanly instead of snapping.
 */
export const phaseContainer: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: EASE_OUT,
      when: 'beforeChildren',
      staggerChildren: 0.055,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.2, ease: EASE_IN_OUT },
  },
}

/** One block inside a phase — a small rise + fade as it settles into place. */
export const riseItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE_OUT } },
}

/**
 * A disclosure that grows open from nothing — used for the hint and the gentle
 * "not yet" note. Height animates to/from auto so the card reflows smoothly.
 */
export const disclosure: Variants = {
  hidden: { opacity: 0, height: 0 },
  show: {
    opacity: 1,
    height: 'auto',
    transition: {
      height: { duration: 0.3, ease: EASE_OUT },
      opacity: { duration: 0.26, ease: EASE_OUT, delay: 0.04 },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      height: { duration: 0.22, ease: EASE_IN_OUT, delay: 0.02 },
      opacity: { duration: 0.16, ease: EASE_IN_OUT },
    },
  },
}

/** Gentle spring for confirmations — a soft pop, no overshoot to speak of. */
export const softSpring: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 30,
  mass: 0.8,
}

/**
 * Press feedback for primary actions. Spread onto a motion.button; pairs with
 * variant-driven entrance animation without conflict.
 */
export const pressable = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
} as const
