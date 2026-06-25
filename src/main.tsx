import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { defaultPath } from './lib/routes'

// Each concept is addressable in both modes: `/learn/:chapterId` and
// `/playground/:chapterId`. `/` and anything unrecognised bounce to the default
// landing lesson. The SPA rewrite in vercel.json serves index.html for these
// deep links so they resolve on a hard refresh, not just in-app navigation.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/learn/:chapterId" element={<App mode="learn" />} />
        <Route path="/playground/:chapterId" element={<App mode="playground" />} />
        <Route path="*" element={<Navigate to={defaultPath()} replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
