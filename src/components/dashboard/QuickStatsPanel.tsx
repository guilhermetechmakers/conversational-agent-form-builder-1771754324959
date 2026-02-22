import {
  MessageSquare,
  TrendingUp,
  Bot,
  Target,
  BarChart3,
  AlertCircle,
} from 'lucide-react'
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
  },
  {
    key: 'completions' as const,
    label: 'Completions',
    icon: TrendingUp,
  },
  {
    key: 'conversionRate' as const,
    label: 'Conversion Rate',
    icon: Target,
    format: (v: number) => `${v}%`,
  },
  {
    key: 'activeAgents' as const,
    label: 'Active Agents',
    icon: Bot,
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
          'bg-card rounded-lg shadow-md p-6 flex flex-col gap-4',
          className
        )}
        role="status"
        aria-label="Loading dashboard statistics"
      >
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between items-center animate-pulse">
            <Skeleton className="h-4 w-24 bg-muted rounded" />
            <Skeleton className="h-6 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={cn(
          'bg-[#FFD600] text-[#181B20] p-4 rounded-lg',
          className
        )}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
          <div>
            <p className="font-medium">Failed to load statistics</p>
            <p className="text-sm mt-1 opacity-90">{error}</p>
          </div>
        </div>
      </div>
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
      <div
        className={cn(
          'bg-card rounded-lg shadow-md p-6 flex flex-col items-center justify-center gap-4 min-h-[200px]',
          className
        )}
        role="status"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <BarChart3 className="h-6 w-6 text-muted-foreground" aria-hidden />
        </div>
        <div className="space-y-1 text-center">
          <h3 className="text-base font-semibold text-foreground">
            No statistics yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Create agents and start sessions to see your dashboard metrics here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'bg-card rounded-lg shadow-md p-6 flex flex-col gap-4',
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
          <div
            key={config.key}
            className="flex justify-between items-center"
            role="article"
            aria-label={`${config.label}: ${display}`}
          >
            <span className="text-muted-foreground flex items-center gap-2">
              <Icon className="h-4 w-4 text-primary shrink-0" aria-hidden />
              {config.label}
            </span>
            <span className="text-foreground font-semibold tabular-nums">
              {display}
            </span>
          </div>
        )
      })}
    </div>
  )
}
