/**
 * Story 0 · "Set up WebSpatial in a React app".
 *
 * Unlike the code lessons (`./lesson`), which teach one editable component file
 * against a live WebSpatial render, Story 0 teaches the *project setup* a
 * beginner does right after installing the SDK. That means several config files
 * in the editor (package.json, tsconfig.json, main.tsx, App.tsx, index.html,
 * app.webmanifest) and a calm setup *checklist* preview instead of a live render
 * — the right-hand stage shows validation status and the browser-fallback vs
 * WebSpatial-Runtime mental model rather than a component.
 *
 * IMPORTANT — verified against the installed SDK (see `currentSdkNote`):
 * `@webspatial/react-sdk@1.7.0`, the version this project locks to, does NOT yet
 * export a `SpatialBoot` component (nor `bootSpatial` / `useSpatialReady`). In
 * 1.7.0 the spatial boot is handled for you by `jsxImportSource` +
 * `@webspatial/vite-plugin`. This story teaches `SpatialBoot` as the intended
 * app-level boot wrapper — the recommended mental model going forward — and is
 * honest about the installed reality through the always-visible "Current SDK"
 * note so a beginner is never misled into a broken import.
 */
import type { LessonMeta, TutorialStep } from './lesson'

/** One file shown in the setup editor's tab strip. */
export interface SetupFile {
  /** Path-style label shown on the tab (e.g. `src/main.tsx`). */
  name: string
  /** Prism language for highlighting (`tsx`, `json`, `markup`). */
  language: string
  /** The step-1 baseline content the editor seeds from. */
  content: string
  /** The completed content, used by "Copy final code". */
  final?: string
}

/**
 * A setup step — a {@link TutorialStep} plus `file`: which editor tab this step
 * edits and validates against. When `file` is omitted the step is a manual /
 * observational one (run a command, open a browser) and simply carries forward.
 * Reusing TutorialStep lets the shared StepCard render setup steps unchanged.
 */
export interface SetupStep extends TutorialStep {
  /** Which file tab this step targets; validation + auto-type run against it. */
  file?: string
}

export interface SetupLesson extends LessonMeta {
  id: string
  /** The files shown in the editor, in tab order. */
  files: SetupFile[]
  steps: SetupStep[]
  /**
   * The honest, always-visible note reconciling what this story teaches
   * (`SpatialBoot`) with the installed SDK (1.7.0, which boots via
   * `jsxImportSource` + `@webspatial/vite-plugin`).
   */
  currentSdkNote: string
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Starter files — a fresh Vite + React + TS project, before WebSpatial   */
/* ────────────────────────────────────────────────────────────────────── */

const packageJsonStarter = `{
  "name": "my-webspatial-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "vite": "^5.4.0"
  }
}`

const packageJsonFinal = `{
  "name": "my-webspatial-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@webspatial/react-sdk": "^1.7.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "vite": "^5.4.0"
  }
}`

const tsconfigStarter = `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true
  },
  "include": ["src"]
}`

const tsconfigFinal = `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "jsxImportSource": "@webspatial/react-sdk",
    "strict": true,
    "noEmit": true
  },
  "include": ["src"]
}`

const mainStarter = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)`

const mainFinal = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SpatialBoot } from '@webspatial/react-sdk'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpatialBoot
      onReady={() => console.log('WebSpatial ready')}
      onError={(error) => console.error('WebSpatial boot failed', error)}
    >
      <App />
    </SpatialBoot>
  </StrictMode>,
)`

const appStarter = `export default function App() {
  return (
    <main>
      <h1>WebSpatial is ready</h1>
      <p>A normal React app — about to gain a spatial-ready element.</p>
    </main>
  )
}`

const appFinal = `export default function App() {
  return (
    <main>
      <h1>WebSpatial is ready</h1>
      <div enable-xr>
        This element can become spatial.
      </div>
    </main>
  )
}`

const indexHtmlStarter = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My WebSpatial App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`

const indexHtmlFinal = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="manifest" href="/app.webmanifest" />
    <title>My WebSpatial App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`

// The manifest already exists in the project from the start — Story 0's job for
// it is a quick verify + a link from index.html, not authoring it from scratch.
const manifestContent = `{
  "name": "WebSpatial Playground",
  "short_name": "WebSpatial",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0b1020",
  "theme_color": "#0b1020",
  "icons": []
}`

