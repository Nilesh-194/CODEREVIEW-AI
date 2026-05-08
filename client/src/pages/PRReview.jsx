import AppShell from '../components/layout/AppShell'
import DiffViewer from '../components/editor/DiffViewer'
import ScoreRing from '../components/review/ScoreRing'
import Button from '../components/ui/Button'

const PRReview = () => (
  <AppShell>
    <div className="pr-header">
      <div className="pr-title-row">
        <div className="pr-icon">⇄</div>
        <div><div className="pr-title-text">feat: implement JWT authentication middleware</div><div className="pr-number">PR #42</div></div>
        <div className="pr-score"><ScoreRing score={74} /></div>
      </div>
      <div className="pr-tags"><span className="pr-tag tag-purple">enhancement</span><span className="pr-tag tag-blue">security</span><span className="pr-tag tag-green">reviewed</span></div>
      <div className="pr-meta-row"><span>main ← feat/user-auth</span><span>·</span><span>Nilesh Dubey</span><span>·</span><span>2h ago</span><span className="green">+48 lines</span><span className="red">-12 lines</span><span>3 files</span></div>
      <div className="pr-actions"><Button>✓ Approve PR</Button><a className="btn btn-ghost" href="https://github.com" target="_blank" rel="noreferrer">View on GitHub ↗</a></div>
    </div>
    <div className="diff-scroll">
      {['src/middleware/auth.js', 'src/routes/auth.js'].map((file) => (
        <section className="diff-file" key={file}>
          <div className="diff-header"><span className="diff-filename">{file}</span><span className="diff-stat-add">+28</span><span className="diff-stat-del">-4</span><span>2 AI comments</span></div>
          <DiffViewer />
        </section>
      ))}
    </div>
  </AppShell>
)

export default PRReview
