type Props = {
  name: string
  goal: string
}

export default function SeekerCard({ name, goal }: Props) {
  return (
    <article className="card">
      <h3 style={{ marginTop: 0 }}>{name}</h3>
      <p style={{ marginBottom: 0 }}>Current goal: {goal}</p>
    </article>
  )
}
