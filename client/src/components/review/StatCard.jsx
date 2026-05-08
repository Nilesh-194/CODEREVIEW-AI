import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

const StatCard = ({ label, value, delta, color = '#00E5A0', progress = 70 }) => {
  const spring = useSpring(0, { stiffness: 80, damping: 18 })
  const rounded = useTransform(spring, (latest) => Math.round(latest))

  useEffect(() => {
    spring.set(Number(value) || 0)
  }, [spring, value])

  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <motion.div className="stat-value">{rounded}</motion.div>
      <div className={`stat-delta ${String(delta).startsWith('-') ? 'down' : ''}`}>{delta}</div>
      <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${progress}%`, background: color }} /></div>
    </div>
  )
}

export default StatCard
