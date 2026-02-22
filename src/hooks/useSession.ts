import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchSession,
  markSessionReviewed,
  resendSessionWebhook,
} from '@/api/sessions'

export const sessionKeys = {
  all: ['sessions'] as const,
  detail: (id: string) => [...sessionKeys.all, 'detail', id] as const,
}

export function useSession(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: sessionKeys.detail(id ?? ''),
    queryFn: () => fetchSession(id!),
    enabled: enabled && !!id,
  })
}

export function useMarkSessionReviewed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ sessionId, notes }: { sessionId: string; notes?: string }) =>
      markSessionReviewed(sessionId, notes),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(sessionId) })
    },
  })
}

export function useResendSessionWebhook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) => resendSessionWebhook(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(sessionId) })
    },
  })
}
