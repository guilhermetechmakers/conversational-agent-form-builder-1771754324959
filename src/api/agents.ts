import { api } from '@/lib/api'
import type { Agent, AgentField } from '@/types'

export interface AgentPayload {
  name: string
  slug: string
  description?: string
  tags?: string[]
  fields: AgentField[]
  persona: {
    tone: string
    systemInstructions: string
    avatarUrl?: string
  }
  appearance: {
    primaryColor: string
    accentColor: string
    theme: 'light' | 'dark'
    logoUrl?: string
  }
  context?: {
    faq?: string
    files?: string[]
    urls?: string[]
  }
  advanced?: {
    webhookUrls?: string[]
    passcodeEnabled?: boolean
    passcode?: string
    rateLimit?: number
    retentionDays?: number
  }
}

export interface AgentRecord {
  id: string
  user_id: string
  title: string
  slug: string
  description: string | null
  tags: string[]
  fields: AgentField[]
  persona: Record<string, unknown>
  appearance: Record<string, unknown>
  context: Record<string, unknown>
  advanced: Record<string, unknown>
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

function recordToAgent(r: AgentRecord): Agent {
  const persona = r.persona as Agent['persona']
  const appearance = r.appearance as Agent['appearance']
  const context = r.context as Agent['context']
  const advanced = r.advanced as Agent['advanced']
  return {
    id: r.id,
    name: r.title,
    slug: r.slug,
    description: r.description ?? undefined,
    tags: r.tags ?? [],
    fields: r.fields ?? [],
    persona: persona ?? { tone: 'friendly', systemInstructions: '' },
    appearance: appearance ?? {
      primaryColor: '#26C6FF',
      accentColor: '#00FF66',
      theme: 'dark',
    },
    context,
    advanced,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

function payloadToBody(payload: AgentPayload): Record<string, unknown> {
  return {
    title: payload.name,
    slug: payload.slug,
    description: payload.description ?? null,
    tags: payload.tags ?? [],
    fields: payload.fields,
    persona: payload.persona,
    appearance: payload.appearance,
    context: payload.context ?? {},
    advanced: payload.advanced ?? {},
  }
}

export async function fetchAgent(id: string): Promise<Agent> {
  const r = await api.get<AgentRecord>(`/agents/${id}`)
  return recordToAgent(r)
}

export async function createAgent(payload: AgentPayload): Promise<Agent> {
  const r = await api.post<AgentRecord>('/agents', payloadToBody(payload))
  return recordToAgent(r)
}

export async function updateAgent(id: string, payload: AgentPayload): Promise<Agent> {
  const r = await api.patch<AgentRecord>(`/agents/${id}`, payloadToBody(payload))
  return recordToAgent(r)
}

export async function saveAgent(id: string | null, payload: AgentPayload): Promise<Agent> {
  if (id && id !== 'new') {
    return updateAgent(id, payload)
  }
  return createAgent(payload)
}

export async function publishAgent(id: string): Promise<Agent> {
  const r = await api.post<AgentRecord>(`/agents/${id}/publish`)
  return recordToAgent(r)
}

export interface AgentListItem extends Agent {
  sessionsCount: number
  conversionRate: number
}

export interface ListAgentsParams {
  status?: 'draft' | 'published'
  tags?: string[]
  search?: string
  limit?: number
  offset?: number
}

export interface ListAgentsResponse {
  agents: AgentListItem[]
  total: number
}

export async function listAgents(params?: ListAgentsParams): Promise<ListAgentsResponse> {
  const searchParams = new URLSearchParams()
  if (params?.status) searchParams.set('status', params.status)
  if (params?.tags?.length) searchParams.set('tags', params.tags.join(','))
  if (params?.search) searchParams.set('search', params.search)
  if (params?.limit) searchParams.set('limit', String(params.limit))
  if (params?.offset) searchParams.set('offset', String(params.offset))
  const query = searchParams.toString()
  const r = await api.get<{ agents: AgentRecord[]; total: number }>(
    `/agents${query ? `?${query}` : ''}`
  )
  const agents: AgentListItem[] = (r.agents ?? []).map((rec) => {
    const agent = recordToAgent(rec)
    const item = rec as AgentRecord & { sessions_count?: number; conversion_rate?: number }
    return {
      ...agent,
      sessionsCount: item.sessions_count ?? 0,
      conversionRate: item.conversion_rate ?? 0,
    }
  })
  return { agents, total: r.total ?? agents.length }
}

export async function deleteAgent(id: string): Promise<void> {
  await api.delete(`/agents/${id}`)
}
