import { Link } from 'react-router-dom'
import { User, Globe, Monitor, Users } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export interface VisitorInfo {
  ip?: string
  userAgent?: string
  referrer?: string
  sessionCount?: number
}

export interface EmptyStateCta {
  label: string
  to?: string
  onClick?: () => void
}

const DEFAULT_EMPTY_CTA: EmptyStateCta = {
  label: 'View all sessions',
  to: '/dashboard/sessions',
}

export interface RelatedSessionsPanelProps {
  visitorInfo?: VisitorInfo
  relatedSessionIds?: string[]
  /** Optional CTA for empty state (e.g. view sessions, refresh) */
  emptyStateCta?: EmptyStateCta
}

export function RelatedSessionsPanel({
  visitorInfo,
  relatedSessionIds = [],
  emptyStateCta = DEFAULT_EMPTY_CTA,
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
            className="flex flex-col items-center justify-center min-h-[12rem] py-8 px-4 text-center rounded-lg border border-dashed border-border bg-muted/30"
            role="status"
            aria-label="No visitor data"
          >
            <User className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
            <p className="text-lg font-semibold text-foreground">
              No visitor data
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Visitor metadata will appear when available. Check back later or
              browse other sessions.
            </p>
            {emptyStateCta.to ? (
              <Button asChild className="mt-6" size="default" variant="secondary">
                <Link to={emptyStateCta.to} className="gap-2">
                  <Users className="h-4 w-4" aria-hidden />
                  {emptyStateCta.label}
                </Link>
              </Button>
            ) : emptyStateCta.onClick ? (
              <Button
                className="mt-6 gap-2"
                size="default"
                variant="secondary"
                onClick={emptyStateCta.onClick}
                aria-label={emptyStateCta.label}
              >
                <Users className="h-4 w-4" aria-hidden />
                {emptyStateCta.label}
              </Button>
            ) : (
              <Button asChild className="mt-6" size="default" variant="secondary">
                <Link to="/dashboard/sessions" className="gap-2">
                  <Users className="h-4 w-4" aria-hidden />
                  {emptyStateCta.label}
                </Link>
              </Button>
            )}
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
