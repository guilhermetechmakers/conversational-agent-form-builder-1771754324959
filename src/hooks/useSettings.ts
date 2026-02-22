import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  fetchProfile,
  updateProfile,
  fetchTeamMembers,
  fetchSubscription,
  fetchWebhooks,
  createWebhook,
  deleteWebhook,
  fetchApiKeys,
  createApiKey,
  revokeApiKey,
  fetchBrandingDefaults,
  updateBrandingDefaults,
  fetchRetentionPolicy,
  updateRetentionPolicy,
} from '@/api/settings'
import type { BrandingDefaults, RetentionPolicy } from '@/types/settings'

export const settingsKeys = {
  all: ['settings'] as const,
  profile: () => [...settingsKeys.all, 'profile'] as const,
  team: () => [...settingsKeys.all, 'team'] as const,
  billing: () => [...settingsKeys.all, 'billing'] as const,
  webhooks: () => [...settingsKeys.all, 'webhooks'] as const,
  apiKeys: () => [...settingsKeys.all, 'api-keys'] as const,
  branding: () => [...settingsKeys.all, 'branding'] as const,
  retention: () => [...settingsKeys.all, 'retention'] as const,
}

export function useProfile() {
  return useQuery({
    queryKey: settingsKeys.profile(),
    queryFn: fetchProfile,
    retry: false,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.profile() })
    },
  })
}

export function useTeamMembers() {
  return useQuery({
    queryKey: settingsKeys.team(),
    queryFn: fetchTeamMembers,
    retry: false,
  })
}

export function useSubscription() {
  return useQuery({
    queryKey: settingsKeys.billing(),
    queryFn: fetchSubscription,
    retry: false,
  })
}

export function useWebhooks() {
  return useQuery({
    queryKey: settingsKeys.webhooks(),
    queryFn: fetchWebhooks,
    retry: false,
  })
}

export function useCreateWebhook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ url, events }: { url: string; events: string[] }) =>
      createWebhook(url, events),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.webhooks() })
    },
  })
}

export function useDeleteWebhook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteWebhook,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.webhooks() })
    },
  })
}

export function useApiKeys() {
  return useQuery({
    queryKey: settingsKeys.apiKeys(),
    queryFn: fetchApiKeys,
    retry: false,
  })
}

export function useCreateApiKey() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createApiKey(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.apiKeys() })
    },
  })
}

export function useRevokeApiKey() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: revokeApiKey,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.apiKeys() })
    },
  })
}

export function useBrandingDefaults() {
  return useQuery({
    queryKey: settingsKeys.branding(),
    queryFn: fetchBrandingDefaults,
    retry: false,
  })
}

export function useUpdateBrandingDefaults() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: BrandingDefaults) => updateBrandingDefaults(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.branding() })
    },
  })
}

export function useRetentionPolicy() {
  return useQuery({
    queryKey: settingsKeys.retention(),
    queryFn: fetchRetentionPolicy,
    retry: false,
  })
}

export function useUpdateRetentionPolicy() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: RetentionPolicy) => updateRetentionPolicy(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.retention() })
    },
  })
}
