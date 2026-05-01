import Link from 'next/link'
import Layout from '../components/Layout'

export default function HomePage() {
  return (
    <Layout title="MindBridge">
      <section className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <p style={{ margin: 0 }}>Peer mentorship for recovery and growth.</p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign up</Link>
        </div>
      </section>
    </Layout>
  )
}
