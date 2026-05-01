import cors from 'cors'
import express from 'express'
import { adminRoutes } from './api/admin.routes.js'
import { authRoutes } from './api/auth.routes.js'
import { chatRoutes } from './api/chat.routes.js'
import { matchRoutes } from './api/match.routes.js'
import { mentorRoutes } from './api/mentor.routes.js'
import { notificationsRoutes } from './api/notifications.routes.js'
import { userRoutes } from './api/user.routes.js'
import { authMiddleware } from './middleware/auth.middleware.js'
import { rateLimitMiddleware } from './middleware/rateLimit.middleware.js'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(rateLimitMiddleware)

  app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'peer-mentorship-backend' })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/user', authMiddleware, userRoutes)
  app.use('/api/chat', authMiddleware, chatRoutes)
  app.use('/api/match', authMiddleware, matchRoutes)
  app.use('/api/mentors', authMiddleware, mentorRoutes)
  app.use('/api/admin', authMiddleware, adminRoutes)
  app.use('/api/notifications', notificationsRoutes)

  return app
}
