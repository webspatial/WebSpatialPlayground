// Post-build: make the deployed site run ONLY in WebSpatial mode.
//
// @webspatial/vite-plugin emits two variants:
//   - `vite build`            -> flat 2D bundle   at base "/"               (dist/)
//   - `XR_ENV=avp vite build` -> spatial bundle   at base "/webspatial/avp/" (dist/webspatial/avp/)
//
// A WebSpatial Runtime (PICO OS 6 / packaged visionOS) only spatializes the
// `avp` bundle. The flat bundle never spatializes. To guarantee the runtime
// always loads the spatial bundle we:
//   1. replace the root index.html with a redirect into /webspatial/avp/
//   2. point the spatial manifest's start_url/scope at /webspatial/avp/
//   3. delete the flat 2D bundle entirely (no 2D fallback)
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const avp = resolve(dist, 'webspatial/avp')

if (!existsSync(resolve(avp, 'index.html'))) {
  console.error('[spatial-only] Missing dist/webspatial/avp — run `XR_ENV=avp vite build` first.')
  process.exit(1)
}

// 1. Root redirect -> spatial bundle
writeFileSync(
  resolve(dist, 'index.html'),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>WebSpatial Playground</title>
    <meta name="theme-color" content="#7c3aed" />
    <link rel="icon" type="image/x-icon" href="/webspatial/avp/favicon.ico" />
    <meta http-equiv="refresh" content="0; url=/webspatial/avp/" />
    <script>window.location.replace('/webspatial/avp/' + window.location.search + window.location.hash);</script>
    <style>html,body{margin:0;height:100%;background:#0a0a0f;color:#e5e7eb;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;display:flex;align-items:center;justify-content:center}a{color:#a78bfa}</style>
  </head>
  <body>
    <p>Loading the WebSpatial app… If you are not redirected, <a href="/webspatial/avp/">open the spatial build</a>.</p>
  </body>
</html>
`,
)

// 2. Spatial manifest points at itself
const manifestPath = resolve(avp, 'app.webmanifest')
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
manifest.start_url = '/webspatial/avp/'
manifest.scope = '/webspatial/avp/'
manifest.icons = (manifest.icons || []).map((i) => ({
  ...i,
  src: i.src.startsWith('/webspatial/avp/') ? i.src : `/webspatial/avp${i.src.startsWith('/') ? '' : '/'}${i.src}`,
}))
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')

// 3. Remove the flat 2D bundle (no fallback)
for (const f of ['assets', 'app.webmanifest']) {
  rmSync(resolve(dist, f), { recursive: true, force: true })
}

console.log('[spatial-only] dist is now WebSpatial-only (root -> /webspatial/avp/, flat bundle removed).')
