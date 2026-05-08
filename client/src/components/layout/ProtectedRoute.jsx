import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const ProtectedRoute = () => {
  const { user, isLoading } = useAuthStore()
  if (isLoading) return <div className="loading-screen">Loading CodeReview AI...</div>
  if (!user) return <Navigate to="/landing" replace />
  return <Outlet />
}

export default ProtectedRoute
