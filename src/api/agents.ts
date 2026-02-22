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
