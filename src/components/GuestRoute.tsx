import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface GuestRouteProps {
  children: React.ReactNode
  /** Redirect path when already authenticated */
  redirectTo?: string
}

/** Wraps auth pages (login, signup) - redirects to dashboard if already logged in */
export function GuestRoute({ children, redirectTo = '/dashboard' }: GuestRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-primary/30" aria-hidden />
      </div>
    )
  }

  if (user) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
