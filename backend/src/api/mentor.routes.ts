import { Router } from 'express'
import { postMentorMatchController } from '../controllers/match.controller.js'

export const mentorRoutes = Router()
mentorRoutes.post('/match', postMentorMatchController)
