import { useEffect, useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'

interface Flag {
  id: string
  targetType: string
  targetId: string
  flagType: string | null
  reason: string | null
  isResolved: boolean
  createdAt: string
  resolvedAt: string | null
  creator: { email: string | null; profile: { displayName: string | null } | null } | null
}

export default function AdminReportsPage() {
  const [flags, setFlags] = useState<Flag[]>([])
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function token() {
    return localStorage.getItem('mindbridge.admin.token') ?? ''
  }

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/flags`, { headers: { Authorization: token() } })
      .then((r) => r.json())
      .then((d) => setFlags(d.flags))
      .catch(() => setError('Failed to load reports'))
      .finally(() => setLoading(false))
  }, [])

  async function resolve(id: string) {
    const res = await fetch(`${API_BASE}/api/admin/flags/${id}/resolve`, {
      method: 'PATCH',
      headers: { Authorization: token() },
    })
    if (res.ok) {
      setFlags((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, isResolved: true, resolvedAt: new Date().toISOString() } : f,
        ),
      )
    }
  }

  const shown = flags.filter((f) =>
    filter === 'all' ? true : filter === 'open' ? !f.isResolved : f.isResolved,
  )

  return (
    <main style={styles.page}>
      <h1 style={styles.heading}>Reports &amp; Flags</h1>
      <p style={styles.sub}>User-submitted flags and moderation outcomes</p>

      <div style={styles.tabs}>
        {(['all', 'open', 'resolved'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{ ...styles.tab, ...(filter === t ? styles.tabActive : {}) }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p>Loading…</p>}

      {!loading && (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Type', 'Target', 'Reason', 'Flagged By', 'Status', 'Created', 'Action'].map(
                  (h) => (
                    <th key={h} style={styles.th}>
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 && (
                <tr>
                  <td colSpan={7} style={styles.empty}>
                    No reports found.
                  </td>
                </tr>
              )}
              {shown.map((f) => (
                <tr key={f.id} style={styles.tr}>
                  <td style={styles.td}>
                    <span style={styles.chip}>{f.flagType ?? f.targetType}</span>
                  </td>
                  <td style={styles.td}>
                    <code style={styles.code}>{f.targetId.slice(0, 8)}…</code>
                  </td>
                  <td style={styles.td}>{f.reason ?? '—'}</td>
                  <td style={styles.td}>
                    {f.creator?.profile?.displayName ?? f.creator?.email ?? 'System'}
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        background: f.isResolved ? '#d1fae5' : '#fef3c7',
                        color: f.isResolved ? '#065f46' : '#92400e',
                      }}
                    >
                      {f.isResolved ? 'Resolved' : 'Open'}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(f.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    {!f.isResolved && (
                      <button onClick={() => resolve(f.id)} style={styles.btn}>
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
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
  sub: { color: '#666', marginTop: 4, marginBottom: '1rem' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1rem' },
  tab: {
    padding: '0.4rem 1rem',
    border: '1px solid #ccc',
    borderRadius: 9999,
    background: '#fff',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  tabActive: { background: '#1a1a2e', color: '#fff', border: '1px solid #1a1a2e' },
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
  chip: {
    padding: '2px 8px',
    borderRadius: 9999,
    fontSize: '0.75rem',
    background: '#e0e7ff',
    color: '#3730a3',
    fontWeight: 600,
  },
  badge: { padding: '2px 8px', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600 },
  code: { fontSize: '0.8rem', background: '#f3f4f6', padding: '1px 4px', borderRadius: 3 },
  btn: {
    padding: '4px 10px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    borderRadius: 4,
    border: '1px solid #ccc',
    background: '#fff',
  },
  empty: { textAlign: 'center', padding: '2rem', color: '#999' },
  error: { color: '#c00' },
}