/* ────────────────────────────────────────────────────────────────────── */

export const setupLesson: SetupLesson = {
  id: 'setup-webspatial',
  chapter: 'Set up WebSpatial in a React app',
  title: 'Boot WebSpatial safely with SpatialBoot',
  intro:
    'Before the spatial tutorials, get a React project ready for WebSpatial: install the SDK, connect the JSX runtime, and wrap your app with SpatialBoot — keeping the normal web workflow intact.',
  learn: [
    'What to do right after installing the WebSpatial SDK',
    'How jsxImportSource connects JSX to the WebSpatial React SDK',
    'How SpatialBoot wraps the app and prepares WebSpatial after mount',
    'How onReady and onError make boot behaviour visible',
    'Why a normal browser still renders fallback content',
    'How browser preview differs from WebSpatial Runtime preview',
  ],
  currentSdkNote:
    'Verified against the installed @webspatial/react-sdk@1.7.0: in this version the spatial boot is handled for you by jsxImportSource + @webspatial/vite-plugin, and SpatialBoot is not yet a published export. This story teaches SpatialBoot as the intended app-level boot wrapper; on 1.7.0 the JSX-runtime + Vite-plugin setup (Steps 2 and onward) is what actually boots WebSpatial today.',
  files: [
    { name: 'package.json', language: 'json', content: packageJsonStarter, final: packageJsonFinal },
    { name: 'tsconfig.json', language: 'json', content: tsconfigStarter, final: tsconfigFinal },
    { name: 'src/main.tsx', language: 'tsx', content: mainStarter, final: mainFinal },
    { name: 'src/App.tsx', language: 'tsx', content: appStarter, final: appFinal },
    { name: 'index.html', language: 'markup', content: indexHtmlStarter, final: indexHtmlFinal },
    { name: 'public/app.webmanifest', language: 'json', content: manifestContent, final: manifestContent },
  ],
  steps: [
    {
      id: 'install-sdk',
      title: 'Install the React SDK',
      explanation:
        'The React SDK gives your app WebSpatial components, JSX behaviour, and runtime boot helpers.',
      task: 'Add the WebSpatial React SDK to the project.',
      file: 'package.json',
      anchors: ['"dependencies"', '@webspatial/react-sdk'],
      command: 'npm install @webspatial/react-sdk',
      altCommands: ['pnpm add @webspatial/react-sdk', 'yarn add @webspatial/react-sdk'],
      validation: { type: 'contains', value: '@webspatial/react-sdk' },
      autoType: {
        mode: 'insertLineAfter',
        anchor: '"dependencies": {',
        text: '    "@webspatial/react-sdk": "^1.7.0",',
      },
      experiment:
        'The React package depends on @webspatial/core-sdk internally — only add core-sdk directly if your docs say to.',
      completionMessage: 'The WebSpatial React SDK is installed.',
      notYet:
        'Not quite yet — add "@webspatial/react-sdk" to dependencies in package.json, then try Next again.',
    },
    {
      id: 'jsx-runtime',
      title: 'Configure the JSX runtime',
      explanation:
        'This lets JSX understand WebSpatial’s extended element and attribute behaviour, like enable-xr and the --xr-* CSS properties.',
      task: 'Set jsxImportSource to @webspatial/react-sdk inside compilerOptions.',
      file: 'tsconfig.json',
      anchors: ['compilerOptions', '"jsx"', 'jsxImportSource'],
      validation: {
        type: 'containsAll',
        values: ['"jsx": "react-jsx"', '"jsxImportSource": "@webspatial/react-sdk"'],
      },
      autoType: {
        mode: 'insertLineAfter',
        anchor: '"jsx": "react-jsx",',
        text: '    "jsxImportSource": "@webspatial/react-sdk",',
      },
      experiment:
        'A Vite project mirrors this with react({ jsxImportSource: "@webspatial/react-sdk" }) in vite.config.ts.',
      completionMessage: 'Your React compiler is connected to the WebSpatial JSX runtime.',
      notYet:
        'Not quite yet — add "jsxImportSource": "@webspatial/react-sdk" next to your "jsx" setting, then try Next again.',
    },
    {
      id: 'import-spatialboot',
      title: 'Import SpatialBoot',
      explanation:
        'SpatialBoot prepares WebSpatial after the app mounts. Use PascalCase — it is a React component, not a lowercase HTML element.',
      task: 'Import SpatialBoot from @webspatial/react-sdk in src/main.tsx.',
      file: 'src/main.tsx',
      anchors: ["import { createRoot }", 'SpatialBoot', '@webspatial/react-sdk'],
      validation: {
        type: 'containsAll',
        values: ['SpatialBoot', '@webspatial/react-sdk'],
      },
      autoType: {
        mode: 'insertLineAfter',
        anchor: "import { createRoot } from 'react-dom/client'",
        text: "import { SpatialBoot } from '@webspatial/react-sdk'",
      },
      completionMessage: 'You can now boot WebSpatial from React.',
      notYet:
        "Not quite yet — add import { SpatialBoot } from '@webspatial/react-sdk' to src/main.tsx, then try Next again.",
    },
    {
      id: 'wrap-app',
      title: 'Wrap the app with SpatialBoot',
      explanation:
        'SpatialBoot runs WebSpatial boot before rendering the app’s children. Place it around the whole app, not inside an individual card.',
      task: 'Wrap <App /> with <SpatialBoot>…</SpatialBoot>.',
      file: 'src/main.tsx',
      anchors: ['<SpatialBoot', '<App />', '</SpatialBoot>'],
      validation: {
        type: 'containsAll',
        values: ['<SpatialBoot', '</SpatialBoot>'],
      },
      autoType: {
        mode: 'replace',
        anchor: '    <App />',
        text: '    <SpatialBoot>\n      <App />\n    </SpatialBoot>',
      },
      completionMessage: 'Your app now boots WebSpatial before showing its content.',
      notYet:
        'Not quite yet — wrap <App /> with <SpatialBoot> in the root render call, then try Next again.',
    },
    {
      id: 'boot-feedback',
      title: 'Add boot feedback',
      explanation:
        'Boot feedback helps you see whether WebSpatial is ready or failed. Keep the first version simple — logging is enough for setup.',
      task: 'Add onReady and onError callbacks to <SpatialBoot>.',
      file: 'src/main.tsx',
      anchors: ['<SpatialBoot', 'onReady', 'onError'],
      validation: {
        type: 'containsAll',
        values: ['onReady', 'onError'],
      },
      autoType: {
        mode: 'replace',
        anchor: '    <SpatialBoot>',
        text:
          '    <SpatialBoot\n' +
          "      onReady={() => console.log('WebSpatial ready')}\n" +
          "      onError={(error) => console.error('WebSpatial boot failed', error)}\n" +
          '    >',
      },
      completionMessage: 'You can now see when WebSpatial boot succeeds or fails.',
      notYet:
        'Not quite yet — add onReady and onError props to <SpatialBoot>, then try Next again.',
    },
    {
      id: 'spatial-ready-element',
      title: 'Add a tiny spatial-ready element',
      explanation:
        'enable-xr marks an element so WebSpatial can spatialize it when runtime support exists. In a normal browser it stays regular HTML.',
      task: 'Add one simple element with enable-xr to src/App.tsx.',
      file: 'src/App.tsx',
      anchors: ['enable-xr', '<div'],
      validation: { type: 'contains', value: 'enable-xr' },
      autoType: {
        mode: 'replace',
        anchor: '      <p>A normal React app — about to gain a spatial-ready element.</p>',
        text: '      <div enable-xr>\n        This element can become spatial.\n      </div>',
      },
      experiment:
        'Stop here — --xr-back, materials, transforms and gestures all start in Story 1, not Story 0.',
      completionMessage: 'You now have a tiny spatial-ready React component.',
      notYet:
        'Not quite yet — add an element with enable-xr to src/App.tsx, then try Next again.',
    },
    {
      id: 'pwa-manifest',
      title: 'Add or verify the PWA manifest',
      explanation:
        'PWA metadata helps spatial runtimes understand how the app should launch. The manifest already exists here — this is mostly a quick check plus the link.',
      task: 'Link public/app.webmanifest from index.html with a <link rel="manifest"> tag.',
      file: 'index.html',
      anchors: ['rel="manifest"', '<title>'],
      validation: { type: 'contains', value: 'rel="manifest"' },
      autoType: {
        mode: 'insertLineAfter',
        anchor: '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
        text: '    <link rel="manifest" href="/app.webmanifest" />',
      },
      experiment:
        'Open the public/app.webmanifest tab to see the launch metadata the runtime reads.',
      completionMessage: 'The app now has basic launch metadata.',
      notYet:
        'Not quite yet — add <link rel="manifest" href="/app.webmanifest" /> to index.html, then try Next again.',
    },
    {
      id: 'dev-server',
      title: 'Run the normal dev server',
      explanation:
        'WebSpatial keeps the normal web development workflow. First, make sure the site runs as an ordinary website.',
      task: 'Start the project like a normal React app, then confirm it renders.',
      command: 'npm run dev',
      altCommands: ['pnpm dev', 'yarn dev'],
      validation: { type: 'manual' },
      completionMessage: 'The app runs as a normal website.',
    },
    {
      id: 'browser-fallback',
      title: 'Understand browser fallback',
      explanation:
        'In ordinary browsers, SpatialBoot should not block the app — WebSpatial behaviour appears only when a supported spatial runtime is available.',
      task: 'Open the app in a normal desktop browser and confirm the web fallback renders.',
      validation: { type: 'manual' },
      fallbackNote:
        'You are viewing the browser-fallback state now. Full spatial behaviour requires a supported WebSpatial Runtime (Apple Vision Pro / PICO OS 6).',
      completionMessage: 'You can develop normally before testing in a spatial runtime.',
    },
    {
      id: 'runtime-preview',
      title: 'Preview in a WebSpatial Runtime',
      explanation:
        'Some platforms open your dev server URL directly (Path A). Others need the Builder to package the site with the WebSpatial Runtime (Path B).',
      task: 'Choose the preview path for your target platform, then continue.',
      command: 'webspatial-builder run --base="http://localhost:5173/"',
      altCommands: [
        'npm install -D @webspatial/builder',
        'npm install -D @webspatial/platform-visionos',
      ],
      validation: { type: 'manual' },
      fallbackNote:
        'Path A: open the dev URL directly in a supported spatial browser/runtime. Path B: use Builder to package the app shell. Use the current Builder command from your installed docs.',
      completionMessage:
        'You now know how normal web preview and spatial runtime preview fit together.',
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting checklist',
      explanation:
        'Most setup issues come from one missing config line, a missing wrapper, or a runtime that cannot reach the dev server.',
      task: 'Review the common setup mistakes in the checklist, then finish.',
      validation: { type: 'manual' },
      completionMessage: 'Your project is ready for the first spatial tutorial.',
    },
  ],
  wrapUp: {
    title: 'What you set up',
    copy: 'You installed the WebSpatial React SDK, connected the JSX runtime, wrapped the app with SpatialBoot, added a tiny spatial-ready element, checked PWA metadata, and learned how normal browser fallback differs from WebSpatial Runtime preview.',
    concepts: [
      'WebSpatial starts as a normal React app.',
      'jsxImportSource connects JSX to the WebSpatial React SDK.',
      'SpatialBoot prepares WebSpatial after mount.',
      'onReady and onError make boot behaviour visible.',
      'enable-xr marks an element for spatialization.',
      'Normal browsers should still render fallback content.',
      'Full spatial behaviour appears in a supported WebSpatial Runtime.',
      'Builder is for packaged runtime workflows.',
    ],
  },
  // The next concept is the first real spatial lesson — wired live in chapters.ts.
  next: {
    title: 'Spatialized HTML Elements',
    note: 'coming next',
  },
}

/**
 * The troubleshooting checklist shown in Story 0's final step and preview. Each
 * line maps to something the setup steps established, so it doubles as a recap.
 */
export const setupTroubleshooting: string[] = [
  '@webspatial/react-sdk is installed.',
  'jsxImportSource points to @webspatial/react-sdk.',
  '<SpatialBoot> wraps the app.',
  'SpatialBoot is PascalCase.',
  'SpatialBoot has useful onReady and onError feedback.',
  'The app has a web manifest.',
  'The manifest is linked from index.html.',
  'The dev server is reachable from the target runtime.',
  'Normal browser fallback is expected.',
  'Full spatial behaviour requires a supported WebSpatial Runtime.',
  'Builder is only needed for platforms that require packaging.',
]
