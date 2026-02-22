import { api } from '@/lib/api'
import type {
  ProfileUpdate,
  TeamMember,
  Subscription,
  Webhook,
  ApiKey,
  BrandingDefaults,
  RetentionPolicy,
} from '@/types/settings'

/** Fetch current user profile (uses auth context; this is for server-side sync) */
export async function fetchProfile(): Promise<ProfileUpdate | null> {
  try {
    const r = await api.get<{ name: string; email: string; avatarUrl?: string }>('/settings/profile')
    return r
  } catch {
    return null
  }
}

/** Update user profile */
export async function updateProfile(data: ProfileUpdate): Promise<ProfileUpdate> {
  const r = await api.patch<ProfileUpdate>('/settings/profile', data)
  return r
}

/** Fetch team members */
export async function fetchTeamMembers(): Promise<TeamMember[]> {
  try {
    const r = await api.get<{ members: TeamMember[] }>('/settings/team')
    return r.members ?? []
  } catch {
    return []
  }
}

/** Fetch subscription and billing info */
export async function fetchSubscription(): Promise<Subscription | null> {
  try {
    const r = await api.get<Subscription>('/settings/billing/subscription')
    return r
  } catch {
    return null
  }
}

/** Fetch webhooks */
export async function fetchWebhooks(): Promise<Webhook[]> {
  try {
    const r = await api.get<{ webhooks: Webhook[] }>('/settings/webhooks')
    return r.webhooks ?? []
  } catch {
    return []
  }
}

/** Create webhook */
export async function createWebhook(url: string, events: string[]): Promise<Webhook> {
  const r = await api.post<Webhook>('/settings/webhooks', { url, events })
  return r
}

/** Delete webhook */
export async function deleteWebhook(id: string): Promise<void> {
  await api.delete(`/settings/webhooks/${id}`)
}

/** Fetch API keys (masked) */
export async function fetchApiKeys(): Promise<ApiKey[]> {
  try {
    const r = await api.get<{ keys: ApiKey[] }>('/settings/api-keys')
    return r.keys ?? []
  } catch {
    return []
  }
}

/** Create API key (returns full key once; store securely) */
export async function createApiKey(name: string): Promise<{ key: ApiKey; secret: string }> {
  const r = await api.post<{ key: ApiKey; secret: string }>('/settings/api-keys', { name })
  return r
}

/** Revoke API key */
export async function revokeApiKey(id: string): Promise<void> {
  await api.delete(`/settings/api-keys/${id}`)
}

/** Fetch branding defaults */
export async function fetchBrandingDefaults(): Promise<BrandingDefaults | null> {
  try {
    const r = await api.get<BrandingDefaults>('/settings/branding')
    return r
  } catch {
    return null
  }
}

/** Update branding defaults */
export async function updateBrandingDefaults(data: BrandingDefaults): Promise<BrandingDefaults> {
  const r = await api.patch<BrandingDefaults>('/settings/branding', data)
  return r
}

/** Fetch retention policy */
export async function fetchRetentionPolicy(): Promise<RetentionPolicy | null> {
  try {
    const r = await api.get<RetentionPolicy>('/settings/retention')
    return r
  } catch {
    return null
  }
}

/** Update retention policy */
export async function updateRetentionPolicy(data: RetentionPolicy): Promise<RetentionPolicy> {
  const r = await api.patch<RetentionPolicy>('/settings/retention', data)
  return r
}

/** Export session data */
export async function exportSessionData(format: 'json' | 'csv'): Promise<Blob> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL ?? '/api'}/settings/export?format=${format}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token') ?? ''}`,
      },
    }
  )
  if (!res.ok) throw new Error('Export failed')
  return res.blob()
}
