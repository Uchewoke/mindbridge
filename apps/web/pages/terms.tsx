import Layout from '../components/Layout'

export default function TermsPage() {
  return (
    <Layout title="Terms of Service">
      <article className="card">
        <h1>Terms of Service (Core Sections)</h1>

        <section>
          <h2>1.1 Acceptance of Terms</h2>
          <p>
            By accessing or using the Platform, users agree to be bound by these Terms. If they do
            not agree, they must not use the service.
          </p>
        </section>

        <section>
          <h2>1.2 Description of Service</h2>
          <p>The Platform provides:</p>
          <ul>
            <li>AI-powered mentorship matching</li>
            <li>Peer-to-peer support for mental health and recovery</li>
            <li>Community engagement tools and content sharing</li>
          </ul>
          <div
            style={{
              backgroundColor: '#fff3cd',
              padding: '1rem',
              borderRadius: '4px',
              marginTop: '1rem',
            }}
          >
            <strong>Important:</strong> This Platform is not a substitute for professional medical
            advice, diagnosis, or treatment.
          </div>
        </section>

        <section>
          <h2>1.3 Eligibility</h2>
          <p>Users must:</p>
          <ul>
            <li>Be at least 18 years old (or parental consent required)</li>
            <li>Provide accurate registration information</li>
          </ul>
        </section>

        <section>
          <h2>1.4 User Accounts</h2>
          <p>Users are responsible for:</p>
          <ul>
            <li>Maintaining account confidentiality</li>
            <li>All activity under their account</li>
          </ul>
        </section>

        <section>
          <h2>1.5 Acceptable Use</h2>
          <p>Users agree NOT to:</p>
          <ul>
            <li>Harass, abuse, or harm others</li>
            <li>Share harmful, illegal, or misleading content</li>
            <li>Attempt to reverse-engineer the AI system</li>
            <li>Use the platform for unauthorized commercial purposes</li>
          </ul>
        </section>

        <section>
          <h2>1.6 AI Disclaimer</h2>
          <ul>
            <li>AI responses are informational only</li>
            <li>Not guaranteed accurate or appropriate for all situations</li>
            <li>Should not be relied upon for crisis decisions</li>
          </ul>
        </section>

        <section>
          <h2>1.7 Suspension & Termination</h2>
          <p>You may suspend or terminate accounts for:</p>
          <ul>
            <li>Violations of terms</li>
            <li>Harmful behavior</li>
            <li>Legal compliance</li>
          </ul>
        </section>

        <section>
          <h2>1.8 Limitation of Liability</h2>
          <p>The Company is not liable for:</p>
          <ul>
            <li>Emotional outcomes from platform interactions</li>
            <li>User-generated content</li>
            <li>Service interruptions</li>
          </ul>
        </section>
      </article>
    </Layout>
  )
}
