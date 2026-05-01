const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) {
    throw new Error(`GET ${path} failed with ${response.status}`)
  }
  return (await response.json()) as T
}
