# WebSpatial Playground — Hackathon One-Pager

> A live, in-browser code editor that teaches and demos **spatial web development** — write real React + WebSpatial code on the left, watch a *genuine* spatialized component render on the right, updating as you type.

---

## The Problem

[WebSpatial](https://webspatial.dev) lets developers build spatial apps for **Apple Vision Pro** and **PICO OS 6** using ordinary React + CSS — an `enable-xr` marker and `--xr-*` CSS properties lift flat UI into true 3D depth. But the on-ramp is steep: you need a headset (or simulator), a full toolchain, and a mental model of how a normal `<div>` becomes a spatial element. There was no fast, zero-install way to *see it happen*.

## The Solution

A browser-based **live editor with production parity**. The twist that makes it more than a toy: snippets are compiled the exact same way a production `vite build` compiles a WebSpatial app, so what you see is an honest render — not a mockup.

- **Learn Mode** *(default)* — calm, Apple-"Develop in Swift"-style guided tutorials. Code, live preview, and the current step stay on screen together; chapters flow one into the next. A **"Do it for me"** affordance applies each step's edit for you, robust to manual drift.
- **Playground Mode** — the open workbench: every example at once as a fully editable component, switched via chips.
- **Community** — a showcase tab of real WebSpatial demos.

## How It Works (the core trick)

`src/lib/compile.ts` is the heart of the project:

1. **Transpile in-browser with [Sucrase](https://github.com/alangpierce/sucrase)** — `typescript`, `jsx`, `imports` transforms, `jsxRuntime: 'automatic'`, and crucially `jsxImportSource: '@webspatial/react-sdk'` — the *exact* JSX runtime the SDK targets at build time.
2. **Evaluate** the transpiled module via `new Function(...)` against a tiny whitelisted module resolver (`react` + `@webspatial/react-sdk`).
3. **Render** the exported component into a live preview wrapped in an error boundary, recompiled on a 250ms debounce as you type.

Because the snippet runs through the SDK's *real* JSX runtime, an `enable-xr` marker or a `--xr-*` property produces a **genuinely spatialized element** — true depth, materials, and gestures on a headset, with an honest flat fallback in a normal browser. This is **not** an `innerHTML` preview.

## What You Can Build

Examples cover the spread of the SDK: spatialized HTML elements (`--xr-back`, `--xr-background-material`), spatial CSS `transform` in true 3D, natural interactions (`onSpatialTap` / `onSpatialDrag`), 3D content containers (`<Model>` for `.glb`/`.usdz`, `<Reality>` scene-graph API), and a frame-driven animated 3D equalizer.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript + Vite 6 |
| Spatial runtime | `@webspatial/react-sdk` / `core-sdk` 1.7 + `@webspatial/vite-plugin` |
| In-browser compile | Sucrase 3.35 (transpile-only, no bundler/wasm) |
| Editor | Custom lightweight editor — transparent `<textarea>` over a Prism.js-highlighted `<pre>` |
| UI | Tailwind + shadcn/ui (Radix) + Framer Motion |
| Deploy | Vercel (SPA rewrites, `vite build`) |

## Design Decisions & Trade-offs

- **Constrained on purpose.** Imports are whitelisted to `react` + the WebSpatial SDK. No arbitrary npm, no multi-file projects — unlike JSFiddle/CodeSandbox. The payoff is *authenticity*: every render is exactly what production would produce, with nothing to misconfigure.
- **No server, no sandboxed iframe.** Compilation and evaluation happen in the page itself — instant feedback, zero backend, trivial to deploy. It's a trusted learning tool, not an untrusted-code arena.
- **Data-driven lessons.** Tutorials live as data (`src/tutorial/*.ts`), so new chapters reuse the same shell — fast to extend during a hackathon.

## Status & Numbers

~57 commits across feature branches; 7+ tutorial stories, a multi-file setup walkthrough with a validation checklist, a Community showcase, and a cookie-backed welcome splash. Builds and deploys to Vercel as a static SPA.

## What's Next

Loosen the import whitelist for richer demos, optional multi-file projects, shareable snippet URLs, and a live headset/simulator handoff.
