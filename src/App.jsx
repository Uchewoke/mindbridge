import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import ToastContainer from '@/components/ui/Toast'
import { useAuthStore, useUserStore } from '@/stores'
import { CommunityPage, CommunitiesPage } from '@/pages/Communities'
import { DiscoverPage } from '@/pages/Discover'
import { JourneyPage } from '@/pages/Journey'
import { SessionsPage } from '@/pages/Sessions'
import { AuthPage } from '@/pages/Auth'
import { AdminPage } from '@/pages/Admin'
import {
  AnonPage,
  CrisisPage,
  FeedPage,
  MessagesPage,
  NotificationsPage,
  SettingsPage,
} from '@/pages'

const queryClient = new QueryClient()

function RequireAuth({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function GuestOnly({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/feed" replace />
  return children
}

function RequireRole({ role, children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const userRole = useUserStore((s) => s.user?.role)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (userRole !== role) return <Navigate to="/feed" replace />
  return children
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route path="/feed" element={<RequireAuth><FeedPage /></RequireAuth>} />
            <Route path="/communities" element={<RequireAuth><CommunitiesPage /></RequireAuth>} />
            <Route path="/communities/:slug" element={<RequireAuth><CommunityPage /></RequireAuth>} />
            <Route path="/discover" element={<RequireAuth><DiscoverPage /></RequireAuth>} />
            <Route path="/sessions" element={<RequireAuth><SessionsPage /></RequireAuth>} />
            <Route path="/sessions/:id" element={<RequireAuth><SessionsPage /></RequireAuth>} />
            <Route path="/journey" element={<RequireAuth><JourneyPage /></RequireAuth>} />
            <Route path="/analytics" element={<RequireAuth><JourneyPage /></RequireAuth>} />
            <Route path="/messages" element={<RequireAuth><MessagesPage /></RequireAuth>} />
            <Route path="/notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
            <Route path="/auth" element={<GuestOnly><AuthPage /></GuestOnly>} />
            <Route path="/login" element={<GuestOnly><AuthPage /></GuestOnly>} />
            <Route path="/signup" element={<GuestOnly><AuthPage /></GuestOnly>} />
            <Route path="/anonymous" element={<RequireAuth><AnonPage /></RequireAuth>} />
            <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
            <Route path="/admin" element={<RequireRole role="admin"><AdminPage /></RequireRole>} />
            <Route path="/crisis" element={<CrisisPage />} />
            <Route path="*" element={<Navigate to="/feed" replace />} />
          </Routes>
        </AppShell>
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
