export function scoreMentorMatch(vectorA: number[], vectorB: number[]): number {
  const minLength = Math.min(vectorA.length, vectorB.length)
  if (minLength === 0) {
    return 0
  }
  let sum = 0
  for (let i = 0; i < minLength; i += 1) {
    sum += Math.abs(vectorA[i] - vectorB[i])
  }
  return Math.max(0, 1 - sum / minLength)
}
