import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Button, Card, CardTitle, PageHeader, Spinner } from '@/components/ui'
import { useAuthStore, useUIStore, useUserStore } from '@/stores'
import { apiSignIn, apiSignUp } from '@/api/auth'
import { validate, rules, passwordStrength } from '@/utils/validate'

const STRENGTH_LABEL = { weak: 'Weak', fair: 'Fair', strong: 'Strong' }
const STRENGTH_COLOR = { weak: '#ef4444', fair: '#f59e0b', strong: '#16a34a' }
const STRENGTH_WIDTH = { weak: '33%', fair: '66%', strong: '100%' }

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <span role="alert" style={{ fontSize: 12, color: '#ef4444', marginTop: 2 }}>
      {msg}
    </span>
  )
}

function PasswordStrengthBar({ password }) {
  if (!password) return null
  const level = passwordStrength(password)
  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ height: 4, borderRadius: 4, background: '#e5e7df', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: STRENGTH_WIDTH[level],
            background: STRENGTH_COLOR[level],
            transition: 'width 0.3s, background 0.3s',
          }}
        />
      </div>
      <span style={{ fontSize: 11, color: STRENGTH_COLOR[level], fontWeight: 600 }}>
        {STRENGTH_LABEL[level]}
      </span>
    </div>
  )
}

function fieldStyle(hasError) {
  return {
    border: `1px solid ${hasError ? '#ef4444' : '#d8decc'}`,
    borderRadius: 10,
    padding: 10,
    width: '100%',
    boxSizing: 'border-box',
  }
}

