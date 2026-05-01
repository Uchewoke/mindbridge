import Layout from '../components/Layout'
import MentorCard from '../components/MentorCard'
import SeekerCard from '../components/SeekerCard'

export default function DashboardPage() {
  return (
    <Layout title="Dashboard">
      <div style={{ display: 'grid', gap: '1rem' }}>
        <MentorCard name="Ama" specialty="Relapse prevention" />
        <SeekerCard name="Jordan" goal="Daily check-ins" />
      </div>
    </Layout>
  )
}
