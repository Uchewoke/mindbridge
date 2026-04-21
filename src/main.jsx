import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/api/queryClient'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'
import App from './App.jsx'

function shouldEnableMocks() {
  const value = String(import.meta.env.VITE_ENABLE_MSW || '').toLowerCase()
  return import.meta.env.DEV || value === 'true' || value === '1'
}

async function prepare() {
  if (shouldEnableMocks()) {
    const { worker } = await import('./mocks/browser')
    return worker.start({ onUnhandledRequest: 'bypass' })
  }
}

prepare().then(() => {
  createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <App />
      </StrictMode>
    </QueryClientProvider>,
  )
})
