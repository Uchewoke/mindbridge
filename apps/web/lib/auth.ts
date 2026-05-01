export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return localStorage.getItem('mindbridge.token')
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken())
}
