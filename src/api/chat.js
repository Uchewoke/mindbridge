import client from './client'

export async function apiSendChatMessage(message) {
  const { data } = await client.post('/api/chat/send', { message })
  return data
}
