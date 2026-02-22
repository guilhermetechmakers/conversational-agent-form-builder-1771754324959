import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { hasRoleOrAbove } from '@/constants/rbac'
import type { AuthRole } from '@/types/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ProtectedRouteProps {
  children: React.ReactNode
  /** Minimum role required (default: viewer) */
  requiredRole?: AuthRole
  /** Redirect path when unauthenticated */
  redirectTo?: string
}

const LOADING_LABEL_ID = 'protected-route-loading-label'

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
        className={cn(
          'flex min-h-[50vh] w-full items-center justify-center',
          'bg-background p-4 sm:p-6 md:p-8'
        )}
      >
        <Card
          className="w-full max-w-sm overflow-hidden border-border"
          role="status"
          aria-live="polite"
          aria-labelledby={LOADING_LABEL_ID}
          aria-busy="true"
        >
          <CardContent className="flex flex-col items-center gap-6 p-8 pt-8">
            <div className="flex flex-col items-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <Skeleton className="absolute inset-0 h-16 w-16 rounded-full skeleton-shimmer" />
                <Loader2
                  className="relative h-8 w-8 animate-spin text-primary"
                  aria-hidden
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-5 w-32 skeleton-shimmer" />
                <Skeleton className="h-4 w-48 skeleton-shimmer" />
              </div>
            </div>
            <span
              id={LOADING_LABEL_ID}
              className="sr-only"
            >
              Checking authentication and access permissions. Please wait.
            </span>
          </CardContent>
        </Card>
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
