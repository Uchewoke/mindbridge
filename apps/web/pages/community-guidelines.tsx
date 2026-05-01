import Layout from '../components/Layout'

export default function CommunityGuidelinesPage() {
  return (
    <Layout title="Community Guidelines">
      <ul className="card" style={{ margin: 0, display: 'grid', gap: '0.5rem' }}>
        <li>Show empathy and avoid judgmental language.</li>
        <li>Do not share sensitive personal details in public channels.</li>
        <li>Escalate safety concerns through in-app reporting tools.</li>
      </ul>
    </Layout>
  )
}
