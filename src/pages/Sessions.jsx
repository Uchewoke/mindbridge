import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Avatar, Button, Card, CardTitle, EmptyState, PageHeader } from '@/components/ui'
import { useUIStore, useUserStore } from '@/stores'

const DEFAULT_SESSIONS = [
  { id: 's1', title: 'Breathing Through Urges', host: 'Ari L.', when: 'Today 7:00 PM', seats: 64 },
  {
    id: 's2',
    title: 'Quiet Night Check-In',
    host: 'Coach Sam',
    when: 'Tonight 9:00 PM',
    seats: 42,
  },
]

const UPCOMING_TOPICS = ['All', 'Anxiety', 'Sleep', 'Boundaries', 'Relapse Prevention', 'Community']

const UPCOMING_SESSIONS = [
  {
    id: 'u1',
    title: 'Morning Reset for Anxious Minds',
    host: 'Priya M.',
    when: 'Tomorrow 8:00 AM',
    topic: 'Anxiety',
    format: 'Guided check-in',
    summary:
      'A short grounding room with breathwork, gentle prompts, and one takeaway for the day.',
    listeners: [
      { id: 'u1-a1', initials: 'PM', avatar: 'linear-gradient(135deg,#fda085,#f6d365)' },
      { id: 'u1-a2', initials: 'ZN', avatar: 'linear-gradient(135deg,#a18cd1,#fbc2eb)' },
      { id: 'u1-a3', initials: 'AL', avatar: 'linear-gradient(135deg,#8ec5fc,#e0c3fc)' },
      { id: 'u1-a4', initials: 'JM', avatar: 'linear-gradient(135deg,#f093fb,#f5576c)' },
    ],
    listenerCount: 18,
    joinLiveId: 's1',
  },
  {
    id: 'u2',
    title: 'Sleep Spiral Interrupt',
    host: 'Lena W.',
    when: 'Tomorrow 9:30 PM',
    topic: 'Sleep',
    format: 'Listener circle',
    summary:
      'Peer-led strategies for racing thoughts, doomscrolling, and rebuilding wind-down rituals.',
    listeners: [
      { id: 'u2-a1', initials: 'LW', avatar: 'linear-gradient(135deg,#e0c3fc,#8ec5fc)' },
      { id: 'u2-a2', initials: 'FC', avatar: 'linear-gradient(135deg,#f6d365,#fda085)' },
      { id: 'u2-a3', initials: 'AT', avatar: 'linear-gradient(135deg,#38f9d7,#43e97b)' },
    ],
    listenerCount: 12,
  },
  {
    id: 'u3',
    title: 'Holding Boundaries Without Guilt',
    host: 'Ari L.',
    when: 'Friday 6:30 PM',
    topic: 'Boundaries',
    format: 'Mentor room',
    summary:
      'Practice scripts, unpack people-pleasing patterns, and leave with one boundary to try this week.',
    listeners: [
      { id: 'u3-a1', initials: 'AL', avatar: 'linear-gradient(135deg,#8ec5fc,#e0c3fc)' },
      { id: 'u3-a2', initials: 'TB', avatar: 'linear-gradient(135deg,#30cfd0,#330867)' },
      { id: 'u3-a3', initials: 'MR', avatar: 'linear-gradient(135deg,#fddb92,#d1fdff)' },
      { id: 'u3-a4', initials: 'DK', avatar: 'linear-gradient(135deg,#f5576c,#f093fb)' },
    ],
    listenerCount: 24,
  },
  {
    id: 'u4',
    title: 'Relapse Prevention Sprint',
    host: 'Coach Sam',
    when: 'Saturday 11:00 AM',
    topic: 'Relapse Prevention',
    format: 'Skills lab',
    summary:
      'Map your next 72 hours, identify risk spikes, and crowdsource practical interruption plans.',
    listeners: [
      { id: 'u4-a1', initials: 'CS', avatar: 'linear-gradient(135deg,#43e97b,#38f9d7)' },
      { id: 'u4-a2', initials: 'SO', avatar: 'linear-gradient(135deg,#43e97b,#38f9d7)' },
      { id: 'u4-a3', initials: 'PM', avatar: 'linear-gradient(135deg,#fda085,#f6d365)' },
    ],
    listenerCount: 16,
    joinLiveId: 's2',
  },
  {
    id: 'u5',
    title: 'Community Wins and Weekly Reset',
    host: 'Zoe N.',
    when: 'Sunday 5:00 PM',
    topic: 'Community',
    format: 'Open mic',
    summary: 'A lighter room for wins, setbacks, and the one small commitment you want witnessed.',
    listeners: [
      { id: 'u5-a1', initials: 'ZN', avatar: 'linear-gradient(135deg,#a18cd1,#fbc2eb)' },
      { id: 'u5-a2', initials: 'JM', avatar: 'linear-gradient(135deg,#f093fb,#f5576c)' },
      { id: 'u5-a3', initials: 'LW', avatar: 'linear-gradient(135deg,#e0c3fc,#8ec5fc)' },
      { id: 'u5-a4', initials: 'FC', avatar: 'linear-gradient(135deg,#f6d365,#fda085)' },
    ],
    listenerCount: 27,
  },
]

