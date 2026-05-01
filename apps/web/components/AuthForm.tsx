type Props = {
  mode: 'login' | 'signup'
}

export default function AuthForm({ mode }: Props) {
  return (
    <form className="card" style={{ display: 'grid', gap: '0.75rem', maxWidth: '420px' }}>
      <h2 style={{ margin: 0 }}>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
      <input placeholder="Email" type="email" required />
      <input placeholder="Password" type="password" required />
      {mode === 'signup' ? <input placeholder="Display name" required /> : null}
      <button type="submit">{mode === 'login' ? 'Login' : 'Sign up'}</button>
    </form>
  )
}
