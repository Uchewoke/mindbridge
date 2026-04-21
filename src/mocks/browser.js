import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * Browser (Service Worker) MSW instance.
 * Started conditionally in src/main.jsx during development only.
 *
 * @example
 * // src/main.jsx
 * if (import.meta.env.DEV) {
 *   const { worker } = await import('./mocks/browser')
 *   await worker.start({ onUnhandledRequest: 'bypass' })
 * }
 */
export const worker = setupWorker(...handlers)
