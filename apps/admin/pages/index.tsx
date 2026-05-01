import { useEffect, useState } from 'react'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'

interface Stats {
  totalUsers: number
  activeUsers: number
  mentors: number
  posts: number
  sessions: number
  safetyEvents: number
  openFlags: number
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string
  value: number | string
  href?: string
}) {
  const card = (
    <div style={styles.card}>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  )
  return href ? (
    <Link href={href} style={{ textDecoration: 'none' }}>
      {card}
    </Link>
  ) : (
    card
  )
}

export default function AdminHomePage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('mindbridge.admin.token') ?? ''
    fetch(`${API_BASE}/api/admin/stats`, {
      headers: { Authorization: token },
    })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setError('Failed to load stats'))
  }, [])

  return (
    <main style={styles.page}>
      <h1 style={styles.heading}>Admin Dashboard</h1>
      <p style={styles.sub}>MindBridge platform overview</p>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.grid}>
        <StatCard label="Total Users" value={stats?.totalUsers ?? '—'} href="/users" />
        <StatCard label="Active Users" value={stats?.activeUsers ?? '—'} href="/users" />
        <StatCard label="Mentors" value={stats?.mentors ?? '—'} href="/users" />
        <StatCard label="Posts" value={stats?.posts ?? '—'} />
        <StatCard label="Sessions" value={stats?.sessions ?? '—'} />
        <StatCard label="Safety Events" value={stats?.safetyEvents ?? '—'} href="/safety" />
        <StatCard label="Open Flags" value={stats?.openFlags ?? '—'} href="/reports" />
      </div>

      <div style={styles.links}>
        <Link href="/users" style={styles.link}>
          Manage Users →
        </Link>
        <Link href="/reports" style={styles.link}>
          View Reports →
        </Link>
        <Link href="/safety" style={styles.link}>
          Safety Monitor →
        </Link>
        <Link href="/analytics" style={styles.link}>
          Analytics →
        </Link>
      </div>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 960,
    margin: '2rem auto',
    fontFamily: 'Segoe UI, sans-serif',
    padding: '0 1rem',
  },
  heading: { fontSize: '1.8rem', fontWeight: 700, margin: 0 },
  sub: { color: '#666', marginTop: 4, marginBottom: '1.5rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  card: {
    background: '#f9f9f9',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    padding: '1.25rem 1rem',
    textAlign: 'center',
    cursor: 'pointer',
  },
  statValue: { fontSize: '2rem', fontWeight: 700, color: '#1a1a2e' },
  statLabel: {
    fontSize: '0.8rem',
    color: '#555',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  links: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  link: {
    padding: '0.6rem 1.2rem',
    background: '#1a1a2e',
    color: '#fff',
    borderRadius: 6,
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  error: { color: '#c00', marginBottom: '1rem' },
}
