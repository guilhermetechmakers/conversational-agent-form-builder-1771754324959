import { MessageSquare, TrendingUp, Bot, Target } from 'lucide-react'
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
    gradient: 'from-[rgb(var(--success))]/20 to-[rgb(var(--success))]/5',
    trendUp: true,
  },
  {
    key: 'conversionRate' as const,
    label: 'Conversion Rate',
    icon: Target,
    gradient: 'from-primary/20 to-[rgb(var(--success))]/10',
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
  className,
}: QuickStatsPanelProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
          className
        )}
      >
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
        className
      )}
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
              `bg-gradient-to-br ${config.gradient}`
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {config.label}
              </span>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{display}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
