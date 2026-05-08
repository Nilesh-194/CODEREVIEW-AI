const labels = { error: 'Error', warning: 'Warning', info: 'Info', good: 'Good' }

const CommentCard = ({ comment, onThread }) => (
  <div className={`comment-card severity-${comment.severity === 'warning' ? 'warn' : comment.severity}`} id={`comment-${comment.line}`} data-comment-id={comment._id}>
    <div className="comment-header">
      <span className={`severity-tag sev-${comment.severity === 'warning' ? 'warn' : comment.severity}`}>{labels[comment.severity]}</span>
      <span className="comment-line">Line {comment.line}</span>
    </div>
    <h4>{comment.title}</h4>
    <p className="comment-text">{comment.explanation}</p>
    {comment.fix && <pre className="comment-fix">{comment.fix}</pre>}
    <button type="button" className="thread-btn" onClick={() => onThread?.(comment)}>Start Thread</button>
  </div>
)

export default CommentCard
