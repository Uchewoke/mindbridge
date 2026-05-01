export default function BootSplash() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(160deg, #f4efe6 0%, #fff 72%)',
        color: '#1b2118',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '22px 24px',
          borderRadius: 12,
          border: '1px solid rgba(27,33,24,0.09)',
          background: 'rgba(255,255,255,0.86)',
          boxShadow: '0 2px 16px rgba(27,33,24,0.07)',
          minWidth: 250,
        }}
      >
        <div
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 24,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: 10,
            color: '#1b2118',
          }}
        >
          MindBridge
        </div>
        <div
          style={{
            width: 24,
            height: 24,
            margin: '0 auto 11px',
            border: '2px solid #b8d4b4',
            borderTopColor: '#4e7a48',
            borderRadius: '50%',
            animation: 'spin 0.78s linear infinite',
          }}
        />
        <p style={{ margin: 0, fontSize: 13.5, color: '#5a6457', letterSpacing: 0.12 }}>
          Restoring session...
        </p>
      </div>
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </div>
  )
}
