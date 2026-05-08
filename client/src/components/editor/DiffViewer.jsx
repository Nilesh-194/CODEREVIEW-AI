const demoLines = [
  ['neutral', '1', '1', '', "const jwt = require('jsonwebtoken')"],
  ['del', '5', '', '-', 'const SECRET = "my_secret_key_123"'],
  ['add', '', '5', '+', 'const SECRET = process.env.JWT_SECRET'],
  ['add', '', '6', '+', "if (!SECRET) throw new Error('JWT_SECRET not set')"],
  ['neutral', '8', '9', '', 'const authenticate = async (req, res, next) => {'],
  ['add', '', '10', '+', '  try {'],
]

const DiffViewer = ({ lines = demoLines }) => (
  <div className="diff-body">
    {lines.map(([type, oldLine, newLine, sign, text], index) => (
      <div className={`diff-line ${type}`} key={`${index}-${text}`}>
        <div className="diff-gutter"><span>{oldLine}</span><span>{newLine}</span></div>
        <div className="diff-sign">{sign}</div>
        <div className="diff-text">{text}</div>
      </div>
    ))}
    <div className="inline-thread">
      <div className="thread-message">
        <div className="thread-avatar thread-ai-avatar">*</div>
        <div className="thread-bubble"><div className="thread-sender ai">CodeReview AI</div>Good move using environment variables. Add startup validation so production fails with a clear deployment error.</div>
      </div>
      <div className="thread-message">
        <div className="thread-avatar thread-user-avatar">N</div>
        <div className="thread-bubble"><div className="thread-sender">Nilesh Dubey</div>I’ll add validation in index.js and keep middleware focused.</div>
      </div>
      <div className="panel-input compact"><span className="panel-input-text">Reply to thread...</span><span className="panel-send">↑</span></div>
    </div>
  </div>
)

export default DiffViewer
