export type SafetyEventLevel = 'low' | 'medium' | 'high' | 'critical'

export type SafetyEvent = {
  id: string
  userId: string
  level: SafetyEventLevel
  reason: string
  createdAt: Date
}
