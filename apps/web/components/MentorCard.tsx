type Props = {
  name: string
  specialty: string
}

export default function MentorCard({ name, specialty }: Props) {
  return (
    <article className="card">
      <h3 style={{ marginTop: 0 }}>{name}</h3>
      <p style={{ marginBottom: 0 }}>Specialty: {specialty}</p>
    </article>
  )
}
