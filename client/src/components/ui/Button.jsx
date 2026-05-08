const Button = ({ variant = 'primary', className = '', disabled, children, ...props }) => (
  <button
    className={`btn ${variant === 'ghost' ? 'btn-ghost' : 'btn-primary'} ${className}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
)

export default Button
