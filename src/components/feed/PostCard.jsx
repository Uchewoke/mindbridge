import { useState } from 'react'
import { Avatar, Button, Card, Divider, Tag } from '@/components/ui'

export default function PostCard({ post, onLike, onReply, delay = 0 }) {
  const [reply, setReply] = useState('')
  const [openReplies, setOpenReplies] = useState(false)
  const [saved, setSaved] = useState(false)
  const [shared, setShared] = useState(false)

  const handleSave = () => {
    setSaved((s) => !s)
  }

  const handleShare = () => {
    const url = `${window.location.origin}/feed?post=${post.id}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      })
    }
  }

  return (
    <Card style={{ animationDelay: `${delay}s` }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'start' }}>
        <Avatar initials={post.initials} background={post.avatar} goldRing={post.role === 'mentor'} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <div>
              <strong>{post.name}</strong>
              <div style={{ color: 'var(--ink-m)', fontSize: 12 }}>{post.time}</div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'end' }}>
              {post.tags.map((t) => (
                <Tag key={t[1]} type={t[0]}>
                  {t[1]}
                </Tag>
              ))}
            </div>
          </div>
          <p style={{ marginBottom: 0 }}>{post.body}</p>
          {post.tip ? (
            <div style={{ marginTop: 10, borderLeft: '4px solid var(--sage)', background: '#f4faf2', borderRadius: 8, padding: '8px 10px' }}>
              <strong>Tip:</strong> {post.tip}
            </div>
          ) : null}

          <Divider />

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button variant={post.liked ? 'sage' : 'outline'} size="sm" onClick={() => onLike(post.id)}>
              ❤️ {post.likes}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setOpenReplies((o) => !o)}>
              💬 {post.replies.length}
            </Button>
            <Button variant={saved ? 'sage' : 'ghost'} size="sm" onClick={handleSave}>
              🔖 {saved ? 'Saved' : 'Save'}
            </Button>
            <Button variant={shared ? 'sage' : 'ghost'} size="sm" onClick={handleShare}>
              ↗ {shared ? 'Copied!' : 'Share'}
            </Button>
          </div>

          {openReplies ? (
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'grid', gap: 8 }}>
                {post.replies.map((r) => (
                  <div key={r.id} style={{ background: '#fafcf8', border: '1px solid #e9efe1', borderRadius: 10, padding: 8 }}>
                    <strong>{r.name}:</strong> {r.text}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <input
                  placeholder="Write a reply"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  style={{ flex: 1, border: '1px solid #d9dfce', borderRadius: 999, padding: '8px 12px' }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (!reply.trim()) return
                    onReply(post.id, { name: 'You', text: reply })
                    setReply('')
                  }}
                >
                  Send
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
