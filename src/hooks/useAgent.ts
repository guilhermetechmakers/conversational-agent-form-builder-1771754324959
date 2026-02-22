import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAgent,
  saveAgent,
  publishAgent,
  type AgentPayload,
} from '@/api/agents'

export const agentKeys = {
  all: ['agents'] as const,
  list: () => [...agentKeys.all, 'list'] as const,
  detail: (id: string) => [...agentKeys.all, 'detail', id] as const,
}

export function useAgent(id: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: agentKeys.detail(id ?? ''),
    queryFn: () => fetchAgent(id!),
    enabled: enabled && !!id && id !== 'new',
  })
}

export function useSaveAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: AgentPayload }) =>
      saveAgent(id, payload),
    onSuccess: (agent) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.all })
      queryClient.setQueryData(agentKeys.detail(agent.id), agent)
    },
  })
}

export function usePublishAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => publishAgent(id),
    onSuccess: (agent) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.all })
      queryClient.setQueryData(agentKeys.detail(agent.id), agent)
    },
  })
}