export function AuthPage() {
  const navigate = useNavigate()
  const toast = useUIStore((s) => s.toast)
  const setUser = useUserStore((s) => s.setUser)
  const signIn = useAuthStore((s) => s.signIn)
  const [mode, setMode] = useState('signin')
  const [signinRole, setSigninRole] = useState('seeker')
  const [signin, setSignin] = useState({ email: '', password: '' })
  const [signup, setSignup] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    role: 'seeker',
  })
  const [signinErrors, setSigninErrors] = useState({})
  const [signupErrors, setSignupErrors] = useState({})
  const [agreed, setAgreed] = useState(false)

  const signinMutation = useMutation({
    mutationFn: () => apiSignIn(signin.email.trim(), signin.password),
    onSuccess: ({ data }) => {
      signIn(data.token)
      const initials =
        (data.user?.name || signin.email)
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0].toUpperCase())
          .join('') || 'MB'
      setUser({ ...data.user, initials, role: signinRole, onboarded: true })
      toast(signinRole === 'mentor' ? 'Signed in as mentor' : 'Welcome back!', 'success')
      navigate('/feed')
    },
    onError: (err) => {
      toast(err?.response?.data?.message || 'Sign in failed. Check your credentials.', 'error')
    },
  })

  const signupMutation = useMutation({
    mutationFn: () =>
      apiSignUp(signup.name.trim(), signup.email.trim(), signup.password, signup.role),
    onSuccess: ({ data }) => {
      signIn(data.token)
      const initials =
        signup.name
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0].toUpperCase())
          .join('') || 'MB'
      setUser({
        ...data.user,
        name: signup.name.trim(),
        initials,
        role: signup.role,
        onboarded: true,
      })
      toast(
        signup.role === 'mentor'
          ? 'Mentor account created. Welcome to MindBridge!'
          : 'Account created. Welcome!',
        'success',
      )
      navigate('/feed')
    },
    onError: (err) => {
      toast(err?.response?.data?.message || 'Could not create account. Please try again.', 'error')
    },
  })

  function doSignIn(e) {
    e.preventDefault()
    const errs = validate({
      email: [signin.email, [rules.required, rules.email]],
      password: [signin.password, [rules.required, rules.minLen(6)]],
    })
    setSigninErrors(errs)
    if (Object.keys(errs).length) return
    signinMutation.mutate()
  }

  function doCreateAccount(e) {
    e.preventDefault()
    const errs = validate({
      name: [signup.name, [rules.required, rules.safeName, rules.maxLen(80)]],
      email: [signup.email, [rules.required, rules.email]],
      password: [signup.password, [rules.required, rules.minLen(8), rules.noHtml]],
      confirm: [signup.confirm, [rules.required, rules.match(signup.password)]],
    })
    setSignupErrors(errs)
    if (Object.keys(errs).length) return
    if (passwordStrength(signup.password) === 'weak') {
      setSignupErrors((e) => ({ ...e, password: 'Password is too weak. Add numbers or symbols.' }))
      return
    }
    if (!agreed) {
      setSignupErrors((e) => ({ ...e, agreed: 'You must agree to the Terms and Privacy Policy.' }))
      return
    }
    signupMutation.mutate()
  }

  return (
    <div>
      <PageHeader
        title="Welcome to <em>MindBridge</em>"
        sub="Sign in or create your account to personalize your support journey."
      />

      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button
            variant={mode === 'signin' && signinRole === 'seeker' ? 'sage' : 'outline'}
            onClick={() => {
              setMode('signin')
              setSigninRole('seeker')
            }}
          >
            Sign in
          </Button>
          <Button
            variant={mode === 'signin' && signinRole === 'mentor' ? 'sage' : 'outline'}
            onClick={() => {
              setMode('signin')
              setSigninRole('mentor')
            }}
          >
            Login as a mentor
          </Button>
          <Button
            variant={mode === 'signup' ? 'sage' : 'outline'}
            onClick={() => setMode('signup')}
          >
            Create account
          </Button>
        </div>
      </Card>

      {mode === 'signin' ? (
        <Card>
          <CardTitle>{signinRole === 'mentor' ? 'Mentor Sign In' : 'Sign In'}</CardTitle>
          <form onSubmit={doSignIn} noValidate style={{ display: 'grid', gap: 10 }}>
            <label style={{ display: 'grid', gap: 4 }}>
              <span style={{ color: 'var(--ink-m)', fontSize: 13 }}>Email</span>
              <input
                type="email"
                value={signin.email}
                autoComplete="email"
                onChange={(e) => {
                  setSignin((s) => ({ ...s, email: e.target.value }))
                  setSigninErrors((er) => ({ ...er, email: null }))
                }}
                placeholder="you@example.com"
                style={fieldStyle(signinErrors.email)}
              />
              <FieldError msg={signinErrors.email} />
            </label>
            <label style={{ display: 'grid', gap: 4 }}>
              <span style={{ color: 'var(--ink-m)', fontSize: 13 }}>Password</span>
              <input
                type="password"
                value={signin.password}
                autoComplete="current-password"
                onChange={(e) => {
                  setSignin((s) => ({ ...s, password: e.target.value }))
                  setSigninErrors((er) => ({ ...er, password: null }))
                }}
                placeholder="Enter password"
                style={fieldStyle(signinErrors.password)}
              />
              <FieldError msg={signinErrors.password} />
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button type="submit" disabled={signinMutation.isPending}>
                {signinMutation.isPending ? <Spinner size={16} color="#fff" /> : 'Sign in'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  toast('Password reset will be available once the backend is live.', 'default')
                }
              >
                Forgot password
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card>
          <CardTitle>Create Account</CardTitle>
          <form onSubmit={doCreateAccount} noValidate style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'grid', gap: 6 }}>
              <span style={{ color: 'var(--ink-m)', fontSize: 13 }}>I am joining as a</span>
              <div style={{ display: 'flex', gap: 8 }}>
                {['seeker', 'mentor'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSignup((s) => ({ ...s, role: r }))}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      borderRadius: 10,
                      cursor: 'pointer',
                      fontWeight: 500,
                      fontSize: 14,
                      border: signup.role === r ? '2px solid #7FA878' : '1px solid #d8decc',
                      background: signup.role === r ? '#f0f7ee' : '#fff',
                      color: signup.role === r ? '#4a7c45' : 'var(--ink-m)',
                    }}
                  >
                    {r === 'seeker' ? 'User' : 'Mentor'}
                  </button>
                ))}
              </div>
            </div>
            <label style={{ display: 'grid', gap: 4 }}>
              <span style={{ color: 'var(--ink-m)', fontSize: 13 }}>Full name</span>
              <input
                value={signup.name}
                autoComplete="name"
                onChange={(e) => {
                  setSignup((s) => ({ ...s, name: e.target.value }))
                  setSignupErrors((er) => ({ ...er, name: null }))
                }}
                placeholder="Maya Reed"
                style={fieldStyle(signupErrors.name)}
              />
              <FieldError msg={signupErrors.name} />
            </label>
            <label style={{ display: 'grid', gap: 4 }}>
              <span style={{ color: 'var(--ink-m)', fontSize: 13 }}>Email</span>
              <input
                type="email"
                value={signup.email}
                autoComplete="email"
                onChange={(e) => {
                  setSignup((s) => ({ ...s, email: e.target.value }))
                  setSignupErrors((er) => ({ ...er, email: null }))
                }}
                placeholder="you@example.com"
                style={fieldStyle(signupErrors.email)}
              />
              <FieldError msg={signupErrors.email} />
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <label style={{ display: 'grid', gap: 4 }}>
                <span style={{ color: 'var(--ink-m)', fontSize: 13 }}>Password</span>
                <input
                  type="password"
                  value={signup.password}
                  autoComplete="new-password"
                  onChange={(e) => {
                    setSignup((s) => ({ ...s, password: e.target.value }))
                    setSignupErrors((er) => ({ ...er, password: null }))
                  }}
                  placeholder="At least 8 characters"
                  style={fieldStyle(signupErrors.password)}
                />
                <PasswordStrengthBar password={signup.password} />
                <FieldError msg={signupErrors.password} />
              </label>
              <label style={{ display: 'grid', gap: 4 }}>
                <span style={{ color: 'var(--ink-m)', fontSize: 13 }}>Confirm</span>
                <input
                  type="password"
                  value={signup.confirm}
                  autoComplete="new-password"
                  onChange={(e) => {
                    setSignup((s) => ({ ...s, confirm: e.target.value }))
                    setSignupErrors((er) => ({ ...er, confirm: null }))
                  }}
                  placeholder="Repeat password"
                  style={fieldStyle(signupErrors.confirm)}
                />
                <FieldError msg={signupErrors.confirm} />
              </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 4 }}>
              <input
                id="legal-consent"
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked)
                  setSignupErrors((er) => ({ ...er, agreed: null }))
                }}
                style={{ marginTop: 2, accentColor: '#4e7a49', flexShrink: 0 }}
              />
              <div>
                <label
                  htmlFor="legal-consent"
                  style={{ fontSize: 13, color: 'var(--ink-m)', cursor: 'pointer' }}
                >
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" style={{ color: '#4a7c45' }}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" target="_blank" style={{ color: '#4a7c45' }}>
                    Privacy Policy
                  </Link>
                  , and understand this platform is not a substitute for medical care.
                </label>
                <FieldError msg={signupErrors.agreed} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button type="submit" disabled={signupMutation.isPending || !agreed}>
                {signupMutation.isPending ? <Spinner size={16} color="#fff" /> : 'Create account'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setMode('signin')}>
                I already have an account
              </Button>
            </div>
          </form>
        </Card>
      )}

      <style>{`@media (max-width: 740px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr !important;}}`}</style>
    </div>
  )
}
