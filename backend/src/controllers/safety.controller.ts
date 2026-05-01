import { Request, Response } from 'express'
import {
  createSafetyReport,
  getSafetyReportsSummary,
  listSafetyReports,
} from '../services/safety/reporting.service.js'

export async function createReportController(req: Request, res: Response): Promise<void> {
  const report = await createSafetyReport({
    userId: req.body?.userId ? String(req.body.userId) : undefined,
    messageId: req.body?.messageId ? String(req.body.messageId) : undefined,
    reason: String(req.body?.reason ?? 'unspecified'),
  })
  res.status(201).json({ ok: true, report })
}

export async function listReportsController(_req: Request, res: Response): Promise<void> {
  const [events, summary] = await Promise.all([listSafetyReports(), getSafetyReportsSummary()])
  res.json({ events, summary })
}
