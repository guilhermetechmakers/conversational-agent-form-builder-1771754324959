import { useState, useCallback } from 'react'
import {
  AgentList,
  QuickStatsPanel,
  RecentSessionsFeed,
  CreateAgentCTA,
  PaginationFilters,
  type DashboardStats,
} from '@/components/dashboard'
import {
  useDashboardStats,
  useDashboardAgents,
  useDashboardSessions,
} from '@/hooks/useDashboard'
import { toast } from 'sonner'
import { deleteAgent } from '@/api/agents'
import { useQueryClient } from '@tanstack/react-query'
import { agentKeys } from '@/hooks/useAgent'
import { dashboardKeys } from '@/hooks/useDashboard'

const PAGE_SIZE = 5

export function DashboardPage() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [agentsPage, setAgentsPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)

  const filters = {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    dateRange:
      dateFrom || dateTo
        ? { from: dateFrom || new Date(0).toISOString(), to: dateTo || new Date().toISOString() }
        : undefined,
  }

  const { data: statsData, isLoading: statsLoading } = useDashboardStats()
  const { data: agentsData, isLoading: agentsLoading } = useDashboardAgents(
    filters,
    agentsPage,
    pageSize
  )
  const { data: sessionsData, isLoading: sessionsLoading } = useDashboardSessions(
    filters,
    1,
    5
  )

  const stats: DashboardStats | undefined = statsData
  const agents = agentsData?.agents ?? []
  const agentsTotal = agentsData?.total ?? 0
  const agentsTotalPages = Math.ceil(agentsTotal / pageSize) || 1
  const sessions = sessionsData?.sessions ?? []

  const handleDeleteAgent = useCallback(
    async (agent: { id: string; name: string }) => {
      if (!confirm(`Delete agent "${agent.name}"? This cannot be undone.`)) return
      try {
        await deleteAgent(agent.id)
        queryClient.invalidateQueries({ queryKey: agentKeys.all })
        queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
        toast.success('Agent deleted')
      } catch {
        toast.error('Failed to delete agent')
      }
    },
    [queryClient]
  )

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your agents and sessions
        </p>
      </div>

      <QuickStatsPanel stats={stats} isLoading={statsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AgentList
          agents={agents}
          isLoading={agentsLoading}
          onDelete={handleDeleteAgent}
        />
        <RecentSessionsFeed
          sessions={sessions}
          isLoading={sessionsLoading}
        />
      </div>

      {agentsTotal > 0 && (
        <PaginationFilters
          status={statusFilter}
          onStatusChange={setStatusFilter}
          dateFrom={dateFrom || undefined}
          dateTo={dateTo || undefined}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          page={agentsPage}
          totalPages={agentsTotalPages}
          totalItems={agentsTotal}
          onPageChange={setAgentsPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
      )}

      <CreateAgentCTA />
    </div>
  )
}
