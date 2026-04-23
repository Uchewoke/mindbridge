import { Link } from 'react-router-dom'

export function Button({ variant = 'dark', size = 'md', style, ...props }) {
  const variants = {
    dark: { background: 'var(--ink)', color: '#fff', border: '1px solid var(--ink)' },
    sage: { background: 'var(--sage)', color: '#fff', border: '1px solid var(--sage)' },
    outline: { background: '#fff', color: 'var(--ink)', border: '1px solid #d7dccc' },
    danger: { background: 'var(--blush)', color: '#fff', border: '1px solid var(--blush)' },
    ghost: { background: 'transparent', color: 'var(--ink-s)', border: '1px solid transparent' },
    anon: {
      background: 'var(--anon-accent)',
      color: '#0d0f0c',
      border: '1px solid var(--anon-accent)',
    },
  }
  const sizes = {
    xs: { padding: '6px 10px', fontSize: 12 },
    sm: { padding: '8px 12px', fontSize: 13 },
    md: { padding: '10px 16px', fontSize: 14 },
    lg: { padding: '12px 18px', fontSize: 15 },
  }
  return (
    <button
      {...props}
      style={{
        borderRadius: '999px',
        cursor: 'pointer',
        transition: 'transform var(--t), box-shadow var(--t)',
        ...variants[variant],
        ...sizes[size],
        ...style,
      }}
    />
  )
}

export function Avatar({
  initials = 'MB',
  background = 'linear-gradient(135deg,#7FA878,#C4775A)',
  size = 38,
  goldRing = false,
  online = false,
  emoji,
}) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          background,
          color: '#fff',
          fontWeight: 700,
          border: goldRing ? '2px solid var(--gold)' : 'none',
        }}
      >
        {emoji || initials}
      </div>
      {online ? (
        <span
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: Math.max(8, size * 0.25),
            height: Math.max(8, size * 0.25),
            borderRadius: '50%',
            background: '#34d399',
            border: '2px solid #fff',
          }}
        />
      ) : null}
    </div>
  )
}

const tagStyles = {
  so: { bg: '#dbe4ff', fg: '#2b50c7' },
  ax: { bg: '#ffe3f0', fg: '#a41361' },
  al: { bg: '#ffedd5', fg: '#b45309' },
  rc: { bg: '#dcfce7', fg: '#166534' },
  dp: { bg: '#ede9fe', fg: '#5b21b6' },
  gm: { bg: '#d1fae5', fg: '#047857' },
  et: { bg: '#ffedd5', fg: '#c2410c' },
  mn: { bg: 'linear-gradient(135deg,#e8d8a5,#c9a84c)', fg: '#6b4f00' },
  sk: { bg: '#ececec', fg: '#4b5563' },
  lo: { bg: '#ede9fe', fg: '#6d28d9' },
}

export function Tag({ type = 'sk', children }) {
  const t = tagStyles[type] || tagStyles.sk
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 999,
        padding: '4px 9px',
        background: t.bg,
        color: t.fg,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  )
}

export function Card({ children, style }) {
  return (
    <section
      className="anim-fade-up"
      style={{
        background: '#fff',
        border: '1px solid #e8e2d5',
        borderRadius: 'var(--r)',
        boxShadow: 'var(--sh)',
        padding: 16,
        ...style,
      }}
    >
      {children}
    </section>
  )
}

export function CardTitle({ children, action }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}
    >
      <h3 style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: 20 }}>{children}</h3>
      {action}
    </div>
  )
}

export function Toggle({ checked, onChange, id }) {
  return (
    <label
      htmlFor={id}
      style={{ position: 'relative', width: 40, height: 24, display: 'inline-block' }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ opacity: 0, width: 0, height: 0 }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 999,
          background: checked ? 'var(--sage)' : '#d1d5db',
          transition: 'all var(--t)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: checked ? 19 : 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#fff',
          transition: 'all var(--t)',
        }}
      />
    </label>
  )
}

export function ToggleRow({ label, sub, checked, onChange, id }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        padding: '10px 0',
        borderBottom: '1px solid #eef0e6',
      }}
    >
      <div>
        <div style={{ fontWeight: 600 }}>{label}</div>
        {sub ? <div style={{ color: 'var(--ink-m)', fontSize: 13 }}>{sub}</div> : null}
      </div>
      <Toggle checked={checked} onChange={onChange} id={id} />
    </div>
  )
}

export function PageHeader({ title, sub, action }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 14,
        alignItems: 'end',
        marginBottom: 18,
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(1.65rem,3vw,2.2rem)',
            color: '#4a4a4a',
          }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p style={{ margin: '6px 0 0', color: 'var(--ink-m)' }}>{sub}</p>
      </div>
      {action}
    </div>
  )
}

export function EmptyState({ icon = '🌿', title, sub, action }) {
  return (
    <Card style={{ textAlign: 'center', padding: 26 }}>
      <div style={{ fontSize: 28 }}>{icon}</div>
      <h3 style={{ margin: '8px 0 4px', fontFamily: 'Fraunces, serif' }}>{title}</h3>
      <p style={{ margin: 0, color: 'var(--ink-m)' }}>{sub}</p>
      {action ? <div style={{ marginTop: 14 }}>{action}</div> : null}
    </Card>
  )
}

export function Spinner({ size = 20, color = 'var(--sage)' }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `2px solid ${color}`,
        borderTopColor: 'transparent',
        display: 'inline-block',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  )
}

export function Divider({ style }) {
  return <hr style={{ border: 0, borderTop: '1px solid #e5e7df', margin: '14px 0', ...style }} />
}

export function NavLinkPill({ to, active, label }) {
  return (
    <Link
      to={to}
      style={{
        display: 'block',
        padding: '10px 12px',
        borderRadius: 12,
        background: active ? 'var(--sage-m)' : 'transparent',
        color: active ? 'var(--sage-d)' : 'inherit',
        fontWeight: active ? 700 : 500,
      }}
    >
      {label}
    </Link>
  )
}
