<p align="center">
  <img src="public/webspatial-logo.svg" alt="WebSpatial" width="320" />
</p>

# WebSpatial Playground

A **live editor** for spatial web development with [WebSpatial](https://webspatial.dev). Write real React + WebSpatial code on the left, watch a genuine WebSpatial component render on the right — and update as you type.

Built with React, TypeScript, Vite, and the [WebSpatial SDK](https://github.com/webspatial/webspatial-sdk).

## How the live editor works

This is **not** an `innerHTML` preview. Editor source is compiled the same way a production `vite build` compiles a WebSpatial app:

1. Your code is transpiled in the browser with [Sucrase](https://github.com/alangpierce/sucrase) using the **automatic JSX runtime targeting `@webspatial/react-sdk`** — the exact `jsxImportSource` the SDK uses at build time.
2. The transpiled module is evaluated against React and the WebSpatial SDK, and its default export is rendered into the preview inside an error boundary.

Because the snippet runs through the SDK's real JSX runtime, an `enable-xr` marker or a `--xr-*` CSS property produces a **genuinely spatialized element** — true depth, materials and gestures on Apple Vision Pro / PICO OS 6, and an honest flat fallback in an ordinary browser. See [`src/lib/compile.ts`](src/lib/compile.ts).

## Two modes

A top-level switch in the header chooses how you explore:

- **Learn Mode** *(default)* — a calm, guided tutorial inspired by Apple's Develop in Swift tutorials. The code, the live preview and the current step stay on screen together, and each chapter walks straight into the next. Lessons are data-driven ([`src/tutorial/lesson.ts`](src/tutorial/lesson.ts)) so future chapters reuse the same shell. Chapters so far:
  1. **Spatialized HTML Elements** — *Lift a normal card into space*: `enable-xr` → [`--xr-back`](https://webspatial.dev/docs/api/react-sdk/css-api/back) → [`--xr-background-material`](https://webspatial.dev/docs/api/react-sdk/css-api/background-material) → live state-driven depth.
  2. **CSS API: Spatial Transform** — *Rotate a spatial card in true 3D*: spatial transform reuses normal CSS [`transform`](https://webspatial.dev/docs/api/react-sdk/css-api/transform) — `rotateY` → `rotateX` → `transform-origin` → `translateZ` vs `--xr-back`.
- **Playground Mode** — the open workbench with every example at once, for users who already know their way around.

## Examples (Playground Mode)

Each example is a full, editable component. Switch with the chips along the top:

- **Spatialized HTML Elements** — `enable-xr`, [`--xr-back`](https://webspatial.dev/docs/api/react-sdk/css-api/back), [`--xr-background-material`](https://webspatial.dev/docs/api/react-sdk/css-api/background-material)
- **CSS API: Spatial Transform** — [spatial CSS `transform`](https://webspatial.dev/docs/api/react-sdk/css-api/transform)
- **CSS API: background-material** — cycling the [`--xr-background-material`](https://webspatial.dev/docs/api/react-sdk/css-api/background-material) backplates
- **Natural Interactions** — [`onSpatialTap`](https://webspatial.dev/docs/api/react-sdk/event-api/spatial-tap) / [`onSpatialDrag`](https://webspatial.dev/docs/api/react-sdk/event-api/spatial-drag)
- **3D Content Containers: `<Model>`** — a 3D asset (`.glb` / `.usdz`) via the [`<Model>`](https://webspatial.dev/docs/api/react-sdk/react-components/Model) component
- **3D Content Containers: `<Reality>`** — programmable 3D with the [`<Reality>`](https://webspatial.dev/docs/api/react-sdk/react-components/Reality) scene-graph API
- **Dynamic 3D Containers: Animation** — a live, frame-driven equalizer of `Box` entities

## Getting Started

```bash
pnpm install
pnpm dev        # 2D web mode
```

## Build

```bash
pnpm build      # spatial runtime (Apple Vision Pro / PICO OS 6) -> dist/
pnpm build:web  # flat 2D web
```

## Documentation

- [WebSpatial Docs](https://webspatial.dev/docs)
- [Full LLM-readable docs (`llms-full.txt`)](https://webspatial.dev/llms-full.txt)
- [WebSpatial SDK on GitHub](https://github.com/webspatial/webspatial-sdk)
