import { api } from '@/lib/api'
import type { Message, Session } from '@/types'

export interface CreateSessionPayload {
  agentSlug: string
  passcode?: string
}

export interface CreateSessionResponse {
  sessionId: string
  agentId: string
  agentName: string
  fieldsCount: number
}

export interface SendMessagePayload {
  sessionId: string
  content: string
}

export interface SendMessageResponse {
  assistantMessage: Message
  capturedFields?: Array<{ fieldId: string; validatedValue: unknown }>
  isComplete?: boolean
}

export interface StreamChunk {
  type: 'token' | 'done' | 'error'
  content?: string
  message?: Message
  error?: string
}

export async function createPublicSession(
  payload: CreateSessionPayload
): Promise<CreateSessionResponse> {
  const r = await api.post<CreateSessionResponse>('/chat/sessions', payload)
  return r
}

export async function sendChatMessage(
  payload: SendMessagePayload
): Promise<SendMessageResponse> {
  const r = await api.post<SendMessageResponse>('/chat/messages', payload)
  return r
}

export async function fetchPublicSession(sessionId: string): Promise<Session> {
  const r = await api.get<Session>(`/chat/sessions/${sessionId}`)
  return r
}

export async function endPublicSession(sessionId: string): Promise<void> {
  await api.post(`/chat/sessions/${sessionId}/end`)
}
