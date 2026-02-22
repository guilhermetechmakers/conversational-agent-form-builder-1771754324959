import { api } from '@/lib/api'

export type AnalyticsDateRange = '7d' | '30d' | '90d'

export interface SessionsOverTimePoint {
  date: string
  sessions: number
  completions: number
}

export interface AgentMetric {
  name: string
  sessions: number
  conversion: number
}

export interface AnalyticsData {
  sessionsOverTime: SessionsOverTimePoint[]
  agentMetrics: AgentMetric[]
}

const MOCK_SESSIONS: SessionsOverTimePoint[] = [
  { date: 'Feb 16', sessions: 120, completions: 85 },
  { date: 'Feb 17', sessions: 145, completions: 102 },
  { date: 'Feb 18', sessions: 98, completions: 72 },
  { date: 'Feb 19', sessions: 167, completions: 118 },
  { date: 'Feb 20', sessions: 134, completions: 95 },
  { date: 'Feb 21', sessions: 189, completions: 142 },
  { date: 'Feb 22', sessions: 156, completions: 112 },
]

const MOCK_AGENT_METRICS: AgentMetric[] = [
  { name: 'Lead Capture', sessions: 456, conversion: 72 },
  { name: 'Support Qualifier', sessions: 312, conversion: 68 },
  { name: 'Event Registration', sessions: 89, conversion: 45 },
]

export async function fetchAnalytics(
  range: AnalyticsDateRange = '7d'
): Promise<AnalyticsData> {
  const params = new URLSearchParams({ range })
  const response = await api.get<AnalyticsData>(`/analytics?${params}`)
  return response
}

export async function fetchAnalyticsWithFallback(
  range: AnalyticsDateRange = '7d',
  onApiError?: (err: unknown) => void
): Promise<AnalyticsData> {
  try {
    return await fetchAnalytics(range)
  } catch (err) {
    onApiError?.(err)
    return {
      sessionsOverTime: MOCK_SESSIONS,
      agentMetrics: MOCK_AGENT_METRICS,
    }
  }
}
