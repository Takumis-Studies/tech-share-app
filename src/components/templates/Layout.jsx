
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <header>
        <p>TechShare</p>
      </header>

      <Outlet />
    </div>
  )
}

export default Layout
