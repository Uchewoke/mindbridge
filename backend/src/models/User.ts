export type UserRole = 'mentor' | 'seeker' | 'admin'

export type User = {
  id: string
  email: string
  displayName: string
  role: UserRole
}
