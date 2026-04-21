import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui'
import { useNotifStore } from '@/stores'

export default function NotifDropdown({ isAnon }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const notifications = useNotifStore((s) => s.notifications)
  const markRead = useNotifStore((s) => s.markRead)
  const unreadCount = notifications.filter((n) => n.unread).length

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          border: `1px solid ${isAnon ? 'var(--anon-accent)' : '#cfd5c0'}`,
          borderRadius: 999,
          background: 'transparent',
          color: 'inherit',
          width: 36,
          height: 36,
          cursor: 'pointer',
        }}
      >
        🔔
      </button>
      {unreadCount ? (
        <span
          style={{
            position: 'absolute',
            right: -2,
            top: -2,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            fontSize: 11,
            background: 'var(--terra)',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            padding: '0 4px',
          }}
        >
          {unreadCount}
        </span>
      ) : null}

      {open ? (
        <div
          className="anim-pop-in"
          style={{
            position: 'absolute',
            top: 42,
            right: 0,
            width: 340,
            maxHeight: 410,
            overflowY: 'auto',
            background: '#fff',
            border: '1px solid #e6e9db',
            borderRadius: 14,
            boxShadow: 'var(--sh-2)',
            zIndex: 30,
          }}
        >
          <div style={{ padding: 12, fontWeight: 700 }}>Notifications</div>
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                markRead(n.id)
                navigate(n.action)
                setOpen(false)
              }}
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: 8,
                textAlign: 'left',
                border: 0,
                cursor: 'pointer',
                padding: 10,
                background: n.unread ? '#f7fbf5' : '#fff',
                borderTop: '1px solid #f0f2eb',
              }}
            >
              <Avatar size={32} initials={n.initials} background={n.avatar} />
              <div>
                <div style={{ fontSize: 13 }} dangerouslySetInnerHTML={{ __html: n.text }} />
                <div style={{ fontSize: 12, color: 'var(--ink-m)' }}>{n.time}</div>
              </div>
            </button>
          ))}
          <button onClick={() => navigate('/notifications')} style={{ width: '100%', border: 0, padding: 10, cursor: 'pointer', background: '#f9fbf7', fontWeight: 700 }}>
            View all
          </button>
        </div>
      ) : null}
    </div>
  )
}
