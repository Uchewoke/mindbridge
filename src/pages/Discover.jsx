import { useEffect, useRef, useState } from 'react'
import { Avatar, Button, Card, CardTitle, PageHeader } from '@/components/ui'
import { useUIStore, useUserStore } from '@/stores'

// ─── Mentor pool ──────────────────────────────────────────────────────────────

const MENTOR_POOL = [
  {
    id: 'm1',
    name: 'Aisha Laurent',
    initials: 'AL',
    avatar: 'linear-gradient(135deg,#8ec5fc,#e0c3fc)',
    role: 'Peer Mentor · Anxiety & Social Media',
    stage: 'recovered',
    topics: ['📱 Social Media', '🫁 Anxiety', '🤝 Loneliness'],
    style: ['Reflective', 'Gentle accountability'],
    quote: '"Recovery isn\'t linear — and that\'s okay."',
    bio: 'Recovered from social-media burnout after 3 years. Now helping others find balance through structured routines.',
    rating: 4.9,
    yrs: 5,
    helped: 148,
    online: true,
    avail: 92,
    activity: 88,
  },
  {
    id: 'm2',
    name: 'Jordan Mills',
    initials: 'JM',
    avatar: 'linear-gradient(135deg,#f093fb,#f5576c)',
    role: 'Peer Mentor · Depression & Alcohol',
    stage: 'mid-recovery',
    topics: ['🌧️ Depression', '🍂 Alcohol', '🫁 Anxiety'],
    style: ['Direct', 'Structured check-ins'],
    quote: '"Small wins compound into big change."',
    bio: 'Three years sober. Uses habit-stacking and journaling to stay grounded.',
    rating: 4.7,
    yrs: 3,
    helped: 97,
    online: false,
    avail: 78,
    activity: 82,
  },
  {
    id: 'm3',
    name: 'Sam Okafor',
    initials: 'SO',
    avatar: 'linear-gradient(135deg,#43e97b,#38f9d7)',
    role: 'Peer Mentor · Gaming & Loneliness',
    stage: 'recovered',
    topics: ['🎮 Gaming', '🤝 Loneliness', '📱 Social Media'],
    style: ['Humour', 'Reflective'],
    quote: '"Gaming got me through hard times — now I use it intentionally."',
    bio: 'Former competitive gamer who found healthy balance. Specialises in digital-life redesign.',
    rating: 4.8,
    yrs: 4,
    helped: 112,
    online: true,
    avail: 85,
    activity: 90,
  },
  {
    id: 'm4',
    name: 'Priya Mehta',
    initials: 'PM',
    avatar: 'linear-gradient(135deg,#fda085,#f6d365)',
    role: 'Peer Mentor · Sleep & Anxiety',
    stage: 'recovered',
    topics: ['🫁 Anxiety', '🌙 Sleep', '🌧️ Depression'],
    style: ['Gentle accountability', 'Mindfulness-based'],
    quote: '"Rest is not a reward — it is a foundation."',
    bio: 'Overcame chronic insomnia and anxiety through CBT and mindfulness. Sleep coach certified.',
    rating: 4.95,
    yrs: 6,
    helped: 201,
    online: true,
    avail: 95,
    activity: 94,
  },
  {
    id: 'm5',
    name: 'Theo Barker',
    initials: 'TB',
    avatar: 'linear-gradient(135deg,#30cfd0,#330867)',
    role: 'Peer Mentor · Alcohol & Depression',
    stage: 'mid-recovery',
    topics: ['🍂 Alcohol', '🌧️ Depression', '🤝 Loneliness'],
    style: ['Direct', 'Accountability-focused'],
    quote: '"Accountability without judgment — that\'s the key."',
    bio: '18 months sober and counting. Runs weekly peer check-in circles.',
    rating: 4.6,
    yrs: 2,
    helped: 61,
    online: false,
    avail: 70,
    activity: 75,
  },
  {
    id: 'm6',
    name: 'Zoe Nakamura',
    initials: 'ZN',
    avatar: 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
    role: 'Peer Mentor · Social Media & Anxiety',
    stage: 'recovered',
    topics: ['📱 Social Media', '🫁 Anxiety', '🎮 Gaming'],
    style: ['Reflective', 'Mindfulness-based'],
    quote: '"Presence over performance — in feeds and in life."',
    bio: 'Digital-wellness researcher turned peer mentor. Has helped 200+ reduce screen time intentionally.',
    rating: 4.85,
    yrs: 7,
    helped: 213,
    online: true,
    avail: 80,
    activity: 85,
  },
]

