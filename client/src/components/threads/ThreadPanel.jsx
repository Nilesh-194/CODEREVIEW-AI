import ThreadMessage from './ThreadMessage'

const ThreadPanel = ({ thread }) => (
  <div className="inline-thread">
    {(thread?.messages || []).map((message, index) => <ThreadMessage key={`${message.createdAt}-${index}`} message={message} />)}
  </div>
)

export default ThreadPanel
