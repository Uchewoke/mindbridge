import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RootStackParamList } from '../../App'
import { scheduleSupportMoment } from '../services/notifications'

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

const SUPPORT_MOMENTS = [
  {
    title: '🌿 Daily Check-in',
    body: 'How are you feeling today? Take a moment to reflect.',
  },
  {
    title: '💬 Mentor message',
    body: 'Your mentor has shared some thoughts for you.',
  },
  {
    title: '🧘 Breathing reminder',
    body: 'Take 3 deep breaths. You are doing great.',
  },
  {
    title: '🆘 Crisis support available',
    body: 'If you are struggling, help is always here. Call 988.',
  },
]

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets()

  const handleScheduleDemo = async (index: number) => {
    const moment = SUPPORT_MOMENTS[index]
    // Schedule 5 seconds out so users can background the app and see it arrive
    await scheduleSupportMoment(moment.title, moment.body, 5_000)
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
    >
      <Text style={styles.heading}>Welcome back</Text>
      <Text style={styles.sub}>
        MindBridge connects you with peer mentors for support on your mental health journey.
      </Text>

      <View style={styles.section}>
        <Pressable style={styles.primaryBtn} onPress={() => navigation.navigate('Chat')}>
          <Text style={styles.primaryBtnText}>Open Chat</Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={() => navigation.navigate('Notifications')}>
          <Text style={styles.secondaryBtnText}>View Notifications</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Demo: Send a Support Moment</Text>
      <Text style={styles.hint}>
        Tap below to schedule a push notification in 5 seconds. Background the app to see it arrive.
      </Text>

      {SUPPORT_MOMENTS.map((m, i) => (
        <Pressable key={i} style={styles.momentCard} onPress={() => handleScheduleDemo(i)}>
          <Text style={styles.momentTitle}>{m.title}</Text>
          <Text style={styles.momentBody}>{m.body}</Text>
        </Pressable>
      ))}

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          MindBridge is for peer support only and is not a substitute for professional mental health
          care. If you are in crisis, call <Text style={styles.crisisLink}>988</Text> or your local
          emergency services.
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6f0' },
  content: { padding: 20 },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2d3c2d',
    marginBottom: 6,
  },
  sub: { fontSize: 15, color: '#5a6a5a', lineHeight: 22, marginBottom: 24 },
  section: { gap: 10, marginBottom: 28 },
  primaryBtn: {
    backgroundColor: '#5a7a5a',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondaryBtn: {
    borderWidth: 1.5,
    borderColor: '#5a7a5a',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  secondaryBtnText: { color: '#5a7a5a', fontWeight: '600', fontSize: 15 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2d3c2d',
    marginBottom: 4,
  },
  hint: {
    fontSize: 13,
    color: '#7a8a7a',
    marginBottom: 14,
    lineHeight: 19,
  },
  momentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e4e7da',
  },
  momentTitle: { fontWeight: '700', color: '#2d3c2d', marginBottom: 3 },
  momentBody: { fontSize: 13, color: '#5a6a5a', lineHeight: 18 },
  disclaimer: {
    marginTop: 28,
    padding: 14,
    backgroundColor: '#fff8f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5cfa0',
  },
  disclaimerText: { fontSize: 12, color: '#7a5a3a', lineHeight: 18 },
  crisisLink: { fontWeight: '700', color: '#c0392b' },
})
