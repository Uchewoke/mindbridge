import { useEffect, useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'

interface User {
  id: string
  email: string | null
  isActive: boolean
  isAdmin: boolean
  isAnonymous: boolean
  createdAt: string
  profile: { displayName: string | null; role: string | null } | null
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function token() {
    return localStorage.getItem('mindbridge.admin.token') ?? ''
  }

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/users`, { headers: { Authorization: token() } })
      .then((r) => r.json())
      .then((d) => setUsers(d.users))
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  async function toggleActive(user: User) {
    const res = await fetch(`${API_BASE}/api/admin/users/${user.id}/status`, {
      method: 'PATCH',
      headers: { Authorization: token(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !user.isActive }),
    })
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u)))
    }
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return (
      u.email?.toLowerCase().includes(q) ||
      u.profile?.displayName?.toLowerCase().includes(q) ||
      u.profile?.role?.toLowerCase().includes(q)
    )
  })

  return (
    <main style={styles.page}>
      <h1 style={styles.heading}>Users</h1>
      <p style={styles.sub}>Manage mentors, seekers, and account status</p>

      <input
        type="search"
        placeholder="Search by email, name, or role…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p>Loading…</p>}

      {!loading && (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Name', 'Email', 'Role', 'Status', 'Admin', 'Joined', 'Action'].map((h) => (
                  <th key={h} style={styles.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={styles.empty}>
                    No users found.
                  </td>
                </tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id} style={styles.tr}>
                  <td style={styles.td}>{u.profile?.displayName ?? '—'}</td>
                  <td style={styles.td}>{u.email ?? '—'}</td>
                  <td style={styles.td}>{u.profile?.role ?? '—'}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        background: u.isActive ? '#d1fae5' : '#fee2e2',
                        color: u.isActive ? '#065f46' : '#991b1b',
                      }}
                    >
                      {u.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td style={styles.td}>{u.isAdmin ? '✓' : ''}</td>
                  <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    {!u.isAdmin && (
                      <button onClick={() => toggleActive(u)} style={styles.btn}>
                        {u.isActive ? 'Suspend' : 'Reinstate'}
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
  search: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    fontSize: '0.9rem',
    border: '1px solid #ccc',
    borderRadius: 6,
    marginBottom: '1rem',
    boxSizing: 'border-box',
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
