import { useEffect, useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'

interface SafetyEvent {
  id: number
  type: string
  content: string | null
  createdAt: string
  user: { email: string | null; profile: { displayName: string | null } | null } | null
}

interface Summary {
  total: number
  crisisCount: number
  blockedCount: number
}

export default function AdminSafetyPage() {
  const [events, setEvents] = useState<SafetyEvent[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('mindbridge.admin.token') ?? ''
    fetch(`${API_BASE}/api/admin/reports`, { headers: { Authorization: token } })
      .then((r) => r.json())
      .then((d) => {
        setEvents(d.events ?? [])
        setSummary(d.summary ?? null)
      })
      .catch(() => setError('Failed to load safety data'))
      .finally(() => setLoading(false))
  }, [])

  const typeColor: Record<string, { bg: string; color: string }> = {
    crisis: { bg: '#fee2e2', color: '#991b1b' },
    blocked: { bg: '#fef3c7', color: '#92400e' },
    report: { bg: '#e0e7ff', color: '#3730a3' },
  }

  return (
    <main style={styles.page}>
      <h1 style={styles.heading}>Safety Monitor</h1>
      <p style={styles.sub}>Crisis escalations, blocked content, and safety workflows</p>

      {summary && (
        <div style={styles.summaryRow}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryVal}>{summary.total}</div>
            <div style={styles.summaryKey}>Total Events</div>
          </div>
          <div style={{ ...styles.summaryCard, background: '#fee2e2' }}>
            <div style={styles.summaryVal}>{summary.crisisCount}</div>
            <div style={styles.summaryKey}>Crisis Flags</div>
          </div>
          <div style={{ ...styles.summaryCard, background: '#fef3c7' }}>
            <div style={styles.summaryVal}>{summary.blockedCount}</div>
            <div style={styles.summaryKey}>Blocked Events</div>
          </div>
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p>Loading…</p>}

      {!loading && (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Type', 'User', 'Content Preview', 'Date'].map((h) => (
                  <th key={h} style={styles.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.length === 0 && (
                <tr>
                  <td colSpan={4} style={styles.empty}>
                    No safety events recorded.
                  </td>
                </tr>
              )}
              {events.map((e) => {
                const colors = typeColor[e.type] ?? { bg: '#f3f4f6', color: '#374151' }
                return (
                  <tr key={e.id} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: colors.bg, color: colors.color }}>
                        {e.type}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {e.user?.profile?.displayName ?? e.user?.email ?? 'Anonymous'}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.preview}>
                        {e.content ? e.content.slice(0, 120) : '—'}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(e.createdAt).toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 1100,
    margin: '2rem auto',
    fontFamily: 'Segoe UI, sans-serif',
    padding: '0 1rem',
  },
  heading: { fontSize: '1.8rem', fontWeight: 700, margin: 0 },
  sub: { color: '#666', marginTop: 4, marginBottom: '1.25rem' },
  summaryRow: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  summaryCard: {
    flex: '1 1 140px',
    background: '#f3f4f6',
    borderRadius: 8,
    padding: '1rem',
    textAlign: 'center',
  },
  summaryVal: { fontSize: '2rem', fontWeight: 700, color: '#1a1a2e' },
  summaryKey: {
    fontSize: '0.75rem',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginTop: 4,
  },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' },
  th: {
    textAlign: 'left',
    padding: '0.6rem 0.75rem',
    background: '#f3f4f6',
    borderBottom: '2px solid #e0e0e0',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '0.6rem 0.75rem', verticalAlign: 'middle' },
  badge: { padding: '2px 8px', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600 },
  preview: { color: '#555', fontStyle: 'italic' },
  empty: { textAlign: 'center', padding: '2rem', color: '#999' },
  error: { color: '#c00' },
}
