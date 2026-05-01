export default function BootSplash() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(160deg, var(--cream) 0%, var(--surface) 72%)',
        color: 'var(--ink)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '22px 24px',
          borderRadius: 'var(--r)',
          border: '1px solid var(--border-s)',
          background: 'color-mix(in srgb, var(--surface) 86%, var(--mist) 14%)',
          boxShadow: 'var(--sh)',
          minWidth: 250,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: 10,
            color: 'var(--ink)',
          }}
        >
          MindBridge
        </div>
        <div
          style={{
            width: 24,
            height: 24,
            margin: '0 auto 11px',
            border: '2px solid var(--sage-l)',
            borderTopColor: 'var(--sage-d)',
            borderRadius: '50%',
            animation: 'spin 0.78s linear infinite',
          }}
        />
        <p style={{ margin: 0, fontSize: 13.5, color: 'var(--ink-s)', letterSpacing: 0.12 }}>
          Restoring session...
        </p>
      </div>
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </div>
  )
}
