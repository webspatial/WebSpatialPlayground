import { version as sdkVersion } from '@webspatial/react-sdk'

/**
 * Real WebSpatial runtime detection via navigator.userAgent.
 * See https://webspatial.dev/docs/api/react-sdk/dom-api/userAgent
 *
 * WebSpatial apps ALWAYS degrade to flat 2D in an ordinary browser — that is the
 * SDK's designed cross-platform behavior, not a bug. True spatial rendering only
 * happens inside a WebSpatial Runtime (Apple Vision Pro / PICO OS 6).
 */
export interface RuntimeInfo {
  /** Inside any WebSpatial Runtime (UA contains `WebSpatial/<version>`). */
  isWebSpatial: boolean
  /** visionOS (Vision Pro) WebSpatial app shell. */
  isVisionOS: boolean
  /** PICO OS 6 built-in Web App Runtime. */
  isPico: boolean
  /** Any spatial runtime is active. */
  isSpatial: boolean
  /** The WebSpatial runtime version parsed from the UA, if present. */
  runtimeVersion?: string
  /** The build variant this bundle was compiled for ("avp" or web). */
  buildEnv: string
  /** Installed @webspatial/react-sdk version. */
  sdkVersion: string
  ua: string
}

export function detectRuntime(): RuntimeInfo {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  const wsMatch = ua.match(/WebSpatial\/(\S+)/)
  const picoMatch = ua.match(/PicoWebApp\/(\S+)/)
  const isWebSpatial = !!wsMatch
  const isVisionOS = ua.includes('Macintosh') && ua.includes('WSAppShell')
  const isPico = !!picoMatch
  // import.meta.env.XR_ENV is injected by @webspatial/vite-plugin at build time.
  const buildEnv =
    (import.meta as unknown as { env?: Record<string, string> }).env?.XR_ENV || 'web'
  return {
    isWebSpatial,
    isVisionOS,
    isPico,
    isSpatial: isWebSpatial || isVisionOS || isPico,
    runtimeVersion: wsMatch?.[1] ?? picoMatch?.[1],
    buildEnv,
    sdkVersion,
    ua,
  }
}
