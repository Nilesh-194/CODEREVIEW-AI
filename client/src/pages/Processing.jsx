import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import ScoreRing from '../components/review/ScoreRing'
import { useSSE } from '../hooks/useSSE'

const steps = ['Parsing syntax', 'Scanning for security issues', 'Analyzing code patterns', 'Generating fix suggestions', 'Compiling final report']

const Processing = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [percent, setPercent] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [chunks, setChunks] = useState('')
  const url = useMemo(() => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/${id}/stream`, [id])

  useSSE(url, {
    progress: (payload) => {
      setPercent(payload.percent)
      setActiveStep(payload.step)
    },
    chunk: (payload) => setChunks((value) => `${value}${payload.text}`),
    complete: () => setTimeout(() => navigate(`/review/${id}`), 600),
  })

  return (
    <AppShell>
      <div className="processing-center">
        <ScoreRing score={percent} size={132} />
        <h1>AI review in progress</h1>
        <p>Estimated time: {Math.max(2, Math.round((100 - percent) / 18))} seconds</p>
        <div className="step-list">
          {steps.map((step, index) => (
            <div className={`step ${index < activeStep ? 'done' : index === activeStep ? 'active' : ''}`} key={step}>
              <span>{index < activeStep ? '✓' : index + 1}</span>{step}
            </div>
          ))}
        </div>
        <div className="linear-progress"><div style={{ width: `${percent}%` }} /></div>
        {chunks && <pre className="stream-preview">{chunks.slice(-600)}</pre>}
      </div>
    </AppShell>
  )
}

export default Processing
