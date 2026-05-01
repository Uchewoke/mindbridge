import { createApp } from './app.js'
import { logInfo } from './utils/logger.js'

const port = Number(process.env.PORT || 4000)
const app = createApp()

app.listen(port, () => {
  logInfo(`Backend listening on http://localhost:${port}`)
})
