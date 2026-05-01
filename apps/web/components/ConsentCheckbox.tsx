type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
}

export default function ConsentCheckbox({ checked, onChange }: Props) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />I
      consent to platform safety and community guidelines.
    </label>
  )
}
