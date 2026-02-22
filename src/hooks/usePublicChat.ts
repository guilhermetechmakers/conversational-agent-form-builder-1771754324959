import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAgentBySlug } from '@/api/agents'
import {
  createPublicSession,
  sendChatMessage,
  endPublicSession,
} from '@/api/public-chat'
import type { Agent, Message } from '@/types'

export const publicChatKeys = {
  agentBySlug: (slug: string) => ['public-chat', 'agent', slug] as const,
}

export function useAgentBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: publicChatKeys.agentBySlug(slug ?? ''),
    queryFn: () => fetchAgentBySlug(slug!),
    enabled: !!slug && slug.length > 0,
  })
}

export function useCreatePublicSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPublicSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-chat'] })
    },
  })
}

export function useSendChatMessage() {
  return useMutation({
    mutationFn: sendChatMessage,
  })
}

export function useEndPublicSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: endPublicSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-chat'] })
    },
  })
}

export function getWelcomeMessage(agent: Agent): Message {
  const firstField = agent.fields?.[0]
  const prompt = firstField
    ? `Hi! I'm ${agent.name}. I'll help you provide the information we need. ${firstField.label || "What's your name?"}`
    : `Hi! I'm ${agent.name}. How can I help you today?`
  return {
    id: crypto.randomUUID(),
    sender: 'assistant',
    content: prompt,
    timestamp: new Date().toISOString(),
  }
}
