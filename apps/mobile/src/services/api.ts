/**
 * Thin API client for the MindBridge backend.
 * The base URL is read from app.json extra.apiBaseUrl (falls back to localhost
 * for local dev).
 */

import Constants from 'expo-constants'

const BASE_URL: string =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? 'http://localhost:4000'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${path} → ${res.status}: ${text}`)
  }

  return res.json() as Promise<T>
}

/** Registers an Expo push token for the currently authenticated user. */
export async function registerPushToken(token: string, authToken?: string): Promise<void> {
  await request('/api/notifications/push-token', {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  })
}

/** Fetches the user's unread notifications from the backend. */
export async function fetchNotifications(authToken: string): Promise<Notification[]> {
  return request<Notification[]>('/api/notifications', {
    headers: { Authorization: `Bearer ${authToken}` },
  })
}

export interface Notification {
  id: string
  title: string
  body: string
  type: 'support_moment' | 'mentor_message' | 'crisis_check_in' | 'general'
  read: boolean
  createdAt: string
}
