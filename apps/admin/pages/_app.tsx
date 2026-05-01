import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import type { AppProps } from 'next/app'

const PUBLIC_ROUTES = ['/login']

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ href: '/', label: '🏠 Dashboard' }],
  },
  {
    label: 'Management',
    items: [
      { href: '/users', label: '👥 Users' },
      { href: '/reports', label: '🚩 Reports' },
      { href: '/safety', label: '🛡 Safety' },
    ],
  },
  {
    label: 'Insights',
    items: [{ href: '/analytics', label: '📊 Analytics' }],
  },
]

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isPublic = PUBLIC_ROUTES.includes(router.pathname)

  useEffect(() => {
    if (isPublic) return
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('mindbridge.admin.token') : null
    if (!token) {
      router.replace('/login')
    }
  }, [router.pathname])

  function logout() {
    localStorage.removeItem('mindbridge.admin.token')
    router.replace('/login')
  }

  if (isPublic) return <Component {...pageProps} />

  return (
    <div style={layoutStyles.shell}>
      {/* Sidebar */}
      <aside style={layoutStyles.sidebar}>
        <div style={layoutStyles.brand}>
          MindBridge
          <br />
          <span style={layoutStyles.brandSub}>Admin Console</span>
        </div>

        <nav style={layoutStyles.nav}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} style={layoutStyles.group}>
              <span style={layoutStyles.groupLabel}>{group.label}</span>
              {group.items.map(({ href, label }) => {
                const active = router.pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    style={{ ...layoutStyles.link, ...(active ? layoutStyles.linkActive : {}) }}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <button onClick={logout} style={layoutStyles.logout}>
          ↩ Sign out
        </button>
      </aside>

      {/* Main content */}
      <main style={layoutStyles.main}>
        <Component {...pageProps} />
      </main>
    </div>
  )
}

const layoutStyles: Record<string, React.CSSProperties> = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f8f9fb',
  },
  sidebar: {
    width: 220,
    flexShrink: 0,
    background: '#1a1a2e',
    color: '#c7d2fe',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 0 1rem',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
  },
  brand: {
    fontWeight: 700,
    fontSize: '1rem',
    color: '#fff',
    padding: '0 1.25rem 1.5rem',
    lineHeight: 1.4,
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    marginBottom: '1rem',
  },
  brandSub: {
    fontWeight: 400,
    fontSize: '0.7rem',
    color: '#818cf8',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    padding: '0 0.75rem',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
  },
  groupLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#6366f1',
    padding: '0 0.5rem',
    marginBottom: '0.25rem',
  },
  link: {
    display: 'block',
    padding: '0.45rem 0.75rem',
    borderRadius: 8,
    color: '#c7d2fe',
    textDecoration: 'none',
    fontSize: '0.875rem',
    transition: 'background 0.15s',
  },
  linkActive: {
    background: '#312e81',
    color: '#fff',
    fontWeight: 600,
  },
  logout: {
    margin: '0 1.25rem',
    padding: '0.5rem 0.75rem',
    background: 'transparent',
    border: '1px solid rgba(99,102,241,0.4)',
    color: '#a5b4fc',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: '0.8rem',
    textAlign: 'left' as const,
  },
  main: {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto',
    minWidth: 0,
  },
}
