/**
 * Tiny cookie helpers.
 *
 * Kept deliberately small — the only persistent client state this app needs is
 * "has the user dismissed the splash screen?", and a cookie (rather than
 * localStorage) is what the product asked for: it survives reloads, expires on
 * its own, and is trivial to clear. Everything is defensive about running
 * without a `document` (SSR / tests) so importing this module is always safe.
 */

/** Read a cookie by name, or `null` when it isn't set. */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const prefix = `${encodeURIComponent(name)}=`
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(prefix))
  return match ? decodeURIComponent(match.slice(prefix.length)) : null
}

/**
 * Write a cookie that lasts `days` (default ~1 year). `SameSite=Lax` keeps it
 * first-party and `path=/` makes it visible on every route, so a deep link
 * lands the same way the home route does.
 */
export function setCookie(name: string, value: string, days = 365): void {
  if (typeof document === 'undefined') return
  const maxAge = days * 24 * 60 * 60
  document.cookie =
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}` +
    `; max-age=${maxAge}; path=/; SameSite=Lax`
}
