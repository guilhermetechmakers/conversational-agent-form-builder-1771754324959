/** Settings-related types for account, billing, webhooks, API keys, branding, and data privacy */

export interface ProfileUpdate {
  name: string
  email: string
  avatarUrl?: string
}

export interface TeamMember {
  id: string
  email: string
  name?: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  avatarUrl?: string
  invitedAt?: string
}

export interface BillingPlan {
  id: string
  name: string
  priceCents?: number
  interval?: 'month' | 'year'
  sessionsLimit?: number
  features?: string[]
}

export interface Subscription {
  planId: string
  planName: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  currentPeriodEnd?: string
  sessionsUsed?: number
  sessionsLimit?: number
}

export interface Webhook {
  id: string
  url: string
  events: string[]
  secret?: string
  enabled: boolean
  createdAt: string
  lastDeliveryAt?: string
  lastDeliveryStatus?: number
}

export interface ApiKey {
  id: string
  name: string
  prefix: string
  lastUsedAt?: string
  createdAt: string
}

export interface BrandingDefaults {
  primaryColor: string
  accentColor: string
  footerText?: string
  logoUrl?: string
}

export interface RetentionPolicy {
  value: number
  unit: 'days' | 'months' | 'years'
}

export type SettingsSection =
  | 'profile'
  | 'team'
  | 'billing'
  | 'webhooks'
  | 'api-keys'
  | 'branding'
  | 'data-privacy'
