import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { apiMe } from '@/api/auth'
import AppShell from '@/components/layout/AppShell'
import BootSplash from '@/components/ui/BootSplash'
import ToastContainer from '@/components/ui/Toast'
import { useAuthStore, useUserStore } from '@/stores'
import { CommunityPage, CommunitiesPage } from '@/pages/Communities'
import { DiscoverPage } from '@/pages/Discover'
import { JourneyPage } from '@/pages/Journey'
import { SessionsPage } from '@/pages/Sessions'
import { AuthPage } from '@/pages/Auth'
import { AdminPage } from '@/pages/Admin'
import { GuidelinesPage } from '@/pages/Guidelines'
import { TermsPage } from '@/pages/Terms'
import { PrivacyPage } from '@/pages/Privacy'
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
  const sessionToken = useAuthStore((s) => s.sessionToken)
  const signIn = useAuthStore((s) => s.signIn)
  const signOut = useAuthStore((s) => s.signOut)
  const setUser = useUserStore((s) => s.setUser)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    let isActive = true

    async function restoreSession() {
      if (!sessionToken) {
        if (isActive) setAuthReady(true)
        return
      }

      try {
        const { data } = await apiMe()
        if (!isActive) return

        signIn(sessionToken)
        if (data?.user) setUser(data.user)
      } catch {
        if (!isActive) return
        signOut()
      } finally {
        if (isActive) setAuthReady(true)
      }
    }

    restoreSession()
    return () => {
      isActive = false
    }
  }, [sessionToken, setUser, signIn, signOut])

  if (!authReady) return <BootSplash />

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route
              path="/feed"
              element={
                <RequireAuth>
                  <FeedPage />
                </RequireAuth>
              }
            />
            <Route
              path="/communities"
              element={
                <RequireAuth>
                  <CommunitiesPage />
                </RequireAuth>
              }
            />
            <Route
              path="/communities/:slug"
              element={
                <RequireAuth>
                  <CommunityPage />
                </RequireAuth>
              }
            />
            <Route
              path="/discover"
              element={
                <RequireAuth>
                  <DiscoverPage />
                </RequireAuth>
              }
            />
            <Route
              path="/sessions"
              element={
                <RequireAuth>
                  <SessionsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/sessions/:id"
              element={
                <RequireAuth>
                  <SessionsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/journey"
              element={
                <RequireAuth>
                  <JourneyPage />
                </RequireAuth>
              }
            />
            <Route
              path="/analytics"
              element={
                <RequireAuth>
                  <JourneyPage />
                </RequireAuth>
              }
            />
            <Route
              path="/ai-mentor"
              element={
                <RequireAuth>
                  <DiscoverPage />
                </RequireAuth>
              }
            />
            <Route
              path="/messages"
              element={
                <RequireAuth>
                  <MessagesPage />
                </RequireAuth>
              }
            />
            <Route
              path="/notifications"
              element={
                <RequireAuth>
                  <NotificationsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/auth"
              element={
                <GuestOnly>
                  <AuthPage />
                </GuestOnly>
              }
            />
            <Route
              path="/login"
              element={
                <GuestOnly>
                  <AuthPage />
                </GuestOnly>
              }
            />
            <Route
              path="/signup"
              element={
                <GuestOnly>
                  <AuthPage />
                </GuestOnly>
              }
            />
            <Route
              path="/anonymous"
              element={
                <RequireAuth>
                  <AnonPage />
                </RequireAuth>
              }
            />
            <Route
              path="/settings"
              element={
                <RequireAuth>
                  <SettingsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireRole role="admin">
                  <AdminPage />
                </RequireRole>
              }
            />
            <Route path="/crisis" element={<CrisisPage />} />
            <Route path="/guidelines" element={<GuidelinesPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<Navigate to="/feed" replace />} />
          </Routes>
        </AppShell>
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
