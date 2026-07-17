/**
 * Shareable playground URLs.
 *
 * The editor's source is deflate-compressed and base64url-encoded into the
 * URL's hash fragment (`#code=…`), so a playground link carries the exact code
 * someone was looking at — no backend, no database, nothing to expire. The
 * hash was chosen deliberately: it never leaves the browser (not sent to the
 * server, invisible to the SPA rewrite in vercel.json) and it layers cleanly
 * on top of the existing `/playground/:chapterId` routes.
 *
 * Payloads are versioned with a single leading character so the format can
 * evolve without breaking old links:
 *   `1` — deflate-raw compressed UTF-8 (CompressionStream), base64url
 *   `0` — plain UTF-8, base64url (fallback for browsers without
 *         CompressionStream; also what old links decode through)
 */

const HASH_PARAM = 'code'

/* ── base64url ─────────────────────────────────────────────────────────── */

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  // Chunked to keep String.fromCharCode off the argument-count ceiling.
  const CHUNK = 0x8000
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlToBytes(encoded: string): Uint8Array {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

/* ── deflate via the built-in streams API ──────────────────────────────── */

const canCompress = () =>
  typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined'

async function pipeThrough(
  bytes: Uint8Array,
  stream: CompressionStream | DecompressionStream,
): Promise<Uint8Array> {
  const compressed = new Blob([bytes as BlobPart]).stream().pipeThrough(stream)
  return new Uint8Array(await new Response(compressed).arrayBuffer())
}

/* ── payload encode / decode ───────────────────────────────────────────── */

/** Compress `code` into a URL-safe payload string (versioned, base64url). */
export async function encodeShareCode(code: string): Promise<string> {
  const utf8 = new TextEncoder().encode(code)
  if (!canCompress()) return '0' + bytesToBase64Url(utf8)
  const deflated = await pipeThrough(utf8, new CompressionStream('deflate-raw'))
  return '1' + bytesToBase64Url(deflated)
}

/** Decode a payload back to source. Returns null on any malformed input. */
export async function decodeShareCode(payload: string): Promise<string | null> {
  try {
    const version = payload[0]
    const bytes = base64UrlToBytes(payload.slice(1))
    if (version === '0') return new TextDecoder().decode(bytes)
    if (version === '1') {
      if (!canCompress()) return null
      const inflated = await pipeThrough(bytes, new DecompressionStream('deflate-raw'))
      return new TextDecoder().decode(inflated)
    }
    return null
  } catch {
    return null
  }
}

/* ── hash fragment helpers ─────────────────────────────────────────────── */

/** Pull the share payload out of a `#code=…` hash, if present. */
export function readShareHash(hash: string = window.location.hash): string | null {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  return params.get(HASH_PARAM)
}

/** `#code=<payload>` — the fragment a shared URL carries. */
export function buildShareHash(payload: string): string {
  return `#${HASH_PARAM}=${payload}`
}

/**
 * Stamp (or clear) the share payload on the current URL without touching
 * history — replaceState keeps back/forward navigation clean while the
 * address bar stays copy-paste shareable at all times.
 */
export function writeShareHash(payload: string | null): void {
  const base = window.location.pathname + window.location.search
  const next = payload == null ? base : base + buildShareHash(payload)
  if (next !== window.location.pathname + window.location.search + window.location.hash) {
    window.history.replaceState(window.history.state, '', next)
  }
}
