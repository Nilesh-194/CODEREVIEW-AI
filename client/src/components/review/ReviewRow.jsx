import { useNavigate } from 'react-router-dom'
import ScoreRing from './ScoreRing'

const icons = { javascript: 'JS', typescript: 'TS', python: 'PY', go: 'GO', java: 'JV', cpp: 'C++' }

const statusLabel = (status) => ({ complete: 'Reviewed', processing: 'In Progress', pending: 'Pending', error: 'Failed' })[status] || status
const statusClass = (status) => ({ complete: 'status-done', processing: 'status-progress', pending: 'status-pending', error: 'status-failed' })[status] || 'status-pending'

const ReviewRow = ({ review }) => {
  const navigate = useNavigate()
  const lineCount = review.code?.split('\n').length || 0
  const created = review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'today'
  const score = review.score || 0

  return (
    <div className="review-row" onClick={() => navigate(review.status === 'complete' ? `/review/${review._id}` : `/review/${review._id}/processing`)}>
      <div className="review-lang">{icons[review.language] || 'JS'}</div>
      <div className="review-info">
        <div className="review-name">{review.filename}</div>
        <div className="review-meta">{lineCount} lines · {created}</div>
      </div>
      <div className={`review-status ${statusClass(review.status)}`}>{statusLabel(review.status)}</div>
      <div className="review-counts"><span className="red">{review.stats?.errors || 0}</span> / <span className="yellow">{review.stats?.warnings || 0}</span></div>
      <ScoreRing score={score} size={44} />
    </div>
  )
}

export default ReviewRow
