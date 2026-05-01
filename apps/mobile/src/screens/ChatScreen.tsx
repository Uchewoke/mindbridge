import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RootStackParamList } from '../../App'

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>

interface Message {
  id: string
  role: 'user' | 'mentor'
  body: string
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', role: 'mentor', body: 'Hi! How are you feeling today? 🌿' },
]

export default function ChatScreen(_props: Props) {
  const insets = useSafeAreaInsets()
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')

  const send = () => {
    const text = input.trim()
    if (!text) return

    const userMsg: Message = {
      id: String(Date.now()),
      role: 'user',
      body: text,
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    // Placeholder for backend call — replace with real API call
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'mentor',
          body: "Thank you for sharing that. I'm here with you. 💚",
        },
      ])
    }, 800)
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        style={styles.messages}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 8 }}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.mentorBubble]}
          >
            <Text style={msg.role === 'user' ? styles.userText : styles.mentorText}>
              {msg.body}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.inputRow, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message…"
          placeholderTextColor="#aab"
          multiline
          maxLength={2000}
          returnKeyType="send"
          onSubmitEditing={send}
        />
        <Pressable style={styles.sendBtn} onPress={send}>
          <Text style={styles.sendBtnText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f5f6f0' },
  messages: { flex: 1 },
  bubble: {
    maxWidth: '80%',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#5a7a5a',
  },
  mentorBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e4e7da',
  },
  userText: { color: '#fff', fontSize: 15, lineHeight: 21 },
  mentorText: { color: '#2d3c2d', fontSize: 15, lineHeight: 21 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e4e7da',
    backgroundColor: '#f5f6f0',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dde4d3',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#2d3c2d',
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: '#5a7a5a',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
