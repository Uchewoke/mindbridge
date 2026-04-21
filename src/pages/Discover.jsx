import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Avatar, Button, Card, CardTitle, EmptyState, PageHeader, Tag } from '@/components/ui'
import { fetchMentorMatches } from '@/api/mentors'
import { useUIStore, useUserStore } from '@/stores'

export function DiscoverPage() {
  const user = useUserStore((s) => s.user)
  const toast = useUIStore((s) => s.toast)
  const [weights, setWeights] = useState({ topics: 0.28, style: 0.16, stage: 0.1, availability: 0.16, quality: 0.3 })

  const { data: remoteData, isLoading, isError } = useQuery({
    queryKey: ['mentor-matches', user.id, weights],
    queryFn: () =>
      fetchMentorMatches({
        seeker: {
          id: user.id,
          topics: user.topics,
          style: user.style,
          stage: user.stage,
        },
        weights,
      }),
    retry: 1,
  })

  const ranked = useMemo(() => {
    const matches = remoteData?.matches
    if (!Array.isArray(matches) || !matches.length) return []
    return matches.map((item) => ({
      ...item.mentor,
      score: Math.round(item.score || 0),
      reasons: Array.isArray(item.reasons) ? item.reasons : [],
    }))
  }, [remoteData])

  return (
    <div>
      <PageHeader title="Discover Your <em>Mentor Match</em>" sub="Adjust weighting and find someone who fits your rhythm." />
      <Card style={{ marginBottom: 12 }}>
        <CardTitle>Matching Weights</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10 }}>
          {Object.entries(weights).map(([k, v]) => (
            <label key={k} style={{ display: 'grid', gap: 4 }}>
              <span style={{ textTransform: 'capitalize' }}>{k} ({Math.round(v * 100)}%)</span>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(v * 100)}
                onChange={(e) => setWeights((w) => ({ ...w, [k]: Number(e.target.value) / 100 }))}
              />
            </label>
          ))}
        </div>
        <small style={{ display: 'block', marginTop: 8, color: 'var(--ink-m)' }}>
          {isLoading ? 'Loading backend mentor matches...' : 'Ranking sourced from backend /api/mentors/match.'}
        </small>
      </Card>

      {isError ? (
        <Card>
          <EmptyState icon="⚠️" title="Match service unavailable" sub="Could not load mentor matches from backend. Please retry." />
        </Card>
      ) : null}

      {!isLoading && !isError && ranked.length === 0 ? (
        <Card>
          <EmptyState icon="🧭" title="No mentor matches yet" sub="Adjust your profile signals or try again shortly." />
        </Card>
      ) : null}

      <div style={{ display: 'grid', gap: 10 }}>
        {ranked.map((m) => (
          <Card key={m.id}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'start' }}>
              <Avatar initials={m.initials} background={m.avatar} goldRing online={m.online} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontFamily: 'Fraunces, serif' }}>{m.name}</h3>
                    <p style={{ margin: '2px 0 0', color: 'var(--ink-m)' }}>{m.role}</p>
                  </div>
                  <Tag type="rc">{m.score}% match</Tag>
                </div>
                <p style={{ marginBottom: 8 }}>{m.quote}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(m.tags || []).map((t) => (
                    <Tag key={t[1]} type={t[0]}>
                      {t[1]}
                    </Tag>
                  ))}
                  {(m.reasons || []).map((reason) => (
                    <Tag key={reason} type="ax">{reason}</Tag>
                  ))}
                  <Tag type="sk">⭐ {m.rating}</Tag>
                  <Tag type="sk">{m.helped} helped</Tag>
                </div>
                <Button style={{ marginTop: 10 }} onClick={() => toast(`Connection request sent to ${m.name}`, 'success')}>
                  Request Match
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
