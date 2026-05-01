import { useEffect, useState } from 'react'

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

function Bar({
  label,
  value,
  max,
  color,
}: {
  label: string
  value: number
  max: number
  color: string
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
          marginBottom: 4,
        }}
      >
        <span>{label}</span>
        <span style={{ fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ background: '#f3f4f6', borderRadius: 4, height: 12, overflow: 'hidden' }}>
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: 4,
            transition: 'width 0.4s',
          }}
        />
      </div>
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('mindbridge.admin.token') ?? ''
    fetch(`${API_BASE}/api/admin/stats`, { headers: { Authorization: token } })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  const maxVal = stats ? Math.max(stats.totalUsers, stats.posts, stats.sessions, 1) : 1

  return (
    <main style={styles.page}>
      <h1 style={styles.heading}>Analytics</h1>
      <p style={styles.sub}>Engagement, matching quality, and retention metrics</p>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p>Loading…</p>}

      {stats && (
        <>
          <div style={styles.kpiRow}>
            {[
              { label: 'Total Users', value: stats.totalUsers, color: '#6366f1' },
              { label: 'Active Users', value: stats.activeUsers, color: '#10b981' },
              { label: 'Mentors', value: stats.mentors, color: '#f59e0b' },
              { label: 'Open Flags', value: stats.openFlags, color: '#ef4444' },
            ].map(({ label, value, color }) => (
              <div key={label} style={styles.kpiCard}>
                <div style={{ ...styles.kpiVal, color }}>{value}</div>
                <div style={styles.kpiLabel}>{label}</div>
              </div>
            ))}
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>Platform Activity</h2>
            <Bar label="Total Users" value={stats.totalUsers} max={maxVal} color="#6366f1" />
            <Bar label="Active Users" value={stats.activeUsers} max={maxVal} color="#10b981" />
            <Bar label="Mentors" value={stats.mentors} max={maxVal} color="#f59e0b" />
            <Bar label="Posts" value={stats.posts} max={maxVal} color="#3b82f6" />
            <Bar label="Sessions" value={stats.sessions} max={maxVal} color="#8b5cf6" />
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>Safety Overview</h2>
            <Bar
              label="Safety Events"
              value={stats.safetyEvents}
              max={Math.max(stats.safetyEvents, stats.openFlags, 1)}
              color="#ef4444"
            />
            <Bar
              label="Open Flags"
              value={stats.openFlags}
              max={Math.max(stats.safetyEvents, stats.openFlags, 1)}
              color="#f97316"
            />
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>Engagement Rate</h2>
            <p style={styles.metric}>
              <strong>
                {stats.totalUsers > 0
                  ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
                  : 0}
                %
              </strong>{' '}
              of users are currently active
            </p>
            <p style={styles.metric}>
              <strong>
                {stats.totalUsers > 0 ? Math.round((stats.mentors / stats.totalUsers) * 100) : 0}%
              </strong>{' '}
              of users are mentors
            </p>
          </div>
        </>
      )}
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 900,
    margin: '2rem auto',
    fontFamily: 'Segoe UI, sans-serif',
    padding: '0 1rem',
  },
  heading: { fontSize: '1.8rem', fontWeight: 700, margin: 0 },
  sub: { color: '#666', marginTop: 4, marginBottom: '1.5rem' },
  kpiRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' },
  kpiCard: {
    flex: '1 1 140px',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: '1rem',
    textAlign: 'center',
  },
  kpiVal: { fontSize: '2rem', fontWeight: 700 },
  kpiLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginTop: 4,
  },
  section: { marginBottom: '2rem' },
  sectionHeading: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0.4rem',
  },
  metric: { fontSize: '0.95rem', margin: '0.4rem 0' },
  error: { color: '#c00' },
}
