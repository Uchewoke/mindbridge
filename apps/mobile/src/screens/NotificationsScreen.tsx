import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RootStackParamList } from '../../App'
import { usePushNotifications } from '../hooks/usePushNotifications'

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>

const DEMO_NOTIFICATIONS = [
  {
    id: '1',
    type: 'mentor_message' as const,
    title: '💬 Mentor message',
    body: 'Your mentor Alex has left you a message.',
    createdAt: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'support_moment' as const,
    title: '🌿 Daily Check-in',
    body: 'How are you feeling today? Take a moment to reflect.',
    createdAt: '1 hr ago',
    read: false,
  },
  {
    id: '3',
    type: 'general' as const,
    title: '🎉 Community update',
    body: 'The Anxiety Support community posted 3 new discussions.',
    createdAt: 'Yesterday',
    read: true,
  },
]

const TYPE_COLOURS: Record<string, string> = {
  mentor_message: '#e0f2fe',
  support_moment: '#e8f5e9',
  crisis_check_in: '#fff3e0',
  general: '#f3f4f6',
}

export default function NotificationsScreen(_props: Props) {
  const insets = useSafeAreaInsets()
  const { expoPushToken, error } = usePushNotifications()

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
    >
      {/* Push token debug info (dev only) */}
      {__DEV__ && (
        <View style={styles.devBox}>
          <Text style={styles.devLabel}>Push token (dev)</Text>
          <Text style={styles.devToken} selectable>
            {error ? `Error: ${error.message}` : (expoPushToken ?? 'Registering…')}
          </Text>
        </View>
      )}

      <Text style={styles.heading}>Notifications</Text>

      {DEMO_NOTIFICATIONS.map((n) => (
        <View
          key={n.id}
          style={[
            styles.card,
            { backgroundColor: TYPE_COLOURS[n.type] ?? '#f3f4f6' },
            !n.read && styles.unread,
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{n.title}</Text>
            <Text style={styles.cardTime}>{n.createdAt}</Text>
          </View>
          <Text style={styles.cardBody}>{n.body}</Text>
        </View>
      ))}

      {DEMO_NOTIFICATIONS.length === 0 && <Text style={styles.empty}>No notifications yet.</Text>}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6f0' },
  content: { padding: 20 },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2d3c2d',
    marginBottom: 16,
  },
  card: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: '#5a7a5a',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: { fontWeight: '700', color: '#2d3c2d', flex: 1 },
  cardTime: { fontSize: 12, color: '#7a8a7a', marginLeft: 8 },
  cardBody: { fontSize: 13, color: '#5a6a5a', lineHeight: 19 },
  empty: { color: '#7a8a7a', textAlign: 'center', marginTop: 40 },
  devBox: {
    backgroundColor: '#f0f4ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  devLabel: { fontSize: 11, fontWeight: '700', color: '#4338ca', marginBottom: 4 },
  devToken: { fontSize: 11, color: '#3730a3', fontFamily: 'monospace' },
})
