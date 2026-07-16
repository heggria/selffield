import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { DataPage } from './pages/DataPage'
import { HistoryPage } from './pages/HistoryPage'
import { HomePage } from './pages/HomePage'
import { MethodPage } from './pages/MethodPage'
import { MirrorPage } from './pages/MirrorPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ReflectPage } from './pages/ReflectPage'

function RouteEffects() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <AppShell>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reflect" element={<ReflectPage />} />
        <Route path="/mirror/:id" element={<MirrorPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/method" element={<MethodPage />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  )
}
