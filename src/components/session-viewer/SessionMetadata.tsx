import { Calendar, Monitor, Globe, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface SessionMetadataProps {
  status: 'active' | 'completed' | 'abandoned'
  createdAt: string
  completedAt?: string
  reviewedAt?: string
  visitorMetadata?: {
    ip?: string
    userAgent?: string
    referrer?: string
  }
}

export function SessionMetadata({
  status,
  createdAt,
  completedAt,
  reviewedAt,
  visitorMetadata,
}: SessionMetadataProps) {
  const statusVariant = {
    completed: 'bg-[rgb(var(--success))]/20 text-[rgb(var(--success))]',
    active: 'bg-primary/20 text-primary',
    abandoned: 'bg-muted text-muted-foreground',
  }[status]

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Session Metadata</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge className={cn('font-medium', statusVariant)}>{status}</Badge>
          {reviewedAt && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Reviewed
            </Badge>
          )}
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>Started: {new Date(createdAt).toLocaleString()}</span>
          </div>
          {completedAt && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>Completed: {new Date(completedAt).toLocaleString()}</span>
            </div>
          )}
        </div>

        {visitorMetadata && (visitorMetadata.ip || visitorMetadata.referrer) && (
          <div className="pt-4 border-t border-border space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Visitor Info
            </p>
            {visitorMetadata.ip && (
              <div className="flex items-center gap-2 text-sm">
                <Monitor className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-mono text-xs truncate" title={visitorMetadata.ip}>
                  IP: {visitorMetadata.ip}
                </span>
              </div>
            )}
            {visitorMetadata.referrer && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-xs truncate max-w-[200px]" title={visitorMetadata.referrer}>
                  Referrer: {visitorMetadata.referrer}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
