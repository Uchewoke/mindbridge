import { useMemo, useState } from 'react'
import { Button, Card, CardTitle, EmptyState, PageHeader, ToggleRow } from '@/components/ui'
import { useUIStore } from '@/stores'

const FLAG_SEV = {
  CRISIS: { bg: '#fde8e8', color: '#c0392b' },
  HIGH: { bg: '#fde8e8', color: '#e74c3c' },
  MEDIUM: { bg: '#fef9e7', color: '#e67e22' },
  LOW: { bg: '#eafaf1', color: '#27ae60' },
}

const ADMIN_DATA = {
  flags: [
    { id: 'f1', text: 'Possible crisis language detected in direct message', user: 'User #4481', severity: 'CRISIS', time: '2m ago' },
    { id: 'f2', text: 'Harassment report filed in Alcohol Recovery community', user: 'Maya R.', severity: 'HIGH', time: '14m ago' },
    { id: 'f3', text: 'Spam-like rapid posting pattern detected', user: 'Anonymous #09', severity: 'MEDIUM', time: '1h ago' },
    { id: 'f4', text: 'Minor profanity in public support thread', user: 'Jordan K.', severity: 'LOW', time: '3h ago' },
  ],
  users: [
    { id: 'u1', name: 'Maya Reed', email: 'maya@example.com', role: 'seeker', status: 'active' },
    { id: 'u2', name: 'Ari L.', email: 'ari@example.com', role: 'mentor', status: 'active' },
    { id: 'u3', name: 'Jordan K.', email: 'jordan@example.com', role: 'seeker', status: 'pending' },
    { id: 'u4', name: 'Sam W.', email: 'sam@example.com', role: 'mentor', status: 'suspended' },
    { id: 'u5', name: 'Casey T.', email: 'casey@example.com', role: 'seeker', status: 'active' },
    { id: 'u6', name: 'Robin P.', email: 'robin@example.com', role: 'seeker', status: 'pending' },
  ],
  communities: [
    { id: 'c1', name: 'Alcohol Recovery', members: 1842, posts: 4210 },
    { id: 'c2', name: 'Anxiety & Panic', members: 3104, posts: 7890 },
    { id: 'c3', name: 'Depression Support', members: 2891, posts: 6540 },
    { id: 'c4', name: 'Eating Disorders', members: 978, posts: 2310 },
    { id: 'c5', name: 'Grief & Loss', members: 1240, posts: 3102 },
    { id: 'c6', name: 'Trauma Survivors', members: 1567, posts: 3890 },
    { id: 'c7', name: 'Family Support', members: 762, posts: 1820 },
  ],
  mentors: [
    { id: 'm1', name: 'Dr. Sarah K.', specialty: 'Addiction', status: 'pending', story: 'Certified addiction counselor with 8 years of clinical experience in outpatient treatment programs.' },
    { id: 'm2', name: 'Marcus T.', specialty: 'Anxiety', status: 'pending', story: 'Five-year recovery from debilitating anxiety disorders. Peer support specialist certification, 2021.' },
    { id: 'm3', name: 'Priya N.', specialty: 'Grief', status: 'verified', story: 'Licensed clinical social worker specialising in bereavement and traumatic loss.' },
    { id: 'm4', name: 'Lena H.', specialty: 'Trauma', status: 'pending', story: 'Trauma-informed coach with lived CPTSD experience. Somatic therapy trained.' },
    { id: 'm5', name: 'Carlos M.', specialty: 'Depression', status: 'verified', story: 'Psychiatric nurse practitioner and depression recovery advocate for 10+ years.' },
  ],
  anonStats: { activeAnonSessions: 214, totalAnonPosts: 1893, anonMessages7d: 432, identityLeakAlerts: 2 },
  topMentors: [
    { name: 'Priya N.', sessions: 34, rating: '4.9' },
    { name: 'Carlos M.', sessions: 28, rating: '4.8' },
    { name: 'Ari L.', sessions: 21, rating: '4.7' },
  ],
  activityChart: [12, 19, 15, 28, 22, 35, 30],
}

