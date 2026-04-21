import { useState } from 'react'
import { format } from 'date-fns'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button, Card, CardTitle, PageHeader } from '@/components/ui'
import { useJourneyStore } from '@/stores'

export function JourneyPage() {
  const goals = useJourneyStore((s) => s.goals)
  const moodLogs = useJourneyStore((s) => s.moodLogs)
  const toggleGoal = useJourneyStore((s) => s.toggleGoal)
  const addGoal = useJourneyStore((s) => s.addGoal)
  const logMood = useJourneyStore((s) => s.logMood)
  const [goalText, setGoalText] = useState('')

  return (
    <div>
      <PageHeader title="Your Recovery <em>Journey</em>" sub="Track mood, routines, and tiny wins." />
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <Card>
          <CardTitle>Mood Trend</CardTitle>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={moodLogs.map((m) => ({ ...m, label: format(new Date(m.date), 'MMM d') }))}>
                <defs>
                  <linearGradient id="mood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7FA878" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#7FA878" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis domain={[1, 5]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#4e7a49" fill="url(#mood)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Log Today</CardTitle>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5].map((v) => (
              <Button key={v} variant="outline" size="sm" onClick={() => logMood(v, `Mood logged ${v}`)}>
                {v}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ marginTop: 12 }}>
        <CardTitle>Goals</CardTitle>
        <div style={{ display: 'grid', gap: 8 }}>
          {goals.map((g) => (
            <label key={g.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="checkbox" checked={g.done} onChange={() => toggleGoal(g.id)} />
              <span>{g.text}</span>
            </label>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <input value={goalText} onChange={(e) => setGoalText(e.target.value)} placeholder="Add a small goal" style={{ flex: 1, border: '1px solid #d7ddcb', borderRadius: 999, padding: '8px 12px' }} />
          <Button
            onClick={() => {
              if (!goalText.trim()) return
              addGoal(goalText)
              setGoalText('')
            }}
          >
            Add
          </Button>
        </div>
      </Card>

      <style>{`@media (max-width: 900px){div[style*="grid-template-columns: 2fr 1fr"]{grid-template-columns:1fr !important;}}`}</style>
    </div>
  )
}
