import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../components/layout/Topbar'
import axios from '../lib/axios'
import { useAuthStore } from '../store/authStore'

const features = [
  ['⚡', 'Instant AI Review', 'Streaming review results as the model reasons through your code.'],
  ['⇄', 'GitHub PRs', 'Connect repositories and review pull requests before merge.'],
  ['💬', 'Line Threads', 'Discuss individual findings in real-time comment threads.'],
  ['🛡', 'Security Scan', 'Prioritize security issues, secrets, and risky auth flows.'],
]

const Landing = () => {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const demoAuth = import.meta.env.VITE_ENABLE_DEMO_AUTH === 'true'

  const login = async () => {
    if (!demoAuth) {
      window.location.href = `${apiUrl}/auth/github`
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.post('/auth/dev-login')
      setUser(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="landing">
      <Topbar compact />
      <section className="landing-hero">
        <div className="cover-grid" />
        <div className="cover-bg" />
        <div className="hero-copy">
          <div className="cover-badge"><span className="cover-badge-dot" /> AI CODE REVIEW WORKFLOW</div>
          <h1>CodeReview <span>AI</span></h1>
          <p>Async code reviews with GitHub OAuth, Monaco annotations, live threads, and streaming AI suggestions.</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={login} disabled={loading}>{loading ? 'Starting...' : 'Start free'}</button>
            <button className="btn btn-ghost" onClick={login} disabled={loading}>{demoAuth ? 'Preview locally' : 'Login with GitHub'}</button>
          </div>
          {error && <div className="login-error">{error}</div>}
        </div>
        <motion.div className="floating-code" animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
          <div className="code-card-head"><span /> auth.js <b>AI annotation</b></div>
          <pre>{`if (!token) res.json(...)
const SECRET = "my_secret_key_123"`}</pre>
          <div className="ai-note"><strong>Error</strong> Hardcoded JWT secret. Use process.env.JWT_SECRET.</div>
        </motion.div>
      </section>
      <section className="feature-grid">
        {features.map(([icon, title, body]) => (
          <div className="feature-card" key={title}><div>{icon}</div><h3>{title}</h3><p>{body}</p></div>
        ))}
      </section>
    </div>
  )
}

export default Landing
