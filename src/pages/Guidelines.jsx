import { PageHeader, Card } from '@/components/ui'

const divider = {
  borderBottom: '1px solid #d8decc',
  marginBottom: '1.25rem',
  paddingBottom: '1.25rem',
}

export function GuidelinesPage() {
  return (
    <>
      <PageHeader
        title="Community Guidelines"
        sub="Our mission is to create a safe, supportive environment."
      />

      <Card>
        <section style={divider}>
          <h2 style={{ marginBottom: '0.75rem' }}>✅ Allowed</h2>
          <ul>
            <li>Sharing experiences</li>
            <li>Offering support and encouragement</li>
            <li>Respectful discussions</li>
          </ul>
        </section>

        <section style={divider}>
          <h2 style={{ marginBottom: '0.75rem' }}>🚫 Not Allowed</h2>
          <ul>
            <li>Harassment, hate speech, or threats</li>
            <li>Promoting self-harm or dangerous behaviour</li>
            <li>Misinformation about mental health</li>
            <li>Spam or scams</li>
          </ul>
        </section>

        <section style={divider}>
          <h2 style={{ marginBottom: '0.75rem' }}>🛡️ Moderation</h2>
          <p>We may:</p>
          <ul>
            <li>Remove content</li>
            <li>Suspend or ban users</li>
            <li>Escalate serious safety concerns</li>
          </ul>
        </section>

        <section style={divider}>
          <h2 style={{ marginBottom: '0.75rem' }}>🆘 Crisis Support</h2>
          <p>
            If you are in crisis, contact <strong>911</strong> or the{' '}
            <strong>988 Suicide &amp; Crisis Lifeline</strong>.
          </p>
        </section>

        <section>
          <h2 style={{ marginBottom: '0.75rem' }}>🤝 Respect First</h2>
          <p>
            This is a support platform — treat others with <strong>empathy and respect</strong>.
          </p>
        </section>
      </Card>
    </>
  )
}
