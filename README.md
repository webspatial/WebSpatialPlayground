# WebSpatial Playground

Interactive examples, live code snippets, and a community gallery for spatial web development with [WebSpatial](https://webspatial.dev).

Built with React, TypeScript, Vite, and the [WebSpatial SDK](https://github.com/webspatial/webspatial-sdk).

## Features

- **CSS API** — Spatialize HTML elements with `--xr-back`, `--xr-transform`, `--xr-background-material`, and `--xr-depth` CSS custom properties
- **React Components** — `<enable-xr>`, `<model>`, and `<reality>` JSX components for spatial content
- **Event API** — Spatial tap, drag, rotate, and magnify gesture handlers
- **JS / Manifest API** — Scene initialization, viewport metrics, user agent detection, and `app.webmanifest` configuration
- **Community Gallery** — Browse spatial apps built by the community

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (2D web mode)
npm run dev
```

## Build

```bash
# Build for spatial runtime (Apple Vision Pro / PICO OS 6)
npm run build

# Build for flat 2D web
npm run build:web
```

The spatial build outputs to `dist/` and is ready for deployment on Vercel or any static host.

## Deployment

This project is configured for [Vercel](https://vercel.com). The `vercel.json` config ensures SPA routing works correctly.

## Links

- [WebSpatial Docs](https://webspatial.dev/docs)
- [WebSpatial SDK on GitHub](https://github.com/webspatial/webspatial-sdk)
