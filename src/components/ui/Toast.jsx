import { useUIStore } from '@/stores'

export default function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts)

  return (
    <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 60, display: 'grid', gap: 10 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className="anim-pop-in"
          style={{
            minWidth: 220,
            background: '#fff',
            border: `1px solid ${t.type === 'error' ? '#fecaca' : t.type === 'success' ? '#bbf7d0' : '#e6e9dc'}`,
            borderLeft: `6px solid ${t.type === 'error' ? '#ef4444' : t.type === 'success' ? '#16a34a' : 'var(--sage)'}`,
            borderRadius: 14,
            padding: '10px 12px',
            boxShadow: 'var(--sh-2)',
          }}
        >
          {t.msg}
        </div>
      ))}
    </div>
  )
}
