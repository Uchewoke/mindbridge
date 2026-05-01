import Layout from '../components/Layout'

export default function PrivacyPage() {
  return (
    <Layout title="Privacy Policy">
      <article className="card">
        <h1>Privacy Policy</h1>

        <section>
          <h2>2.1 Data Collected</h2>
          <ul>
            <li>Account info (name, email)</li>
            <li>Behavioral data (usage, interactions)</li>
            <li>Sensitive inputs (mental health-related content)</li>
          </ul>
        </section>

        <section>
          <h2>2.2 How Data Is Used</h2>
          <ul>
            <li>AI matching & personalization</li>
            <li>Platform improvement</li>
            <li>Safety monitoring</li>
          </ul>
        </section>

        <section>
          <h2>2.3 Sensitive Data Notice</h2>
          <p>
            Mental health-related inputs may be considered sensitive. By using the platform, users
            consent to processing for platform functionality.
          </p>
        </section>

        <section>
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

        <section>
          <h2>2.5 Security</h2>
          <p>Reasonable safeguards are used, but no system is 100% secure.</p>
        </section>

        <section>
          <h2>2.6 User Rights</h2>
          <p>Users may:</p>
          <ul>
            <li>Request deletion</li>
            <li>Access their data</li>
            <li>Opt out of communications</li>
          </ul>
        </section>

        <section>
          <h2>2.7 HIPAA Note &amp; Alternative Compliance Frameworks</h2>
          <div
            style={{
              backgroundColor: '#f8d7da',
              padding: '1rem',
              borderRadius: '4px',
              marginTop: '1rem',
            }}
          >
            <strong>Important:</strong> MindBridge is a peer-mentorship and emotional support
            platform — it is <strong>not</strong> a clinical service. Accordingly, this platform is
            not HIPAA-covered and must not be used for clinical record storage or as a substitute
            for professional medical or mental health treatment.
          </div>

          <p style={{ marginTop: '1rem' }}>
            Because MindBridge operates outside the clinical domain, it is not subject to HIPAA. We
            nevertheless align with the following alternative compliance frameworks to protect user
            data:
          </p>

          <ul>
            <li>
              <strong>GDPR (General Data Protection Regulation)</strong> – For users in the European
              Economic Area, we respect data subject rights including access, portability,
              rectification, and erasure.
            </li>
            <li>
              <strong>CCPA (California Consumer Privacy Act)</strong> – California residents have
              the right to know, delete, and opt out of the sale of personal information. We do not
              sell personal data.
            </li>
            <li>
              <strong>SOC 2 Type II (aspirational)</strong> – We follow security, availability, and
              confidentiality principles consistent with SOC 2 standards. Formal certification is in
              progress.
            </li>
            <li>
              <strong>42 CFR Part 2 awareness</strong> – Content related to substance use disorder
              is handled with heightened sensitivity in alignment with federal confidentiality
              principles, even though we are not a formal Part 2 program.
            </li>
            <li>
              <strong>NIST Privacy Framework</strong> – We apply NIST-aligned practices for
              identifying, governing, controlling, communicating, and protecting privacy risks.
            </li>
          </ul>

          <p>
            If your organisation requires a specific compliance framework not listed above, please
            contact us to discuss suitability before using the platform for sensitive record
            storage.
          </p>
        </section>
      </article>
    </Layout>
  )
}
