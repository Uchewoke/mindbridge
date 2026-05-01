/**
 * usePushNotifications
 *
 * Handles the full push-notification lifecycle:
 * 1. Registers the device and obtains a token on mount
 * 2. Listens for incoming notifications while the app is foregrounded
 * 3. Listens for notification-tap events so the app can deep-link
 */

import * as Notifications from 'expo-notifications'
import { useEffect, useRef, useState } from 'react'
import { registerForPushNotifications } from '../services/notifications'

export interface UsePushNotificationsResult {
  /** The Expo push token for this device, or null if unavailable. */
  expoPushToken: string | null
  /** The most recently received foreground notification. */
  lastNotification: Notifications.Notification | null
  /** Any error that occurred during registration. */
  error: Error | null
}

export function usePushNotifications(): UsePushNotificationsResult {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null)
  const [lastNotification, setLastNotification] = useState<Notifications.Notification | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const notificationListener = useRef<Notifications.EventSubscription | null>(null)
  const responseListener = useRef<Notifications.EventSubscription | null>(null)

  useEffect(() => {
    // 1. Register and obtain token
    registerForPushNotifications()
      .then((token) => setExpoPushToken(token))
      .catch((err: unknown) => setError(err instanceof Error ? err : new Error(String(err))))

    // 2. Foreground notification received
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setLastNotification(notification)
    })

    // 3. User tapped a notification (foreground or background)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, unknown>
      console.log('[Push] Notification tapped:', data)
      // Deep-link handling can be added here (e.g. navigate to chat)
    })

    return () => {
      notificationListener.current?.remove()
      responseListener.current?.remove()
    }
  }, [])

  return { expoPushToken, lastNotification, error }
}
