import { createBrowserRouter, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { AuthLayout } from '@/layouts/auth-layout'
import { PublicLayout } from '@/layouts/public-layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { GuestRoute } from '@/components/GuestRoute'
import { LandingPage } from '@/pages/landing'
import { LoginPage } from '@/pages/login'
import { SignupPage } from '@/pages/signup'
import { ForgotPasswordPage } from '@/pages/forgot-password'
import { PasswordResetPage } from '@/pages/password-reset'
import { VerifyEmailPage } from '@/pages/verify-email'
import { DashboardPage } from '@/pages/dashboard'
import { AgentsListPage } from '@/pages/agents-list'
import { AgentBuilderPage } from '@/pages/agent-builder'
import { PublicChatPage } from '@/pages/public-chat'
import { SessionsListPage } from '@/pages/sessions-list'
import { SessionViewerPage } from '@/pages/session-viewer'
import { SettingsPage } from '@/pages/settings'
import { AnalyticsPage } from '@/pages/analytics'
import { HelpPage } from '@/pages/help'
import { NotFoundPage } from '@/pages/not-found'
import { ErrorPage } from '@/pages/error-page'
import { PrivacyPage } from '@/pages/privacy'
import { TermsPage } from '@/pages/terms'
import { CheckoutPage } from '@/pages/checkout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'docs', element: <HelpPage /> },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: 'signup',
        element: (
          <GuestRoute>
            <SignupPage />
          </GuestRoute>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <GuestRoute>
            <ForgotPasswordPage />
          </GuestRoute>
        ),
      },
      {
        path: 'password-reset',
        element: (
          <GuestRoute>
            <PasswordResetPage />
          </GuestRoute>
        ),
      },
      {
        path: 'verify-email',
        element: (
          <GuestRoute>
            <VerifyEmailPage />
          </GuestRoute>
        ),
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'agents', element: <AgentsListPage /> },
      { path: 'agents/new', element: <AgentBuilderPage /> },
      { path: 'agents/:id', element: <AgentBuilderPage /> },
      { path: 'sessions', element: <SessionsListPage /> },
      { path: 'sessions/:id', element: <SessionViewerPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'help', element: <HelpPage /> },
    ],
  },
  {
    path: '/chat/:slug',
    element: <PublicChatPage />,
  },
  {
    path: '/demo',
    element: <Navigate to="/chat/demo" replace />,
  },
  {
    path: '/checkout',
    element: (
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    ),
  },
  { path: '/404', element: <NotFoundPage /> },
  { path: '/500', element: <ErrorPage /> },
  { path: '*', element: <NotFoundPage /> },
])
