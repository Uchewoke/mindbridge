import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Avatar, Button, Card, CardTitle, EmptyState, PageHeader } from '@/components/ui'
import { useUIStore, useUserStore } from '@/stores'

const DEFAULT_SESSIONS = [
  { id: 's1', title: 'Breathing Through Urges', host: 'Ari L.', when: 'Today 7:00 PM', seats: 64 },
  { id: 's2', title: 'Quiet Night Check-In', host: 'Coach Sam', when: 'Tonight 9:00 PM', seats: 42 },
]

export function SessionsPage() {
  const { id } = useParams()
  const user = useUserStore((s) => s.user)
  const toast = useUIStore((s) => s.toast)
  const [sessions, setSessions] = useState(DEFAULT_SESSIONS)
  const [activeId, setActiveId] = useState(id || '')
  const [hostingOpen, setHostingOpen] = useState(false)
  const [hostDraft, setHostDraft] = useState({ title: '', when: '', seats: 30, topic: '' })

  const isVerifiedMentor = user.role === 'mentor' && user.verificationStatus === 'verified'
  const isDemoHostingEnabled = String(import.meta.env.VITE_ENABLE_MSW || '').toLowerCase() === 'true'
  const canHostSession = isVerifiedMentor || isDemoHostingEnabled

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

  if (activeId) return <SessionRoom session={sessions.find((s) => s.id === activeId)} onLeave={() => setActiveId('')} />

  return (
    <div>
      <PageHeader
        title="Live Audio <em>Sessions</em>"
        sub={canHostSession ? 'Drop into guided peer rooms when you need support.' : 'Verified mentors can host sessions. Join live rooms anytime.'}
        action={
          canHostSession
            ? <Button onClick={() => setHostingOpen(true)}>Host a Session</Button>
            : null
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
                <Button variant="outline" onClick={() => setHostingOpen(false)}>Cancel</Button>
                <Button onClick={createHostedSession}>Publish Session</Button>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  )
}

function SessionRoom({ session, onLeave }) {
  const user = useUserStore((s) => s.user)
  const toast = useUIStore((s) => s.toast)
  const [seconds, setSeconds] = useState(0)
  const [muted, setMuted] = useState(false)
  const [raisedHands, setRaisedHands] = useState([])
  const [chat, setChat] = useState([{ id: 'c1', from: 'Host', text: 'Welcome. Take a breath.' }])
  const [text, setText] = useState('')

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  if (!session) return <EmptyState title="Session not found" sub="Try selecting a live room again." />

  return (
    <div>
      <PageHeader title={`🎙️ ${session.title}`} sub={`Live for ${Math.floor(seconds / 60)}m ${seconds % 60}s`} action={<Button onClick={onLeave}>Leave</Button>} />
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <Card>
          <CardTitle>Speaker Stage</CardTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10 }}>
            {[{ initials: 'AL', name: 'Ari' }, { initials: user.initials, name: user.name }].map((p) => (
              <div key={p.name} style={{ display: 'grid', justifyItems: 'center', gap: 6, padding: 10, border: '1px solid #e6eadf', borderRadius: 12 }}>
                <Avatar initials={p.initials} background="linear-gradient(135deg,#7FA878,#C4775A)" size={46} />
                <strong>{p.name}</strong>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              onClick={() => {
                setMuted((m) => !m)
                toast(muted ? 'Mic unmuted' : 'Mic muted')
              }}
            >
              {muted ? 'Unmute' : 'Mute'} Mic
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (!raisedHands.includes(user.id)) setRaisedHands((h) => [...h, user.id])
                toast('Hand raised', 'success')
              }}
            >
              Raise Hand
            </Button>
            <Button variant="outline" onClick={() => toast(['👏', '💛', '🌿', '✨'][Math.floor(Math.random() * 4)])}>
              React
            </Button>
          </div>
        </Card>

        <Card>
          <CardTitle>Chat</CardTitle>
          <div style={{ display: 'grid', gap: 6, maxHeight: 230, overflowY: 'auto' }}>
            {chat.map((c) => (
              <div key={c.id} style={{ border: '1px solid #e8eddf', borderRadius: 10, padding: 8 }}>
                <strong>{c.from}</strong>
                <div>{c.text}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input value={text} onChange={(e) => setText(e.target.value)} style={{ flex: 1, border: '1px solid #d7ddcb', borderRadius: 999, padding: '8px 12px' }} />
            <Button
              size="sm"
              onClick={() => {
                if (!text.trim()) return
                setChat((c) => [...c, { id: crypto.randomUUID(), from: 'You', text }])
                setText('')
              }}
            >
              Send
            </Button>
          </div>
          <p style={{ marginTop: 10, color: 'var(--ink-m)', fontSize: 13 }}>Hands raised: {raisedHands.length}</p>
        </Card>
      </div>
      <style>{`@media (max-width: 900px){div[style*="grid-template-columns: 2fr 1fr"]{grid-template-columns:1fr !important;}}`}</style>
    </div>
  )
}
