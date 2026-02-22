import { useQuery } from '@tanstack/react-query'
import {
  fetchDashboardStats,
  fetchDashboardAgents,
  fetchDashboardSessions,
  type DashboardFilters,
} from '@/api/dashboard'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  agents: (filters?: DashboardFilters, page?: number) =>
    [...dashboardKeys.all, 'agents', filters, page] as const,
  sessions: (filters?: DashboardFilters, page?: number) =>
    [...dashboardKeys.all, 'sessions', filters, page] as const,
}

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: fetchDashboardStats,
  })
}

export function useDashboardAgents(
  filters?: DashboardFilters,
  page = 1,
  limit = 10
) {
  return useQuery({
    queryKey: dashboardKeys.agents(filters, page),
    queryFn: () => fetchDashboardAgents(filters, page, limit),
  })
}

export function useDashboardSessions(
  filters?: DashboardFilters,
  page = 1,
  limit = 10
) {
  return useQuery({
    queryKey: dashboardKeys.sessions(filters, page),
    queryFn: () => fetchDashboardSessions(filters, page, limit),
  })
}
