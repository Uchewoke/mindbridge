import { Router } from 'express'
import {
  getDashboardStateController,
  listReportsController,
  listUsersController,
  toggleUserActiveController,
  getStatsController,
  listFlagsController,
  resolveFlagController,
  updateDashboardFlagController,
  updateDashboardMentorController,
  updateDashboardUserController,
} from '../controllers/admin.controller.js'

export const adminRoutes = Router()
adminRoutes.get('/state', getDashboardStateController)
adminRoutes.get('/reports', listReportsController)
adminRoutes.get('/users', listUsersController)
adminRoutes.patch('/users/:id/status', toggleUserActiveController)
adminRoutes.get('/stats', getStatsController)
adminRoutes.get('/flags', listFlagsController)
adminRoutes.patch('/flags/:id/resolve', resolveFlagController)
adminRoutes.patch('/state/flags/:id', updateDashboardFlagController)
adminRoutes.patch('/state/users/:id', updateDashboardUserController)
adminRoutes.patch('/state/mentors/:id', updateDashboardMentorController)
