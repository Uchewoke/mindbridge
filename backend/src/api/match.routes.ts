import { Router } from 'express'
import { getMatchesController } from '../controllers/match.controller.js'

export const matchRoutes = Router()
matchRoutes.get('/', getMatchesController)