function AdminBarChart({ data }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const max = Math.max(...data)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 90, padding: '0 4px' }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: '100%', background: '#7cb97e', borderRadius: '4px 4px 0 0', height: `${Math.round((v / max) * 72)}px`, minHeight: 4 }} />
          <span style={{ fontSize: 10, color: 'var(--ink-m)' }}>{days[i]}</span>
        </div>
      ))}
    </div>
  )
}

export function AdminPage() {
  const toast = useUIStore((s) => s.toast)
  const [tab, setTab] = useState('overview')
  const [flags, setFlags] = useState(ADMIN_DATA.flags)
  const [users, setUsers] = useState(ADMIN_DATA.users)
  const [mentors, setMentors] = useState(ADMIN_DATA.mentors)
  const [expandedStory, setExpandedStory] = useState(null)
  const [q, setQ] = useState('')
  const [anonControls, setAnonControls] = useState({ allowAnonPosting: true, hideAnonInSearch: true, requireAnonApproval: false, logAnonActivity: true })

  const filteredUsers = useMemo(
    () => users.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())),
    [users, q],
  )
  const pendingUsers = useMemo(() => users.filter((u) => u.status === 'pending'), [users])
  const pendingMentorCount = useMemo(() => mentors.filter((m) => m.status === 'pending').length, [mentors])

  const dismissFlag = (id) => { setFlags((x) => x.filter((f) => f.id !== id)); toast('Flag dismissed', 'success') }
  const removeFlag = (id) => { setFlags((x) => x.filter((f) => f.id !== id)); toast('Content removed', 'success') }
  const alertCrisis = (id) => { setFlags((x) => x.filter((f) => f.id !== id)); toast('Crisis team alerted', 'success') }
  const approveUser = (id) => { setUsers((x) => x.map((u) => u.id === id ? { ...u, status: 'active' } : u)); toast('User approved', 'success') }
  const suspendUser = (id) => { setUsers((x) => x.map((u) => u.id === id ? { ...u, status: 'suspended' } : u)); toast('User suspended', 'success') }
  const unsuspendUser = (id) => { setUsers((x) => x.map((u) => u.id === id ? { ...u, status: 'active' } : u)); toast('User reactivated', 'success') }
  const approveMentor = (id) => { setMentors((x) => x.map((m) => m.id === id ? { ...m, status: 'verified' } : m)); toast('Mentor approved', 'success') }
  const revokeMentor = (id) => { setMentors((x) => x.map((m) => m.id === id ? { ...m, status: 'pending' } : m)); toast('Verification revoked', 'success') }

  const statusChip = (s) => {
    const map = { active: '#27ae60', pending: '#e67e22', suspended: '#e74c3c', verified: '#2980b9' }
    return <span style={{ background: (map[s] || '#888') + '22', color: map[s] || '#888', borderRadius: 999, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{s}</span>
  }

  return (
    <div>
      <PageHeader title="Admin <em>Operations</em>" sub="Safety, moderation, and platform health." />
      <Card style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {[
          ['overview', '🛡 Overview'],
          ['flags', flags.length ? `🚩 Flags (${flags.length})` : '🚩 Flags'],
          ['users', '👥 Users'],
          ['communities', '🫂 Communities'],
          ['mentors', pendingMentorCount ? `✅ Mentors (${pendingMentorCount})` : '✅ Mentors'],
          ['anonymous', '👤 Anonymous'],
        ].map(([t, label]) => (
          <Button key={t} variant={tab === t ? 'sage' : 'ghost'} size="sm" onClick={() => setTab(t)}>
            {label}
          </Button>
        ))}
      </Card>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' ? (
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12 }}>
            {[
              ['Total Users', users.length, null],
              ['Active Sessions', 38, 'live now'],
              ['Open Flags', flags.length, flags.length > 0 ? 'needs review' : 'all clear'],
              ['Pending Approvals', pendingUsers.length, pendingUsers.length > 0 ? 'action required' : 'none'],
            ].map(([label, value, sub]) => (
              <Card key={label} style={{ textAlign: 'center', padding: '14px 10px' }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--sage)' }}>{value}</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
                {sub ? <div style={{ fontSize: 11, color: 'var(--ink-m)', marginTop: 2 }}>{sub}</div> : null}
              </Card>
            ))}
          </div>
          <Card>
            <CardTitle>7-Day Platform Activity</CardTitle>
            <AdminBarChart data={ADMIN_DATA.activityChart} />
          </Card>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
            <Card>
              <CardTitle>Pending Approvals</CardTitle>
              {pendingUsers.length === 0 ? (
                <p style={{ color: 'var(--ink-m)', fontSize: 14, margin: 0 }}>No pending users.</p>
              ) : (
                pendingUsers.map((u) => (
                  <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #eef2e7' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-m)', textTransform: 'capitalize' }}>{u.role}</div>
                    </div>
                    <Button size="sm" onClick={() => approveUser(u.id)}>Approve</Button>
                  </div>
                ))
              )}
            </Card>
            <Card>
              <CardTitle>Top Mentors</CardTitle>
              {ADMIN_DATA.topMentors.map((m) => (
                <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #eef2e7' }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-m)' }}>{m.sessions} sessions · ⭐ {m.rating}</div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      ) : null}

      {/* ── FLAGGED CONTENT ── */}
      {tab === 'flags' ? (
        <Card>
          <CardTitle>Flagged Content ({flags.length})</CardTitle>
          {flags.length === 0 ? (
            <EmptyState icon="✅" title="No active flags" sub="All flagged content has been resolved." />
          ) : (
            flags.map((f) => {
              const sev = FLAG_SEV[f.severity] || FLAG_SEV.LOW
              return (
                <div key={f.id} style={{ border: `1.5px solid ${sev.color}44`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ background: sev.bg, color: sev.color, borderRadius: 999, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{f.severity}</span>
                    <span style={{ fontSize: 12, color: 'var(--ink-m)' }}>{f.user} · {f.time}</span>
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: 14 }}>{f.text}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button variant="outline" size="sm" onClick={() => dismissFlag(f.id)}>Dismiss</Button>
                    <Button variant="dark" size="sm" onClick={() => removeFlag(f.id)}>Remove content</Button>
                    {f.severity === 'CRISIS' ? (
                      <Button variant="danger" size="sm" onClick={() => alertCrisis(f.id)}>Alert crisis team</Button>
                    ) : null}
                  </div>
                </div>
              )
            })
          )}
        </Card>
      ) : null}

      {/* ── USERS ── */}
      {tab === 'users' ? (
        <Card>
          <CardTitle>User Directory</CardTitle>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or email…"
            style={{ border: '1px solid #d8decc', borderRadius: 999, padding: '8px 14px', marginBottom: 12, width: '100%', boxSizing: 'border-box' }}
          />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e8ede1' }}>
                  {['Name', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '6px 10px', color: 'var(--ink-m)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 16, color: 'var(--ink-m)', textAlign: 'center' }}>No users match your search.</td></tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #eef2e7' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: '8px 10px', color: 'var(--ink-m)' }}>{u.email}</td>
                      <td style={{ padding: '8px 10px', textTransform: 'capitalize' }}>{u.role}</td>
                      <td style={{ padding: '8px 10px' }}>{statusChip(u.status)}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {u.status === 'pending' ? <Button size="sm" onClick={() => approveUser(u.id)}>Approve</Button> : null}
                          {u.status === 'active' ? <Button size="sm" variant="outline" onClick={() => suspendUser(u.id)}>Suspend</Button> : null}
                          {u.status === 'suspended' ? <Button size="sm" variant="outline" onClick={() => unsuspendUser(u.id)}>Unsuspend</Button> : null}
                          <Button size="sm" variant="ghost" onClick={() => toast(`Viewing ${u.name}`, 'success')}>View</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {/* ── COMMUNITIES ── */}
      {tab === 'communities' ? (
        <Card>
          <CardTitle>Communities ({ADMIN_DATA.communities.length})</CardTitle>
          <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
            {ADMIN_DATA.communities.map((c) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: '1px solid #e8ece1', borderRadius: 10, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-m)' }}>{c.members.toLocaleString()} members · {c.posts.toLocaleString()} posts</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast(`Managing ${c.name}`, 'success')}>Manage</Button>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {/* ── MENTORS ── */}
      {tab === 'mentors' ? (
        <Card>
          <CardTitle>Mentor Verification Queue</CardTitle>
          {mentors.map((m) => (
            <div key={m.id} style={{ border: '1px solid #e8ece1', borderRadius: 10, padding: 12, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{m.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-m)', marginTop: 2 }}>Specialty: {m.specialty} · {statusChip(m.status)}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Button size="sm" variant="ghost" onClick={() => setExpandedStory(expandedStory === m.id ? null : m.id)}>
                    {expandedStory === m.id ? 'Hide story' : 'View story'}
                  </Button>
                  {m.status === 'pending' ? <Button size="sm" onClick={() => approveMentor(m.id)}>Approve</Button> : null}
                  {m.status === 'verified' ? <Button size="sm" variant="danger" onClick={() => revokeMentor(m.id)}>Revoke</Button> : null}
                </div>
              </div>
              {expandedStory === m.id ? (
                <div style={{ marginTop: 10, padding: '10px 12px', background: '#f8fbf7', borderRadius: 8, fontSize: 14 }}>
                  {m.story}
                </div>
              ) : null}
            </div>
          ))}
        </Card>
      ) : null}

      {/* ── ANONYMOUS ── */}
      {tab === 'anonymous' ? (
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 12 }}>
            {[
              ['Active anon sessions', ADMIN_DATA.anonStats.activeAnonSessions],
              ['Total anon posts', ADMIN_DATA.anonStats.totalAnonPosts],
              ['Messages (7d)', ADMIN_DATA.anonStats.anonMessages7d],
              ['Identity leak alerts', ADMIN_DATA.anonStats.identityLeakAlerts],
            ].map(([label, value]) => (
              <Card key={label} style={{ textAlign: 'center', padding: '14px 10px' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--sage)' }}>{value}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-m)', marginTop: 4 }}>{label}</div>
              </Card>
            ))}
          </div>
          <Card>
            <CardTitle>Admin Privacy Controls</CardTitle>
            <ToggleRow
              label="Allow anonymous posting"
              sub="Permit users to post and reply without revealing their identity"
              checked={anonControls.allowAnonPosting}
              onChange={() => setAnonControls((p) => ({ ...p, allowAnonPosting: !p.allowAnonPosting }))}
              id="admin-anon-posting"
            />
            <ToggleRow
              label="Hide anonymous users in search"
              sub="Anonymous sessions are excluded from search and discovery results"
              checked={anonControls.hideAnonInSearch}
              onChange={() => setAnonControls((p) => ({ ...p, hideAnonInSearch: !p.hideAnonInSearch }))}
              id="admin-anon-search"
            />
            <ToggleRow
              label="Require approval for anonymous mode"
              sub="Users must submit a request before anonymous mode is activated"
              checked={anonControls.requireAnonApproval}
              onChange={() => setAnonControls((p) => ({ ...p, requireAnonApproval: !p.requireAnonApproval }))}
              id="admin-anon-approval"
            />
            <ToggleRow
              label="Log anonymous activity"
              sub="Store anonymised audit trail for moderation purposes only"
              checked={anonControls.logAnonActivity}
              onChange={() => setAnonControls((p) => ({ ...p, logAnonActivity: !p.logAnonActivity }))}
              id="admin-anon-log"
            />
            <div style={{ marginTop: 12 }}>
              <Button onClick={() => toast('Anonymous controls saved', 'success')}>Save controls</Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