function ListenerAvatarStack({ listeners, total }) {
  const visible = listeners.slice(0, 4)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 6 }}>
        {visible.map((listener, index) => (
          <div
            key={listener.id}
            title={listener.initials}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              marginLeft: index === 0 ? 0 : -8,
              background: listener.avatar,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 800,
              border: '2px solid #fffaf0',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.12)',
            }}
          >
            {listener.initials}
          </div>
        ))}
      </div>
      <span style={{ fontSize: 12, color: 'var(--ink-m)' }}>{total} listeners interested</span>
    </div>
  )
}

export function SessionsPage() {
  const { id } = useParams()
  const user = useUserStore((s) => s.user)
  const toast = useUIStore((s) => s.toast)
  const [sessions, setSessions] = useState(DEFAULT_SESSIONS)
  const [activeId, setActiveId] = useState(id || '')
  const [topicFilter, setTopicFilter] = useState('All')
  const [rsvps, setRsvps] = useState([])
  const [hostingOpen, setHostingOpen] = useState(false)
  const [hostDraft, setHostDraft] = useState({ title: '', when: '', seats: 30, topic: '' })

  const isVerifiedMentor = user.role === 'mentor' && user.verificationStatus === 'verified'
  const isDemoHostingEnabled =
    String(import.meta.env.VITE_ENABLE_MSW || '').toLowerCase() === 'true'
  const canHostSession = isVerifiedMentor || isDemoHostingEnabled
  const filteredUpcoming = UPCOMING_SESSIONS.filter(
    (session) => topicFilter === 'All' || session.topic === topicFilter,
  )

  const toggleRsvp = (session) => {
    setRsvps((prev) => {
      const hasRsvp = prev.includes(session.id)
      toast(
        hasRsvp ? `RSVP removed for ${session.title}` : `RSVP saved for ${session.title}`,
        'success',
      )
      return hasRsvp ? prev.filter((item) => item !== session.id) : [...prev, session.id]
    })
  }

  const createHostedSession = () => {
    if (!hostDraft.title.trim() || !hostDraft.when.trim()) {
      toast('Title and schedule are required', 'error')
      return
    }

    const newSession = {
      id: `s-${Date.now()}`,
      title: hostDraft.title.trim(),
      host: user.name,
      when: hostDraft.when.trim(),
      seats: Number(hostDraft.seats) || 30,
    }

    setSessions((prev) => [newSession, ...prev])
    setHostDraft({ title: '', when: '', seats: 30, topic: '' })
    setHostingOpen(false)
    toast('Session scheduled successfully', 'success')
  }

  if (activeId)
    return (
      <SessionRoom
        session={sessions.find((s) => s.id === activeId)}
        onLeave={() => setActiveId('')}
      />
    )

  return (
    <div>
      <PageHeader
        title="Live Audio <em>Sessions</em>"
        sub={
          canHostSession
            ? 'Drop into guided peer rooms when you need support.'
            : 'Verified mentors can host sessions. Join live rooms anytime.'
        }
        action={
          canHostSession ? (
            <Button onClick={() => setHostingOpen(true)}>Host a Session</Button>
          ) : null
        }
      />
      <div style={{ display: 'grid', gap: 10 }}>
        {sessions.map((s) => (
          <Card key={s.id}>
            <CardTitle>{s.title}</CardTitle>
            <p style={{ margin: 0, color: 'var(--ink-m)' }}>
              Host: {s.host} · {s.when} · {s.seats} seats
            </p>
            <Button style={{ marginTop: 10 }} onClick={() => setActiveId(s.id)}>
              Join Live
            </Button>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: 18 }}>
        <Card
          style={{
            background: 'linear-gradient(180deg, #fffdf7 0%, #f8fbf4 100%)',
            border: '1px solid #dde7d0',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 12,
              flexWrap: 'wrap',
              marginBottom: 16,
            }}
          >
            <div>
              <CardTitle>Upcoming Sessions</CardTitle>
              <p style={{ margin: '6px 0 0', color: 'var(--ink-m)', maxWidth: 620 }}>
                Browse the next rooms on deck, narrow by topic, and RSVP before they fill.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {UPCOMING_TOPICS.map((topic) => {
                const active = topic === topicFilter
                return (
                  <button
                    key={topic}
                    onClick={() => setTopicFilter(topic)}
                    style={{
                      border: `1px solid ${active ? '#4e7a49' : '#d7dfcf'}`,
                      background: active ? '#eef7e8' : '#fff',
                      color: active ? '#355634' : '#52624b',
                      padding: '8px 12px',
                      borderRadius: 999,
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {topic}
                  </button>
                )
              })}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 14,
            }}
          >
            {filteredUpcoming.map((session) => {
              const isRsvped = rsvps.includes(session.id)
              const canJoin = Boolean(session.joinLiveId)
              return (
                <div
                  key={session.id}
                  style={{
                    background: '#fff',
                    border: '1px solid #e7ecdf',
                    borderRadius: 18,
                    padding: 16,
                    display: 'grid',
                    gap: 12,
                    boxShadow: '0 10px 24px rgba(31, 41, 55, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#355634',
                        background: '#eef7e8',
                        borderRadius: 999,
                        padding: '5px 9px',
                        alignSelf: 'flex-start',
                      }}
                    >
                      {session.topic}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--ink-m)', fontWeight: 600 }}>
                      {session.when}
                    </span>
                  </div>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: 'Fraunces, serif',
                        fontSize: 20,
                        color: '#213126',
                      }}
                    >
                      {session.title}
                    </h3>
                    <p style={{ margin: '4px 0 0', color: '#5b6b58', fontSize: 13 }}>
                      Hosted by {session.host} · {session.format}
                    </p>
                  </div>
                  <p style={{ margin: 0, color: '#475569', fontSize: 14, lineHeight: 1.6 }}>
                    {session.summary}
                  </p>
                  <ListenerAvatarStack
                    listeners={session.listeners}
                    total={session.listenerCount}
                  />
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <Button
                      variant={isRsvped ? 'outline' : 'sage'}
                      onClick={() => toggleRsvp(session)}
                    >
                      {isRsvped ? 'RSVP Saved' : 'RSVP'}
                    </Button>
                    <Button
                      variant={canJoin ? 'outline' : 'ghost'}
                      disabled={!canJoin}
                      onClick={() => canJoin && setActiveId(session.joinLiveId)}
                    >
                      {canJoin ? 'Join' : 'Join Soon'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {!filteredUpcoming.length ? (
            <div style={{ marginTop: 14 }}>
              <EmptyState
                title="No upcoming sessions in this topic"
                body="Try another filter or host a room to get this lane moving."
              />
            </div>
          ) : null}
        </Card>
      </div>

      {hostingOpen ? (
        <div
          onClick={() => setHostingOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 18, 14, 0.45)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 30,
            padding: 14,
          }}
        >
          <Card
            onClick={(e) => e.stopPropagation()}
            style={{ width: 'min(560px, 100%)', border: '1px solid #d8e2cc' }}
          >
            <CardTitle>Host a Session</CardTitle>
            <div style={{ display: 'grid', gap: 10 }}>
              <label style={{ display: 'grid', gap: 5 }}>
                <span style={{ color: 'var(--ink-m)', fontSize: 13 }}>Session title</span>
                <input
                  value={hostDraft.title}
                  onChange={(e) => setHostDraft((d) => ({ ...d, title: e.target.value }))}
                  placeholder="Breathing Through Evening Anxiety"
                  style={{ border: '1px solid #d8decc', borderRadius: 10, padding: 10 }}
                />
              </label>
              <label style={{ display: 'grid', gap: 5 }}>
                <span style={{ color: 'var(--ink-m)', fontSize: 13 }}>When</span>
                <input
                  value={hostDraft.when}
                  onChange={(e) => setHostDraft((d) => ({ ...d, when: e.target.value }))}
                  placeholder="Tomorrow 8:30 PM"
                  style={{ border: '1px solid #d8decc', borderRadius: 10, padding: 10 }}
                />
              </label>
              <label style={{ display: 'grid', gap: 5 }}>
                <span style={{ color: 'var(--ink-m)', fontSize: 13 }}>Topic</span>
                <input
                  value={hostDraft.topic}
                  onChange={(e) => setHostDraft((d) => ({ ...d, topic: e.target.value }))}
                  placeholder="Urges, boundaries, relapse prevention"
                  style={{ border: '1px solid #d8decc', borderRadius: 10, padding: 10 }}
                />
              </label>
              <label style={{ display: 'grid', gap: 5 }}>
                <span style={{ color: 'var(--ink-m)', fontSize: 13 }}>Seats</span>
                <input
                  type="number"
                  min={5}
                  max={500}
                  value={hostDraft.seats}
                  onChange={(e) => setHostDraft((d) => ({ ...d, seats: e.target.value }))}
                  style={{ border: '1px solid #d8decc', borderRadius: 10, padding: 10 }}
                />
              </label>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
                <Button variant="outline" onClick={() => setHostingOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createHostedSession}>Publish Session</Button>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  )
}

// ─── Constants ────────────────────────────────────────────────────────────────

const HOST_REPLIES = [
  "That's a really important insight — thank you for sharing.",
  "You're not alone in feeling that way.",
  'Take your time — this is a safe space.',
  'Anyone else want to respond to that?',
  'That takes real courage to say out loud.',
  "Let's sit with that for a moment.",
  'I hear you. What has helped you in the past?',
]

const SESSION_RESOURCES = [
  { id: 'r1', type: '📖', label: 'Book', title: 'The Urge by Carl Erik Fisher', href: '#' },
  { id: 'r2', type: '📄', label: 'Article', title: 'NIDA: Understanding Addiction', href: '#' },
  { id: 'r3', type: '🛠️', label: 'Tool', title: '4-7-8 Breathing Technique', href: '#' },
  { id: 'r4', type: '📄', label: 'Article', title: 'How to Ride Out a Craving Wave', href: '#' },
  { id: 'r5', type: '🛠️', label: 'Tool', title: 'MindBridge Daily Check-In Sheet', href: '#' },
]

const INIT_SPEAKERS = [
  {
    id: 'sp1',
    name: 'Ari (Host)',
    initials: 'AL',
    avatar: 'linear-gradient(135deg,#8ec5fc,#e0c3fc)',
    speaking: true,
    muted: false,
    isHost: true,
  },
  {
    id: 'sp2',
    name: 'Priya M.',
    initials: 'PM',
    avatar: 'linear-gradient(135deg,#fda085,#f6d365)',
    speaking: false,
    muted: false,
    isHost: false,
  },
  {
    id: 'sp3',
    name: 'Sam O.',
    initials: 'SO',
    avatar: 'linear-gradient(135deg,#43e97b,#38f9d7)',
    speaking: false,
    muted: true,
    isHost: false,
  },
]

const INIT_LISTENERS = [
  {
    id: 'l1',
    name: 'Jordan M.',
    initials: 'JM',
    avatar: 'linear-gradient(135deg,#f093fb,#f5576c)',
  },
  { id: 'l2', name: 'Theo B.', initials: 'TB', avatar: 'linear-gradient(135deg,#30cfd0,#330867)' },
  { id: 'l3', name: 'Zoe N.', initials: 'ZN', avatar: 'linear-gradient(135deg,#a18cd1,#fbc2eb)' },
  {
    id: 'l4',
    name: 'Marcus R.',
    initials: 'MR',
    avatar: 'linear-gradient(135deg,#fddb92,#d1fdff)',
  },
  { id: 'l5', name: 'Lena W.', initials: 'LW', avatar: 'linear-gradient(135deg,#e0c3fc,#8ec5fc)' },
  { id: 'l6', name: 'Devon K.', initials: 'DK', avatar: 'linear-gradient(135deg,#f5576c,#f093fb)' },
  { id: 'l7', name: 'Amara T.', initials: 'AT', avatar: 'linear-gradient(135deg,#38f9d7,#43e97b)' },
  { id: 'l8', name: 'Finn C.', initials: 'FC', avatar: 'linear-gradient(135deg,#f6d365,#fda085)' },
]

const INIT_HANDS = [
  {
    id: 'l2',
    name: 'Theo B.',
    initials: 'TB',
    avatar: 'linear-gradient(135deg,#30cfd0,#330867)',
    raisedAt: 42,
  },
  {
    id: 'l5',
    name: 'Lena W.',
    initials: 'LW',
    avatar: 'linear-gradient(135deg,#e0c3fc,#8ec5fc)',
    raisedAt: 87,
  },
]

const REACT_EMOJIS = ['👏', '💛', '🌿', '✨', '🙌', '💪', '❤️', '🌟']

// ─── Floating reaction ────────────────────────────────────────────────────────

function FloatingReaction({ emoji, id, onDone }) {
  const [opacity, setOpacity] = useState(1)
  const [bottom, setBottom] = useState(60)
  const left = useRef(20 + Math.random() * 60)

  useEffect(() => {
    let frame
    const start = Date.now()
    const dur = 2600
    function tick() {
      const p = Math.min((Date.now() - start) / dur, 1)
      setBottom(60 + p * 260)
      setOpacity(p < 0.7 ? 1 : 1 - (p - 0.7) / 0.3)
      if (p < 1) frame = requestAnimationFrame(tick)
      else onDone(id)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        bottom,
        left: `${left.current}%`,
        fontSize: 28,
        opacity,
        pointerEvents: 'none',
        zIndex: 9999,
        userSelect: 'none',
        transition: 'none',
        filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.18))',
      }}
    >
      {emoji}
    </div>
  )
}

// ─── Speaking ring animation ──────────────────────────────────────────────────

function SpeakerTile({ person, onInviteBack }) {
  const [ring, setRing] = useState(person.speaking)
  useEffect(() => {
    if (!person.speaking) {
      setRing(false)
      return
    }
    let on = true
    const t = setInterval(() => {
      setRing((r) => !r)
      on = !on
    }, 900)
    return () => clearInterval(t)
  }, [person.speaking])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: 12,
        borderRadius: 14,
        background: '#fafafa',
        border: `1px solid ${person.speaking ? '#4e7a49' : '#e5e7eb'}`,
        transition: 'border-color 0.3s',
        position: 'relative',
      }}
    >
      {/* speaking glow ring */}
      {person.speaking && (
        <div
          style={{
            position: 'absolute',
            top: 6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 60,
            borderRadius: '50%',
            boxShadow: ring
              ? '0 0 0 4px rgba(78,122,73,0.45), 0 0 0 8px rgba(78,122,73,0.18)'
              : '0 0 0 2px rgba(78,122,73,0.2)',
            transition: 'box-shadow 0.45s ease',
            pointerEvents: 'none',
          }}
        />
      )}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: person.avatar,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 18,
          color: '#fff',
          flexShrink: 0,
        }}
      >
        {person.initials}
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'center', maxWidth: 80 }}>
        {person.name}
      </span>
      <div style={{ display: 'flex', gap: 4 }}>
        {person.isHost && (
          <span
            style={{
              fontSize: 10,
              background: '#fef9c3',
              color: '#92400e',
              borderRadius: 20,
              padding: '1px 6px',
              fontWeight: 700,
            }}
          >
            Host
          </span>
        )}
        {person.muted && (
          <span
            style={{
              fontSize: 10,
              background: '#fee2e2',
              color: '#b91c1c',
              borderRadius: 20,
              padding: '1px 6px',
            }}
          >
            🔇
          </span>
        )}
        {person.speaking && !person.muted && (
          <span
            style={{
              fontSize: 10,
              background: '#dcfce7',
              color: '#15803d',
              borderRadius: 20,
              padding: '1px 6px',
            }}
          >
            🎙
          </span>
        )}
      </div>
      {onInviteBack && (
        <button
          onClick={onInviteBack}
          style={{
            fontSize: 10,
            border: '1px solid #d1d5db',
            borderRadius: 20,
            padding: '2px 8px',
            cursor: 'pointer',
            background: '#fff',
            marginTop: 2,
          }}
        >
          Move back
        </button>
      )}
    </div>
  )
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', marginBottom: 12 }}>
      {tabs.map(({ id, label, badge }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          style={{
            flex: 1,
            padding: '8px 4px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: active === id ? 700 : 400,
            fontSize: 13,
            color: active === id ? '#4e7a49' : '#6b7280',
            borderBottom: `2px solid ${active === id ? '#4e7a49' : 'transparent'}`,
            marginBottom: -2,
            transition: 'all 0.15s',
            position: 'relative',
          }}
        >
          {label}
          {badge > 0 && (
            <span
              style={{
                marginLeft: 4,
                fontSize: 10,
                background: '#ef4444',
                color: '#fff',
                borderRadius: 20,
                padding: '0 5px',
                fontWeight: 700,
              }}
            >
              {badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// ─── Main SessionRoom ─────────────────────────────────────────────────────────

function SessionRoom({ session, onLeave }) {
  const user = useUserStore((s) => s.user)
  const toast = useUIStore((s) => s.toast)
  const chatRef = useRef(null)
  const [isNarrowRoom, setIsNarrowRoom] = useState(false)

  // timer
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const sync = () => setIsNarrowRoom(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // stage
  const [speakers, setSpeakers] = useState(INIT_SPEAKERS)
  const [listeners, setListeners] = useState(INIT_LISTENERS)
  const [hands, setHands] = useState(INIT_HANDS)
  const [muted, setMuted] = useState(false)
  const [recording, setRecording] = useState(false)

  // randomly animate who is "speaking"
  useEffect(() => {
    const t = setInterval(() => {
      setSpeakers((prev) =>
        prev.map((sp) => ({
          ...sp,
          speaking: !sp.muted && Math.random() > 0.55,
        })),
      )
    }, 1800)
    return () => clearInterval(t)
  }, [])

  // chat
  const [chat, setChat] = useState([
    {
      id: 'c0',
      from: 'Host (Ari)',
      text: 'Welcome everyone. Take a breath and settle in 🌿',
      time: '0:00',
      isMine: false,
    },
    { id: 'c1', from: 'Priya M.', text: 'So glad to be here tonight', time: '0:12', isMine: false },
    { id: 'c2', from: 'Sam O.', text: 'Same — really needed this', time: '0:28', isMine: false },
  ])
  const [chatInput, setChatInput] = useState('')
  function sendChat() {
    if (!chatInput.trim()) return
    const msg = {
      id: crypto.randomUUID(),
      from: 'You',
      text: chatInput.trim(),
      time: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`,
      isMine: true,
    }
    setChat((c) => [...c, msg])
    setChatInput('')
    // simulate host auto-reply after 1.2s
    setTimeout(() => {
      setChat((c) => [
        ...c,
        {
          id: crypto.randomUUID(),
          from: 'Host (Ari)',
          text: HOST_REPLIES[Math.floor(Math.random() * HOST_REPLIES.length)],
          time: `${Math.floor((seconds + 1) / 60)}:${String((seconds + 1) % 60).padStart(2, '0')}`,
          isMine: false,
        },
      ])
    }, 1200)
  }
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [chat])

  // floating reactions
  const [floaters, setFloaters] = useState([])
  function fireReaction(emoji) {
    const id = crypto.randomUUID()
    setFloaters((f) => [...f, { id, emoji }])
  }
  function removeFloater(id) {
    setFloaters((f) => f.filter((x) => x.id !== id))
  }

  // sidebar tabs
  const [tab, setTab] = useState('chat')
  const [sheetOpen, setSheetOpen] = useState(false)

  // raise hand (as listener)
  const [myHandRaised, setMyHandRaised] = useState(false)
  function raiseHand() {
    if (myHandRaised) return
    setMyHandRaised(true)
    setHands((h) => [
      ...h,
      {
        id: user.id,
        name: user.name ?? 'You',
        initials: user.initials ?? 'ME',
        avatar: 'linear-gradient(135deg,#7FA878,#C4775A)',
        raisedAt: seconds,
      },
    ])
    toast('Hand raised — the host can invite you to the stage', 'success')
  }

  // invite from hands → stage
  function inviteToStage(person) {
    setHands((h) => h.filter((x) => x.id !== person.id))
    setListeners((l) => l.filter((x) => x.id !== person.id))
    setSpeakers((s) => [...s, { ...person, speaking: false, muted: false, isHost: false }])
    toast(`${person.name} moved to the speaker stage`, 'success')
  }

  // move speaker back to listeners
  function moveToListeners(person) {
    setSpeakers((s) => s.filter((x) => x.id !== person.id))
    setListeners((l) => [
      ...l,
      { id: person.id, name: person.name, initials: person.initials, avatar: person.avatar },
    ])
    toast(`${person.name} moved back to listeners`, 'info')
  }

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  if (!session)
    return <EmptyState title="Session not found" sub="Try selecting a live room again." />

  const tabs = [
    { id: 'chat', label: '💬 Chat', badge: 0 },
    { id: 'people', label: '👥 People', badge: 0 },
    { id: 'hands', label: '✋ Hands', badge: hands.length },
    { id: 'resources', label: '📚 Resources', badge: 0 },
  ]

  useEffect(() => {
    if (!isNarrowRoom) setSheetOpen(false)
  }, [isNarrowRoom])

  function renderTabContent(panelHeight = 460) {
    return (
      <>
        {/* Chat tab */}
        {tab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: panelHeight }}>
            <div
              ref={chatRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {chat.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: m.isMine ? 'flex-end' : 'flex-start',
                  }}
                >
                  {!m.isMine && (
                    <span style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>
                      {m.from} · {m.time}
                    </span>
                  )}
                  <div
                    style={{
                      maxWidth: '85%',
                      padding: '8px 12px',
                      borderRadius: m.isMine ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      background: m.isMine ? '#4e7a49' : '#f3f4f6',
                      color: m.isMine ? '#fff' : '#111827',
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    {m.text}
                  </div>
                  {m.isMine && (
                    <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{m.time}</span>
                  )}
                </div>
              ))}
            </div>
            <div style={{ padding: 10, borderTop: '1px solid #e5e7eb', display: 'flex', gap: 6 }}>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                placeholder="Say something…"
                style={{
                  flex: 1,
                  border: '1px solid #d1d5db',
                  borderRadius: 20,
                  padding: '8px 12px',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              <button
                onClick={sendChat}
                style={{
                  padding: '8px 14px',
                  borderRadius: 20,
                  background: '#4e7a49',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* People tab */}
        {tab === 'people' && (
          <div style={{ padding: '0 14px 14px', maxHeight: panelHeight, overflowY: 'auto' }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 8,
              }}
            >
              Speakers ({speakers.length})
            </div>
            {speakers.map((sp) => (
              <div
                key={sp.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 0',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: sp.avatar,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#fff',
                    fontSize: 13,
                  }}
                >
                  {sp.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{sp.name}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>
                    {sp.isHost ? 'Host' : 'Speaker'}{' '}
                    {sp.speaking && !sp.muted ? '· 🎙 Speaking' : ''}
                  </div>
                </div>
                {sp.muted && <span style={{ fontSize: 11, color: '#ef4444' }}>🔇</span>}
              </div>
            ))}
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                margin: '14px 0 8px',
              }}
            >
              Listeners ({listeners.length})
            </div>
            {listeners.map((l) => (
              <div
                key={l.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '7px 0',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: l.avatar,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#fff',
                    fontSize: 11,
                  }}
                >
                  {l.initials}
                </div>
                <div style={{ fontSize: 13, color: '#374151' }}>{l.name}</div>
              </div>
            ))}
          </div>
        )}

        {/* Raised hands tab */}
        {tab === 'hands' && (
          <div style={{ padding: '0 14px 14px', maxHeight: panelHeight, overflowY: 'auto' }}>
            {hands.length === 0 ? (
              <div
                style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af', fontSize: 13 }}
              >
                No raised hands right now
              </div>
            ) : (
              hands.map((h) => (
                <div
                  key={h.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 0',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: h.avatar,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: '#fff',
                      fontSize: 13,
                    }}
                  >
                    {h.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{h.name}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>
                      Raised at {fmt(h.raisedAt)}
                    </div>
                  </div>
                  <button
                    onClick={() => inviteToStage(h)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      background: '#4e7a49',
                      color: '#fff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    Invite to stage
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Resources tab */}
        {tab === 'resources' && (
          <div style={{ padding: '0 14px 14px', maxHeight: panelHeight, overflowY: 'auto' }}>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 0, marginBottom: 12 }}>
              Curated for this session by the host
            </p>
            {SESSION_RESOURCES.map((r) => (
              <a
                key={r.id}
                href={r.href}
                onClick={(e) => e.preventDefault()}
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  padding: '10px 0',
                  borderBottom: '1px solid #f3f4f6',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{r.type}</span>
                <div>
                  <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, marginBottom: 2 }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: 13, color: '#111827', fontWeight: 500, lineHeight: 1.4 }}>
                    {r.title}
                  </div>
                </div>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: 13,
                    color: '#4e7a49',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  Open →
                </span>
              </a>
            ))}
          </div>
        )}
      </>
    )
  }

  return (
    <div style={{ position: 'relative', paddingBottom: isNarrowRoom ? 86 : 0 }}>
      {/* Floating reactions */}
      {floaters.map(({ id, emoji }) => (
        <FloatingReaction key={id} id={id} emoji={emoji} onDone={removeFloater} />
      ))}

      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 16,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: 22 }}>
            🎙 {session.title}
          </h2>
          <div
            style={{
              display: 'flex',
              gap: 10,
              marginTop: 4,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 13,
                background: '#fee2e2',
                color: '#b91c1c',
                borderRadius: 20,
                padding: '2px 10px',
                fontWeight: 700,
                animation: 'none',
              }}
            >
              ● LIVE
            </span>
            <span style={{ fontSize: 13, color: '#6b7280', fontVariantNumeric: 'tabular-nums' }}>
              ⏱ {fmt(seconds)}
            </span>
            <span style={{ fontSize: 13, color: '#6b7280' }}>
              🎤 {speakers.length} speakers · 👥 {listeners.length} listening
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setRecording((r) => !r)
              toast(
                recording ? 'Recording stopped' : 'Recording started',
                recording ? 'info' : 'success',
              )
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              border: `1px solid ${recording ? '#b91c1c' : '#d1d5db'}`,
              background: recording ? '#fee2e2' : '#fff',
              color: recording ? '#b91c1c' : '#374151',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {recording ? '⏹ Stop Rec' : '⏺ Record'}
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href)
              toast('Session link copied!', 'success')
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              border: '1px solid #d1d5db',
              background: '#fff',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            🔗 Share
          </button>
          <button
            onClick={onLeave}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Leave
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isNarrowRoom ? '1fr' : '1fr 340px',
          gap: 14,
          alignItems: 'start',
        }}
      >
        {/* Left — Stage + Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Speaker grid */}
          <Card>
            <CardTitle>Speaker Stage</CardTitle>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                gap: 10,
                marginBottom: 14,
              }}
            >
              {speakers.map((sp) => (
                <SpeakerTile
                  key={sp.id}
                  person={sp}
                  onInviteBack={!sp.isHost ? () => moveToListeners(sp) : null}
                />
              ))}
            </div>

            {/* Room controls */}
            <div
              style={{
                borderTop: '1px solid #e5e7eb',
                paddingTop: 12,
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => {
                  setMuted((m) => !m)
                  toast(muted ? 'Mic on' : 'Mic muted')
                }}
                style={{
                  padding: '9px 16px',
                  borderRadius: 10,
                  border: `2px solid ${muted ? '#ef4444' : '#4e7a49'}`,
                  background: muted ? '#fee2e2' : '#f0fdf4',
                  color: muted ? '#b91c1c' : '#15803d',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                {muted ? '🔇 Unmute' : '🎙 Mute'}
              </button>
              <button
                onClick={raiseHand}
                style={{
                  padding: '9px 16px',
                  borderRadius: 10,
                  border: `2px solid ${myHandRaised ? '#f59e0b' : '#d1d5db'}`,
                  background: myHandRaised ? '#fef3c7' : '#fff',
                  color: myHandRaised ? '#92400e' : '#374151',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                {myHandRaised ? '✋ Hand raised' : '✋ Raise Hand'}
              </button>

              {/* Quick react picker */}
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {REACT_EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      fireReaction(e)
                      toast(e)
                    }}
                    style={{
                      padding: '7px 10px',
                      borderRadius: 10,
                      border: '1px solid #e5e7eb',
                      background: '#fff',
                      fontSize: 16,
                      cursor: 'pointer',
                      lineHeight: 1,
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right — Tabbed sidebar */}
        {!isNarrowRoom ? (
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px 0' }}>
              <TabBar tabs={tabs} active={tab} onChange={setTab} />
            </div>
            {renderTabContent(460)}
          </Card>
        ) : null}
      </div>

      {isNarrowRoom ? (
        <>
          <div
            style={{
              position: 'fixed',
              left: 10,
              right: 10,
              bottom: 10,
              zIndex: 40,
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 14,
              boxShadow: '0 10px 25px rgba(15,23,42,0.15)',
              padding: 8,
              display: 'grid',
              gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
              gap: 6,
            }}
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id)
                  setSheetOpen(true)
                }}
                style={{
                  minHeight: 44,
                  borderRadius: 10,
                  border: `1px solid ${tab === t.id ? '#4e7a49' : '#d1d5db'}`,
                  background: tab === t.id ? '#f0fdf4' : '#fff',
                  color: tab === t.id ? '#166534' : '#334155',
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                {t.label.replace(/\s.*/, '')}
                {t.badge > 0 ? ` (${t.badge})` : ''}
              </button>
            ))}
          </div>

          {sheetOpen ? (
            <div
              onClick={() => setSheetOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15,23,42,0.35)',
                zIndex: 45,
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  background: '#fff',
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  borderTop: '1px solid #e5e7eb',
                  maxHeight: '78dvh',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'grid', placeItems: 'center', paddingTop: 8 }}>
                  <span
                    style={{
                      width: 54,
                      height: 4,
                      borderRadius: 999,
                      background: '#cbd5e1',
                      display: 'block',
                    }}
                  />
                </div>
                <div style={{ padding: '10px 14px 0' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 6,
                    }}
                  >
                    <strong style={{ fontSize: 14, color: '#0f172a' }}>Session Panel</strong>
                    <button
                      onClick={() => setSheetOpen(false)}
                      style={{
                        border: '1px solid #d1d5db',
                        background: '#fff',
                        borderRadius: 8,
                        padding: '6px 10px',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Close
                    </button>
                  </div>
                  <TabBar tabs={tabs} active={tab} onChange={setTab} />
                </div>
                {renderTabContent(330)}
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
