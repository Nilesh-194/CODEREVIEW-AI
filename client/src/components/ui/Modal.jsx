import Button from './Button'

const Modal = ({ open, title, children, onCancel, onConfirm, confirmText = 'Confirm' }) => {
  if (!open) return null
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{title}</h3>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm}>{confirmText}</Button>
        </div>
      </div>
    </div>
  )
}

export default Modal
