export type Consent = {
  userId: string
  acceptedAt: Date
  policyVersion: string
}

export type UserConsentRecord = {
  id: number
  userId: string
  agreedToTerms: boolean
  agreedToPrivacy: boolean
  agreedAt: Date
  ipAddress: string | null
  userAgent: string | null
}
