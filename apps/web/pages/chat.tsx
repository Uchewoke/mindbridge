import ChatBox from '../components/ChatBox'
import Layout from '../components/Layout'

const demo = [
  { role: 'mentor' as const, body: 'How are you feeling today?' },
  { role: 'seeker' as const, body: 'A bit anxious, but better than yesterday.' },
]

export default function ChatPage() {
  return (
    <Layout title="Mentorship Chat">
      <ChatBox messages={demo} />
    </Layout>
  )
}
