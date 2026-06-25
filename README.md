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

## Examples

Each example is a full, editable component. Switch with the chips along the top:

- **Floating glass card** — `enable-xr`, [`--xr-back`](https://webspatial.dev/docs/api/react-sdk/css-api/back), [`--xr-background-material`](https://webspatial.dev/docs/api/react-sdk/css-api/background-material)
- **True 3D transform** — [spatial CSS `transform`](https://webspatial.dev/docs/api/react-sdk/css-api/transform)
- **Background materials** — cycling the [`--xr-background-material`](https://webspatial.dev/docs/api/react-sdk/css-api/background-material) backplates
- **Spatial gestures** — [`onSpatialTap`](https://webspatial.dev/docs/api/react-sdk/event-api/spatial-tap) / [`onSpatialDrag`](https://webspatial.dev/docs/api/react-sdk/event-api/spatial-drag)
- **`<Model>`** — a 3D asset (`.glb` / `.usdz`) via the [`<Model>`](https://webspatial.dev/docs/api/react-sdk/react-components/Model) component
- **`<Reality>`** — programmable 3D with the [`<Reality>`](https://webspatial.dev/docs/api/react-sdk/react-components/Reality) scene-graph API
- **Animated `<Reality>`** — a live, frame-driven equalizer of `Box` entities

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
- [SDK test-server examples](https://webspatial-sdk-test-server.vercel.app/#/)
