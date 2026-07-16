import { Database, History, Menu, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

function Brand() {
  return (
    <NavLink className="brand" to="/" aria-label="SelfField 首页">
      <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>SelfField</span>
    </NavLink>
  )
}

const links = [
  { to: '/method', label: '方法' },
  { to: '/history', label: '轨迹', icon: History },
  { to: '/data', label: '数据', icon: Database },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="app-shell">
      <header className="site-header">
        <Brand />
        <nav className="desktop-nav" aria-label="主导航">
          {links.map((link) => <NavLink key={link.to} to={link.to}>{link.label}</NavLink>)}
        </nav>
        <div className="header-actions">
          <NavLink className="button button-dark button-compact" to="/reflect">
            <Plus size={16} strokeWidth={1.8} />一次照见
          </NavLink>
          <button
            className="menu-button"
            type="button"
            aria-label={open ? '关闭导航' : '打开导航'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      {open && (
        <nav className="mobile-nav" aria-label="移动端导航">
          {links.map((link) => {
            const Icon = link.icon
            return <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>{Icon && <Icon size={17} />}{link.label}</NavLink>
          })}
        </nav>
      )}

      <main key={location.pathname} className="route-enter">{children}</main>
      <footer className="site-footer">
        <div><Brand /><p>A living mirror, not a personality test.</p></div>
        <p>默认私密 · 没有分类 · 没有永久结论</p>
        <p>© {new Date().getFullYear()} Heggria</p>
      </footer>
    </div>
  )
}
