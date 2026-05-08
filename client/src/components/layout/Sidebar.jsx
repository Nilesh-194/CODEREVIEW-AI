import { NavLink } from 'react-router-dom'

const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar-section">Workspace</div>
    <NavLink className="sidebar-item" to="/"><span className="sidebar-item-icon">⌂</span><span>Dashboard</span><span className="badge-count green">12</span></NavLink>
    <NavLink className="sidebar-item" to="/review/new"><span className="sidebar-item-icon">+</span><span>New Review</span></NavLink>
    <NavLink className="sidebar-item" to="/pr/demo:repo:42"><span className="sidebar-item-icon">⇄</span><span>Pull Requests</span><span className="badge-count">3</span></NavLink>
    <div className="sidebar-section">Manage</div>
    <NavLink className="sidebar-item" to="/settings"><span className="sidebar-item-icon">⚙</span><span>Settings</span></NavLink>
  </aside>
)

export default Sidebar
