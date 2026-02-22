import { Link } from 'react-router-dom'
import { AlertCircle, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface SessionEntry {
  id: string
  agentId: string
  agentName?: string
  status: string
  createdAt: string
  completedAt?: string
}

export interface RecentSessionsFeedProps {
  sessions?: SessionEntry[]
  isLoading?: boolean
  isError?: boolean
  error?: string
  onRetry?: () => void
  className?: string
}

const EMPTY_STATE_ICON_SIZE = 'h-6 w-6'

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

export function RecentSessionsFeed({
  sessions = [],
  isLoading,
  isError,
  error,
  onRetry,
  className,
}: RecentSessionsFeedProps) {
  if (isError) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>Latest activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in"
            role="alert"
            aria-live="assertive"
          >
            <div className="rounded-full bg-destructive/10 p-4 mb-4">
              <AlertCircle
                className={cn(EMPTY_STATE_ICON_SIZE, 'text-destructive')}
                aria-hidden
              />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">
              Failed to load sessions
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {error ?? 'Something went wrong. Please try again.'}
            </p>
            {onRetry && (
              <Button
                variant="outline"
                onClick={onRetry}
                aria-label="Retry loading sessions"
                className="transition-all duration-200 hover:scale-[1.02]"
              >
                Try again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (sessions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>Latest activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in"
            role="status"
            aria-live="polite"
          >
            <div className="rounded-full bg-primary/10 p-5 mb-6 ring-4 ring-primary/5">
              <MessageSquare
                className={cn(EMPTY_STATE_ICON_SIZE, 'text-primary')}
                aria-hidden
              />
            </div>
            <h3 className="font-semibold text-xl mb-2 text-foreground">
              No sessions yet
            </h3>
            <p className="text-muted-foreground mb-2 max-w-sm text-base leading-relaxed">
              Sessions will appear here when visitors interact with your agents.
            </p>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Create and publish an agent to start collecting conversations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                asChild
                aria-label="Create your first agent to start collecting sessions"
                className="transition-all duration-200 hover:scale-[1.02] hover:shadow-glow"
              >
                <Link to="/dashboard/agents/new">Create your first agent</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                aria-label="View all sessions"
                className="transition-all duration-200 hover:scale-[1.02]"
              >
                <Link to="/dashboard/sessions">View all sessions</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('bg-card rounded-lg shadow-md p-6 flex-1', className)}>
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
        <CardDescription>Latest activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {sessions.map((session) => (
            <Link
              key={session.id}
              to={`/dashboard/sessions/${session.id}`}
              className="flex justify-between items-center py-2 border-b border-border last:border-b-0 transition-all duration-200 hover:bg-muted"
            >
              <div>
                <p className="font-medium text-sm text-foreground">
                  {session.agentName ?? 'Unknown Agent'}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(session.createdAt)}
                </span>
              </div>
              <span className="text-primary text-sm font-medium capitalize">
                {session.status}
              </span>
            </Link>
          ))}
        </div>
        <Button
          variant="ghost"
          className="w-full mt-4"
          asChild
          aria-label="View all sessions"
        >
          <Link to="/dashboard/sessions">View all sessions</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
