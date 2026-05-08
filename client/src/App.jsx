import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import NewReview from './pages/NewReview'
import PRReview from './pages/PRReview'
import Processing from './pages/Processing'
import ReviewEditor from './pages/ReviewEditor'
import Settings from './pages/Settings'
import { useAuthStore } from './store/authStore'

const App = () => {
  const { fetchMe } = useAuthStore()

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/review/new" element={<NewReview />} />
          <Route path="/review/:id/processing" element={<Processing />} />
          <Route path="/review/:id" element={<ReviewEditor />} />
          <Route path="/pr/:prId" element={<PRReview />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App
