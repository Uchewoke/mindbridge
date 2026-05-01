import { useEffect, useRef, useState } from 'react'
import { Button, Card, CardTitle, PageHeader } from '@/components/ui'
import { useJourneyStore, useUserStore } from '@/stores'

// ─── Seed data ────────────────────────────────────────────────────────────────

const TODAY = new Date('2026-05-01')

function daysAgo(n) {
  const d = new Date(TODAY)
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

const MOCK_MOOD = Array.from({ length: 30 }, (_, i) => ({
  date: daysAgo(29 - i),
  mood: Math.max(1, Math.min(5, 3 + Math.round(Math.sin(i * 0.45) * 1.5 + (Math.random() - 0.5)))),
  anxiety: Math.max(
    1,
    Math.min(5, 3 - Math.round(Math.sin(i * 0.45) * 1.2 + (Math.random() - 0.5))),
  ),
}))

const RECOVERY_DIMS = [
  { label: 'Social Media', emoji: '📱', value: 72 },
  { label: 'Anxiety', emoji: '🫁', value: 58 },
  { label: 'Sleep', emoji: '🌙', value: 81 },
  { label: 'Alcohol', emoji: '🍂', value: 90 },
  { label: 'Depression', emoji: '🌧', value: 64 },
  { label: 'Loneliness', emoji: '🤝', value: 47 },
]

const AI_INSIGHTS = [
  {
    tag: 'positive',
    text: 'Your mood scores improved 18% compared to last month — a consistent upward trend.',
  },
  {
    tag: 'positive',
    text: "You've maintained your morning check-in streak for 12 consecutive days.",
  },
  {
    tag: 'neutral',
    text: 'Anxiety tends to spike on Mondays. Consider scheduling a short breathing exercise Sunday evening.',
  },
  {
    tag: 'neutral',
    text: 'Sleep quality and mood scores are closely correlated in your data — protecting sleep may be your highest-leverage habit.',
  },
]

// Build 371-day heatmap (53 weeks × 7)
const HEATMAP_DAYS = Array.from({ length: 371 }, (_, i) => {
  const d = new Date(TODAY)
  d.setDate(d.getDate() - (370 - i))
  const iso = d.toISOString().slice(0, 10)
  const past = d <= TODAY
  const level = past ? Math.floor(Math.random() * 5) : 0
  return { iso, level, isToday: iso === TODAY.toISOString().slice(0, 10) }
})

// Calendar for May 2026
const MAY_DAYS = Array.from({ length: 31 }, (_, i) => {
  const d = new Date(2026, 4, i + 1)
  const iso = d.toISOString().slice(0, 10)
  return {
    day: i + 1,
    iso,
    level: i < 1 ? 0 : Math.floor(Math.random() * 5),
    isToday: iso === TODAY.toISOString().slice(0, 10),
  }
})
const MAY_START_DOW = new Date(2026, 4, 1).getDay() // 0=Sun

const MOOD_LABELS = { 1: '😞 Rough', 2: '😕 Low', 3: '😐 Okay', 4: '🙂 Good', 5: '😄 Great' }
const LEVEL_COLORS = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
const INTENSITY_COLORS = ['#f0fdf4', '#bbf7d0', '#4ade80', '#16a34a', '#15803d']

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, sub, accent = '#4e7a49' }) {
  const countRef = useRef(null)
  useEffect(() => {
    const el = countRef.current
    if (!el) return
    const target = parseInt(value, 10)
    if (isNaN(target)) {
      el.textContent = value
      return
    }
    let start = 0
    const step = Math.ceil(target / 40)
    const id = setInterval(() => {
      start = Math.min(start + step, target)
      el.textContent = start
      if (start >= target) clearInterval(id)
    }, 20)
    return () => clearInterval(id)
  }, [value])

  return (
    <Card
      style={{
        textAlign: 'center',
        padding: '20px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
      <div
        ref={countRef}
        style={{ fontSize: 32, fontWeight: 800, color: accent, lineHeight: 1, marginBottom: 2 }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: 11, color: 'var(--ink-m, #6b7280)' }}>{sub}</div>}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: accent,
          borderRadius: '0 0 12px 12px',
        }}
      />
    </Card>
  )
}

