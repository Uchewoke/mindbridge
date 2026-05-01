import { Router } from 'express'
import { loginController, meController, signupController } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

export const authRoutes = Router()
authRoutes.post('/login', loginController)
authRoutes.post('/signin', loginController) // alias used by the web frontend
authRoutes.post('/signup', signupController)
authRoutes.get('/me', authMiddleware, meController)
