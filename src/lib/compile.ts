import { transform } from 'sucrase'
import * as React from 'react'
import * as WebSpatialSDK from '@webspatial/react-sdk'
// The WebSpatial JSX runtime. These jsx/jsxs functions are what turn an
// `enable-xr` marker into a real spatialized element at render time — the exact
// same runtime the production `vite build` compiles against. By transpiling the
// editor's source against it, the live preview is a GENUINE WebSpatial render,
// not an innerHTML preview.
import * as WebSpatialJsxRuntime from '@webspatial/react-sdk/jsx-runtime'

export interface CompileResult {
  /** The default-exported (or first exported) React component, if compilation succeeded. */
  Component: React.ComponentType | null
  /** A human-readable error (syntax / runtime), if compilation failed. */
  error: string | null
}

/**
 * The modules a playground snippet is allowed to import. Everything a real
 * WebSpatial component needs — React itself, the SDK components, and the SDK's
 * JSX runtime that the transpiler targets for `enable-xr`.
 */
function resolveModule(id: string): unknown {
  switch (id) {
    case 'react':
      return React
    case 'react/jsx-runtime':
    case 'react/jsx-dev-runtime':
    case '@webspatial/react-sdk/jsx-runtime':
    case '@webspatial/react-sdk/jsx-dev-runtime':
      return WebSpatialJsxRuntime
    case '@webspatial/react-sdk':
    case '@webspatial/core-sdk':
      return WebSpatialSDK
    default:
      throw new Error(
        `Cannot import "${id}" in the playground. Available modules: "react", "@webspatial/react-sdk".`,
      )
  }
}

/**
 * Transpile + evaluate a WebSpatial React snippet into a live component.
 *
 * The snippet is real source: it goes through the same JSX transform the SDK
 * uses at build time (`jsxImportSource: "@webspatial/react-sdk"`), so writing
 * `<div enable-xr style={{ '--xr-back': '60px' }}>` produces a genuinely
 * spatialized element — true depth on a headset, a flat fallback in a browser.
 */
export function compile(source: string): CompileResult {
  let transpiled: string
  try {
    transpiled = transform(source, {
      transforms: ['typescript', 'jsx', 'imports'],
      jsxRuntime: 'automatic',
      jsxImportSource: '@webspatial/react-sdk',
      production: true,
    }).code
  } catch (err) {
    return { Component: null, error: formatError(err, 'Syntax error') }
  }

  try {
    const moduleObj: { exports: Record<string, unknown> } = { exports: {} }
    const factory = new Function('require', 'module', 'exports', 'React', transpiled)
    factory(resolveModule, moduleObj, moduleObj.exports, React)

    const exported = moduleObj.exports
    const candidate =
      (exported.default as unknown) ??
      (exported.App as unknown) ??
      Object.values(exported).find((v) => typeof v === 'function')

    if (typeof candidate !== 'function') {
      return {
        Component: null,
        error:
          'No component found. Export a component as the default export, e.g.\n`export default function App() { … }`',
      }
    }
    return { Component: candidate as React.ComponentType, error: null }
  } catch (err) {
    return { Component: null, error: formatError(err, 'Runtime error') }
  }
}

function formatError(err: unknown, prefix: string): string {
  if (err instanceof Error) {
    // Sucrase prefixes parse errors with the transform name; trim noise.
    const msg = err.message.replace(/^Error: /, '')
    return `${prefix}: ${msg}`
  }
  return `${prefix}: ${String(err)}`
}
