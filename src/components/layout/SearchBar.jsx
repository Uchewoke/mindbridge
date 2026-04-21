import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SEARCH_INDEX = [
  { id: 'm1', type: 'mentor', title: 'Ari L.', sub: 'Social Media recovery mentor', to: '/discover' },
  { id: 'c1', type: 'community', title: 'Anxiety & Stress', sub: '4.1k members', to: '/communities/anxiety' },
  { id: 'p1', type: 'post', title: 'Tiny swaps beat giant promises', sub: 'Trending post in feed', to: '/feed' },
]

export default function SearchBar({ isAnon }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  const results = useMemo(() => {
    if (!q.trim()) return []
    const needle = q.toLowerCase()
    return SEARCH_INDEX.filter((it) => `${it.title} ${it.sub}`.toLowerCase().includes(needle))
  }, [q])

  return (
    <div style={{ position: 'relative', width: 'min(460px, 100%)' }}>
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search mentors, communities, posts"
        style={{
          width: '100%',
          borderRadius: 999,
          border: `1px solid ${isAnon ? 'var(--anon-accent)' : '#d8decd'}`,
          background: isAnon ? '#131813' : '#fff',
          color: isAnon ? '#e7ffe9' : 'var(--ink)',
          padding: '10px 14px',
        }}
      />
      {open && q.trim() ? (
        <div
          className="anim-pop-in"
          style={{
            position: 'absolute',
            top: 42,
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #e6eadd',
            borderRadius: 14,
            boxShadow: 'var(--sh-2)',
            overflow: 'hidden',
            zIndex: 20,
          }}
        >
          {results.length ? (
            results.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  navigate(r.to)
                  setOpen(false)
                  setQ('')
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  border: 0,
                  background: '#fff',
                  padding: 10,
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f1eb',
                }}
              >
                <div style={{ fontWeight: 700 }}>{r.title}</div>
                <div style={{ color: 'var(--ink-m)', fontSize: 13 }}>{r.sub}</div>
              </button>
            ))
          ) : (
            <div style={{ padding: 10, color: 'var(--ink-m)' }}>No results yet.</div>
          )}
          <button
            onClick={() => {
              navigate(`/search?q=${encodeURIComponent(q)}`)
              setOpen(false)
            }}
            style={{ width: '100%', border: 0, background: '#f9fbf7', padding: 11, cursor: 'pointer', fontWeight: 600 }}
          >
            See all results
          </button>
        </div>
      ) : null}
    </div>
  )
}
