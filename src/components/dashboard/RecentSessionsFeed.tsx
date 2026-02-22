import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
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
  className?: string
}

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
  className,
}: RecentSessionsFeedProps) {
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
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <MessageSquare className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No sessions yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Sessions will appear here when visitors interact with your agents.
            </p>
            <Button
              variant="outline"
              asChild
              aria-label="View all sessions"
            >
              <Link to="/dashboard/sessions">View all sessions</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
        <CardDescription>Latest activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sessions.map((session) => (
            <Link
              key={session.id}
              to={`/dashboard/sessions/${session.id}`}
              className="flex items-center justify-between rounded-lg border border-border p-3 transition-all duration-200 hover:border-primary/50 hover:shadow-card"
            >
              <div>
                <p className="font-medium text-sm">{session.agentName ?? 'Unknown Agent'}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTimeAgo(session.createdAt)}
                </p>
              </div>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  session.status === 'completed' &&
                    'bg-success/20 text-success',
                  session.status === 'active' && 'bg-primary/20 text-primary',
                  session.status === 'abandoned' && 'bg-muted text-muted-foreground'
                )}
              >
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