const ALL_TOPICS = [
  '📱 Social Media',
  '🫁 Anxiety',
  '🍂 Alcohol',
  '🌧️ Depression',
  '🎮 Gaming',
  '🤝 Loneliness',
  '🌙 Sleep',
]
const ALL_STYLES = [
  'Reflective',
  'Gentle accountability',
  'Direct',
  'Structured check-ins',
  'Humour',
  'Mindfulness-based',
  'Accountability-focused',
]
const ALL_STAGES = ['early', 'mid-recovery', 'maintenance']
const STAGE_LABELS = {
  early: '🌱 Early',
  'mid-recovery': '🌿 Mid-Recovery',
  maintenance: '🌳 Maintenance',
}

const CRITERIA = [
  {
    key: 'topics',
    label: 'Topic Overlap',
    emoji: '🎯',
    desc: 'How closely your focus areas match',
  },
  {
    key: 'style',
    label: 'Communication Style',
    emoji: '💬',
    desc: 'Alignment in support approach',
  },
  { key: 'stage', label: 'Recovery Stage', emoji: '🌱', desc: 'Mentor experience with your stage' },
  {
    key: 'availability',
    label: 'Availability',
    emoji: '📅',
    desc: 'How active and reachable they are',
  },
  {
    key: 'quality',
    label: 'Rating & Experience',
    emoji: '⭐',
    desc: 'Composite of ratings, years, outcomes',
  },
  { key: 'recentActivity', label: 'Recent Activity', emoji: '⚡', desc: 'Engaged in last 30 days' },
  {
    key: 'experience',
    label: 'Years of Experience',
    emoji: '🏅',
    desc: 'Mentoring tenure on the platform',
  },
]

const DEFAULT_WEIGHTS = {
  topics: 28,
  style: 16,
  stage: 10,
  availability: 16,
  quality: 20,
  recentActivity: 5,
  experience: 5,
}

// ─── Score engine ─────────────────────────────────────────────────────────────

function totalWeight(w) {
  return Object.values(w).reduce((a, b) => a + b, 0)
}

function extendedScore(seeker, mentor, rawW) {
  const sum = totalWeight(rawW) || 1
  const w = Object.fromEntries(Object.entries(rawW).map(([k, v]) => [k, v / sum]))
  function overlap(a = [], b = []) {
    const sa = new Set(a.map((s) => s.toLowerCase().trim()))
    const sb = new Set(b.map((s) => s.toLowerCase().trim()))
    let c = 0
    for (const x of sa) if (sb.has(x)) c++
    return sa.size && sb.size ? c / Math.max(sa.size, sb.size) : 0
  }
  const stageMap = {
    'early|recovered': 95,
    'early|mid-recovery': 88,
    'mid-recovery|recovered': 92,
    'mid-recovery|mid-recovery': 85,
    'maintenance|recovered': 80,
  }
  const stageKey = `${(seeker.stage || '').toLowerCase()}|${(mentor.stage || '').toLowerCase()}`
  const stageSc = stageMap[stageKey] ?? (mentor.stage === 'recovered' ? 88 : 75)
  const components = {
    topics: Math.round(overlap(seeker.topics, mentor.topics) * 100),
    style: Math.round(overlap(seeker.style, mentor.style) * 100),
    stage: stageSc,
    availability: mentor.avail ?? 70,
    quality: Math.round(
      ((mentor.rating / 5) * 0.45 +
        Math.min(mentor.yrs / 8, 1) * 0.3 +
        ((mentor.activity ?? 70) / 100) * 0.25) *
        100,
    ),
    recentActivity: mentor.activity ?? 70,
    experience: Math.round(Math.min(mentor.yrs / 8, 1) * 100),
  }
  const score = Math.round(
    Math.min(
      100,
      Math.max(
        0,
        Object.entries(w).reduce((acc, [k, wv]) => acc + (components[k] ?? 0) * wv, 0),
      ),
    ),
  )
  return { score, components }
}

