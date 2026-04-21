import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * Node (vitest / Jest) MSW server instance.
 *
 * Usage in a test file:
 * @example
 * import { server } from '@/mocks/node'
 *
 * beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
 * afterEach(() => server.resetHandlers())
 * afterAll(() => server.close())
 *
 * // Override a handler for one test:
 * import { http, HttpResponse } from 'msw'
 * it('handles mentor match error', async () => {
 *   server.use(
 *     http.post('/api/mentors/match', () => HttpResponse.json({ message: 'Server error' }, { status: 500 }))
 *   )
 *   // ... test the error state
 * })
 */
export const server = setupServer(...handlers)
