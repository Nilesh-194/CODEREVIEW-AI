const Badge = ({ tone = 'green', children }) => (
  <span className={`badge badge-${tone}`}>{children}</span>
)

export default Badge
