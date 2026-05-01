import { PageHeader, Card } from '@/components/ui'
import { Link } from 'react-router-dom'

const sectionStyle = {
  borderBottom: '1px solid #d8decc',
  marginBottom: '1.25rem',
  paddingBottom: '1.25rem',
}

const warningBox = {
  backgroundColor: '#fff3cd',
  padding: '1rem',
  borderRadius: '4px',
  marginTop: '1rem',
}

export function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms of Service"
        sub={<>Effective Date: April 27, 2026 &nbsp;·&nbsp; Governed by the laws of Georgia</>}
      />

      <Card>
        <section style={sectionStyle}>
          <h2>1.1 Acceptance of Terms</h2>
          <p>
            By accessing or using MindBridge, you agree to be bound by these Terms. If you do not
            agree, you must not use the service.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>1.2 Description of Service</h2>
          <p>MindBridge provides:</p>
          <ul>
            <li>AI-powered mentorship matching</li>
            <li>Peer-to-peer support for mental health and recovery</li>
            <li>Community engagement tools and content sharing</li>
          </ul>
          <div style={warningBox}>
            <strong>Important:</strong> This platform is <strong>not</strong> a substitute for
            professional medical advice, diagnosis, or treatment.
          </div>
        </section>

        <section style={sectionStyle}>
          <h2>1.3 Eligibility</h2>
          <p>Users must:</p>
          <ul>
            <li>Be at least 18 years old (or have parental consent)</li>
            <li>Provide accurate registration information</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2>1.4 User Accounts</h2>
          <p>You are responsible for:</p>
          <ul>
            <li>Maintaining account confidentiality</li>
            <li>All activity under your account</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2>1.5 Acceptable Use</h2>
          <p>
            You agree <strong>NOT</strong> to:
          </p>
          <ul>
            <li>Harass, abuse, or harm others</li>
            <li>Share harmful, illegal, or misleading content</li>
            <li>Attempt to reverse-engineer the AI system</li>
            <li>Use the platform for unauthorised commercial purposes</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2>1.6 AI Disclaimer</h2>
          <ul>
            <li>AI responses are informational only</li>
            <li>Not guaranteed accurate or appropriate for all situations</li>
            <li>Should not be relied upon for crisis decisions</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2>1.7 Suspension &amp; Termination</h2>
          <p>We may suspend or terminate accounts for:</p>
          <ul>
            <li>Violations of these Terms</li>
            <li>Harmful behaviour</li>
            <li>Legal compliance requirements</li>
          </ul>
        </section>

        <section>
          <h2>1.8 Limitation of Liability</h2>
          <p>MindBridge is not liable for:</p>
          <ul>
            <li>Emotional outcomes from platform interactions</li>
            <li>User-generated content</li>
            <li>Service interruptions</li>
          </ul>
          <p style={{ marginTop: '1rem' }}>
            See also: <Link to="/privacy">Privacy Policy</Link> &nbsp;·&nbsp;{' '}
            <Link to="/guidelines">Community Guidelines</Link>
          </p>
        </section>
      </Card>
    </>
  )
}
