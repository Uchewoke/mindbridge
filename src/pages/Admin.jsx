import { useEffect, useMemo, useState } from 'react'
import { Button, Card, CardTitle, EmptyState, PageHeader, ToggleRow } from '@/components/ui'
import {
  fetchAdminState,
  fetchSafetyEvents,
  updateAdminFlagAction,
  updateAdminMentorStatus,
  updateAdminUserStatus,
} from '@/api/admin'
import { useUIStore } from '@/stores'

const FLAG_SEV = {
  CRISIS: { bg: '#fde8e8', color: '#c0392b' },
  HIGH: { bg: '#fde8e8', color: '#e74c3c' },
  MEDIUM: { bg: '#fef9e7', color: '#e67e22' },
  LOW: { bg: '#eafaf1', color: '#27ae60' },
}

const ADMIN_DATA = {
  flags: [
    {
      id: 'f1',
      text: 'Possible crisis language detected in direct message',
      user: 'User #4481',
      severity: 'CRISIS',
      time: '2m ago',
    },
    {
      id: 'f2',
      text: 'Harassment report filed in Alcohol Recovery community',
      user: 'Maya R.',
      severity: 'HIGH',
      time: '14m ago',
    },
    {
      id: 'f3',
      text: 'Spam-like rapid posting pattern detected',
      user: 'Anonymous #09',
      severity: 'MEDIUM',
      time: '1h ago',
    },
    {
      id: 'f4',
      text: 'Minor profanity in public support thread',
      user: 'Jordan K.',
      severity: 'LOW',
      time: '3h ago',
    },
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
    {
      id: 'c1',
      name: 'Alcohol Recovery',
      members: 1842,
      posts: 4210,
      activity: [36, 42, 30, 51, 48, 59, 62],
    },
    {
      id: 'c2',
      name: 'Anxiety & Panic',
      members: 3104,
      posts: 7890,
      activity: [62, 70, 58, 74, 79, 88, 84],
    },
    {
      id: 'c3',
      name: 'Depression Support',
      members: 2891,
      posts: 6540,
      activity: [48, 52, 49, 61, 65, 69, 73],
    },
    {
      id: 'c4',
      name: 'Eating Disorders',
      members: 978,
      posts: 2310,
      activity: [18, 25, 21, 28, 24, 31, 34],
    },
    {
      id: 'c5',
      name: 'Grief & Loss',
      members: 1240,
      posts: 3102,
      activity: [22, 24, 27, 31, 29, 35, 38],
    },
    {
      id: 'c6',
      name: 'Trauma Survivors',
      members: 1567,
      posts: 3890,
      activity: [29, 35, 33, 38, 41, 46, 50],
    },
    {
      id: 'c7',
      name: 'Family Support',
      members: 762,
      posts: 1820,
      activity: [14, 16, 13, 18, 21, 24, 26],
    },
  ],
  mentors: [
    {
      id: 'm1',
      name: 'Dr. Sarah K.',
      specialty: 'Addiction',
      status: 'pending',
      story:
        'Certified addiction counselor with 8 years of clinical experience in outpatient treatment programs.',
    },
    {
      id: 'm2',
      name: 'Marcus T.',
      specialty: 'Anxiety',
      status: 'pending',
      story:
        'Five-year recovery from debilitating anxiety disorders. Peer support specialist certification, 2021.',
    },
    {
      id: 'm3',
      name: 'Priya N.',
      specialty: 'Grief',
      status: 'verified',
      story: 'Licensed clinical social worker specialising in bereavement and traumatic loss.',
    },
    {
      id: 'm4',
      name: 'Lena H.',
      specialty: 'Trauma',
      status: 'pending',
      story: 'Trauma-informed coach with lived CPTSD experience. Somatic therapy trained.',
    },
    {
      id: 'm5',
      name: 'Carlos M.',
      specialty: 'Depression',
      status: 'verified',
      story: 'Psychiatric nurse practitioner and depression recovery advocate for 10+ years.',
    },
  ],
  anonStats: {
    activeAnonSessions: 214,
    totalAnonPosts: 1893,
    anonMessages7d: 432,
    identityLeakAlerts: 2,
  },
  topMentors: [
    {
      name: 'Priya N.',
      sessions: 34,
      rating: '4.9',
      community: 'Grief & Loss',
      responseRate: 98,
      matches: 14,
    },
    {
      name: 'Carlos M.',
      sessions: 28,
      rating: '4.8',
      community: 'Depression Support',
      responseRate: 95,
      matches: 11,
    },
    {
      name: 'Ari L.',
      sessions: 21,
      rating: '4.7',
      community: 'Alcohol Recovery',
      responseRate: 93,
      matches: 9,
    },
  ],
  activityChart: [12, 19, 15, 28, 22, 35, 30],
  totalMatches: 186,
}

