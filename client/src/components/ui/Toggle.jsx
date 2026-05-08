const Toggle = ({ checked, onChange }) => (
  <button className={`toggle ${checked ? 'on' : ''}`} type="button" onClick={() => onChange?.(!checked)}>
    <span className="toggle-knob" />
  </button>
)

export default Toggle
