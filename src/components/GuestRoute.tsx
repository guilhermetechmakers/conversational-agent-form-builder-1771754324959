import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

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
      <div
        className="flex min-h-[50vh] w-full items-center justify-center p-4"
        role="status"
        aria-live="polite"
        aria-label="Checking authentication status"
      >
        <Card className="w-full max-w-md overflow-hidden">
          <CardHeader className="space-y-2 pb-4">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="flex items-center justify-center gap-2 pt-4">
              <Loader2
                className="h-5 w-5 animate-spin text-primary"
                aria-hidden
              />
              <span className="sr-only">Loading authentication</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (user) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
