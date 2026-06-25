import { useMemo, useState } from 'react'
import './App.css'
import { categories } from './examples'
import type { Example, ControlValues } from './examples/types'
import { controlDefaults } from './examples/types'
import { CodePanel } from './components/CodePanel'
import { ControlsPanel } from './components/ControlsPanel'
import { RuntimeBanner } from './components/RuntimeBanner'
import {
  Paintbrush, Component, Hand, Code,
  Sparkles, ChevronRight, Copy, Check,
  ExternalLink, Github, BookOpen, Monitor,
  Glasses, Play, Users, Heart, Plus,
  ArrowUpRight, Globe, RotateCcw, Sliders,
} from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  Paintbrush: <Paintbrush size={18} />,
  Component: <Component size={18} />,
  Hand: <Hand size={18} />,
  Code: <Code size={18} />,
}

// ─── Gallery Data ───────────────────────────────────────────────────
const galleryItems = [
  { id: 'g1', title: 'Spatial Music Player', author: 'sarah.dev', desc: 'Album art floats in space, audio-reactive particles in a 3D container.', tags: ['music', '3d-viz'], likes: 127, color: 'pink' },
  { id: 'g2', title: 'Spatial Kanban Board', author: 'marcos.ui', desc: 'Kanban columns as spatial scenes. Drag cards between floating boards.', tags: ['productivity', 'drag'], likes: 89, color: 'blue' },
  { id: 'g3', title: '3D Developer Portfolio', author: 'jenna.xyz', desc: 'Portfolio → spatial gallery on headsets. Project cards float with depth.', tags: ['portfolio', 'elevation'], likes: 203, color: 'emerald' },
  { id: 'g4', title: 'Spatial Chess', author: 'alex.games', desc: 'Board has real volume, pieces float above the surface.', tags: ['game', 'volume'], likes: 156, color: 'amber' },
  { id: 'g5', title: 'Analytics Dashboard XR', author: 'data.nina', desc: 'Charts pop into 3D. Walk around your data visualizations.', tags: ['dashboard', 'charts'], likes: 94, color: 'violet' },
  { id: 'g6', title: 'Spatial Recipe Book', author: 'cook.spatial', desc: 'Floating ingredient panels and 3D food models.', tags: ['cooking', 'model'], likes: 112, color: 'rose' },
]

type View = 'playground' | 'gallery'

