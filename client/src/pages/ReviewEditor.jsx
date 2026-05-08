import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import MonacoWrapper from '../components/editor/MonacoWrapper'
import ScoreRing from '../components/review/ScoreRing'
import CommentCard from '../components/review/CommentCard'
import Button from '../components/ui/Button'
import axios from '../lib/axios'
import { demoReview } from '../data/demo'

const ReviewEditor = () => {
  const { id } = useParams()
  const [review, setReview] = useState(id === 'demo' ? demoReview : null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  useEffect(() => {
    if (id === 'demo') return
    axios.get(`/api/reviews/${id}`).then(({ data }) => setReview(data)).catch(() => setReview(demoReview))
  }, [id])

  const ask = async () => {
    setAnswer('')
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/ask`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId: id, question }),
    })
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      decoder.decode(value).split('\n\n').forEach((line) => {
        if (line.startsWith('data: ')) {
          const payload = JSON.parse(line.replace('data: ', ''))
          if (payload.text) setAnswer((current) => current + payload.text)
        }
      })
    }
  }

  if (!review) return <AppShell><div className="loading-screen">Loading review...</div></AppShell>

  return (
    <AppShell>
      <div className="editor-layout">
        <section className="code-panel">
          <div className="code-tabs"><div className="code-tab active"><span className="code-tab-dot" />{review.filename}</div></div>
          <MonacoWrapper code={review.code} language={review.language} readOnly comments={review.comments || []} onLineClick={(line) => document.querySelector(`#comment-${line}`)?.scrollIntoView({ behavior: 'smooth' })} />
        </section>
        <aside className="review-panel">
          <div className="review-panel-header">
            <div className="ai-score-ring"><ScoreRing score={review.score || 0} /><div><div className="ai-score-label">Code Quality Score</div><div className="ai-score-grade">{review.grade} — Good</div></div></div>
            <div className="panel-actions"><Button variant="ghost" onClick={() => navigator.clipboard.writeText(window.location.href)}>Share</Button><a className="btn btn-ghost" href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/${id}/export`}>Download</a></div>
          </div>
          <div className="summary-row"><span className="red">{review.stats?.errors || 0} errors</span><span className="yellow">{review.stats?.warnings || 0} warnings</span><span>{review.stats?.info || 0} info</span><span className="green">{review.stats?.good || 0} good</span></div>
          <div className="comment-list">{(review.comments || []).map((comment) => <CommentCard key={comment._id || comment.line} comment={comment} />)}</div>
          <div className="panel-footer">
            {answer && <div className="ai-answer">{answer}</div>}
            <div className="panel-input"><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask AI about this file..." /><button onClick={ask}>↑</button></div>
          </div>
        </aside>
      </div>
    </AppShell>
  )
}

export default ReviewEditor
