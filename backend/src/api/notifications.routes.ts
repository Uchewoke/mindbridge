import { Router } from 'express'
import {
  deregisterPushTokenController,
  registerPushTokenController,
  sendSupportMomentController,
} from '../controllers/notifications.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { requireAdmin } from '../middleware/requireAdmin.middleware.js'

export const notificationsRoutes = Router()

// Authenticated users register / remove their device token
notificationsRoutes.post('/push-token', authMiddleware, registerPushTokenController)
notificationsRoutes.delete('/push-token', authMiddleware, deregisterPushTokenController)

// Admins can broadcast support moments
notificationsRoutes.post(
  '/support-moment',
  authMiddleware,
  requireAdmin,
  sendSupportMomentController,
)
