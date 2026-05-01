import { createSafetyEvent, getSafetySummary, listSafetyEvents } from './events.service.js'

type SafetyReport = {
  userId?: string
  messageId?: string
  reason: string
}

export async function createSafetyReport(report: SafetyReport) {
  const content = report.messageId
    ? `messageId=${report.messageId}; reason=${report.reason}`
    : `reason=${report.reason}`

  return createSafetyEvent({
    userId: report.userId,
    type: 'user_report',
    content,
  })
}

export async function listSafetyReports() {
  return listSafetyEvents(200)
}

export async function getSafetyReportsSummary() {
  return getSafetySummary()
}
