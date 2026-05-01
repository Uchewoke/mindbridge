import { useState } from 'react'
import AuthForm from '../components/AuthForm'
import ConsentCheckbox from '../components/ConsentCheckbox'
import Layout from '../components/Layout'

export default function SignupPage() {
  const [consent, setConsent] = useState(false)

  return (
    <Layout title="Sign up">
      <div style={{ display: 'grid', gap: '1rem' }}>
        <AuthForm mode="signup" />
        <ConsentCheckbox checked={consent} onChange={setConsent} />
      </div>
    </Layout>
  )
}
