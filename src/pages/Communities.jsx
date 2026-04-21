import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Card, CardTitle, EmptyState, PageHeader, Spinner, Tag } from '@/components/ui'
import { fetchCommunities, createCommunity } from '@/api/communities'
import { useUIStore } from '@/stores'

const ICON_OPTIONS = ['🌱', '🧠', '💬', '🫂', '🌿', '🔥', '🎯', '🌊', '🌈', '🤝', '📖', '🎮', '🍂', '🌧️', '📱', '🫁']
const ACCENT_OPTIONS = [
  { label: 'Teal', hex: '#0CA678' },
  { label: 'Indigo', hex: '#3B5BDB' },
  { label: 'Purple', hex: '#7048E8' },
  { label: 'Rose', hex: '#C2255C' },
  { label: 'Orange', hex: '#E67700' },
  { label: 'Sage', hex: '#5B8C5A' },
]

const BLANK = { name: '', icon: '🌱', desc: '', accentHex: '#0CA678' }

function CreateCommunityModal({ onClose }) {
  const [form, setForm] = useState(BLANK)
  const [error, setError] = useState('')
  const toast = useUIStore((s) => s.toast)
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communities'] })
      toast('Community created!', 'success')
      onClose()
    },
    onError: (err) => {
      setError(err?.response?.data?.message || 'Could not create community. Please try again.')
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.desc.trim()) {
      setError('Name and description are required.')
      return
    }
    mutation.mutate(form)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Create community"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 9999,
        padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
        <h2 style={{ margin: '0 0 20px', fontFamily: 'Fraunces, serif', fontSize: 22 }}>Create a Community</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
          {/* Icon picker */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Icon</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ICON_OPTIONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, icon: ic }))}
                  style={{
                    fontSize: 22,
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    border: form.icon === ic ? '2px solid var(--sage)' : '2px solid #e5e7df',
                    background: form.icon === ic ? '#f0f9f0' : '#fafaf8',
                    cursor: 'pointer',
                  }}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="cc-name" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Name</label>
            <input
              id="cc-name"
              value={form.name}
              maxLength={60}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Morning Routines"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d7dccc', fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="cc-desc" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Description</label>
            <textarea
              id="cc-desc"
              value={form.desc}
              maxLength={200}
              rows={3}
              onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
              placeholder="What is this community about?"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d7dccc', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          {/* Accent colour */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Colour</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {ACCENT_OPTIONS.map((a) => (
                <button
                  key={a.hex}
                  type="button"
                  title={a.label}
                  onClick={() => setForm((f) => ({ ...f, accentHex: a.hex }))}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: a.hex,
                    border: form.accentHex === a.hex ? '3px solid var(--ink)' : '3px solid transparent',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>

          {error && <p style={{ margin: 0, color: 'var(--blush)', fontSize: 13 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="sage" disabled={mutation.isPending}>
              {mutation.isPending ? <Spinner size={16} color="#fff" /> : 'Create Community'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function CommunitiesPage() {
  const [showCreate, setShowCreate] = useState(false)
  const { data, isLoading } = useQuery({
    queryKey: ['communities'],
    queryFn: fetchCommunities,
  })
  const communities = data?.communities ?? []

  return (
    <div>
      <PageHeader
        title="Communities <em>That Understand</em>"
        sub="Find people who get your exact journey."
        action={<Button variant="sage" onClick={() => setShowCreate(true)}>+ New Community</Button>}
      />
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spinner size={28} /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12 }}>
          {communities.map((c, i) => (
            <Link key={c.slug} to={`/communities/${c.slug}`} style={{ textDecoration: 'none' }}>
              <Card style={{ animationDelay: `${i * 0.06}s`, borderTop: `3px solid ${c.accentHex}` }}>
                <div style={{ fontSize: 26 }}>{c.icon}</div>
                <CardTitle>{c.name}</CardTitle>
                <p style={{ margin: 0, color: 'var(--ink-m)' }}>{c.desc}</p>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <Tag type="rc">{c.members.toLocaleString()} members</Tag>
                  <Tag type="sk">{c.online} online</Tag>
                  {c.createdByMe && <Tag type="mn">Created by you</Tag>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
      {showCreate && <CreateCommunityModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}

export function CommunityPage() {
  const { slug } = useParams()
  const { data } = useQuery({ queryKey: ['communities'], queryFn: fetchCommunities })
  const community = (data?.communities ?? []).find((c) => c.slug === slug)

  if (!community) {
    return <EmptyState title="Community not found" sub="Try another community from the hub." />
  }

  return (
    <div>
      <PageHeader title={`${community.icon} ${community.name}`} sub={community.desc} />
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <Card>
          <CardTitle>Trending Posts</CardTitle>
          <div style={{ display: 'grid', gap: 8 }}>
            {community.posts.map((p) => (
              <div key={p} style={{ padding: 10, borderRadius: 10, background: '#f8fbf6', border: '1px solid #e4ecdc' }}>
                {p}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>Community Snapshot</CardTitle>
          <p style={{ margin: 0 }}>
            <strong>{community.members.toLocaleString()}</strong> members
          </p>
          <p style={{ margin: '6px 0 0' }}>
            <strong>{community.online}</strong> online now
          </p>
          <p style={{ marginTop: 8, color: 'var(--ink-m)' }}>Rules: kindness first, no shaming, protect anonymity.</p>
        </Card>
      </div>
      <style>{`@media (max-width: 900px){div[style*="grid-template-columns: 2fr 1fr"]{grid-template-columns:1fr !important;}}`}</style>
    </div>
  )
}
