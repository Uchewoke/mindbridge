type Message = {
  role: 'mentor' | 'seeker'
  body: string
}

type Props = {
  messages: Message[]
}

export default function ChatBox({ messages }: Props) {
  return (
    <section className="card" style={{ display: 'grid', gap: '0.5rem' }}>
      {messages.map((msg, idx) => (
        <div
          key={idx}
          style={{
            padding: '0.6rem',
            borderRadius: 8,
            background: msg.role === 'mentor' ? '#e0f2fe' : '#f1f5f9',
          }}
        >
          <strong>{msg.role === 'mentor' ? 'Mentor' : 'You'}:</strong> {msg.body}
        </div>
      ))}
    </section>
  )
}
