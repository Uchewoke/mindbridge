import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Avatar, Button, Card, NavLinkPill } from '@/components/ui'
import SearchBar from '@/components/layout/SearchBar'
import NotifDropdown from '@/components/notifications/NotifDropdown'
import { useAnonStore, useAuthStore, useUIStore, useUserStore } from '@/stores'

const primaryNavItems = [
  ['feed', '/feed', '📰 Feed'],
  ['communities', '/communities', '🫂 Communities'],
  ['discover', '/discover', '🧭 Discover'],
  ['sessions', '/sessions', '🎙 Sessions'],
  ['journey', '/journey', '📈 Journey'],
  ['messages', '/messages', '💬 Messages'],
]

const secondaryNavItems = [
  ['settings', '/settings', '⚙ Settings'],
  ['admin', '/admin', '🛡 Admin'],
  ['auth', '/auth', '🔐 Auth'],
  ['crisis', '/crisis', '🆘 Crisis'],
]

export default function AppShell({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthRoute = ['/auth', '/login', '/signup'].includes(location.pathname)
  const user = useUserStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const signOut = useAuthStore((s) => s.signOut)
  const active = useAnonStore((s) => s.active)
  const alias = useAnonStore((s) => s.alias)
  const disableAnon = useAnonStore((s) => s.disable)
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const closeSidebar = useUIStore((s) => s.closeSidebar)
  const [isCompactNav, setIsCompactNav] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const disclaimer = (
    <p
      style={{
        margin: '14px 0 0',
        fontSize: 12,
        lineHeight: 1.45,
        color: '#c0392b',
      }}
    >
      MindBridge content is for peer support and informational purposes only. It is not a substitute
      for medical, mental health, or emergency care. If you are in immediate danger, call local
      emergency services now.
    </p>
  )

  const visibleSecondaryNavItems = secondaryNavItems.filter((n) =>
    n[0] === 'auth' ? !isAuthenticated : true,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1100px)')
    const sync = () => {
      setIsCompactNav(mq.matches)
      if (!mq.matches) setShowMore(true)
      if (mq.matches) setShowMore(false)
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  if (isAuthRoute) {
    return (
      <div style={{ minHeight: '100dvh', padding: 14 }}>
        <main style={{ maxWidth: 740, margin: '24px auto 0' }}>
          {children}
          {disclaimer}
        </main>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: active ? 'var(--anon-bg)' : undefined,
        color: active ? '#e5f2e3' : undefined,
      }}
    >
      <header
        style={{
          height: 'var(--topbar-h)',
          display: 'grid',
          gridTemplateColumns: 'auto minmax(220px, 1fr) auto auto',
          alignItems: 'center',
          gap: 10,
          padding: '0 14px',
          borderBottom: `1px solid ${active ? '#1b261b' : '#dde4d3'}`,
          background: active ? '#0b0f0b' : 'var(--cream)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={toggleSidebar}
          style={{
            border: 0,
            background: 'transparent',
            fontSize: 18,
            cursor: 'pointer',
            color: 'inherit',
          }}
        >
          ☰
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link
            to="/feed"
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 12 }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                background: active
                  ? 'var(--anon-accent)'
                  : 'linear-gradient(135deg,var(--sage),var(--terra))',
              }}
            />
            <strong style={{ color: active ? 'var(--anon-accent)' : 'var(--ink)' }}>
              MindBridge
            </strong>
          </Link>
          <SearchBar isAnon={active} />
        </div>
        {active ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              border: '1px solid #1f3f27',
              borderRadius: 999,
              padding: '6px 10px',
            }}
          >
            <span>{alias}</span>
            <Button variant="anon" size="xs" onClick={disableAnon}>
              Exit
            </Button>
          </div>
        ) : null}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              border: `1px solid ${isAuthenticated ? '#b7dfb0' : '#e1e3da'}`,
              background: isAuthenticated ? '#eef9eb' : '#f5f6f2',
              color: isAuthenticated ? '#2f6b2b' : 'var(--ink-m)',
              borderRadius: 999,
              padding: '5px 9px',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {isAuthenticated ? 'Signed in' : 'Guest'}
          </span>
          {isAuthenticated ? (
            <span
              style={{
                color: 'var(--ink-m)',
                fontSize: 12,
                maxWidth: 180,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user.email}
            </span>
          ) : null}
          {isAuthenticated ? (
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                signOut()
                closeSidebar()
                navigate('/login')
              }}
            >
              Sign out
            </Button>
          ) : null}
          <NotifDropdown isAnon={active} />
          <Avatar
            initials={user.initials}
            background={user.avatar}
            emoji={active ? '👻' : undefined}
          />
        </div>
      </header>

      <aside
        className="anim-fade-in"
        style={{
          position: 'fixed',
          top: 'var(--topbar-h)',
          left: 0,
          bottom: 0,
          width: 'var(--sidebar-w)',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(calc(-1 * var(--sidebar-w)))',
          transition: 'transform var(--t)',
          background: active ? '#101510' : '#faf8f2',
          borderRight: `1px solid ${active ? '#1e2a1d' : '#e4e7da'}`,
          padding: 12,
          zIndex: 9,
          overflowY: 'auto',
        }}
      >
        <p style={{ margin: '4px 4px 8px', color: 'var(--ink-m)', fontSize: 12, fontWeight: 700 }}>
          Main
        </p>
        {primaryNavItems.map((n) => (
          <div key={n[0]} onClick={closeSidebar}>
            <NavLinkPill to={n[1]} active={location.pathname.startsWith(n[1])} label={n[2]} />
          </div>
        ))}

        <div style={{ marginTop: 8 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 4px 6px',
            }}
          >
            <p style={{ margin: 0, color: 'var(--ink-m)', fontSize: 12, fontWeight: 700 }}>
              Account & Safety
            </p>
            {isCompactNav ? (
              <Button size="xs" variant="ghost" onClick={() => setShowMore((v) => !v)}>
                {showMore ? 'Less' : 'More'}
              </Button>
            ) : null}
          </div>

          {showMore || !isCompactNav ? (
            <div>
              {visibleSecondaryNavItems.map((n) => (
                <div key={n[0]} onClick={closeSidebar}>
                  <NavLinkPill to={n[1]} active={location.pathname.startsWith(n[1])} label={n[2]} />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <Card style={{ marginTop: 14, background: active ? '#121a12' : '#fff' }}>
          <p style={{ margin: 0, color: active ? '#98b39a' : 'var(--ink-m)', fontSize: 13 }}>
            Current profile
          </p>
          <h4 style={{ margin: '6px 0 0', fontFamily: 'Fraunces, serif' }}>
            {active ? alias : user.name}
          </h4>
          <p
            style={{ margin: '4px 0 0', color: active ? '#98b39a' : 'var(--ink-m)', fontSize: 13 }}
          >
            {active ? 'Anonymous mode active' : `${user.streak}-day streak`}
          </p>
          {active ? (
            <p style={{ margin: '10px 0 0', color: '#9cc89a', fontSize: 12 }}>
              Anonymous mode does not replace crisis support. Crisis help is always available.
            </p>
          ) : null}
        </Card>
      </aside>

      <main style={{ marginTop: 8, marginLeft: 0, padding: '14px 14px 14px 18px' }}>
        {children}
        {disclaimer}
      </main>
    </div>
  )
}
