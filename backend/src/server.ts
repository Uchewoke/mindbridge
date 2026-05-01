import { config as loadEnv } from 'dotenv'
import { createApp } from './app.js'
import { logInfo } from './utils/logger.js'

// Prefer backend/.env for backend runtime, then fallback to root .env.
loadEnv()
loadEnv({ path: '../.env' })

const port = Number(process.env.PORT || 4000)
const app = createApp()

app.listen(port, () => {
  logInfo(`Backend listening on http://localhost:${port}`)
})
