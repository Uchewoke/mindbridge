export function logInfo(message: string, meta?: unknown): void {
  console.log(`[INFO] ${message}`, meta ?? '')
}

export function logError(message: string, meta?: unknown): void {
  console.error(`[ERROR] ${message}`, meta ?? '')
}
