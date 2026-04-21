import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deactivateAccount, requestAccountExport } from '@/api/account'
import PostCard from '@/components/feed/PostCard'
import { VoiceRecorder } from '@/components/messages/VoiceRecorder'
import { Avatar, Button, Card, CardTitle, EmptyState, PageHeader, ToggleRow } from '@/components/ui'
import {
  useAnonStore,
  useAuthStore,
  useFeedStore,
  useMessagesStore,
  useNotifStore,
  useSettingsStore,
  useUIStore,
  useUserStore,
} from '@/stores'

const AI_FEEDBACK_KEY = 'mindbridge-ai-reply-feedback'

function readAiFeedback() {
  try {
    const raw = localStorage.getItem(AI_FEEDBACK_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeAiFeedback(next) {
  try {
    localStorage.setItem(AI_FEEDBACK_KEY, JSON.stringify(next))
  } catch {
    // Ignore storage quota/privacy mode failures.
  }
}

function getAiReplySuggestions(lastIncomingText = '', name = 'there', regenKey = 0) {
  const msg = lastIncomingText.toLowerCase()
  let suggestions = []

  if (msg.includes('routine') || msg.includes('goal')) {
    suggestions = [
      `Thanks ${name}, I can start with one small step tonight.`,
      'Could we keep it simple and pick one 10-minute action?',
      'I tried a short routine yesterday and it helped a bit.',
      'Let us choose one realistic goal for today and keep it manageable.',
      'That makes sense. I can commit to a short check-in routine tonight.',
    ]
  } else if (msg.includes('today') || msg.includes('going')) {
    suggestions = [
      `Thanks for checking in, ${name}. Today has been mixed but I am staying steady.`,
      'I am feeling a little overwhelmed and could use a grounding tip.',
      'I am doing better now than this morning and trying to keep momentum.',
      'It has been up and down, but I am still showing up.',
      'Thanks for asking. I could use support with one next step.',
    ]
  } else {
    suggestions = [
      `Thank you ${name}, that helped me feel less alone.`,
      'Can we break that into one step I can do right now?',
      'I appreciate this. I will try it and report back tonight.',
      'That was helpful. I feel more grounded after reading this.',
      'Could you help me turn that into a simple plan?',
    ]
  }

  const pivot = Math.abs(regenKey) % suggestions.length
  const rotated = [...suggestions.slice(pivot), ...suggestions.slice(0, pivot)]
  return rotated.slice(0, 3)
}

export function FeedPage() {
  const posts = useFeedStore((s) => s.posts)
  const toggleLike = useFeedStore((s) => s.toggleLike)
  const addReply = useFeedStore((s) => s.addReply)
  const addPost = useFeedStore((s) => s.addPost)
  const user = useUserStore((s) => s.user)
  const anon = useAnonStore((s) => s)
  const toast = useUIStore((s) => s.toast)
  const [draft, setDraft] = useState('')

  return (
    <div>
      <PageHeader
        title="Recovery Feed <em>For Real People</em>"
        sub="Share honestly, support freely, heal together."
      />
      <Card style={{ marginBottom: 12 }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="What does support look like for you today?"
          style={{
            width: '100%',
            border: '1px solid #d8decd',
            borderRadius: 12,
            padding: 10,
            resize: 'vertical',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <small style={{ color: 'var(--ink-m)' }}>
            {anon.active ? `Posting as ${anon.alias}` : `Posting as ${user.name}`}
          </small>
          <Button
            onClick={() => {
              if (!draft.trim()) return
              addPost({
                authorId: user.id,
                initials: anon.active ? '' : user.initials,
                name: anon.active ? anon.alias : user.name,
                avatar: user.avatar,
                role: 'seeker',
                tags: [[anon.active ? 'sk' : 'rc', anon.active ? 'Anonymous' : 'Check-in']],
                body: draft,
                tip: '',
              })
              setDraft('')
              toast('Post shared', 'success')
            }}
          >
            Post
          </Button>
        </div>
      </Card>
      <div style={{ display: 'grid', gap: 10 }}>
        {posts.map((p, i) => (
          <PostCard key={p.id} post={p} onLike={toggleLike} onReply={addReply} delay={i * 0.04} />
        ))}
      </div>
    </div>
  )
}

export function AnonPage() {
  const anon = useAnonStore((s) => s)
  return (
    <div>
      <PageHeader
        title="Anonymous <em>Mode</em>"
        sub="Share safely with identity shielding and privacy-first defaults."
      />
      <Card>
        <ToggleRow
          label="Enable Anonymous Mode"
          sub="Use alias + ghost avatar across UI"
          checked={anon.active}
          onChange={anon.toggle}
          id="anon-active"
        />
        <ToggleRow
          label="Auto-expire mode"
          checked={anon.autoExpire}
          onChange={() => anon.updateSettings({ autoExpire: !anon.autoExpire })}
          id="anon-expire"
        />
        <ToggleRow
          label="Disable read receipts"
          checked={anon.noReadReceipts}
          onChange={() => anon.updateSettings({ noReadReceipts: !anon.noReadReceipts })}
          id="anon-receipts"
        />
        <ToggleRow
          label="Hide reply counts"
          checked={anon.hideReplyCount}
          onChange={() => anon.updateSettings({ hideReplyCount: !anon.hideReplyCount })}
          id="anon-replies"
        />
        <div style={{ marginTop: 12 }}>
          <Button variant="outline" onClick={anon.randomizeAlias}>
            Randomize alias
          </Button>
        </div>
      </Card>
    </div>
  )
}

export function MessagesPage() {
  const threads = useMessagesStore((s) => s.threads)
  const chats = useMessagesStore((s) => s.chats)
  const activeThread = useMessagesStore((s) => s.activeThread)
  const setActiveThread = useMessagesStore((s) => s.setActiveThread)
  const sendMessage = useMessagesStore((s) => s.sendMessage)
  const sendVoiceMessage = useMessagesStore((s) => s.sendVoiceMessage)
  const toast = useUIStore((s) => s.toast)
  const inputRef = useRef(null)
  const [text, setText] = useState('')
  const [regenKey, setRegenKey] = useState(0)
  const [suggestionMode, setSuggestionMode] = useState('fill')
  const [feedback, setFeedback] = useState(() => readAiFeedback())
  const active = threads.find((t) => t.id === activeThread)
  const conversation = chats[activeThread] || []
  const lastIncoming = [...conversation].reverse().find((m) => !m.mine)

  const aiSuggestions = useMemo(() => {
    const raw = getAiReplySuggestions(lastIncoming?.text || '', active?.name || 'there', regenKey)
    return [...raw].sort((a, b) => {
      const fa = feedback[`${activeThread}::${a}`] || { up: 0, down: 0 }
      const fb = feedback[`${activeThread}::${b}`] || { up: 0, down: 0 }
      return fb.up - fb.down - (fa.up - fa.down)
    })
  }, [lastIncoming?.text, active?.name, regenKey, feedback, activeThread])

  const applySuggestion = async (suggestion) => {
    if (suggestionMode === 'copy') {
      try {
        await navigator.clipboard.writeText(suggestion)
        toast('Suggestion copied to clipboard', 'success')
      } catch {
        setText(suggestion)
        toast('Clipboard unavailable, added to input', 'default')
      }
      return
    }

    if (suggestionMode === 'insert') {
      const input = inputRef.current
      if (!input) {
        setText((prev) => `${prev}${prev ? ' ' : ''}${suggestion}`)
        return
      }
      const start = input.selectionStart ?? text.length
      const end = input.selectionEnd ?? text.length
      const next = `${text.slice(0, start)}${suggestion}${text.slice(end)}`
      setText(next)
      requestAnimationFrame(() => {
        const cursorPos = start + suggestion.length
        input.focus()
        input.setSelectionRange(cursorPos, cursorPos)
      })
      return
    }

    setText(suggestion)
  }

  const captureFeedback = (suggestion, vote) => {
    const key = `${activeThread}::${suggestion}`
    const current = feedback[key] || { up: 0, down: 0 }
    const next = {
      ...feedback,
      [key]: {
        ...current,
        up: vote === 'up' ? current.up + 1 : current.up,
        down: vote === 'down' ? current.down + 1 : current.down,
      },
    }
    setFeedback(next)
    writeAiFeedback(next)
    toast(vote === 'up' ? 'Saved positive feedback' : 'Saved negative feedback', 'default')
  }

  return (
    <div>
      <PageHeader
        title="Direct <em>Messages</em>"
        sub="One-to-one support with mentors and peers."
      />
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 12 }}>
        <Card style={{ padding: 8 }}>
          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveThread(t.id)}
              style={{
                width: '100%',
                border: 0,
                background: activeThread === t.id ? '#f0f8ee' : '#fff',
                textAlign: 'left',
                padding: 10,
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              <strong>{t.name}</strong>
              <div style={{ color: 'var(--ink-m)', fontSize: 13 }}>{t.last}</div>
            </button>
          ))}
        </Card>
        <Card>
          <CardTitle
            action={
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                <Button size="xs" variant="outline" onClick={() => setRegenKey((k) => k + 1)}>
                  Regenerate
                </Button>
                {['fill', 'insert', 'copy'].map((mode) => (
                  <Button
                    key={mode}
                    size="xs"
                    variant={suggestionMode === mode ? 'sage' : 'outline'}
                    onClick={() => setSuggestionMode(mode)}
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            }
          >
            {active?.name || 'Thread'}
          </CardTitle>
          <div style={{ display: 'grid', gap: 6, maxHeight: 360, overflowY: 'auto' }}>
            {conversation.map((m) => (
              <div
                key={m.id}
                style={{
                  justifySelf: m.mine ? 'end' : 'start',
                  maxWidth: '75%',
                  background: m.mine ? '#e6f6e2' : '#f4f4f4',
                  borderRadius: 12,
                  padding: '8px 10px',
                }}
              >
                {m.type === 'voice' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>🎙</span>
                    <audio src={m.blobUrl} controls style={{ height: 28, maxWidth: 180 }} />
                    <span style={{ fontSize: 11, color: 'var(--ink-m)', whiteSpace: 'nowrap' }}>
                      {String(Math.floor(m.duration / 60)).padStart(2, '0')}:
                      {String(m.duration % 60).padStart(2, '0')}
                    </span>
                  </div>
                ) : (
                  m.text
                )}
              </div>
            ))}
          </div>
          <p style={{ margin: '10px 0 0', fontSize: 12, color: 'var(--ink-m)' }}>
            AI suggestions mode: <strong style={{ color: 'var(--ink-s)' }}>{suggestionMode}</strong>
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
            {aiSuggestions.map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  onClick={() => applySuggestion(s)}
                  style={{
                    border: '1px solid #d8decc',
                    borderRadius: 999,
                    background: '#f7fbf5',
                    color: 'var(--ink-s)',
                    padding: '6px 10px',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {s}
                </button>
                <button
                  onClick={() => captureFeedback(s, 'up')}
                  title="Helpful"
                  style={{ border: 0, background: 'transparent', cursor: 'pointer', fontSize: 12 }}
                >
                  👍 {feedback[`${activeThread}::${s}`]?.up || 0}
                </button>
                <button
                  onClick={() => captureFeedback(s, 'down')}
                  title="Not helpful"
                  style={{ border: 0, background: 'transparent', cursor: 'pointer', fontSize: 12 }}
                >
                  👎 {feedback[`${activeThread}::${s}`]?.down || 0}
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
            <VoiceRecorder onSend={(url, dur) => sendVoiceMessage(activeThread, url, dur)} />
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a message"
              style={{
                flex: 1,
                border: '1px solid #d8ddcb',
                borderRadius: 999,
                padding: '8px 12px',
              }}
            />
            <Button
              size="sm"
              onClick={() => {
                if (!text.trim()) return
                sendMessage(activeThread, text)
                setText('')
              }}
            >
              Send
            </Button>
          </div>
        </Card>
      </div>
      <style>{`@media (max-width: 900px){div[style*="grid-template-columns: 280px 1fr"]{grid-template-columns:1fr !important;}}`}</style>
    </div>
  )
}

export function NotificationsPage() {
  const notifications = useNotifStore((s) => s.notifications)
  const markAllRead = useNotifStore((s) => s.markAllRead)
  return (
    <div>
      <PageHeader
        title="All <em>Notifications</em>"
        sub="Everything important, in one place."
        action={
          <Button variant="outline" onClick={markAllRead}>
            Mark all read
          </Button>
        }
      />
      <Card>
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 8,
              padding: '8px 0',
              borderBottom: '1px solid #eef1e7',
            }}
          >
            <Avatar initials={n.initials} background={n.avatar} size={34} />
            <div>
              <div dangerouslySetInnerHTML={{ __html: n.text }} />
              <small style={{ color: 'var(--ink-m)' }}>{n.time}</small>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

export function CrisisPage() {
  return (
    <div>
      <PageHeader
        title="Crisis <em>Resources</em>"
        sub="If you are in immediate danger, call emergency services now."
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
          gap: 12,
        }}
      >
        {[
          ['988 Lifeline', 'Call or text 988'],
          ['Crisis Text Line', 'Text HOME to 741741'],
          ['SAMHSA', '1-800-662-4357'],
          ['NEDA Alliance', '1-866-662-1235'],
          ['NAMI', '1-800-950-6264'],
        ].map((r) => (
          <Card key={r[0]}>
            <CardTitle>{r[0]}</CardTitle>
            <p style={{ margin: 0 }}>{r[1]}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function SettingsPage() {
  const navigate = useNavigate()
  const user = useUserStore((s) => s.user)
  const setUser = useUserStore((s) => s.setUser)
  const signOut = useAuthStore((s) => s.signOut)
  const anon = useAnonStore((s) => s)
  const markAllRead = useNotifStore((s) => s.markAllRead)
  const toast = useUIStore((s) => s.toast)
  const notifPrefs = useSettingsStore((s) => s.notifPrefs)
  const setNotifPrefs = useSettingsStore((s) => s.setNotifPrefs)
  const privacyPrefs = useSettingsStore((s) => s.privacyPrefs)
  const setPrivacyPrefs = useSettingsStore((s) => s.setPrivacyPrefs)
  const mentorPrefs = useSettingsStore((s) => s.mentorPrefs)
  const setMentorPrefs = useSettingsStore((s) => s.setMentorPrefs)
  const a11yPrefs = useSettingsStore((s) => s.a11yPrefs)
  const setA11yPrefs = useSettingsStore((s) => s.setA11yPrefs)
  const [panel, setPanel] = useState('profile')
  const [exportPhrase, setExportPhrase] = useState('')
  const [deactivatePhrase, setDeactivatePhrase] = useState('')
  const panels = [
    'profile',
    'account',
    'notifications',
    'privacy',
    'anonymous',
    'mentoring',
    'accessibility',
    'billing',
    'danger',
  ]

  const doExportData = async () => {
    if (exportPhrase.trim().toUpperCase() !== 'EXPORT') {
      toast('Type EXPORT to continue', 'error')
      return
    }

    try {
      const response = await requestAccountExport()
      const result = response?.data || {}
      const payload = result.data || result.export || result.payload || result
      const fileName =
        result.fileName || `mindbridge-export-${new Date().toISOString().slice(0, 10)}.json`

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const href = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = href
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(href)
      toast('Data export started', 'success')
      setExportPhrase('')
    } catch {
      toast('Unable to export data right now', 'error')
    }
  }

  const doDeactivateAccount = async () => {
    if (deactivatePhrase.trim().toUpperCase() !== 'DEACTIVATE') {
      toast('Type DEACTIVATE to confirm', 'error')
      return
    }

    try {
      await deactivateAccount()
      ;['mindbridge-user', 'mindbridge-journey', 'mindbridge-settings', 'mindbridge-auth'].forEach(
        (key) => {
          localStorage.removeItem(key)
        },
      )
      signOut()
      if (anon.active) anon.disable()
      toast('Account deactivated on this device', 'success')
      setDeactivatePhrase('')
      navigate('/login')
    } catch {
      toast('Unable to deactivate account right now', 'error')
    }
  }

  return (
    <div>
      <PageHeader
        title="Settings <em>Control Center</em>"
        sub="Everything personal in one calm place."
      />
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 12 }}>
        <Card>
          {panels.map((p) => (
            <button
              key={p}
              onClick={() => setPanel(p)}
              style={{
                width: '100%',
                border: 0,
                background: panel === p ? '#eef7ea' : '#fff',
                textAlign: 'left',
                padding: 10,
                borderRadius: 10,
                textTransform: 'capitalize',
                cursor: 'pointer',
              }}
            >
              {p}
            </button>
          ))}
        </Card>
        <Card>
          <CardTitle>{panel[0].toUpperCase() + panel.slice(1)}</CardTitle>
          {panel === 'profile' ? (
            <div style={{ display: 'grid', gap: 8 }}>
              <input
                value={user.name}
                onChange={(e) => setUser({ name: e.target.value })}
                style={{ border: '1px solid #d8decc', borderRadius: 10, padding: 10 }}
              />
              <textarea
                value={user.bio}
                onChange={(e) => setUser({ bio: e.target.value })}
                rows={3}
                style={{ border: '1px solid #d8decc', borderRadius: 10, padding: 10 }}
              />
              <Button>Save profile</Button>
            </div>
          ) : panel === 'account' ? (
            <div style={{ display: 'grid', gap: 10 }}>
              <label style={{ display: 'grid', gap: 4 }}>
                <span style={{ color: 'var(--ink-m)', fontSize: 13 }}>Email</span>
                <input
                  value={user.email}
                  onChange={(e) => setUser({ email: e.target.value })}
                  style={{ border: '1px solid #d8decc', borderRadius: 10, padding: 10 }}
                />
              </label>
              <label style={{ display: 'grid', gap: 4 }}>
                <span style={{ color: 'var(--ink-m)', fontSize: 13 }}>Display name</span>
                <input
                  value={user.name}
                  onChange={(e) => setUser({ name: e.target.value })}
                  style={{ border: '1px solid #d8decc', borderRadius: 10, padding: 10 }}
                />
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Button onClick={() => toast('Account details saved', 'success')}>
                  Save account
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast('Password reset link sent', 'success')}
                >
                  Reset password
                </Button>
              </div>
            </div>
          ) : panel === 'notifications' ? (
            <div>
              <ToggleRow
                label="Email digest"
                sub="Weekly summary of your progress and community updates"
                checked={notifPrefs.emailDigest}
                onChange={() => setNotifPrefs((p) => ({ ...p, emailDigest: !p.emailDigest }))}
                id="notif-email"
              />
              <ToggleRow
                label="Push notifications"
                sub="Receive real-time updates for messages and mentions"
                checked={notifPrefs.push}
                onChange={() => setNotifPrefs((p) => ({ ...p, push: !p.push }))}
                id="notif-push"
              />
              <ToggleRow
                label="Session reminders"
                sub="Alerts before live sessions start"
                checked={notifPrefs.sessionReminders}
                onChange={() =>
                  setNotifPrefs((p) => ({ ...p, sessionReminders: !p.sessionReminders }))
                }
                id="notif-sessions"
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <Button onClick={() => toast('Notification preferences saved', 'success')}>
                  Save preferences
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    markAllRead()
                    toast('All notifications marked read', 'success')
                  }}
                >
                  Mark all read
                </Button>
              </div>
            </div>
          ) : panel === 'privacy' ? (
            <div>
              <ToggleRow
                label="Searchable profile"
                sub="Allow others to find your profile in search"
                checked={privacyPrefs.searchable}
                onChange={() => setPrivacyPrefs((p) => ({ ...p, searchable: !p.searchable }))}
                id="privacy-search"
              />
              <ToggleRow
                label="Anonymous usage analytics"
                sub="Share anonymized product telemetry to improve support features"
                checked={privacyPrefs.dataSharing}
                onChange={() => setPrivacyPrefs((p) => ({ ...p, dataSharing: !p.dataSharing }))}
                id="privacy-data"
              />
              <ToggleRow
                label="Weekly data export"
                sub="Receive a weekly export of your activity and mood logs"
                checked={privacyPrefs.weeklyExport}
                onChange={() => setPrivacyPrefs((p) => ({ ...p, weeklyExport: !p.weeklyExport }))}
                id="privacy-export"
              />
              <div style={{ marginTop: 12 }}>
                <Button onClick={() => toast('Privacy settings updated', 'success')}>
                  Save privacy settings
                </Button>
              </div>
            </div>
          ) : panel === 'anonymous' ? (
            <div>
              <ToggleRow
                label="Enable Anonymous Mode"
                sub="Use alias and ghost avatar"
                checked={anon.active}
                onChange={anon.toggle}
                id="settings-anon-active"
              />
              <ToggleRow
                label="Auto-expire mode"
                checked={anon.autoExpire}
                onChange={() => anon.updateSettings({ autoExpire: !anon.autoExpire })}
                id="settings-anon-expire"
              />
              <ToggleRow
                label="Disable read receipts"
                checked={anon.noReadReceipts}
                onChange={() => anon.updateSettings({ noReadReceipts: !anon.noReadReceipts })}
                id="settings-anon-read"
              />
              <ToggleRow
                label="Hide reply counts"
                checked={anon.hideReplyCount}
                onChange={() => anon.updateSettings({ hideReplyCount: !anon.hideReplyCount })}
                id="settings-anon-reply"
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <Button variant="outline" onClick={anon.randomizeAlias}>
                  Randomize alias
                </Button>
                <Button onClick={() => toast('Anonymous preferences saved', 'success')}>
                  Save anonymous settings
                </Button>
              </div>
            </div>
          ) : panel === 'mentoring' ? (
            <div>
              <ToggleRow
                label="Available for mentoring"
                sub="Allow seekers to request support sessions with you"
                checked={mentorPrefs.availableForMentoring}
                onChange={() =>
                  setMentorPrefs((p) => ({ ...p, availableForMentoring: !p.availableForMentoring }))
                }
                id="mentor-available"
              />
              <ToggleRow
                label="Allow DM requests"
                sub="Let seekers start direct conversations"
                checked={mentorPrefs.dmRequests}
                onChange={() => setMentorPrefs((p) => ({ ...p, dmRequests: !p.dmRequests }))}
                id="mentor-dm"
              />
              <label style={{ display: 'grid', gap: 6, marginTop: 10 }}>
                <span style={{ color: 'var(--ink-m)', fontSize: 13 }}>Office hours preference</span>
                <select
                  value={mentorPrefs.officeHours}
                  onChange={(e) => setMentorPrefs((p) => ({ ...p, officeHours: e.target.value }))}
                  style={{ border: '1px solid #d8decc', borderRadius: 10, padding: 10 }}
                >
                  <option value="weeknights">Weeknights</option>
                  <option value="weekends">Weekends</option>
                  <option value="flexible">Flexible</option>
                </select>
              </label>
              <div style={{ marginTop: 12 }}>
                <Button onClick={() => toast('Mentoring settings saved', 'success')}>
                  Save mentoring settings
                </Button>
              </div>
            </div>
          ) : panel === 'accessibility' ? (
            <div>
              <ToggleRow
                label="Reduced motion"
                sub="Minimize animated transitions where possible"
                checked={a11yPrefs.reducedMotion}
                onChange={() => setA11yPrefs((p) => ({ ...p, reducedMotion: !p.reducedMotion }))}
                id="a11y-motion"
              />
              <ToggleRow
                label="Larger text"
                sub="Increase baseline text size in key reading surfaces"
                checked={a11yPrefs.largerText}
                onChange={() => setA11yPrefs((p) => ({ ...p, largerText: !p.largerText }))}
                id="a11y-text"
              />
              <ToggleRow
                label="Higher contrast"
                sub="Increase contrast for interactive controls and labels"
                checked={a11yPrefs.higherContrast}
                onChange={() => setA11yPrefs((p) => ({ ...p, higherContrast: !p.higherContrast }))}
                id="a11y-contrast"
              />
              <div style={{ marginTop: 12 }}>
                <Button onClick={() => toast('Accessibility preferences saved', 'success')}>
                  Save accessibility settings
                </Button>
              </div>
            </div>
          ) : panel === 'billing' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))',
                gap: 10,
              }}
            >
              {['Free $0', 'Plus $9', 'Pro $19'].map((p) => (
                <Card key={p} style={{ background: '#f8fbf7' }}>
                  <strong>{p}</strong>
                </Card>
              ))}
            </div>
          ) : panel === 'danger' ? (
            <div style={{ display: 'grid', gap: 12 }}>
              <Card style={{ background: '#fff8ef', border: '1px solid #f1d3b5' }}>
                <h4 style={{ margin: 0, fontFamily: 'Fraunces, serif' }}>Export Your Data</h4>
                <p style={{ margin: '8px 0 0', color: 'var(--ink-m)' }}>
                  Download your profile and settings as a JSON file.
                </p>
                <label style={{ display: 'grid', gap: 6, marginTop: 10 }}>
                  <span style={{ color: 'var(--ink-m)', fontSize: 13 }}>
                    Type EXPORT to confirm
                  </span>
                  <input
                    value={exportPhrase}
                    onChange={(e) => setExportPhrase(e.target.value)}
                    placeholder="EXPORT"
                    style={{ border: '1px solid #e7c7a8', borderRadius: 10, padding: 10 }}
                  />
                </label>
                <div style={{ marginTop: 10 }}>
                  <Button variant="outline" onClick={doExportData}>
                    Export data
                  </Button>
                </div>
              </Card>

              <Card style={{ background: '#fff2f2', border: '1px solid #f0c4c4' }}>
                <h4 style={{ margin: 0, fontFamily: 'Fraunces, serif', color: '#9d1d1d' }}>
                  Deactivate Account
                </h4>
                <p style={{ margin: '8px 0 0', color: '#8b4a4a' }}>
                  This signs you out and clears local account data on this device.
                </p>
                <label style={{ display: 'grid', gap: 6, marginTop: 10 }}>
                  <span style={{ color: '#8b4a4a', fontSize: 13 }}>Type DEACTIVATE to confirm</span>
                  <input
                    value={deactivatePhrase}
                    onChange={(e) => setDeactivatePhrase(e.target.value)}
                    placeholder="DEACTIVATE"
                    style={{ border: '1px solid #e7b5b5', borderRadius: 10, padding: 10 }}
                  />
                </label>
                <div style={{ marginTop: 10 }}>
                  <Button variant="danger" onClick={doDeactivateAccount}>
                    Deactivate account
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <p style={{ color: 'var(--ink-m)' }}>
              This panel is scaffolded and ready for deeper controls.
            </p>
          )}
        </Card>
      </div>
      <style>{`@media (max-width: 900px){div[style*="grid-template-columns: 220px 1fr"]{grid-template-columns:1fr !important;}}`}</style>
    </div>
  )
}
