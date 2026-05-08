import { useState } from 'react'
import AppShell from '../components/layout/AppShell'
import Toggle from '../components/ui/Toggle'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import axios from '../lib/axios'
import { useAuthStore } from '../store/authStore'

const tabs = ['General', 'AI Model', 'Integrations', 'Notifications', 'Team', 'API Keys', 'Danger Zone']

const Settings = () => {
  const { user, setUser } = useAuthStore()
  const [active, setActive] = useState('General')
  const [settings, setSettings] = useState(user?.settings || {})
  const [confirm, setConfirm] = useState(null)

  const save = async () => {
    const { data } = await axios.patch('/api/users/settings', settings)
    setUser(data)
  }

  const generateKey = async () => {
    const { data } = await axios.post('/api/users/api-keys', { label: 'Production key' })
    setUser({ ...user, apiKeys: data })
  }

  return (
    <AppShell>
      <div className="settings-layout">
        <nav className="settings-nav">{tabs.map((tab) => <button className={`settings-nav-item ${active === tab ? 'active' : ''}`} onClick={() => setActive(tab)} key={tab}>{tab}</button>)}</nav>
        <section className="settings-body">
          {active === 'General' && (
            <div className="settings-section">
              <h2>AI Review Configuration</h2><p>Control how the AI analyzes and annotates your code</p>
              <div className="setting-row"><div><div className="setting-name">AI Model</div><div className="setting-desc">Choose which model powers your code reviews</div></div><select className="select-box"><option>Llama 3.3 70B via Groq</option></select></div>
              {[
                ['autoReview', 'Auto-review on file save'],
                ['inlineFixes', 'Inline fix suggestions'],
                ['securityScan', 'Security scanning'],
                ['streaming', 'Streaming responses'],
              ].map(([key, label]) => <div className="setting-row" key={key}><div><div className="setting-name">{label}</div><div className="setting-desc">Enabled for new reviews and repository workflows</div></div><Toggle checked={Boolean(settings[key])} onChange={(value) => setSettings({ ...settings, [key]: value })} /></div>)}
              <div className="setting-row"><div><div className="setting-name">Review depth</div><div className="setting-desc">Default analysis depth for new reviews</div></div><select className="select-box" value={settings.defaultDepth || 'standard'} onChange={(event) => setSettings({ ...settings, defaultDepth: event.target.value })}><option value="quick">Quick</option><option value="standard">Standard</option><option value="deep">Deep</option></select></div>
              <Button onClick={save}>Save changes</Button>
            </div>
          )}
          {active === 'Integrations' && <div className="connection-card"><div><h3>Connected to GitHub</h3><p>@{user?.username || 'username'} · repositories available after OAuth</p></div><Button variant="ghost">Disconnect</Button></div>}
          {active === 'API Keys' && <div><Button onClick={generateKey}>Generate API key</Button><table className="keys-table"><tbody>{(user?.apiKeys || []).map((key) => <tr key={key.key}><td>{key.label}</td><td>{new Date(key.createdAt).toLocaleDateString()}</td><td><Button variant="ghost">Revoke</Button></td></tr>)}</tbody></table></div>}
          {active === 'Danger Zone' && <div className="danger-zone"><Button variant="ghost" onClick={() => setConfirm('reviews')}>Delete all reviews</Button><Button variant="ghost" onClick={() => setConfirm('account')}>Delete account</Button></div>}
        </section>
      </div>
      <Modal open={Boolean(confirm)} title="Confirm destructive action" onCancel={() => setConfirm(null)} onConfirm={async () => { await axios.delete(confirm === 'reviews' ? '/api/users/reviews' : '/api/users/account'); setConfirm(null) }} confirmText="Delete">
        This action cannot be undone.
      </Modal>
    </AppShell>
  )
}

export default Settings
