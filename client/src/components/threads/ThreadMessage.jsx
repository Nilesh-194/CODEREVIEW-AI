const ThreadMessage = ({ message }) => (
  <div className="thread-message">
    <div className={`thread-avatar ${message.isAI ? 'thread-ai-avatar' : 'thread-user-avatar'}`}>{message.isAI ? '*' : message.senderName?.[0] || 'U'}</div>
    <div className="thread-bubble">
      <div className={`thread-sender ${message.isAI ? 'ai' : ''}`}>{message.senderName || 'CodeReview AI'}</div>
      {message.content}
    </div>
  </div>
)

export default ThreadMessage