function App() {
  const [view, setView] = useState<View>('playground')
  const [catId, setCatId] = useState(categories[0].id)
  const [exId, setExId] = useState(categories[0].examples[0].id)
  const [copied, setCopied] = useState(false)

  const cat = categories.find((c) => c.id === catId)!
  const ex: Example = cat.examples.find((e) => e.id === exId) ?? cat.examples[0]

  // Per-example control values (the live source of truth for the real preview).
  const [valuesMap, setValuesMap] = useState<Record<string, ControlValues>>({})
  const values: ControlValues = valuesMap[ex.id] ?? controlDefaults(ex.controls)

  const code = useMemo(() => ex.code(values), [ex, values])

  const pickCat = (id: string) => {
    setCatId(id)
    setExId(categories.find((c) => c.id === id)!.examples[0].id)
  }

  const onControlChange = (id: string, value: string | number | boolean) => {
    setValuesMap((m) => ({
      ...m,
      [ex.id]: { ...(m[ex.id] ?? controlDefaults(ex.controls)), [id]: value },
    }))
  }

  const resetControls = () => {
    setValuesMap((m) => {
      const next = { ...m }
      delete next[ex.id]
      return next
    })
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-screen bg-[#0a0a0f] overflow-hidden">
      {/* ─── Sidebar ─── */}
      <aside
        enable-xr
        className="w-72 border-r border-white/5 flex flex-col bg-[#0c0c14]"
        style={{ '--xr-back': '10px', '--xr-background-material': 'translucent' }}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">WebSpatial</h1>
              <p className="text-[10px] text-white/40 font-medium">Playground</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 w-fit">
            <Glasses size={10} className="text-violet-400" />
            <span className="text-[9px] text-violet-300 font-medium">Genuine WebSpatial build</span>
          </div>
        </div>

        {/* View toggle */}
        <div className="px-3 pt-3 pb-1">
          <div className="flex bg-white/3 rounded-lg p-0.5 border border-white/5">
            {([['playground', 'Examples', <Play size={11} key="p" />], ['gallery', 'Gallery', <Users size={11} key="g" />]] as const).map(([v, label, icon]) => (
              <button
                key={v}
                onClick={() => setView(v as View)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === v ? 'bg-violet-500/15 text-violet-300 border border-violet-500/20' : 'text-white/40 hover:text-white/60'}`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Nav */}
        {view === 'playground' ? (
          <nav className="flex-1 overflow-y-auto py-3 px-3">
            {categories.map((c) => (
              <div key={c.id} className="mb-1">
                <button
                  onClick={() => pickCat(c.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all duration-200 ${catId === c.id ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20' : 'text-white/50 hover:text-white/80 hover:bg-white/3 border border-transparent'}`}
                >
                  <span className={catId === c.id ? 'text-violet-400' : 'text-white/30'}>{iconMap[c.iconName]}</span>
                  <span className="font-medium">{c.name}</span>
                  {catId === c.id && <ChevronRight size={12} className="ml-auto text-violet-400/60" />}
                </button>
                {catId === c.id && (
                  <div className="ml-5 mt-1 mb-2 pl-3 border-l border-violet-500/10">
                    {c.examples.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => setExId(e.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-all duration-150 ${exId === e.id ? 'text-violet-200 bg-violet-500/10' : 'text-white/40 hover:text-white/70'}`}
                      >
                        {e.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        ) : (
          <div className="flex-1 overflow-y-auto py-3 px-3">
            <p className="text-xs text-white/40 px-1 mb-3">Community-built WebSpatial apps</p>
            {galleryItems.map((g) => (
              <button key={g.id} className="w-full text-left px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white/80 hover:bg-white/3 transition-all flex items-center gap-2">
                <Globe size={12} className="text-white/30" />
                <span className="truncate">{g.title}</span>
                <span className="ml-auto text-[10px] text-white/20 flex items-center gap-0.5"><Heart size={8} />{g.likes}</span>
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-white/5 flex gap-3">
          <a href="https://webspatial.dev/docs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"><BookOpen size={12} />Docs</a>
          <a href="https://github.com/webspatial/webspatial-sdk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"><Github size={12} />GitHub</a>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <RuntimeBanner />

        {view === 'playground' ? (
          <>
            <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0c0c14]/50 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <h2 className="text-base font-semibold text-white truncate">{ex.title}</h2>
                <span className="text-xs text-white/30">—</span>
                <span className="text-xs text-white/40 truncate">{ex.subtitle}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {ex.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-white/40 border border-white/5">{t}</span>
                ))}
              </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
              {/* ── Code pane (≈42%) ── */}
              <div
                enable-xr
                className="flex flex-col border-r border-white/5 min-w-0"
                style={{ width: '42%', '--xr-back': '20px', '--xr-background-material': 'translucent' }}
              >
                <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 bg-[#0e0e18] shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-violet-500/40" />
                    <span className="text-[11px] font-medium text-white/50 font-mono">
                      {ex.language === 'json' ? 'app.webmanifest' : 'example.tsx'}
                    </span>
                    <span className="ml-2 flex items-center gap-1 text-[9px] text-violet-300/70 px-1.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                      <Sparkles size={8} />real source
                    </span>
                  </div>
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
                  >
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="flex-1 overflow-auto bg-[#0a0a12] p-4">
                  <CodePanel code={code} language={ex.language ?? 'tsx'} />
                </div>
                <div className="px-4 py-2 border-t border-white/5 bg-[#0c0c14] text-[10px] text-white/30 flex items-center gap-1.5 shrink-0">
                  <Sliders size={10} className="text-violet-400/60" />
                  Edit the controls on the right — this source reflects the live values driving the real component.
                </div>
              </div>

              {/* ── Preview pane (≈58%, large) ── */}
              <div
                enable-xr
                className="flex-1 flex flex-col min-w-0"
                style={{ '--xr-back': '40px', '--xr-background-material': 'translucent' }}
              >
                <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 bg-[#0e0e18] shrink-0">
                  <span className="text-[11px] font-medium text-white/50 flex items-center gap-1.5">
                    <Play size={11} className="text-violet-400" />Live Preview · real WebSpatial
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={resetControls}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
                    >
                      <RotateCcw size={10} />Reset
                    </button>
                    <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-white/40 flex items-center gap-1"><Monitor size={9} />2D fallback</div>
                    <div className="px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-400/20 text-[9px] text-violet-300 flex items-center gap-1"><Glasses size={9} />Spatial</div>
                  </div>
                </div>

                <ControlsPanel controls={ex.controls} values={values} onChange={onControlChange} />

                {/* Stage — large */}
                <div className="flex-1 relative ws-stage overflow-auto flex items-center justify-center p-8 min-h-0">
                  <div key={ex.id} className="relative z-10 w-full h-full flex items-center justify-center">
                    {ex.render(values)}
                  </div>
                </div>

                {/* Description + Docs */}
                <div className="p-5 bg-[#0c0c14] border-t border-white/5 overflow-y-auto shrink-0" style={{ maxHeight: '170px' }}>
                  <p className="text-sm text-white/60 leading-relaxed">{ex.description}</p>
                  <div className="mt-4 flex gap-2">
                    <a
                      href={ex.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300 hover:bg-violet-500/20 transition-colors"
                    >
                      <BookOpen size={10} />Docs<ExternalLink size={9} className="opacity-50" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Gallery */
          <div className="flex-1 overflow-y-auto">
            <header className="px-8 pt-8 pb-6 border-b border-white/5 bg-[#0c0c14]/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Community Gallery</h2>
                  <p className="text-sm text-white/40">Spatial apps built with WebSpatial by the community</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/15 border border-violet-500/25 text-sm text-violet-300 hover:bg-violet-500/25 transition-all">
                  <Plus size={14} />Submit Your App
                </button>
              </div>
              <div className="flex gap-2 mt-4">
                {['All', 'Productivity', 'Games', 'Data Viz', '3D Models'].map((f, i) => (
                  <button key={f} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${i === 0 ? 'bg-violet-500/15 text-violet-300 border border-violet-500/20' : 'bg-white/3 text-white/40 border border-white/5 hover:text-white/60'}`}>{f}</button>
                ))}
              </div>
            </header>
            <div className="p-8 grid grid-cols-3 gap-5">
              {galleryItems.map((g, idx) => (
                <div
                  key={g.id}
                  enable-xr
                  className="group rounded-xl border border-white/5 bg-[#0e0e18] hover:border-violet-500/20 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-violet-500/5"
                  style={{ '--xr-back': `${30 + idx * 10}px`, '--xr-background-material': 'translucent' }}
                >
                  <div className={`h-32 bg-gradient-to-br from-${g.color}-500/20 to-${g.color}-500/5 flex items-center justify-center relative overflow-hidden`}>
                    <div className={`w-8 h-8 rounded-lg bg-${g.color}-400 opacity-30 animate-float`} />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">{g.title}</h3>
                      <ArrowUpRight size={14} className="text-white/20 group-hover:text-violet-400 transition-colors" />
                    </div>
                    <p className="text-xs text-white/40 mb-3 line-clamp-2">{g.desc}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {g.tags.map((t) => <span key={t} className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-white/30 border border-white/5">{t}</span>)}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[11px] text-white/30">by <span className="text-white/50">{g.author}</span></span>
                      <span className="flex items-center gap-1 text-[11px] text-white/30"><Heart size={10} className="text-rose-400/50" />{g.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-8 pb-8">
              <div
                enable-xr
                className="rounded-2xl p-8 text-center"
                style={{ '--xr-back': '50px', '--xr-background-material': 'translucent', background: 'linear-gradient(to right,rgba(139,92,246,0.05),rgba(217,70,239,0.05))', border: '1px solid rgba(139,92,246,0.15)' }}
              >
                <h3 className="text-lg font-semibold text-white mb-2">Built something spatial?</h3>
                <p className="text-sm text-white/40 mb-4 max-w-md mx-auto">Share your WebSpatial creation with the community.</p>
                <div className="flex gap-3 justify-center">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500/20 border border-violet-500/30 text-sm text-violet-200 hover:bg-violet-500/30 transition-all"><Plus size={14} />Submit via Form</button>
                  <a href="https://github.com/webspatial/webspatial-sdk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white/50 hover:text-white/70 hover:bg-white/10 transition-all"><Github size={14} />Submit via PR</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
