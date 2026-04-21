import client from './client'

export async function fetchCommunities() {
  const { data } = await client.get('/api/communities')
  return data
}

export async function createCommunity(payload) {
  const { data } = await client.post('/api/communities', payload)
  return data
}
