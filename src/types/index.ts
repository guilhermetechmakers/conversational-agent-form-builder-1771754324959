export type FieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'textarea'
  | 'date'

export interface FieldOption {
  label: string
  value: string
}

export interface AgentField {
  id: string
  type: FieldType
  label: string
  required: boolean
  placeholder?: string
  validation?: Record<string, unknown>
  options?: FieldOption[]
  sampleData?: string
}

export interface Agent {
  id: string
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
    passcode?: string
    rateLimit?: number
    retentionDays?: number
  }
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  sender: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface CapturedField {
  fieldId: string
  type: FieldType
  validatedValue: unknown
  rawValue?: string
  validationWarning?: string
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  action: string
  details?: string
  isRetry?: boolean
}

export interface Session {
  id: string
  agentId: string
  agentName?: string
  status: 'active' | 'completed' | 'abandoned'
  messages: Message[]
  capturedFields: CapturedField[]
  visitorMetadata?: {
    ip?: string
    userAgent?: string
    referrer?: string
  }
  createdAt: string
  completedAt?: string
  reviewedAt?: string
  notes?: string
}

export interface User {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
}

export interface Dashboard {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}