function AdminBarChart({ data }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const max = Math.max(...data)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setAnimated(true), 60)
    return () => clearTimeout(timeout)
  }, [data])

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 90, padding: '0 4px' }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <div
            style={{
              width: '100%',
              background: '#7cb97e',
              borderRadius: '4px 4px 0 0',
              height: animated ? `${Math.round((v / max) * 72)}px` : '8px',
              minHeight: 4,
              transition: 'height 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
          <span style={{ fontSize: 10, color: 'var(--ink-m)' }}>{days[i]}</span>
        </div>
      ))}
    </div>
  )
}

function CommunityActivityChart({ communities }) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {communities.map((community) => (
        <div
          key={community.id}
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(160px, 220px) minmax(0, 1fr)',
            gap: 14,
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #eef2e7',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{community.name}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-m)', marginTop: 4 }}>
              {community.members.toLocaleString()} members · {community.posts.toLocaleString()}{' '}
              posts
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <AdminBarChart data={community.activity} />
          </div>
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
  const [pendingActions, setPendingActions] = useState({})
  const [expandedStory, setExpandedStory] = useState(null)
  const [safetySummary, setSafetySummary] = useState({
    flagged_message: 0,
    crisis_detection: 0,
    user_report: 0,
  })
  const [recentSafetyEvents, setRecentSafetyEvents] = useState([])
  const [q, setQ] = useState('')
  const [anonControls, setAnonControls] = useState({
    allowAnonPosting: true,
    hideAnonInSearch: true,
    requireAnonApproval: false,
    logAnonActivity: true,
  })

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(q.toLowerCase()) ||
          u.email.toLowerCase().includes(q.toLowerCase()),
      ),
    [users, q],
  )
  const pendingUsers = useMemo(() => users.filter((u) => u.status === 'pending'), [users])
  const pendingMentorCount = useMemo(
    () => mentors.filter((m) => m.status === 'pending').length,
    [mentors],
  )
  const totalMembers = useMemo(
    () => ADMIN_DATA.communities.reduce((sum, community) => sum + community.members, 0),
    [],
  )
  const totalPosts = useMemo(
    () => ADMIN_DATA.communities.reduce((sum, community) => sum + community.posts, 0),
    [],
  )
  const pendingApprovals = useMemo(
    () => [
      ...pendingUsers.map((user) => ({
        id: user.id,
        type: 'member',
        name: user.name,
        detail: user.email,
        meta: user.role,
      })),
      ...mentors
        .filter((mentor) => mentor.status === 'pending')
        .map((mentor) => ({
          id: mentor.id,
          type: 'mentor',
          name: mentor.name,
          detail: mentor.specialty,
          meta: 'mentor verification',
        })),
    ],
    [mentors, pendingUsers],
  )

  useEffect(() => {
    let active = true

    fetchAdminState()
      .then(({ data }) => {
        if (!active) return
        if (Array.isArray(data?.flags)) setFlags(data.flags)
        if (Array.isArray(data?.users)) setUsers(data.users)
        if (Array.isArray(data?.mentors)) setMentors(data.mentors)
      })
      .catch(() => {
        if (!active) return
      })

    fetchSafetyEvents()
      .then(({ data }) => {
        if (!active) return
        setSafetySummary({
          flagged_message: Number(data?.summary?.flagged_message || 0),
          crisis_detection: Number(data?.summary?.crisis_detection || 0),
          user_report: Number(data?.summary?.user_report || 0),
        })
        setRecentSafetyEvents(Array.isArray(data?.events) ? data.events.slice(0, 8) : [])
      })
      .catch(() => {
        if (!active) return
        setRecentSafetyEvents([])
      })

    return () => {
      active = false
    }
  }, [])

  const actionKey = (scope, id, action) => `${scope}:${id}:${action}`
  const isActionPending = (scope, id, action) =>
    Boolean(pendingActions[actionKey(scope, id, action)])

  const withActionLock = async (scope, id, action, task) => {
    const key = actionKey(scope, id, action)
    let locked = false

    setPendingActions((prev) => {
      if (prev[key]) return prev
      locked = true
      return { ...prev, [key]: true }
    })

    if (!locked) return

    try {
      await task()
    } finally {
      setPendingActions((prev) => {
        if (!prev[key]) return prev
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const applyFlagAction = async (id, action, message) => {
    await withActionLock('flag', id, action, async () => {
      try {
        const { data } = await updateAdminFlagAction(id, action)
        setFlags(Array.isArray(data?.flags) ? data.flags : [])
        toast(message, 'success')
      } catch {
        toast('Could not update flag. Try again.', 'error')
      }
    })
  }

  const dismissFlag = (id) => applyFlagAction(id, 'dismissed', 'Flag dismissed')

  const removeFlag = (id) => {
    applyFlagAction(id, 'removed', 'Content removed')
  }

  const alertCrisis = (id) => {
    applyFlagAction(id, 'crisis-alerted', 'Crisis team alerted')
  }

  const saveUserStatus = async (id, status, message) => {
    await withActionLock('user', id, status, async () => {
      try {
        const { data } = await updateAdminUserStatus(id, status)
        setUsers((current) => current.map((user) => (user.id === id ? data.user : user)))
        toast(message, 'success')
      } catch {
        toast('Could not update user status. Try again.', 'error')
      }
    })
  }

  const approveUser = (id) => {
    saveUserStatus(id, 'active', 'User approved')
  }

  const denyUser = (id) => {
    saveUserStatus(id, 'denied', 'User denied')
  }

  const suspendUser = (id) => {
    saveUserStatus(id, 'suspended', 'User suspended')
  }

  const unsuspendUser = (id) => {
    saveUserStatus(id, 'active', 'User reactivated')
  }

  const saveMentorStatus = async (id, status, message) => {
    await withActionLock('mentor', id, status, async () => {
      try {
        const { data } = await updateAdminMentorStatus(id, status)
        setMentors((current) => current.map((mentor) => (mentor.id === id ? data.mentor : mentor)))
        toast(message, 'success')
      } catch {
        toast('Could not update mentor status. Try again.', 'error')
      }
    })
  }

  const approveMentor = (id) => {
    saveMentorStatus(id, 'verified', 'Mentor approved')
  }

  const denyMentor = (id) => {
    saveMentorStatus(id, 'denied', 'Mentor denied')
  }

  const revokeMentor = (id) => {
    saveMentorStatus(id, 'pending', 'Verification revoked')
  }

  const statusChip = (s) => {
    const map = {
      active: '#27ae60',
      pending: '#e67e22',
      suspended: '#e74c3c',
      verified: '#2980b9',
      denied: '#7f8c8d',
    }
    return (
      <span
        style={{
          background: (map[s] || '#888') + '22',
          color: map[s] || '#888',
          borderRadius: 999,
          padding: '2px 8px',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {s}
      </span>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(160deg, #0a0e2e 0%, #0d2050 30%, #1a3a6e 55%, #c0541a 80%, #e8842a 100%)',
        padding: '12px',
        borderRadius: 12,
      }}
    >
      <PageHeader
        title="Admin <em>Operations</em>"
        sub="Safety, moderation, and platform health."
      />
      <Card style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {[
          ['overview', '🛡 Overview'],
          ['flags', flags.length ? `🚩 Flags (${flags.length})` : '🚩 Flags'],
          ['users', pendingUsers.length ? `👥 Users (${pendingUsers.length} pending)` : '👥 Users'],
          ['communities', '🫂 Communities'],
          ['mentors', pendingMentorCount ? `✅ Mentors (${pendingMentorCount})` : '✅ Mentors'],
          ['anonymous', '👤 Anonymous'],
        ].map(([t, label]) => (
          <Button
            key={t}
            variant={tab === t ? 'sage' : 'ghost'}
            size="sm"
            onClick={() => setTab(t)}
          >
            {label}
          </Button>
        ))}
      </Card>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' ? (
        <div style={{ display: 'grid', gap: 12 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
              gap: 12,
            }}
          >
            {[
              ['Members', totalMembers.toLocaleString(), 'community reach'],
              ['Posts', totalPosts.toLocaleString(), 'public activity'],
              ['Flags', flags.length, flags.length > 0 ? 'needs review' : 'all clear'],
              ['Matches', ADMIN_DATA.totalMatches, 'this week'],
            ].map(([label, value, sub]) => (
              <Card
                key={label}
                style={{
                  padding: '16px 14px',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,248,239,0.98))',
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-m)',
                    fontWeight: 700,
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--sage)', marginTop: 6 }}>
                  {value}
                </div>
                {sub ? (
                  <div style={{ fontSize: 12, color: 'var(--ink-m)', marginTop: 4 }}>{sub}</div>
                ) : null}
              </Card>
            ))}
          </div>
          <Card>
            <CardTitle>7-Day Platform Activity</CardTitle>
            <AdminBarChart data={ADMIN_DATA.activityChart} />
          </Card>
          <Card>
            <CardTitle>Community Activity</CardTitle>
            <p style={{ margin: '0 0 12px', color: 'var(--ink-m)', fontSize: 13 }}>
              Animated weekly activity bars per community.
            </p>
            <CommunityActivityChart communities={ADMIN_DATA.communities} />
          </Card>
          <Card>
            <CardTitle>Safety Events</CardTitle>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div style={{ background: '#eef7ff', borderRadius: 10, padding: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--ink-m)' }}>Flagged Messages</div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{safetySummary.flagged_message}</div>
              </div>
              <div style={{ background: '#fff5f5', borderRadius: 10, padding: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--ink-m)' }}>Crisis Detections</div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>
                  {safetySummary.crisis_detection}
                </div>
              </div>
              <div style={{ background: '#f4fff7', borderRadius: 10, padding: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--ink-m)' }}>User Reports</div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{safetySummary.user_report}</div>
              </div>
            </div>
            {recentSafetyEvents.length === 0 ? (
              <p style={{ margin: 0, color: 'var(--ink-m)', fontSize: 13 }}>
                No persisted safety events yet.
              </p>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {recentSafetyEvents.map((event) => (
                  <div
                    key={event.id}
                    style={{ border: '1px solid #e8ece1', borderRadius: 10, padding: '8px 10px' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 8,
                        flexWrap: 'wrap',
                      }}
                    >
                      <strong style={{ textTransform: 'capitalize' }}>
                        {String(event.type || '').replace(/_/g, ' ')}
                      </strong>
                      <span style={{ color: 'var(--ink-m)', fontSize: 12 }}>
                        {new Date(event.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {event.content ? (
                      <div style={{ marginTop: 4, fontSize: 13 }}>{event.content}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </Card>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
              gap: 12,
            }}
          >
            <Card>
              <CardTitle>Pending Approval Queue</CardTitle>
              {pendingApprovals.length === 0 ? (
                <p style={{ color: 'var(--ink-m)', fontSize: 14, margin: 0 }}>
                  No approvals waiting.
                </p>
              ) : (
                pendingApprovals.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '10px 0',
                      borderBottom: '1px solid #eef2e7',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-m)', marginTop: 2 }}>
                        {item.detail}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--ink-m)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          marginTop: 4,
                        }}
                      >
                        {item.meta}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {(() => {
                        const approvePending =
                          item.type === 'mentor'
                            ? isActionPending('mentor', item.id, 'verified')
                            : isActionPending('user', item.id, 'active')
                        const denyPending =
                          item.type === 'mentor'
                            ? isActionPending('mentor', item.id, 'denied')
                            : isActionPending('user', item.id, 'denied')
                        const anyPending = approvePending || denyPending
                        return (
                          <>
                            <Button
                              size="sm"
                              disabled={anyPending}
                              onClick={() =>
                                item.type === 'mentor'
                                  ? approveMentor(item.id)
                                  : approveUser(item.id)
                              }
                            >
                              {approvePending ? 'Saving…' : 'Approve'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={anyPending}
                              onClick={() =>
                                item.type === 'mentor' ? denyMentor(item.id) : denyUser(item.id)
                              }
                            >
                              {denyPending ? 'Saving…' : 'Deny'}
                            </Button>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                ))
              )}
            </Card>
            <Card>
              <CardTitle>Top Mentors This Week</CardTitle>
              {ADMIN_DATA.topMentors.map((m, index) => (
                <div
                  key={m.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '10px 0',
                    borderBottom: '1px solid #eef2e7',
                  }}
                >
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        background: index === 0 ? '#f4d35e' : index === 1 ? '#d6dde6' : '#e9b17a',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 800,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-m)', marginTop: 2 }}>
                        {m.community}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-m)', textAlign: 'right' }}>
                    <div>
                      {m.sessions} sessions · ⭐ {m.rating}
                    </div>
                    <div style={{ marginTop: 4 }}>
                      {m.matches} matches · {m.responseRate}% response
                    </div>
                  </div>
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
            <EmptyState
              icon="✅"
              title="No active flags"
              sub="All flagged content has been resolved."
            />
          ) : (
            flags.map((f) => {
              const sev = FLAG_SEV[f.severity] || FLAG_SEV.LOW
              return (
                <div
                  key={f.id}
                  style={{
                    border: `1.5px solid ${sev.color}44`,
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span
                      style={{
                        background: sev.bg,
                        color: sev.color,
                        borderRadius: 999,
                        padding: '2px 10px',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {f.severity}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--ink-m)' }}>
                      {f.user} · {f.time}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: 14 }}>{f.text}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isActionPending('flag', f.id, 'dismissed')}
                      onClick={() => dismissFlag(f.id)}
                    >
                      {isActionPending('flag', f.id, 'dismissed') ? 'Dismissing…' : 'Dismiss'}
                    </Button>
                    <Button
                      variant="dark"
                      size="sm"
                      disabled={isActionPending('flag', f.id, 'removed')}
                      onClick={() => removeFlag(f.id)}
                    >
                      {isActionPending('flag', f.id, 'removed') ? 'Removing…' : 'Remove content'}
                    </Button>
                    {f.severity === 'CRISIS' ? (
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={isActionPending('flag', f.id, 'crisis-alerted')}
                        onClick={() => alertCrisis(f.id)}
                      >
                        {isActionPending('flag', f.id, 'crisis-alerted')
                          ? 'Alerting…'
                          : 'Alert crisis team'}
                      </Button>
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
            style={{
              border: '1px solid #d8decc',
              borderRadius: 999,
              padding: '8px 14px',
              marginBottom: 12,
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e8ede1' }}>
                  {['Name', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '6px 10px',
                        color: 'var(--ink-m)',
                        fontWeight: 600,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ padding: 16, color: 'var(--ink-m)', textAlign: 'center' }}
                    >
                      No users match your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #eef2e7' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: '8px 10px', color: 'var(--ink-m)' }}>{u.email}</td>
                      <td style={{ padding: '8px 10px', textTransform: 'capitalize' }}>{u.role}</td>
                      <td style={{ padding: '8px 10px' }}>{statusChip(u.status)}</td>
                      <td style={{ padding: '8px 10px' }}>
                        {(() => {
                          const approvePending = isActionPending('user', u.id, 'active')
                          const denyPending = isActionPending('user', u.id, 'denied')
                          const suspendPending = isActionPending('user', u.id, 'suspended')
                          const anyPending = approvePending || denyPending || suspendPending
                          return (
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              {u.status === 'pending' ? (
                                <>
                                  <Button
                                    size="sm"
                                    disabled={anyPending}
                                    onClick={() => approveUser(u.id)}
                                  >
                                    {approvePending ? 'Saving…' : 'Approve'}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={anyPending}
                                    onClick={() => denyUser(u.id)}
                                  >
                                    {denyPending ? 'Saving…' : 'Deny'}
                                  </Button>
                                </>
                              ) : null}
                              {u.status === 'active' ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={anyPending}
                                  onClick={() => suspendUser(u.id)}
                                >
                                  {suspendPending ? 'Saving…' : 'Suspend'}
                                </Button>
                              ) : null}
                              {u.status === 'suspended' ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={anyPending}
                                  onClick={() => unsuspendUser(u.id)}
                                >
                                  {approvePending ? 'Saving…' : 'Unsuspend'}
                                </Button>
                              ) : null}
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={anyPending}
                                onClick={() => toast(`Viewing ${u.name}`, 'success')}
                              >
                                View
                              </Button>
                            </div>
                          )
                        })()}
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
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  border: '1px solid #e8ece1',
                  borderRadius: 10,
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-m)' }}>
                    {c.members.toLocaleString()} members · {c.posts.toLocaleString()} posts
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast(`Managing ${c.name}`, 'success')}
                >
                  Manage
                </Button>
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
            <div
              key={m.id}
              style={{
                border: '1px solid #e8ece1',
                borderRadius: 10,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{m.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-m)', marginTop: 2 }}>
                    Specialty: {m.specialty} · {statusChip(m.status)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(() => {
                    const verifyPending = isActionPending('mentor', m.id, 'verified')
                    const denyPending = isActionPending('mentor', m.id, 'denied')
                    const revokePending = isActionPending('mentor', m.id, 'pending')
                    const anyPending = verifyPending || denyPending || revokePending
                    return (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={anyPending}
                          onClick={() => setExpandedStory(expandedStory === m.id ? null : m.id)}
                        >
                          {expandedStory === m.id ? 'Hide story' : 'View story'}
                        </Button>
                        {m.status === 'pending' ? (
                          <>
                            <Button
                              size="sm"
                              disabled={anyPending}
                              onClick={() => approveMentor(m.id)}
                            >
                              {verifyPending ? 'Saving…' : 'Approve'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={anyPending}
                              onClick={() => denyMentor(m.id)}
                            >
                              {denyPending ? 'Saving…' : 'Deny'}
                            </Button>
                          </>
                        ) : null}
                        {m.status === 'verified' ? (
                          <Button
                            size="sm"
                            variant="danger"
                            disabled={anyPending}
                            onClick={() => revokeMentor(m.id)}
                          >
                            {revokePending ? 'Saving…' : 'Revoke'}
                          </Button>
                        ) : null}
                      </>
                    )
                  })()}
                </div>
              </div>
              {expandedStory === m.id ? (
                <div
                  style={{
                    marginTop: 10,
                    padding: '10px 12px',
                    background: '#f8fbf7',
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                >
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))',
              gap: 12,
            }}
          >
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
              onChange={() =>
                setAnonControls((p) => ({ ...p, allowAnonPosting: !p.allowAnonPosting }))
              }
              id="admin-anon-posting"
            />
            <ToggleRow
              label="Hide anonymous users in search"
              sub="Anonymous sessions are excluded from search and discovery results"
              checked={anonControls.hideAnonInSearch}
              onChange={() =>
                setAnonControls((p) => ({ ...p, hideAnonInSearch: !p.hideAnonInSearch }))
              }
              id="admin-anon-search"
            />
            <ToggleRow
              label="Require approval for anonymous mode"
              sub="Users must submit a request before anonymous mode is activated"
              checked={anonControls.requireAnonApproval}
              onChange={() =>
                setAnonControls((p) => ({ ...p, requireAnonApproval: !p.requireAnonApproval }))
              }
              id="admin-anon-approval"
            />
            <ToggleRow
              label="Log anonymous activity"
              sub="Store anonymised audit trail for moderation purposes only"
              checked={anonControls.logAnonActivity}
              onChange={() =>
                setAnonControls((p) => ({ ...p, logAnonActivity: !p.logAnonActivity }))
              }
              id="admin-anon-log"
            />
            <div style={{ marginTop: 12 }}>
              <Button onClick={() => toast('Anonymous controls saved', 'success')}>
                Save controls
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
