/**
 * Expo Push Notification service (backend).
 *
 * Uses the Expo Push API (HTTP v2) directly — no SDK required.
 * Docs: https://docs.expo.dev/push-notifications/sending-notifications/
 */

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

export type NotificationType = 'support_moment' | 'mentor_message' | 'crisis_check_in' | 'general'

export interface PushMessage {
  to: string | string[]
  title: string
  body: string
  data?: Record<string, unknown>
  sound?: 'default' | null
  badge?: number
  channelId?: string
  priority?: 'default' | 'normal' | 'high'
}

interface ExpoTicket {
  status: 'ok' | 'error'
  id?: string
  message?: string
  details?: { error?: string }
}

interface ExpoReceiptsResponse {
  data: Record<string, { status: 'ok' | 'error'; message?: string; details?: unknown }>
}

/**
 * Sends one or more push messages via the Expo Push API.
 * Batches up to 100 messages per request (Expo limit).
 */
export async function sendExpoPushNotifications(messages: PushMessage[]): Promise<ExpoTicket[]> {
  const tickets: ExpoTicket[] = []

  // Process in chunks of 100
  for (let i = 0; i < messages.length; i += 100) {
    const chunk = messages.slice(i, i + 100)

    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chunk),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Expo Push API error ${response.status}: ${text}`)
    }

    const json = (await response.json()) as { data: ExpoTicket[] }
    tickets.push(...json.data)
  }

  return tickets
}

/**
 * Sends a "support moment" push notification to one or more Expo push tokens.
 */
export async function sendSupportMoment(
  tokens: string[],
  title: string,
  body: string,
  data: Record<string, unknown> = {},
): Promise<ExpoTicket[]> {
  if (tokens.length === 0) return []

  const messages: PushMessage[] = tokens.map((token) => ({
    to: token,
    title,
    body,
    sound: 'default',
    channelId: 'support-moments',
    priority: 'high',
    data: { type: 'support_moment', ...data },
  }))

  return sendExpoPushNotifications(messages)
}

/**
 * Checks push receipts for previously sent tickets.
 * Should be called ~15–30 minutes after sending to detect delivery failures.
 */
export async function checkPushReceipts(
  ticketIds: string[],
): Promise<ExpoReceiptsResponse['data']> {
  const response = await fetch('https://exp.host/--/api/v2/push/getReceipts', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids: ticketIds }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Expo Receipts API error ${response.status}: ${text}`)
  }

  const json = (await response.json()) as ExpoReceiptsResponse
  return json.data
}
