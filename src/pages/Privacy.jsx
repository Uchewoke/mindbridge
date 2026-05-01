import { PageHeader, Card } from '@/components/ui'
import { Link } from 'react-router-dom'

const sectionStyle = {
  borderBottom: '1px solid #d8decc',
  marginBottom: '1.25rem',
  paddingBottom: '1.25rem',
}

const warningBox = {
  backgroundColor: '#f8d7da',
  padding: '1rem',
  borderRadius: '4px',
  marginTop: '1rem',
}

export function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" sub="Effective Date: April 27, 2026" />

      <Card>
        <section style={sectionStyle}>
          <h2>2.1 Data Collected</h2>
          <ul>
            <li>Account info (name, email)</li>
            <li>Behavioural data (usage, interactions)</li>
            <li>Sensitive inputs (mental health-related content)</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2>2.2 How Data Is Used</h2>
          <ul>
            <li>AI matching &amp; personalisation</li>
            <li>Platform improvement</li>
            <li>Safety monitoring</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2>2.3 Sensitive Data Notice</h2>
          <p>
            Mental health-related inputs may be considered sensitive. By using the platform, you
            consent to processing for platform functionality.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>2.4 Data Sharing</h2>
          <p>
            <strong>We do NOT sell user data.</strong>
          </p>
          <p>We may share with:</p>
          <ul>
            <li>Service providers (hosting, analytics)</li>
            <li>Legal authorities (if required)</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2>2.5 Security</h2>
          <p>Reasonable safeguards are used, but no system is 100% secure.</p>
        </section>

        <section style={sectionStyle}>
          <h2>2.6 User Rights</h2>
          <p>You may:</p>
          <ul>
            <li>Request deletion of your data</li>
            <li>Access your data</li>
            <li>Opt out of communications</li>
          </ul>
        </section>

        <section>
          <h2>2.7 HIPAA Note &amp; Alternative Compliance Frameworks</h2>
          <div style={warningBox}>
            <strong>Important:</strong> MindBridge is a peer-mentorship and emotional support
            platform — it is <strong>not</strong> a clinical service. Accordingly, this platform is
            not HIPAA-covered and must not be used for clinical record storage or as a substitute
            for professional medical or mental health treatment.
          </div>

          <p style={{ marginTop: '1rem' }}>
            Because MindBridge operates outside the clinical domain, it is not subject to HIPAA. We
            nevertheless align with the following compliance frameworks:
          </p>

          <ul>
            <li>
              <strong>GDPR</strong> – EU data subject rights including access, portability,
              rectification, and erasure.
            </li>
            <li>
              <strong>CCPA</strong> – California residents have the right to know, delete, and opt
              out of the sale of personal information. We do not sell personal data.
            </li>
            <li>
              <strong>SOC 2 Type II (aspirational)</strong> – Security, availability, and
              confidentiality principles. Formal certification is in progress.
            </li>
            <li>
              <strong>42 CFR Part 2 awareness</strong> – Substance use disorder content handled with
              heightened sensitivity.
            </li>
            <li>
              <strong>NIST Privacy Framework</strong> – Applied for identifying, governing, and
              protecting privacy risks.
            </li>
          </ul>

          <p style={{ marginTop: '1rem' }}>
            See also: <Link to="/terms">Terms of Service</Link> &nbsp;·&nbsp;{' '}
            <Link to="/guidelines">Community Guidelines</Link>
          </p>
        </section>
      </Card>
    </>
  )
}
