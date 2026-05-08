import Topbar from './Topbar'
import Sidebar from './Sidebar'
import { useSocket } from '../../hooks/useSocket'

const AppShell = ({ children }) => {
  useSocket()
  return (
    <div className="app-screen">
      <Topbar />
      <div className="layout">
        <Sidebar />
        <main className="main">{children}</main>
      </div>
    </div>
  )
}

export default AppShell
