import { Activity, AlertCircle, RefreshCw } from 'lucide-react'
import type { AuditLogEntry } from '@/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface AuditTrailPanelProps {
  logs: AuditLogEntry[]
  isLoading?: boolean
  error?: Error | null
  onRetry?: () => void
  /** Optional callback for empty state CTA (e.g. refresh to check for new events) */
  onRefresh?: () => void
}

const ICON_SIZE_EMPTY_ERROR = 'h-10 w-10'
const ICON_SIZE_INLINE = 'h-4 w-4'

export function AuditTrailPanel({
  logs,
  isLoading = false,
  error = null,
  onRetry,
  onRefresh,
}: AuditTrailPanelProps) {
  if (isLoading) {
    return (
      <Card className="flex-1 mt-6">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-full rounded-md" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="flex-1 mt-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Audit Trail</h2>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center py-8 text-center"
            role="alert"
          >
            <AlertCircle
              className={cn(ICON_SIZE_EMPTY_ERROR, 'text-notification mb-4')}
              aria-hidden
            />
            <p className="text-sm font-medium text-notification mb-2">
              Failed to load audit trail
            </p>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              {error.message}
            </p>
            {onRetry && (
              <Button onClick={onRetry} variant="default" size="default">
                Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (logs.length === 0) {
    return (
      <Card className="flex-1 mt-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Audit Trail</h2>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center min-h-[12rem] py-8 text-center"
            role="status"
          >
            <Activity
              className={cn(ICON_SIZE_EMPTY_ERROR, 'text-muted-foreground mb-4')}
              aria-hidden
            />
            <p className="text-lg font-semibold text-foreground mt-2">
              No audit events
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Webhook deliveries and actions will appear here
            </p>
            {onRefresh && (
              <Button
                onClick={onRefresh}
                variant="secondary"
                size="default"
                className="mt-6"
              >
                <RefreshCw className={cn(ICON_SIZE_INLINE, 'mr-2')} />
                Refresh
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex-1 mt-6">
      <CardHeader>
        <h2 className="text-xl font-semibold">Audit Trail</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="text-xs text-muted-foreground shrink-0">
                {new Date(log.timestamp).toLocaleString()}
              </span>
              <span>{log.action}</span>
              {log.details && (
                <span className="text-muted-foreground truncate">
                  — {log.details}
                </span>
              )}
              {log.isRetry && (
                <Badge
                  variant="default"
                  className="shrink-0 bg-notification text-background border-0"
                >
                  Retry
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
