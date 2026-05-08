import { Link, NavLink } from 'react-router-dom'
import Button from '../ui/Button'
import { useAuthStore } from '../../store/authStore'
import axios from '../../lib/axios'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Topbar = ({ compact = false }) => {
  const { user, logout, setUser } = useAuthStore()
  const login = async () => {
    if (import.meta.env.VITE_ENABLE_DEMO_AUTH === 'true') {
      const { data } = await axios.post('/auth/dev-login')
      setUser(data)
      window.location.href = '/'
      return
    }
    window.location.href = `${apiUrl}/auth/github`
  }

  return (
    <header className="topbar">
      <Link className="topbar-logo" to={user ? '/' : '/landing'}>
        <span className="topbar-logo-icon">*</span>
        CodeReview AI
      </Link>
      {!compact && (
        <nav className="topbar-nav">
          <NavLink className="nav-item" to="/">Dashboard</NavLink>
          <NavLink className="nav-item" to="/review/new">New Review</NavLink>
          <NavLink className="nav-item" to="/settings">Settings</NavLink>
        </nav>
      )}
      <div className="topbar-right">
        {user ? (
          <>
            <Button variant="ghost" onClick={logout}>Logout</Button>
            <div className="avatar">{user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : user.username?.[0]?.toUpperCase() || 'U'}</div>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={login}>Login with GitHub</Button>
            <Button onClick={login}>Start free</Button>
          </>
        )}
      </div>
    </header>
  )
}

export default Topbar
