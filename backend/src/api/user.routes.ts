import { Router } from 'express'
import { createReportController } from '../controllers/safety.controller.js'

export const userRoutes = Router()
userRoutes.get('/me', (_req, res) => {
  res.json({ id: 'user_1', role: 'seeker', displayName: 'Demo User' })
})
userRoutes.post('/reports', createReportController)
