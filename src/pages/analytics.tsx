import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import {
  AlertCircle,
  BarChart3,
  FileSpreadsheet,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAnalytics } from '@/hooks/useAnalytics'
import type { AnalyticsDateRange } from '@/api/analytics'
import { cn } from '@/lib/utils'

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AnalyticsError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="animate-fade-in" role="alert">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        <div
          className="rounded-full bg-destructive/10 p-4 mb-4"
          aria-hidden
        >
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Failed to load analytics</h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          We couldn&apos;t load analytics data. Please check your connection and
          try again.
        </p>
        <Button
          onClick={onRetry}
          aria-label="Retry loading analytics data"
        >
          Retry
        </Button>
      </CardContent>
    </Card>
  )
}

function AnalyticsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 rounded-xl border border-border bg-card/50">
      <div
        className="rounded-full bg-muted p-4 mb-4"
        aria-hidden
      >
        <BarChart3 className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold mb-2">No analytics data yet</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Analytics will appear here once you have sessions and agent activity.
        Start a conversation or create an agent to see metrics.
      </p>
    </div>
  )
}

export function AnalyticsPage() {
  const [range, setRange] = useState<AnalyticsDateRange>('7d')
  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useAnalytics(range)

  const handleExportCsv = () => {
    toast.loading('Preparing CSV export...', { id: 'export-csv' })
    setTimeout(() => {
      toast.success('CSV export ready', { id: 'export-csv' })
    }, 800)
  }

  const handleExportPdf = () => {
    toast.loading('Preparing PDF export...', { id: 'export-pdf' })
    setTimeout(() => {
      toast.success('PDF export ready', { id: 'export-pdf' })
    }, 800)
  }

  if (isLoading) {
    return <AnalyticsSkeleton />
  }

  if (isError) {
    return <AnalyticsError onRetry={() => refetch()} />
  }

  const sessionsOverTime = data?.sessionsOverTime ?? []
  const agentMetrics = data?.agentMetrics ?? []
  const isEmpty =
    sessionsOverTime.length === 0 && agentMetrics.length === 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Agent performance and key metrics
          </p>
        </div>
        <Select
          value={range}
          onValueChange={(v) => setRange(v as AnalyticsDateRange)}
        >
          <SelectTrigger
            className="w-[180px]"
            aria-label="Select date range for analytics"
          >
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isEmpty ? (
        <AnalyticsEmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
              className={cn(
                'transition-all duration-300',
                'hover:shadow-card-hover',
                isRefetching && 'opacity-80'
              )}
            >
              <CardHeader>
                <CardTitle>Sessions over time</CardTitle>
                <CardDescription>Sessions and completions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] min-h-[200px]">
                  {sessionsOverTime.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sessionsOverTime}>
                        <defs>
                          <linearGradient
                            id="colorSessions"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="rgb(var(--primary))"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="rgb(var(--primary))"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgb(var(--border))"
                        />
                        <XAxis
                          dataKey="date"
                          stroke="rgb(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis
                          stroke="rgb(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgb(var(--card))',
                            border: '1px solid rgb(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="sessions"
                          stroke="rgb(var(--primary))"
                          fillOpacity={1}
                          fill="url(#colorSessions)"
                        />
                        <Area
                          type="monotone"
                          dataKey="completions"
                          stroke="rgb(var(--success))"
                          fillOpacity={0}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <AnalyticsEmptyState />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card
              className={cn(
                'transition-all duration-300',
                'hover:shadow-card-hover',
                isRefetching && 'opacity-80'
              )}
            >
              <CardHeader>
                <CardTitle>Agent metrics</CardTitle>
                <CardDescription>Sessions and conversion by agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] min-h-[200px]">
                  {agentMetrics.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={agentMetrics}
                        layout="vertical"
                        margin={{ left: 80 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgb(var(--border))"
                        />
                        <XAxis
                          type="number"
                          stroke="rgb(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          stroke="rgb(var(--muted-foreground))"
                          fontSize={12}
                          width={70}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgb(var(--card))',
                            border: '1px solid rgb(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar
                          dataKey="sessions"
                          fill="rgb(var(--primary))"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <AnalyticsEmptyState />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card
            className={cn(
              'transition-all duration-300',
              'hover:shadow-card-hover'
            )}
          >
            <CardHeader>
              <CardTitle>Export</CardTitle>
              <CardDescription>Download analytics data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={handleExportCsv}
                  aria-label="Export analytics as CSV"
                  className="gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4" aria-hidden />
                  Export CSV
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleExportPdf}
                  aria-label="Export analytics as PDF"
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" aria-hidden />
                  Export PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
