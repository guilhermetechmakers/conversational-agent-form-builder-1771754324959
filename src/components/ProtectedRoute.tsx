import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { hasRoleOrAbove } from '@/constants/rbac'
import type { AuthRole } from '@/types/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  /** Minimum role required (default: viewer) */
  requiredRole?: AuthRole
  /** Redirect path when unauthenticated */
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requiredRole = 'viewer',
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div
        className="flex min-h-[50vh] items-center justify-center p-4"
        role="status"
        aria-live="polite"
        aria-label="Checking authentication status"
      >
        <Loader2
          className="h-8 w-8 animate-spin text-primary"
          aria-hidden
        />
        <span className="sr-only">Loading authentication</span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (!hasRoleOrAbove(user.role, requiredRole)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