// ─── Animated SVG Line Chart ──────────────────────────────────────────────────

function LineChart({ data, keys, colors, width = '100%', height = 160 }) {
  const svgRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80)
    return () => clearTimeout(t)
  }, [])

  const pad = { top: 12, right: 12, bottom: 28, left: 28 }
  const svgW = 600,
    svgH = height === 160 ? 160 : 180
  const chartW = svgW - pad.left - pad.right
  const chartH = svgH - pad.top - pad.bottom

  const allVals = data.flatMap((d) => keys.map((k) => d[k]))
  const minV = Math.floor(Math.min(...allVals)) - 0.5
  const maxV = Math.ceil(Math.max(...allVals)) + 0.5

  function xOf(i) {
    return pad.left + (i / (data.length - 1)) * chartW
  }
  function yOf(v) {
    return pad.top + chartH - ((v - minV) / (maxV - minV)) * chartH
  }

  function pathFor(key) {
    return data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xOf(i).toFixed(1)} ${yOf(d[key]).toFixed(1)}`)
      .join(' ')
  }

  function areaFor(key) {
    const line = pathFor(key)
    const last = `L ${xOf(data.length - 1).toFixed(1)} ${(pad.top + chartH).toFixed(1)} L ${pad.left.toFixed(1)} ${(pad.top + chartH).toFixed(1)} Z`
    return line + ' ' + last
  }

  const totalLen = 800
  const xLabels = data.filter((_, i) => i % Math.ceil(data.length / 6) === 0)

  return (
    <div style={{ position: 'relative', width }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const mx = ((e.clientX - rect.left) / rect.width) * svgW
          const idx = Math.round(((mx - pad.left) / chartW) * (data.length - 1))
          if (idx >= 0 && idx < data.length) setTooltip({ idx, x: mx, y: e.clientY - rect.top })
        }}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          {keys.map((k, ki) => (
            <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors[ki]} stopOpacity={0.25} />
              <stop offset="100%" stopColor={colors[ki]} stopOpacity={0.01} />
            </linearGradient>
          ))}
        </defs>

        {/* Grid lines */}
        {[minV + 1, minV + 2, minV + 3, minV + 4].map((v) =>
          v <= maxV ? (
            <line
              key={v}
              x1={pad.left}
              y1={yOf(v).toFixed(1)}
              x2={pad.left + chartW}
              y2={yOf(v).toFixed(1)}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
          ) : null,
        )}

        {/* Area fills */}
        {keys.map((k, ki) => (
          <path
            key={`area-${k}`}
            d={areaFor(k)}
            fill={`url(#grad-${k})`}
            opacity={animated ? 1 : 0}
            style={{ transition: 'opacity 0.6s ease' }}
          />
        ))}

        {/* Lines */}
        {keys.map((k, ki) => (
          <path
            key={`line-${k}`}
            d={pathFor(k)}
            fill="none"
            stroke={colors[ki]}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={animated ? 'none' : totalLen}
            strokeDashoffset={animated ? 0 : totalLen}
            style={{ transition: animated ? 'stroke-dashoffset 1.2s ease' : 'none' }}
          />
        ))}

        {/* X-axis labels */}
        {data.map((d, i) =>
          i % Math.ceil(data.length / 6) === 0 ? (
            <text
              key={i}
              x={xOf(i).toFixed(1)}
              y={svgH - 6}
              textAnchor="middle"
              fontSize={9}
              fill="#9ca3af"
            >
              {d.date.slice(5)}
            </text>
          ) : null,
        )}

        {/* Hover dot */}
        {tooltip &&
          keys.map((k, ki) => (
            <circle
              key={k}
              cx={xOf(tooltip.idx).toFixed(1)}
              cy={yOf(data[tooltip.idx][k]).toFixed(1)}
              r={4}
              fill={colors[ki]}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
      </svg>

      {/* Tooltip bubble */}
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            left: `${(xOf(tooltip.idx) / 600) * 100}%`,
            top: 0,
            transform: 'translate(-50%, 4px)',
            background: '#1f2937',
            color: '#fff',
            padding: '6px 10px',
            borderRadius: 8,
            fontSize: 11,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 3 }}>{data[tooltip.idx].date}</div>
          {keys.map((k, ki) => (
            <div key={k} style={{ color: colors[ki] }}>
              {k.charAt(0).toUpperCase() + k.slice(1)}: {data[tooltip.idx][k]}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Heatmap ──────────────────────────────────────────────────────────────────

function Heatmap({ days }) {
  const [hover, setHover] = useState(null)
  const weeks = []
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {week.map((day) => (
              <div
                key={day.iso}
                title={`${day.iso} — level ${day.level}`}
                onMouseEnter={() => setHover(day)}
                onMouseLeave={() => setHover(null)}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  background: LEVEL_COLORS[day.level],
                  outline: day.isToday ? '2px solid #4e7a49' : 'none',
                  outlineOffset: 1,
                  cursor: 'default',
                  transition: 'transform 0.1s',
                  transform: hover?.iso === day.iso ? 'scale(1.4)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 8 }}>
        <span style={{ fontSize: 10, color: '#9ca3af' }}>Less</span>
        {LEVEL_COLORS.map((c, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
        ))}
        <span style={{ fontSize: 10, color: '#9ca3af' }}>More</span>
      </div>
    </div>
  )
}

// ─── Mood Distribution ────────────────────────────────────────────────────────

function MoodDistribution({ data }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120)
    return () => clearTimeout(t)
  }, [])

  const counts = [1, 2, 3, 4, 5].map((v) => ({
    v,
    count: data.filter((d) => d.mood === v).length,
    label: MOOD_LABELS[v],
  }))
  const max = Math.max(...counts.map((c) => c.count), 1)
  const barColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {counts.map(({ v, count, label }) => (
        <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, width: 80, flexShrink: 0, color: 'var(--ink-m,#6b7280)' }}>
            {label}
          </span>
          <div
            style={{
              flex: 1,
              height: 16,
              background: '#f3f4f6',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: barColors[v - 1],
                borderRadius: 8,
                width: animated ? `${(count / max) * 100}%` : '0%',
                transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          </div>
          <span
            style={{ fontSize: 12, color: 'var(--ink-m,#6b7280)', width: 22, textAlign: 'right' }}
          >
            {count}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Recovery Progress ────────────────────────────────────────────────────────

function RecoveryBars({ dims }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {dims.map(({ label, emoji, value }) => (
        <div key={label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>
              {emoji} {label}
            </span>
            <span
              style={{ fontSize: 13, fontWeight: 700, color: value >= 70 ? '#16a34a' : '#d97706' }}
            >
              {value}%
            </span>
          </div>
          <div style={{ height: 10, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                borderRadius: 999,
                background:
                  value >= 70
                    ? 'linear-gradient(90deg,#4ade80,#16a34a)'
                    : 'linear-gradient(90deg,#fcd34d,#d97706)',
                width: animated ? `${value}%` : '0%',
                transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

function MonthCalendar({ days, startDow, monthLabel }) {
  const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const cells = [...Array.from({ length: startDow }, (_, i) => null), ...days]

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7,1fr)',
          gap: 2,
          marginBottom: 4,
        }}
      >
        {DOW.map((d) => (
          <div
            key={d}
            style={{ textAlign: 'center', fontSize: 10, color: '#9ca3af', fontWeight: 600 }}
          >
            {d}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
        {cells.map((day, i) =>
          day ? (
            <div
              key={day.day}
              title={`${day.iso} — ${['No data', 'Low', 'Light', 'Active', 'Strong'][day.level]}`}
              style={{
                aspectRatio: '1',
                borderRadius: 6,
                background: INTENSITY_COLORS[day.level],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: day.isToday ? 800 : 400,
                color: day.level >= 3 ? '#fff' : '#374151',
                outline: day.isToday ? '2px solid #4e7a49' : 'none',
                outlineOffset: 1,
                cursor: 'default',
              }}
            >
              {day.day}
            </div>
          ) : (
            <div key={`empty-${i}`} />
          ),
        )}
      </div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 8 }}>
        {INTENSITY_COLORS.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: c,
                border: '1px solid #e5e7eb',
              }}
            />
            <span style={{ fontSize: 9, color: '#9ca3af' }}>
              {['—', 'Low', 'Light', 'Active', 'Strong'][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function JourneyPage() {
  const goals = useJourneyStore((s) => s.goals)
  const toggleGoal = useJourneyStore((s) => s.toggleGoal)
  const addGoal = useJourneyStore((s) => s.addGoal)
  const logMood = useJourneyStore((s) => s.logMood)
  const streak = useUserStore((s) => s.user?.streak ?? 12)

  const [range, setRange] = useState('30d')
  const [goalText, setGoalText] = useState('')
  const [todayMood, setTodayMood] = useState(null)

  const rangeData = range === '7d' ? MOCK_MOOD.slice(-7) : MOCK_MOOD

  const avgMood = (MOCK_MOOD.reduce((a, b) => a + b.mood, 0) / MOCK_MOOD.length).toFixed(1)
  const sessions = 8
  const goalsDone = goals.filter((g) => g.done).length
  const goalPct = goals.length ? Math.round((goalsDone / goals.length) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHeader
        title="Journey Analytics"
        sub="Your recovery progress — mood, habits, and milestones"
      />

      {/* KPI row */}
      <div
        className="journey-kpi-grid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}
      >
        <KpiCard icon="🔥" label="Day Streak" value={streak} sub="Keep it up!" accent="#f97316" />
        <KpiCard
          icon="😊"
          label="Avg Mood Score"
          value={avgMood}
          sub="out of 5.0"
          accent="#16a34a"
        />
        <KpiCard icon="🎙" label="Sessions" value={sessions} sub="this month" accent="#6366f1" />
        <KpiCard
          icon="✅"
          label="Goal Completion"
          value={`${goalPct}%`}
          sub={`${goalsDone}/${goals.length} goals`}
          accent="#0ea5e9"
        />
      </div>

      {/* Mood + Anxiety chart */}
      <Card>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <CardTitle style={{ margin: 0 }}>Mood & Anxiety Over Time</CardTitle>
          <div style={{ display: 'flex', gap: 4 }}>
            {['7d', '30d'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  border: '1px solid #d1d5db',
                  cursor: 'pointer',
                  background: range === r ? '#4e7a49' : 'transparent',
                  color: range === r ? '#fff' : 'var(--ink)',
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 8, fontSize: 12 }}>
          {[
            ['#16a34a', 'Mood'],
            ['#6366f1', 'Anxiety'],
          ].map(([c, l]) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span
                style={{
                  width: 12,
                  height: 3,
                  background: c,
                  borderRadius: 2,
                  display: 'inline-block',
                }}
              />
              {l}
            </span>
          ))}
        </div>
        <LineChart
          data={rangeData}
          keys={['mood', 'anxiety']}
          colors={['#16a34a', '#6366f1']}
          height={170}
        />
      </Card>

      {/* Heatmap + Calendar */}
      <div
        className="journey-two-col"
        style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'start' }}
      >
        <Card>
          <CardTitle>Daily Check-in Activity — Past Year</CardTitle>
          <Heatmap days={HEATMAP_DAYS} />
        </Card>
        <Card style={{ minWidth: 240 }}>
          <CardTitle>May 2026</CardTitle>
          <MonthCalendar days={MAY_DAYS} startDow={MAY_START_DOW} monthLabel="May 2026" />
        </Card>
      </div>

      {/* Mood distribution + Recovery bars */}
      <div
        className="journey-two-col"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
      >
        <Card>
          <CardTitle>Mood Distribution (30 days)</CardTitle>
          <MoodDistribution data={MOCK_MOOD} />
        </Card>
        <Card>
          <CardTitle>Recovery Area Progress</CardTitle>
          <RecoveryBars dims={RECOVERY_DIMS} />
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardTitle>AI Insights</CardTitle>
        <div
          className="journey-two-col"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
        >
          {AI_INSIGHTS.map((ins, i) => (
            <div
              key={i}
              style={{
                background: ins.tag === 'positive' ? '#f0fdf4' : '#fefce8',
                border: `1px solid ${ins.tag === 'positive' ? '#bbf7d0' : '#fde68a'}`,
                borderRadius: 10,
                padding: '12px 14px',
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>
                {ins.tag === 'positive' ? '✅' : '💡'}
              </span>
              <div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: ins.tag === 'positive' ? '#15803d' : '#b45309',
                    display: 'block',
                    marginBottom: 3,
                  }}
                >
                  {ins.tag}
                </span>
                <span style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5 }}>
                  {ins.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Daily Goals */}
      <Card>
        <CardTitle>Daily Goals</CardTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {goals.map((g) => (
            <label
              key={g.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                background: g.done ? '#f0fdf4' : 'var(--surface-2,#f9fafb)',
                border: `1px solid ${g.done ? '#bbf7d0' : '#e5e7eb'}`,
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={g.done}
                onChange={() => toggleGoal(g.id)}
                style={{ width: 16, height: 16, accentColor: '#4e7a49', cursor: 'pointer' }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: 14,
                  textDecoration: g.done ? 'line-through' : 'none',
                  color: g.done ? '#6b7280' : 'var(--ink)',
                }}
              >
                {g.text}
              </span>
              {g.streak > 0 && (
                <span
                  style={{
                    fontSize: 11,
                    background: '#fff7ed',
                    color: '#c2410c',
                    border: '1px solid #fed7aa',
                    borderRadius: 20,
                    padding: '1px 8px',
                    fontWeight: 600,
                  }}
                >
                  🔥 {g.streak}d
                </span>
              )}
            </label>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && goalText.trim()) {
                addGoal(goalText)
                setGoalText('')
              }
            }}
            placeholder="+ Add a new goal…"
            style={{
              flex: 1,
              border: '1px solid var(--border,#d1d5db)',
              borderRadius: 999,
              padding: '9px 14px',
              fontSize: 14,
              outline: 'none',
              background: 'var(--surface,#fff)',
              color: 'var(--ink)',
            }}
          />
          <Button
            onClick={() => {
              if (goalText.trim()) {
                addGoal(goalText)
                setGoalText('')
              }
            }}
            disabled={!goalText.trim()}
          >
            Add
          </Button>
        </div>
      </Card>

      {/* Log today's mood */}
      <Card>
        <CardTitle>Log Today's Mood</CardTitle>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              onClick={() => {
                logMood(v, MOOD_LABELS[v])
                setTodayMood(v)
              }}
              style={{
                flex: '1 1 auto',
                padding: '10px 8px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
                border: `2px solid ${todayMood === v ? '#4e7a49' : '#e5e7eb'}`,
                background: todayMood === v ? '#f0fdf4' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {MOOD_LABELS[v]}
            </button>
          ))}
        </div>
        {todayMood && (
          <div style={{ marginTop: 10, fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
            ✓ Logged! Today: {MOOD_LABELS[todayMood]}
          </div>
        )}
      </Card>

      <style>{`
        @media (max-width: 900px) {
          .journey-kpi-grid { grid-template-columns: repeat(2,1fr) !important; }
          .journey-two-col { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 580px) {
          .journey-kpi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
