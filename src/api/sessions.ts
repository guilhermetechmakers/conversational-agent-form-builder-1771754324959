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
