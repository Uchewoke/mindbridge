/**
 * In-memory push token store.
 *
 * In production this should be persisted to the database (e.g. a
 * `push_tokens` table keyed by userId).  The interface is kept separate so
 * swapping in a DB-backed implementation requires no changes to the
 * controller.
 */

// token → userId mapping
const tokensByUserId = new Map<string, Set<string>>()
const userIdByToken = new Map<string, string>()

export function storePushToken(userId: string, token: string): void {
  if (!tokensByUserId.has(userId)) {
    tokensByUserId.set(userId, new Set())
  }
  tokensByUserId.get(userId)!.add(token)
  userIdByToken.set(token, userId)
}

export function removePushToken(token: string): void {
  const userId = userIdByToken.get(token)
  if (userId) {
    tokensByUserId.get(userId)?.delete(token)
    userIdByToken.delete(token)
  }
}

export function getTokensForUser(userId: string): string[] {
  return Array.from(tokensByUserId.get(userId) ?? [])
}

export function getAllTokens(): string[] {
  return Array.from(userIdByToken.keys())
}
