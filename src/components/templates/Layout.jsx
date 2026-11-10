
import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
function Layout() {
  const { user, login, logout } = useAuth()

  return (
    <div>
      <header>
        <Link to="/">TechShare</Link>

        {user ? (
          <div>
            <span>ようこそ、{user.name}さん</span>
            {' '}
            <Link to="/create">記事を書く</Link>
            {' '}
            <button type="button" onClick={logout}>
              ログアウト
            </button>
          </div>
        ) : (
          <button type="button" onClick={login}>
            ログイン
          </button>
        )}
      </header>

      <Outlet />
    </div>
  )
}

export default Layout
