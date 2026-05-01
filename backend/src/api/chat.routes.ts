import { Router } from 'express'
import { sendChatMessageController } from '../controllers/chat.controller.js'
import { safetyMiddleware } from '../middleware/safety.middleware.js'

export const chatRoutes = Router()
chatRoutes.post('/send', safetyMiddleware, sendChatMessageController)
