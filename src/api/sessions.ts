import { api } from '@/lib/api'
import type { Session } from '@/types'

export interface SessionRecord {
  id: string
  agentId: string
  agentName?: string | null
  status: string
  messages: unknown[]
  capturedFields: unknown[]
  visitorMetadata?: Record<string, unknown>
  reviewedAt?: string | null
  notes?: string | null
  createdAt: string
  completedAt?: string | null
}

function recordToSession(r: SessionRecord): Session {
  return {
    id: r.id,
    agentId: r.agentId,
    agentName: r.agentName ?? undefined,
    status: r.status as Session['status'],
    messages: (r.messages ?? []) as Session['messages'],
    capturedFields: (r.capturedFields ?? []) as Session['capturedFields'],
    visitorMetadata: r.visitorMetadata as Session['visitorMetadata'],
    reviewedAt: r.reviewedAt ?? undefined,
    notes: r.notes ?? undefined,
    createdAt: r.createdAt,
    completedAt: r.completedAt ?? undefined,
  }
}

export async function fetchSession(id: string): Promise<Session> {
  const r = await api.get<SessionRecord>(`/sessions/${id}`)
  return recordToSession(r)
}

export async function markSessionReviewed(
  sessionId: string,
  notes?: string
): Promise<void> {
  await api.post(`/sessions/${sessionId}/mark-reviewed`, { sessionId, notes })
}

export async function resendSessionWebhook(sessionId: string): Promise<{
  success: boolean
  sent: number
  failed: number
}> {
  return api.post(`/sessions/${sessionId}/resend-webhook`, { sessionId })
}

export interface ListSessionsParams {
  agentId?: string
  status?: 'active' | 'completed' | 'abandoned'
  from?: string
  to?: string
  limit?: number
  offset?: number
}

export interface ListSessionsResponse {
  sessions: SessionRecord[]
  total: number
}

export async function listSessions(params?: ListSessionsParams): Promise<ListSessionsResponse> {
  const searchParams = new URLSearchParams()
  if (params?.agentId) searchParams.set('agentId', params.agentId)
  if (params?.status) searchParams.set('status', params.status)
  if (params?.from) searchParams.set('from', params.from)
  if (params?.to) searchParams.set('to', params.to)
  if (params?.limit) searchParams.set('limit', String(params.limit))
  if (params?.offset) searchParams.set('offset', String(params.offset))
  const query = searchParams.toString()
  const r = await api.get<{ sessions: SessionRecord[]; total: number }>(
    `/sessions${query ? `?${query}` : ''}`
  )
  return {
    sessions: r.sessions ?? [],
    total: r.total ?? 0,
  }
}
