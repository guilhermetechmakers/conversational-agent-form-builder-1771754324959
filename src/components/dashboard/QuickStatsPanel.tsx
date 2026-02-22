import {
  MessageSquare,
  TrendingUp,
  Bot,
  Target,
  BarChart3,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface DashboardStats {
  totalSessions: number
  completions: number
  conversionRate: number
  activeAgents: number
}

export interface QuickStatsPanelProps {
  stats?: DashboardStats | null
  isLoading?: boolean
  error?: string | null
  className?: string
}

const statConfig = [
  {
    key: 'totalSessions' as const,
    label: 'Total Sessions',
    icon: MessageSquare,
    gradient: 'from-primary/20 to-primary/5',
    trendUp: true,
  },
  {
    key: 'completions' as const,
    label: 'Completions',
    icon: TrendingUp,
    gradient: 'from-success/20 to-success/5',
    trendUp: true,
  },
  {
    key: 'conversionRate' as const,
    label: 'Conversion Rate',
    icon: Target,
    gradient: 'from-primary/20 to-success/10',
    format: (v: number) => `${v}%`,
  },
  {
    key: 'activeAgents' as const,
    label: 'Active Agents',
    icon: Bot,
    gradient: 'from-accent/20 to-accent/5',
  },
]

export function QuickStatsPanel({
  stats,
  isLoading,
  error,
  className,
}: QuickStatsPanelProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
          className
        )}
        role="status"
        aria-label="Loading dashboard statistics"
      >
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24 animate-pulse" />
              <Skeleton className="h-4 w-4 rounded" aria-hidden />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card
        className={cn(
          'overflow-hidden border-destructive/30 bg-destructive/5',
          className
        )}
        role="alert"
        aria-live="assertive"
      >
        <CardContent className="flex flex-col items-center justify-center gap-4 py-12 px-6">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10"
            aria-hidden
          >
            <AlertCircle
              className="h-6 w-6 text-destructive"
              aria-hidden
            />
          </div>
          <div className="space-y-1 text-center">
            <h3 className="text-base font-semibold text-foreground">
              Failed to load statistics
            </h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const hasNoData =
    !stats ||
    (stats.totalSessions === 0 &&
      stats.completions === 0 &&
      stats.conversionRate === 0 &&
      stats.activeAgents === 0)

  if (hasNoData) {
    return (
      <Card
        className={cn(
          'overflow-hidden border-border',
          className
        )}
        role="status"
      >
        <CardContent className="flex flex-col items-center justify-center gap-4 py-12 px-6">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-muted"
            aria-hidden
          >
            <BarChart3
              className="h-6 w-6 text-muted-foreground"
              aria-hidden
            />
          </div>
          <div className="space-y-1 text-center">
            <h3 className="text-base font-semibold text-foreground">
              No statistics yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Create agents and start sessions to see your dashboard metrics here.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
        className
      )}
      role="region"
      aria-label="Dashboard statistics"
    >
      {statConfig.map((config) => {
        const Icon = config.icon
        const value = stats?.[config.key] ?? 0
        const display =
          config.format && typeof value === 'number'
            ? config.format(value)
            : String(value)
        return (
          <Card
            key={config.key}
            className={cn(
              'overflow-hidden transition-all duration-300',
              'hover:shadow-card-hover hover:scale-[1.02]',
              'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
              `bg-gradient-to-br ${config.gradient}`
            )}
            role="article"
            aria-label={`${config.label}: ${display}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {config.label}
              </span>
              <Icon
                className="h-4 w-4 text-primary shrink-0"
                aria-hidden
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">{display}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
