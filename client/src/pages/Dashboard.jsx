import AppShell from '../components/layout/AppShell'
import StatCard from '../components/review/StatCard'
import ReviewRow from '../components/review/ReviewRow'
import Button from '../components/ui/Button'
import { useReviews } from '../hooks/useReviews'
import { demoReviews } from '../data/demo'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()
  const { reviews, isLoading } = useReviews()
  const rows = reviews.length ? reviews : demoReviews

  return (
    <AppShell>
      <div className="main-header">
        <div><h1 className="main-title">Dashboard</h1><p className="main-sub">Review history and code quality pulse</p></div>
        <Button onClick={() => navigate('/review/new')}>+ New Review</Button>
      </div>
      <div className="main-body scrollable">
        <div className="stats-row">
          <StatCard label="Total Reviews" value={rows.length} delta="+12%" progress={82} />
          <StatCard label="Avg Score" value={74} delta="+6 pts" color="#0097FF" progress={74} />
          <StatCard label="Issues Resolved" value={128} delta="+31%" color="#00C47A" progress={68} />
          <StatCard label="Open Threads" value={9} delta="-4%" color="#FF5C8D" progress={36} />
        </div>
        <div className="reviews-header">
          {['All', 'JavaScript', 'Python', 'TypeScript'].map((chip, index) => <button className={`filter-chip ${index === 0 ? 'active' : ''}`} key={chip}>{chip}</button>)}
          {isLoading && <span className="muted">Loading...</span>}
        </div>
        <div className="reviews-list">
          {rows.map((review) => <ReviewRow key={review._id} review={review} />)}
        </div>
      </div>
    </AppShell>
  )
}

export default Dashboard
