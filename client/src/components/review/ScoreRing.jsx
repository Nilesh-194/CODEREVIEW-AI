import { motion } from 'framer-motion'

const toneForScore = (score) => (score > 80 ? '#00C47A' : score >= 60 ? '#FFB800' : '#FF4560')

const ScoreRing = ({ score = 0, size = 52 }) => {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = toneForScore(score)

  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg className="ring-svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1E2130" strokeWidth="3" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
      </svg>
      <div className="ring-text" style={{ color }}>{score || 0}</div>
    </div>
  )
}

export default ScoreRing
