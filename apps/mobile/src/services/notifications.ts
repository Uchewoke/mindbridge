/**
 * Push notification service for MindBridge mobile.
 *
 * Responsibilities:
 * - Request / check notification permissions
 * - Obtain the Expo push token
 * - Register the token with the MindBridge backend
 * - Configure foreground notification behaviour
 */

import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { registerPushToken } from './api'

// Show notifications as banners even when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export type PushPermissionStatus = 'granted' | 'denied' | 'undetermined'

/** Returns the current permission status without prompting. */
export async function getPushPermissionStatus(): Promise<PushPermissionStatus> {
  const { status } = await Notifications.getPermissionsAsync()
  return status as PushPermissionStatus
}

/**
 * Requests permission, retrieves the Expo push token, and registers it
 * with the backend.  Returns the token string, or null if permission is
 * denied or the device is not physical.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn('[Push] Push notifications only work on physical devices.')
    return null
  }

  // Android requires an explicit notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('support-moments', {
      name: 'Support Moments',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#5a7a5a',
      description: 'Gentle check-ins, mentor messages, and crisis resources from MindBridge.',
    })
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    console.warn('[Push] Permission not granted.')
    return null
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId

  if (!projectId) {
    console.warn('[Push] EAS project ID not found in app config.')
    return null
  }

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data

  // Persist the token server-side so the backend can target this device
  await registerPushToken(token)

  return token
}

/** Schedules a local "support moment" notification for a given delay (ms). */
export async function scheduleSupportMoment(
  title: string,
  body: string,
  delayMs: number,
): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      data: { type: 'support_moment' },
    },
    trigger: { seconds: Math.ceil(delayMs / 1000) },
  })
}

/** Cancels all scheduled local notifications. */
export async function cancelAllScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync()
}
