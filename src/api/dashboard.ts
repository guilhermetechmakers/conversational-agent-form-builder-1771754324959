import { api } from '@/lib/api'
import type { AgentListItem } from '@/api/agents'

export interface DashboardStats {
  totalSessions: number
  completions: number
  conversionRate: number
  activeAgents: number
}

export interface DashboardAgentsResponse {
  agents: AgentListItem[]
  total: number
}

export interface DashboardSessionsResponse {
  sessions: Array<{
    id: string
    agentId: string
    agentName?: string
    status: string
    createdAt: string
    completedAt?: string
  }>
  total: number
}

export interface DashboardFilters {
  status?: string
  dateRange?: { from: string; to: string }
  tags?: string[]
}

const MOCK_STATS: DashboardStats = {
  totalSessions: 1247,
  completions: 892,
  conversionRate: 71.5,
  activeAgents: 5,
}

const MOCK_AGENTS: AgentListItem[] = [
  {
    id: '1',
    name: 'Lead Capture',
    slug: 'lead-capture',
    sessionsCount: 456,
    conversionRate: 72,
    status: 'published',
    fields: [],
    persona: { tone: 'friendly', systemInstructions: '' },
    appearance: { primaryColor: '#26C6FF', accentColor: '#00FF66', theme: 'dark' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Support Qualifier',
    slug: 'support-qualifier',
    sessionsCount: 312,
    conversionRate: 68,
    status: 'published',
    fields: [],
    persona: { tone: 'friendly', systemInstructions: '' },
    appearance: { primaryColor: '#26C6FF', accentColor: '#00FF66', theme: 'dark' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Event Registration',
    slug: 'event-reg',
    sessionsCount: 0,
    conversionRate: 0,
    status: 'draft',
    fields: [],
    persona: { tone: 'friendly', systemInstructions: '' },
    appearance: { primaryColor: '#26C6FF', accentColor: '#00FF66', theme: 'dark' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const MOCK_SESSIONS: DashboardSessionsResponse['sessions'] = [
  { id: 's1', agentId: '1', agentName: 'Lead Capture', status: 'completed', createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), completedAt: new Date().toISOString() },
  { id: 's2', agentId: '2', agentName: 'Support Qualifier', status: 'active', createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
  { id: 's3', agentId: '1', agentName: 'Lead Capture', status: 'completed', createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(), completedAt: new Date().toISOString() },
  { id: 's4', agentId: '3', agentName: 'Event Registration', status: 'abandoned', createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
]

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const r = await api.get<DashboardStats>('/dashboard/stats')
    return r
  } catch {
    return MOCK_STATS
  }
}

export async function fetchDashboardAgents(
  filters?: DashboardFilters,
  page = 1,
  limit = 10
): Promise<DashboardAgentsResponse> {
  try {
    const params = new URLSearchParams()
    if (filters?.status) params.set('status', filters.status)
    if (filters?.tags?.length) params.set('tags', filters.tags.join(','))
    if (filters?.dateRange?.from) params.set('from', filters.dateRange.from)
    if (filters?.dateRange?.to) params.set('to', filters.dateRange.to)
    params.set('page', String(page))
    params.set('limit', String(limit))
    const r = await api.get<DashboardAgentsResponse>(`/dashboard/agents?${params}`)
    return r
  } catch {
    const start = (page - 1) * limit
    const agents = MOCK_AGENTS.slice(start, start + limit)
    return { agents, total: MOCK_AGENTS.length }
  }
}

export async function fetchDashboardSessions(
  filters?: DashboardFilters,
  page = 1,
  limit = 10
): Promise<DashboardSessionsResponse> {
  try {
    const params = new URLSearchParams()
    if (filters?.status) params.set('status', filters.status)
    if (filters?.dateRange?.from) params.set('from', filters.dateRange.from)
    if (filters?.dateRange?.to) params.set('to', filters.dateRange.to)
    params.set('page', String(page))
    params.set('limit', String(limit))
    const r = await api.get<DashboardSessionsResponse>(`/dashboard/sessions?${params}`)
    return r
  } catch {
    const start = (page - 1) * limit
    const sessions = MOCK_SESSIONS.slice(start, start + limit)
    return { sessions, total: MOCK_SESSIONS.length }
  }
}
