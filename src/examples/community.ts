/**
 * Community showcase — a hand-curated gallery of WebSpatial demos and apps
 * built by the community.
 *
 * A WebSpatial app is, at the end of the day, just a website: it loads in an
 * ordinary browser and gains true depth, materials and gestures inside a
 * WebSpatial runtime (Apple Vision Pro / PICO OS 6). So a showcase needs
 * nothing more than a URL — every entry below is a link anyone can open.
 *
 * Adding your own demo is intentionally a one-file change: append an entry to
 * the `communityDemos` array and open a pull request against the repo (see
 * `communityRepo` below). Each entry needs a `title`, a `url` and a short
 * `description`; the rest is optional.
 */

export interface CommunityDemo {
  /** Display name of the demo / app. */
  title: string
  /** The live URL — a WebSpatial site is just a website, so this is all it takes. */
  url: string
  /** One or two sentences on what it shows off. */
  description: string
  /** Optional creator credit, shown as a subtle byline on the tile. */
  author?: string
  /** Optional short tags (e.g. "3D", "Game", "UI") rendered as chips. */
  tags?: string[]
}

/**
 * Where the "Add your demo" call-to-action points. We deep-link straight to
 * editing THIS file on GitHub so a contributor lands in the right place with
 * the PR flow one click away.
 */
export const communityRepo = {
  /** Repository home. */
  url: 'https://github.com/webspatial/WebSpatialPlayground',
  /** Path of this config inside the repo, surfaced in the CTA copy. */
  filePath: 'src/examples/community.ts',
  /** Deep link that opens this file in GitHub's editor (starts a PR). */
  editUrl:
    'https://github.com/webspatial/WebSpatialPlayground/edit/main/src/examples/community.ts',
}

/* ────────────────────────────────────────────────────────────────────── */

export const communityDemos: CommunityDemo[] = [
  {
    title: 'WebSpatial Playground',
    url: 'https://playground.webspatial.dev',
    description:
      'This very playground — a live editor for spatial web development. Write real React + WebSpatial code and watch a genuine spatial component render as you type.',
    author: 'WebSpatial',
    tags: ['Official', 'Editor'],
  },
  {
    title: 'WebSpatial Hackathon',
    url: 'https://webspatial-hackathon.vercel.app/',
    description:
      'A community hackathon showcase for WebSpatial experiments, demos and spatial web ideas.',
    author: 'WebSpatial Community',
    tags: ['Community', 'Hackathon'],
  },
  {
    title: 'Solar System',
    url: 'https://sample-solarsystem.vercel.app/',
    description:
      'A spatial solar system demo that shows 3D celestial bodies arranged in depth for an immersive WebSpatial scene.',
    author: 'WebSpatial Community',
    tags: ['Community', '3D'],
  },
]