// ─── Animated compatibility ring ──────────────────────────────────────────────

function CompatibilityRing({ pct, size = 140 }) {
  const [displayed, setDisplayed] = useState(0)
  const r = (size - 18) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - displayed / 100)
  useEffect(() => {
    setDisplayed(0)
    const start = Date.now(),
      dur = 1000
    const raf = requestAnimationFrame(function tick() {
      const p = Math.min((Date.now() - start) / dur, 1)
      setDisplayed(Math.round(pct * (1 - Math.pow(1 - p, 3))))
      if (p < 1) requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(raf)
  }, [pct])
  const color = pct >= 80 ? '#16a34a' : pct >= 60 ? '#4e7a49' : pct >= 40 ? '#d97706' : '#ef4444'
  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={12} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={12}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.05s linear' }}
      />
      <text
        x={size / 2}
        y={size / 2 - 6}
        textAnchor="middle"
        fontSize={size < 110 ? 18 : 24}
        fontWeight={800}
        fill={color}
      >
        {displayed}%
      </text>
      <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fontSize={10} fill="#6b7280">
        match
      </text>
    </svg>
  )
}

// ─── Dimension bar ────────────────────────────────────────────────────────────

function DimBar({ label, value, color = '#4e7a49' }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(value), 80)
    return () => clearTimeout(t)
  }, [value])
  return (
    <div style={{ marginBottom: 6 }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}
      >
        <span style={{ color: '#6b7280' }}>{label}</span>
        <span style={{ fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            borderRadius: 99,
            background: color,
            width: `${w}%`,
            transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
    </div>
  )
}

// ─── Match card ───────────────────────────────────────────────────────────────

function MatchCard({ result, rank, onRequest }) {
  const [expanded, setExpanded] = useState(false)
  const { mentor, score, components } = result
  const dimColor = score >= 80 ? '#16a34a' : score >= 60 ? '#4e7a49' : '#d97706'
  return (
    <Card style={{ position: 'relative', overflow: 'hidden' }}>
      {rank <= 3 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: ['#f59e0b', '#9ca3af', '#cd7c3a'][rank - 1],
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '0 12px 0 12px',
          }}
        >
          {['🥇 Top Match', '🥈 #2', '🥉 #3'][rank - 1]}
        </div>
      )}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <CompatibilityRing pct={score} size={100} />
          <Avatar
            initials={mentor.initials}
            background={mentor.avatar}
            size={40}
            online={mentor.online}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 4,
              marginBottom: 4,
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: 18 }}>
                {mentor.name}
              </h3>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{mentor.role}</div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: 12,
                  background: '#f0fdf4',
                  color: '#15803d',
                  border: '1px solid #bbf7d0',
                  borderRadius: 20,
                  padding: '2px 8px',
                  fontWeight: 600,
                }}
              >
                ⭐ {mentor.rating}
              </span>
              <span
                style={{
                  fontSize: 12,
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  border: '1px solid #bfdbfe',
                  borderRadius: 20,
                  padding: '2px 8px',
                  fontWeight: 600,
                }}
              >
                👥 {mentor.helped}
              </span>
              {mentor.online && (
                <span
                  style={{
                    fontSize: 12,
                    background: '#dcfce7',
                    color: '#16a34a',
                    borderRadius: 20,
                    padding: '2px 8px',
                    fontWeight: 600,
                  }}
                >
                  ● Online
                </span>
              )}
            </div>
          </div>
          <p style={{ margin: '6px 0', fontSize: 13, fontStyle: 'italic', color: '#374151' }}>
            {mentor.quote}
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {mentor.topics.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 11,
                  background: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid #fde68a',
                  borderRadius: 20,
                  padding: '2px 8px',
                }}
              >
                {t}
              </span>
            ))}
            {mentor.style.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: 11,
                  background: '#f0f9ff',
                  color: '#0c4a6e',
                  border: '1px solid #bae6fd',
                  borderRadius: 20,
                  padding: '2px 8px',
                }}
              >
                {s}
              </span>
            ))}
          </div>
          {CRITERIA.map(({ key, label, emoji }) =>
            components[key] !== undefined ? (
              <DimBar
                key={key}
                label={`${emoji} ${label}`}
                value={components[key]}
                color={dimColor}
              />
            ) : null,
          )}
          {expanded && (
            <p style={{ margin: '8px 0', fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
              {mentor.bio}
            </p>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <Button variant="sage" onClick={() => onRequest(mentor)}>
              Request Match
            </Button>
            <Button variant="outline" size="sm" onClick={() => setExpanded((e) => !e)}>
              {expanded ? 'Hide bio' : 'Read bio'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

// ─── Step bar ─────────────────────────────────────────────────────────────────

function StepBar({ step }) {
  const steps = ['Criteria Weights', 'Your Profile', 'Results']
  return (
    <div style={{ display: 'flex', marginBottom: 24 }}>
      {steps.map((label, i) => {
        const done = i < step,
          active = i === step
        return (
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
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              {i > 0 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: done ? '#4e7a49' : '#e5e7eb',
                    transition: 'background 0.3s',
                  }}
                />
              )}
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: done ? '#4e7a49' : active ? '#f0fdf4' : '#f3f4f6',
                  border: `2px solid ${done || active ? '#4e7a49' : '#d1d5db'}`,
                  color: done ? '#fff' : active ? '#4e7a49' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 13,
                  transition: 'all 0.3s',
                }}
              >
                {done ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: done ? '#4e7a49' : '#e5e7eb',
                    transition: 'background 0.3s',
                  }}
                />
              )}
            </div>
            <span
              style={{
                fontSize: 11,
                color: active ? '#4e7a49' : '#9ca3af',
                fontWeight: active ? 700 : 400,
                textAlign: 'center',
              }}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function DiscoverPage() {
  const storeUser = useUserStore((s) => s.user)
  const toast = useUIStore((s) => s.toast)

  const [step, setStep] = useState(0)
  const [weights, setWeights] = useState({ ...DEFAULT_WEIGHTS })
  const [profile, setProfile] = useState({
    topics: storeUser?.topics ?? ['📱 Social Media', '🫁 Anxiety'],
    style: storeUser?.style ?? ['Reflective', 'Gentle accountability'],
    stage: storeUser?.stage ?? 'mid-recovery',
  })
  const [results, setResults] = useState(null)
  const [running, setRunning] = useState(false)

  const wTotal = totalWeight(weights)

  function toggleTopic(t) {
    setProfile((p) => ({
      ...p,
      topics: p.topics.includes(t) ? p.topics.filter((x) => x !== t) : [...p.topics, t],
    }))
  }
  function toggleStyle(s) {
    setProfile((p) => ({
      ...p,
      style: p.style.includes(s) ? p.style.filter((x) => x !== s) : [...p.style, s],
    }))
  }
  function normalise() {
    setWeights((prev) => {
      const sum = totalWeight(prev) || 1
      return Object.fromEntries(
        Object.entries(prev).map(([k, v]) => [k, Math.round((v / sum) * 100)]),
      )
    })
  }
  function runMatch() {
    setRunning(true)
    setTimeout(() => {
      const ranked = MENTOR_POOL.map((mentor) => ({
        mentor,
        ...extendedScore(profile, mentor, weights),
      })).sort((a, b) => b.score - a.score)
      setResults(ranked)
      setRunning(false)
      setStep(2)
    }, 700)
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <PageHeader
        title="AI Mentor <em>Matching Engine</em>"
        sub="A real compatibility algorithm — tuned to your recovery profile."
      />

      <StepBar step={step} />

      {/* ── Step 0: Criteria Weights ── */}
      {step === 0 && (
        <Card>
          <CardTitle>Criteria Weights</CardTitle>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 0, marginBottom: 16 }}>
            Drag each slider to control how much each factor influences your matches. Total:{' '}
            <strong style={{ color: wTotal === 100 ? '#16a34a' : '#d97706' }}>{wTotal}</strong>/100
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {CRITERIA.map(({ key, label, emoji, desc }) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>
                    {emoji} {label}
                  </span>
                  <span
                    style={{ fontWeight: 700, color: '#4e7a49', minWidth: 36, textAlign: 'right' }}
                  >
                    {weights[key]}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={1}
                  value={weights[key]}
                  onChange={(e) => setWeights((w) => ({ ...w, [key]: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#4e7a49' }}
                />
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{desc}</div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              gap: 10,
              marginTop: 22,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Button variant="outline" size="sm" onClick={normalise}>
              Auto-normalise to 100%
            </Button>
            <Button variant="sage" onClick={() => setStep(1)} style={{ marginLeft: 'auto' }}>
              Next: Your Profile →
            </Button>
          </div>
        </Card>
      )}

      {/* ── Step 1: Your Profile ── */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card>
            <CardTitle>Your Focus Topics</CardTitle>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 0, marginBottom: 12 }}>
              Select the topics most relevant to your journey.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ALL_TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTopic(t)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 20,
                    fontSize: 13,
                    cursor: 'pointer',
                    border: `2px solid ${profile.topics.includes(t) ? '#4e7a49' : '#e5e7eb'}`,
                    background: profile.topics.includes(t) ? '#f0fdf4' : '#fff',
                    color: profile.topics.includes(t) ? '#15803d' : '#374151',
                    fontWeight: profile.topics.includes(t) ? 700 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </Card>
          <Card>
            <CardTitle>Communication Style</CardTitle>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 0, marginBottom: 12 }}>
              What kind of support do you prefer?
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ALL_STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleStyle(s)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 20,
                    fontSize: 13,
                    cursor: 'pointer',
                    border: `2px solid ${profile.style.includes(s) ? '#6366f1' : '#e5e7eb'}`,
                    background: profile.style.includes(s) ? '#eef2ff' : '#fff',
                    color: profile.style.includes(s) ? '#4338ca' : '#374151',
                    fontWeight: profile.style.includes(s) ? 700 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>
          <Card>
            <CardTitle>Recovery Stage</CardTitle>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ALL_STAGES.map((st) => (
                <button
                  key={st}
                  onClick={() => setProfile((p) => ({ ...p, stage: st }))}
                  style={{
                    padding: '10px 22px',
                    borderRadius: 12,
                    fontSize: 14,
                    cursor: 'pointer',
                    border: `2px solid ${profile.stage === st ? '#4e7a49' : '#e5e7eb'}`,
                    background: profile.stage === st ? '#4e7a49' : '#fff',
                    color: profile.stage === st ? '#fff' : '#374151',
                    fontWeight: 700,
                    transition: 'all 0.15s',
                  }}
                >
                  {STAGE_LABELS[st]}
                </button>
              ))}
            </div>
          </Card>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="outline" onClick={() => setStep(0)}>
              ← Back
            </Button>
            <Button
              variant="sage"
              onClick={runMatch}
              disabled={running || profile.topics.length === 0}
              style={{ marginLeft: 'auto', minWidth: 180 }}
            >
              {running ? '⚙ Computing…' : '🔍 Find My Matches →'}
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 2: Results ── */}
      {step === 2 && results && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card
            style={{
              background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
              border: '1px solid #bbf7d0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <CompatibilityRing pct={results[0]?.score ?? 0} size={120} />
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: '#15803d',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 4,
                  }}
                >
                  Top Match
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    fontFamily: 'Fraunces, serif',
                    marginBottom: 4,
                  }}
                >
                  {results[0]?.mentor.name}
                </div>
                <div style={{ fontSize: 13, color: '#374151', marginBottom: 10 }}>
                  {results[0]?.mentor.role}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {results[0]?.mentor.topics.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 11,
                        background: '#fef3c7',
                        color: '#92400e',
                        border: '1px solid #fde68a',
                        borderRadius: 20,
                        padding: '2px 8px',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: '#6b7280' }}>
              Showing {results.length} mentors ranked by compatibility
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep(0)}
              style={{ marginLeft: 'auto' }}
            >
              ⚙ Adjust Weights
            </Button>
            <Button variant="outline" size="sm" onClick={() => setStep(1)}>
              👤 Edit Profile
            </Button>
          </div>
          {results.map((r, i) => (
            <MatchCard
              key={r.mentor.id}
              result={r}
              rank={i + 1}
              onRequest={(m) => toast(`Connection request sent to ${m.name}!`, 'success')}
            />
          ))}
        </div>
      )}
    </div>
  )
}
