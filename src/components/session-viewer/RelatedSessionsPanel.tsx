import { User, Globe, Monitor } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export interface VisitorInfo {
  ip?: string
  userAgent?: string
  referrer?: string
  sessionCount?: number
}

export interface RelatedSessionsPanelProps {
  visitorInfo?: VisitorInfo
  relatedSessionIds?: string[]
}

export function RelatedSessionsPanel({
  visitorInfo,
  relatedSessionIds = [],
}: RelatedSessionsPanelProps) {
  const hasVisitorInfo =
    visitorInfo &&
    (visitorInfo.ip || visitorInfo.userAgent || visitorInfo.referrer)
  const hasRelatedSessions = relatedSessionIds.length > 0

  if (!hasVisitorInfo && !hasRelatedSessions) {
    return (
      <Card className="flex-1 mt-6">
        <CardHeader>
          <h2 className="text-xl font-semibold leading-none tracking-tight">
            Related Sessions / Visitor Info
          </h2>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center min-h-[12rem] py-8 text-center"
            role="status"
            aria-label="No visitor data"
          >
            <User className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
            <p className="text-lg font-semibold text-foreground">
              No visitor data
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Visitor metadata will appear when available
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const infoItems: { label: string; value: string; icon?: React.ReactNode }[] =
    []

  if (visitorInfo?.ip) {
    infoItems.push({
      label: 'IP Address',
      value: visitorInfo.ip,
      icon: <Monitor className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />,
    })
  }
  if (visitorInfo?.referrer) {
    infoItems.push({
      label: 'Referrer',
      value: visitorInfo.referrer,
      icon: <Globe className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />,
    })
  }
  if (visitorInfo?.sessionCount !== undefined) {
    infoItems.push({
      label: 'Session Count',
      value: String(visitorInfo.sessionCount),
    })
  }
  if (relatedSessionIds.length > 0) {
    infoItems.push({
      label: 'Related Sessions',
      value: relatedSessionIds.join(', '),
    })
  }

  return (
    <Card className="flex-1 mt-6">
      <CardHeader>
        <h2 className="text-xl font-semibold leading-none tracking-tight">
          Related Sessions / Visitor Info
        </h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center gap-4 p-3 rounded-lg bg-background border border-border"
            >
              <div className="flex items-center gap-2 min-w-0">
                {item.icon}
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
              <span
                className="text-sm text-muted-foreground truncate max-w-[200px]"
                title={item.value}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
