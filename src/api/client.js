import axios from 'axios'

function readSessionToken() {
  try {
    const raw = localStorage.getItem('mindbridge-auth')
    return raw ? JSON.parse(raw)?.state?.sessionToken ?? null : null
  } catch {
    return null
  }
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = readSessionToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) window.location.href = '/login'
    return Promise.reject(error)
  },
)

export default client