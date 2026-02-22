import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  MessageSquare,
  RefreshCw,
  Search,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useListSessions } from '@/hooks/useSession'
import type { SessionRecord } from '@/api/sessions'

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

function SessionListSkeleton() {
  return (
    <div className="space-y-2" role="status" aria-label="Loading sessions">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-border p-4"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
      <span className="sr-only">Loading sessions list</span>
    </div>
  )
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <div className="rounded-full bg-muted p-4 mb-4">
        <MessageSquare
          className="h-10 w-10 text-muted-foreground"
          aria-hidden
        />
      </div>
      <h3 className="font-semibold text-lg mb-2">No sessions yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Sessions will appear here when visitors interact with your agents.
        Create and publish an agent to start collecting conversations.
      </p>
      <Button variant="outline" asChild>
        <Link
          to="/dashboard/agents"
          aria-label="Go to agents page to create your first agent"
        >
          View agents
        </Link>
      </Button>
    </div>
  )
}

function ErrorState({
  onRetry,
  message,
}: {
  onRetry: () => void
  message?: string
}) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in"
      role="alert"
      aria-live="assertive"
    >
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <AlertCircle
          className="h-10 w-10 text-destructive"
          aria-hidden
        />
      </div>
      <h3 className="font-semibold text-lg mb-2">Failed to load sessions</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {message ?? 'Something went wrong while loading sessions. Please try again.'}
      </p>
      <Button
        variant="outline"
        onClick={onRetry}
        aria-label="Retry loading sessions"
      >
        <RefreshCw className="h-4 w-4 mr-2" aria-hidden />
        Try again
      </Button>
    </div>
  )
}

function SessionRow({ session }: { session: SessionRecord }) {
  return (
    <Link
      to={`/dashboard/sessions/${session.id}`}
      className="flex items-center justify-between rounded-lg border border-border p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`View session ${session.agentName ?? 'Unknown'} - ${session.status} - ${formatTimeAgo(session.createdAt)}`}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <MessageSquare className="h-5 w-5 text-primary" aria-hidden />
        </div>
        <div>
          <p className="font-medium">{session.agentName ?? 'Unknown Agent'}</p>
          <p className="text-sm text-muted-foreground">
            {formatTimeAgo(session.createdAt)}
          </p>
        </div>
      </div>
      <span
        className={cn(
          'rounded-full px-2 py-0.5 text-xs font-medium',
          session.status === 'completed' &&
            'bg-[rgb(var(--success))]/20 text-[rgb(var(--success))]',
          session.status === 'active' && 'bg-primary/20 text-primary',
          session.status === 'abandoned' && 'bg-muted text-muted-foreground'
        )}
      >
        {session.status}
      </span>
    </Link>
  )
}

export function SessionsListPage() {
  const [search, setSearch] = useState('')
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useListSessions({ limit: 50 })

  const sessions = data?.sessions ?? []

  useEffect(() => {
    if (isError && error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to load sessions'
      )
    }
  }, [isError, error])

  const filteredSessions = useMemo(() => {
    if (!search.trim()) return sessions
    const q = search.trim().toLowerCase()
    return sessions.filter(
      (s) =>
        (s.agentName ?? '').toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
    )
  }, [sessions, search])

  const handleRefresh = async () => {
    const result = await refetch()
    if (result.isError) {
      toast.error('Failed to refresh sessions')
    } else {
      toast.success('Sessions refreshed')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Sessions</h1>
          <p className="text-muted-foreground mt-1">
            View and manage conversation sessions
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading || isRefetching}
          aria-label="Refresh sessions list"
        >
          <RefreshCw
            className={cn('h-4 w-4 mr-2', (isLoading || isRefetching) && 'animate-spin')}
            aria-hidden
          />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-full sm:max-w-sm w-full">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden
            />
            <Input
              placeholder="Search sessions..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search sessions by agent name or ID"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SessionListSkeleton />
          ) : isError ? (
            <ErrorState
              onRetry={() => refetch()}
              message={
                error instanceof Error ? error.message : undefined
              }
            />
          ) : filteredSessions.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-2" role="list">
              {filteredSessions.map((session) => (
                <div key={session.id} role="listitem">
                  <SessionRow session={session} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
