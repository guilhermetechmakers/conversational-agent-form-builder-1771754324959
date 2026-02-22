import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  User,
  Users,
  CreditCard,
  Webhook,
  KeyRound,
  Palette,
  Database,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import {
  useProfile,
  useUpdateProfile,
  useTeamMembers,
  useSubscription,
  useWebhooks,
  useCreateWebhook,
  useDeleteWebhook,
  useApiKeys,
  useCreateApiKey,
  useRevokeApiKey,
  useBrandingDefaults,
  useUpdateBrandingDefaults,
  useRetentionPolicy,
  useUpdateRetentionPolicy,
} from '@/hooks/useSettings'
import type { SettingsSection } from '@/types/settings'

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
})

const brandingSchema = z.object({
  primaryColor: z.string().min(1, 'Primary color is required'),
  accentColor: z.string().min(1, 'Accent color is required'),
  footerText: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>
type BrandingFormData = z.infer<typeof brandingSchema>

const SIDEBAR_ITEMS: { id: SettingsSection; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Account Profile', icon: User },
  { id: 'team', label: 'Team & Seats', icon: Users },
  { id: 'billing', label: 'Billing & Subscription', icon: CreditCard },
  { id: 'webhooks', label: 'Webhook Manager', icon: Webhook },
  { id: 'api-keys', label: 'API Keys', icon: KeyRound },
  { id: 'branding', label: 'Branding Defaults', icon: Palette },
  { id: 'data-privacy', label: 'Data & Privacy', icon: Database },
]

const RETENTION_OPTIONS = [
  { value: 7, unit: 'days' as const, label: '7 days' },
  { value: 30, unit: 'days' as const, label: '30 days' },
  { value: 90, unit: 'days' as const, label: '90 days' },
  { value: 1, unit: 'years' as const, label: '1 year' },
  { value: 2, unit: 'years' as const, label: '2 years' },
]

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionDisabled = false,
}: {
  icon: React.ElementType
  title: string
  description: string
  actionLabel: string
  onAction?: () => void
  actionDisabled?: boolean
}) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <div className="rounded-full bg-muted p-5 mb-6">
        <Icon className="h-10 w-10 text-muted-foreground" aria-hidden />
      </div>
      <h3 className="font-semibold text-lg text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm text-sm leading-relaxed">{description}</p>
      <Button
        className="bg-primary text-primary-foreground hover:bg-secondary-accent transition-colors duration-200 focus:ring-2 focus:ring-primary"
        onClick={onAction}
        disabled={actionDisabled}
        aria-label={actionLabel}
      >
        {actionLabel}
      </Button>
    </div>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      role="alert"
      aria-live="assertive"
    >
      <p className="text-notification mb-4">{message}</p>
      <Button
        className="bg-notification text-background hover:bg-primary transition-colors duration-200"
        onClick={onRetry}
        aria-label="Retry loading"
      >
        Retry
      </Button>
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div
      className="space-y-6 animate-pulse min-h-[320px]"
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading settings"
    >
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 bg-muted rounded-md skeleton-shimmer" />
        <Skeleton className="h-4 w-full bg-muted rounded-md skeleton-shimmer" />
        <Skeleton className="h-4 w-3/4 bg-muted rounded-md skeleton-shimmer" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full bg-muted rounded-md skeleton-shimmer" />
        <Skeleton className="h-12 w-full bg-muted rounded-md skeleton-shimmer" />
        <Skeleton className="h-12 w-32 bg-muted rounded-md skeleton-shimmer" />
      </div>
    </div>
  )
}

export function SettingsPage() {
  const [section, setSection] = useState<SettingsSection>('profile')
  const [webhookDialogOpen, setWebhookDialogOpen] = useState(false)
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false)
  const [newWebhookUrl, setNewWebhookUrl] = useState('')
  const [newApiKeyName, setNewApiKeyName] = useState('')

  const { user } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  })

  const brandingForm = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: { primaryColor: '#26C6FF', accentColor: '#00FF66', footerText: '' },
  })

  const profileQuery = useProfile()
  const updateProfileMutation = useUpdateProfile()
  const teamQuery = useTeamMembers()
  const subscriptionQuery = useSubscription()
  const webhooksQuery = useWebhooks()
  const createWebhookMutation = useCreateWebhook()
  const deleteWebhookMutation = useDeleteWebhook()
  const apiKeysQuery = useApiKeys()
  const createApiKeyMutation = useCreateApiKey()
  const revokeApiKeyMutation = useRevokeApiKey()
  const brandingQuery = useBrandingDefaults()
  const updateBrandingMutation = useUpdateBrandingDefaults()
  const retentionQuery = useRetentionPolicy()
  const updateRetentionMutation = useUpdateRetentionPolicy()

  const profileData =
    profileQuery.data ??
    (user ? { name: user.name ?? '', email: user.email, avatarUrl: user.avatarUrl } : null)

  useEffect(() => {
    if (profileData) {
      reset({ name: profileData.name, email: profileData.email })
    }
  }, [profileData?.name, profileData?.email, reset])

  useEffect(() => {
    if (brandingQuery.data) {
      brandingForm.reset({
        primaryColor: brandingQuery.data.primaryColor ?? '#26C6FF',
        accentColor: brandingQuery.data.accentColor ?? '#00FF66',
        footerText: brandingQuery.data.footerText ?? '',
      })
    }
  }, [brandingQuery.data, brandingForm.reset])

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfileMutation.mutateAsync(data)
      toast.success('Profile updated')
    } catch {
      toast.error('Failed to update profile')
    }
  }

  const onBrandingSubmit = async (data: BrandingFormData) => {
    try {
      await updateBrandingMutation.mutateAsync(data)
      toast.success('Branding defaults saved')
    } catch {
      toast.error('Failed to save branding')
    }
  }

  const handleAddWebhook = async () => {
    if (!newWebhookUrl.trim()) {
      toast.error('Enter a webhook URL')
      return
    }
    try {
      await createWebhookMutation.mutateAsync({
        url: newWebhookUrl.trim(),
        events: ['session.completed'],
      })
      toast.success('Webhook added')
      setWebhookDialogOpen(false)
      setNewWebhookUrl('')
    } catch {
      toast.error('Failed to add webhook')
    }
  }

  const handleCreateApiKey = async () => {
    if (!newApiKeyName.trim()) {
      toast.error('Enter a key name')
      return
    }
    try {
      await createApiKeyMutation.mutateAsync(newApiKeyName.trim())
      toast.success('API key created. Copy it now — it won\'t be shown again.')
      setApiKeyDialogOpen(false)
      setNewApiKeyName('')
    } catch {
      toast.error('Failed to create API key')
    }
  }

  const handleExportData = async (format: 'json' | 'csv') => {
    toast.info(`Export as ${format.toUpperCase()} coming soon`)
  }

  const isPageLoading =
    (section === 'profile' && profileQuery.isLoading) ||
    (section === 'team' && teamQuery.isLoading) ||
    (section === 'billing' && subscriptionQuery.isLoading) ||
    (section === 'webhooks' && webhooksQuery.isLoading) ||
    (section === 'api-keys' && apiKeysQuery.isLoading) ||
    (section === 'branding' && brandingQuery.isLoading) ||
    (section === 'data-privacy' && retentionQuery.isLoading)

  return (
    <div
      className="flex flex-col md:flex-row bg-background min-h-[calc(100vh-8rem)] -m-4 md:-m-6 p-4 md:p-8"
      aria-busy={isPageLoading}
      aria-live="polite"
    >
      {/* Sidebar */}
      <aside
        className="flex flex-col items-center bg-card w-full md:w-20 lg:w-64 py-6 md:py-8 rounded-lg md:rounded-none md:rounded-l-lg overflow-hidden"
        aria-label="Settings navigation"
      >
        <nav className="flex flex-row md:flex-col gap-1 w-full md:w-auto overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = section === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={cn(
                  'flex items-center justify-center md:justify-start gap-2 px-4 md:px-4 py-2.5 rounded-md whitespace-nowrap transition-colors duration-200',
                  isActive ? 'text-primary bg-background/50' : 'text-muted-foreground hover:text-primary'
                )}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`${item.label}${isActive ? ', current section' : ''}`}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span className="hidden lg:inline">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4 hidden lg:inline ml-auto" aria-hidden />}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col space-y-8 p-6 md:p-8 overflow-auto">
        {/* Account Profile */}
        {section === 'profile' && (
          <div className="animate-fade-in">
            <Card className="bg-card shadow-lg rounded-lg border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Account Profile</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Update your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {profileQuery.isLoading ? (
                  <SettingsSkeleton />
                ) : !profileData ? (
                  <EmptyState
                    icon={User}
                    title="No profile data"
                    description="Sign in to view and update your account profile. Your profile information will appear here once you're authenticated."
                    actionLabel="Sign in"
                    onAction={() => window.location.assign('/login')}
                  />
                ) : (
                  <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user?.avatarUrl} alt="" />
                        <AvatarFallback className="bg-background text-primary text-xl">
                          {(user?.name ?? user?.email ?? 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-name" className="text-foreground">
                        Name
                      </Label>
                      <Input
                        id="profile-name"
                        placeholder="Your name"
                        className="bg-background text-foreground placeholder:text-muted-foreground rounded-md border-border focus:ring-2 focus:ring-ring"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'profile-name-error' : undefined}
                        {...register('name')}
                      />
                      {errors.name && (
                        <p id="profile-name-error" className="text-sm text-destructive" role="alert">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-email" className="text-foreground">
                        Email
                      </Label>
                      <Input
                        id="profile-email"
                        type="email"
                        placeholder="you@example.com"
                        className="bg-background text-foreground placeholder:text-muted-foreground rounded-md border-border focus:ring-2 focus:ring-ring"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'profile-email-error' : undefined}
                        {...register('email')}
                      />
                      {errors.email && (
                        <p id="profile-email-error" className="text-sm text-destructive" role="alert">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting || updateProfileMutation.isPending}
                      className="bg-primary text-primary-foreground hover:bg-secondary-accent transition-colors duration-200"
                      aria-label="Save profile changes"
                    >
                      {isSubmitting || updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          Saving...
                        </>
                      ) : (
                        'Save changes'
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Team & Seats */}
        {section === 'team' && (
          <div className="animate-fade-in">
            <Card className="bg-card shadow-lg rounded-lg border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Team & Seats</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Invite team members and manage roles
                  </CardDescription>
                </div>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-secondary-accent transition-colors duration-200"
                  onClick={() => toast.info('Team invites coming soon')}
                  aria-label="Invite team member"
                >
                  Invite member
                </Button>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {teamQuery.isLoading ? (
                  <SettingsSkeleton />
                ) : teamQuery.isError ? (
                  <ErrorState
                    message="Failed to load team members"
                    onRetry={() => teamQuery.refetch()}
                  />
                ) : !teamQuery.data?.length ? (
                  <EmptyState
                    icon={Users}
                    title="No team members yet"
                    description="Invite collaborators to work on your agents and forms. Add team members to share access and manage permissions."
                    actionLabel="Invite member"
                    onAction={() => toast.info('Team invites coming soon')}
                  />
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sso-toggle" className="text-foreground">
                        Enable SSO
                      </Label>
                      <Switch
                        id="sso-toggle"
                        className="data-[state=checked]:bg-primary"
                        onCheckedChange={() => toast.info('SSO configuration coming soon')}
                        aria-label="Enable SSO for team authentication"
                      />
                    </div>
                    <div className="rounded-md border border-border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-muted-foreground">Member</TableHead>
                            <TableHead className="text-muted-foreground">Role</TableHead>
                            <TableHead className="text-muted-foreground">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                      <TableBody>
                        {teamQuery.data.map((m) => (
                          <TableRow key={m.id} className="border-border">
                            <TableCell className="text-foreground">
                              {m.name ?? m.email}
                            </TableCell>
                            <TableCell>
                              <Select defaultValue={m.role} aria-label={`Role for ${m.name ?? m.email}`}>
                                <SelectTrigger className="bg-background text-foreground border-border w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                  <SelectItem value="owner" className="text-foreground">
                                    Owner
                                  </SelectItem>
                                  <SelectItem value="admin" className="text-foreground">
                                    Admin
                                  </SelectItem>
                                  <SelectItem value="editor" className="text-foreground">
                                    Editor
                                  </SelectItem>
                                  <SelectItem value="viewer" className="text-foreground">
                                    Viewer
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-muted-foreground">Active</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Billing & Subscription */}
        {section === 'billing' && (
          <div className="animate-fade-in">
            <Card className="bg-card shadow-lg rounded-lg border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Billing & Subscription</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Manage your plan and payment
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {subscriptionQuery.isLoading ? (
                  <SettingsSkeleton />
                ) : subscriptionQuery.isError ? (
                  <ErrorState
                    message="Failed to load billing info"
                    onRetry={() => subscriptionQuery.refetch()}
                  />
                ) : !subscriptionQuery.data ? (
                  <EmptyState
                    icon={CreditCard}
                    title="No billing plan"
                    description="Upgrade your plan to unlock premium features and higher limits. Stripe integration coming soon."
                    actionLabel="Upgrade plan"
                    onAction={() => window.location.assign('/checkout')}
                  />
                ) : (
                  <div className="space-y-4">
                    <p className="text-foreground">
                      Plan: {subscriptionQuery.data.planName} (
                      {subscriptionQuery.data.status})
                    </p>
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-secondary-accent transition-colors duration-200"
                      onClick={() => window.location.assign('/checkout')}
                      aria-label="Manage subscription"
                    >
                      Manage subscription
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Webhook Manager */}
        {section === 'webhooks' && (
          <div className="animate-fade-in">
            <Card className="bg-card shadow-lg rounded-lg border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Webhook Manager</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Add and test webhook endpoints
                  </CardDescription>
                </div>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-secondary-accent transition-colors duration-200"
                  onClick={() => setWebhookDialogOpen(true)}
                  aria-label="Add webhook"
                >
                  Add webhook
                </Button>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {webhooksQuery.isLoading ? (
                  <SettingsSkeleton />
                ) : webhooksQuery.isError ? (
                  <ErrorState
                    message="Failed to load webhooks"
                    onRetry={() => webhooksQuery.refetch()}
                  />
                ) : !webhooksQuery.data?.length ? (
                  <EmptyState
                    icon={Webhook}
                    title="No webhooks configured"
                    description="Add webhook endpoints to receive real-time notifications when events occur. Configure workspace-level webhooks for form submissions and agent events."
                    actionLabel="Add webhook"
                    onAction={() => setWebhookDialogOpen(true)}
                  />
                ) : (
                  <div className="rounded-md border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="text-muted-foreground">URL</TableHead>
                          <TableHead className="text-muted-foreground">Events</TableHead>
                          <TableHead className="text-muted-foreground">Status</TableHead>
                          <TableHead className="text-muted-foreground w-24" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {webhooksQuery.data.map((w) => (
                          <TableRow key={w.id} className="border-border">
                            <TableCell className="text-foreground font-mono text-sm truncate max-w-[200px]">
                              {w.url}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {w.events.join(', ')}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {w.enabled ? 'Enabled' : 'Disabled'}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  if (confirm('Delete this webhook?')) {
                                    deleteWebhookMutation.mutate(w.id)
                                  }
                                }}
                                aria-label={`Delete webhook ${w.url}`}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* API Keys */}
        {section === 'api-keys' && (
          <div className="animate-fade-in">
            <Card className="bg-card shadow-lg rounded-lg border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">API Keys</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Scoped API keys for integrations
                  </CardDescription>
                </div>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-secondary-accent transition-colors duration-200"
                  onClick={() => setApiKeyDialogOpen(true)}
                  aria-label="Create API key"
                >
                  Create API key
                </Button>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {apiKeysQuery.isLoading ? (
                  <SettingsSkeleton />
                ) : apiKeysQuery.isError ? (
                  <ErrorState
                    message="Failed to load API keys"
                    onRetry={() => apiKeysQuery.refetch()}
                  />
                ) : !apiKeysQuery.data?.length ? (
                  <EmptyState
                    icon={KeyRound}
                    title="No API keys"
                    description="Create API keys to integrate with external services and automate workflows. API keys are scoped to your workspace and can be revoked at any time."
                    actionLabel="Create API key"
                    onAction={() => setApiKeyDialogOpen(true)}
                  />
                ) : (
                  <div className="rounded-md border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="text-muted-foreground">Name</TableHead>
                          <TableHead className="text-muted-foreground">Key</TableHead>
                          <TableHead className="text-muted-foreground">Last used</TableHead>
                          <TableHead className="text-muted-foreground w-24" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {apiKeysQuery.data.map((k) => (
                          <TableRow key={k.id} className="border-border">
                            <TableCell className="text-foreground">{k.name}</TableCell>
                            <TableCell className="text-muted-foreground font-mono text-sm">
                              {k.prefix}•••••••
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {k.lastUsedAt
                                ? new Date(k.lastUsedAt).toLocaleDateString()
                                : 'Never'}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  if (confirm('Revoke this API key?')) {
                                    revokeApiKeyMutation.mutate(k.id)
                                  }
                                }}
                                aria-label={`Revoke API key ${k.name}`}
                              >
                                Revoke
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Branding Defaults */}
        {section === 'branding' && (
          <div className="animate-fade-in">
            <Card className="bg-card shadow-lg rounded-lg border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Branding Defaults</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Default appearance for new agents
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {brandingQuery.isLoading ? (
                  <SettingsSkeleton />
                ) : brandingQuery.isError ? (
                  <ErrorState
                    message="Failed to load branding"
                    onRetry={() => brandingQuery.refetch()}
                  />
                ) : (
                  <form
                    onSubmit={brandingForm.handleSubmit(onBrandingSubmit)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="primary-color" className="text-foreground">
                        Primary color
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary-color"
                          type="color"
                          className="h-10 w-14 p-1 bg-background border-border cursor-pointer"
                          aria-label="Primary color picker"
                          aria-invalid={!!brandingForm.formState.errors.primaryColor}
                          aria-describedby={
                            brandingForm.formState.errors.primaryColor
                              ? 'primary-color-error'
                              : undefined
                          }
                          {...brandingForm.register('primaryColor')}
                        />
                        <Input
                          className="flex-1 bg-background text-foreground placeholder:text-muted-foreground rounded-md border-border"
                          value={brandingForm.watch('primaryColor')}
                          onChange={(e) =>
                            brandingForm.setValue('primaryColor', e.target.value)
                          }
                          aria-label="Primary color hex value"
                        />
                      </div>
                      {brandingForm.formState.errors.primaryColor && (
                        <p
                          id="primary-color-error"
                          className="text-sm text-destructive"
                          role="alert"
                        >
                          {brandingForm.formState.errors.primaryColor.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accent-color" className="text-foreground">
                        Accent color
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="accent-color"
                          type="color"
                          className="h-10 w-14 p-1 bg-background border-border cursor-pointer"
                          aria-label="Accent color picker"
                          aria-invalid={!!brandingForm.formState.errors.accentColor}
                          aria-describedby={
                            brandingForm.formState.errors.accentColor
                              ? 'accent-color-error'
                              : undefined
                          }
                          {...brandingForm.register('accentColor')}
                        />
                        <Input
                          className="flex-1 bg-background text-foreground placeholder:text-muted-foreground rounded-md border-border"
                          value={brandingForm.watch('accentColor')}
                          onChange={(e) =>
                            brandingForm.setValue('accentColor', e.target.value)
                          }
                          aria-label="Accent color hex value"
                        />
                      </div>
                      {brandingForm.formState.errors.accentColor && (
                        <p
                          id="accent-color-error"
                          className="text-sm text-destructive"
                          role="alert"
                        >
                          {brandingForm.formState.errors.accentColor.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="footer-text" className="text-foreground">
                        Footer text
                      </Label>
                      <Textarea
                        id="footer-text"
                        placeholder="Custom footer text for chat widget"
                        className="bg-background text-foreground placeholder:text-muted-foreground rounded-md border-border focus:ring-2 focus:ring-ring min-h-[80px]"
                        aria-label="Custom footer text for chat widget"
                        {...brandingForm.register('footerText')}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={updateBrandingMutation.isPending}
                      className="bg-primary text-primary-foreground hover:bg-secondary-accent transition-colors duration-200"
                      aria-label="Save branding defaults"
                    >
                      {updateBrandingMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          Saving...
                        </>
                      ) : (
                        'Save branding'
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Data & Privacy */}
        {section === 'data-privacy' && (
          <div className="animate-fade-in">
            <Card className="bg-card shadow-lg rounded-lg border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Data & Privacy</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Retention policies and data export
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {retentionQuery.isLoading ? (
                  <SettingsSkeleton />
                ) : retentionQuery.isError ? (
                  <ErrorState
                    message="Failed to load retention settings"
                    onRetry={() => retentionQuery.refetch()}
                  />
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="retention" className="text-foreground">
                        Session retention
                      </Label>
                      <Select
                        value={
                          retentionQuery.data
                            ? `${retentionQuery.data.value}-${retentionQuery.data.unit}`
                            : '90-days'
                        }
                        onValueChange={async (v) => {
                          const [value, unit] = v.split('-')
                          try {
                            await updateRetentionMutation.mutateAsync({
                              value: parseInt(value, 10),
                              unit: unit as 'days' | 'months' | 'years',
                            })
                            toast.success('Retention policy updated')
                          } catch {
                            toast.error('Failed to update retention policy')
                          }
                        }}
                      >
                        <SelectTrigger
                          id="retention"
                          className="bg-background text-foreground border-border"
                          aria-label="Session retention period"
                        >
                          <SelectValue placeholder="Select retention" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {RETENTION_OPTIONS.map((opt) => (
                            <SelectItem
                              key={`${opt.value}-${opt.unit}`}
                              value={`${opt.value}-${opt.unit}`}
                              className="text-foreground"
                            >
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Sessions older than this will be automatically deleted.
                      </p>
                    </div>
                    <div>
                      <Label className="text-foreground">Export data</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Download your session data in JSON or CSV format.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          className="bg-primary text-primary-foreground hover:bg-secondary-accent transition-colors duration-200"
                          onClick={() => handleExportData('json')}
                          aria-label="Export data as JSON"
                        >
                          Export JSON
                        </Button>
                        <Button
                          className="bg-primary text-primary-foreground hover:bg-secondary-accent transition-colors duration-200"
                          onClick={() => handleExportData('csv')}
                          aria-label="Export data as CSV"
                        >
                          Export CSV
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Add Webhook Dialog */}
      <Dialog open={webhookDialogOpen} onOpenChange={setWebhookDialogOpen}>
        <DialogContent className="bg-card border-border" aria-describedby="webhook-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add webhook</DialogTitle>
            <DialogDescription id="webhook-dialog-description" className="text-muted-foreground">
              Enter the URL to receive event payloads.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url" className="text-foreground">
                Webhook URL
              </Label>
              <Input
                id="webhook-url"
                placeholder="https://example.com/webhook"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                className="bg-background text-foreground placeholder:text-muted-foreground border-border"
                aria-label="Webhook URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-border text-muted-foreground hover:bg-background"
              onClick={() => setWebhookDialogOpen(false)}
              aria-label="Cancel adding webhook"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-secondary-accent"
              onClick={handleAddWebhook}
              disabled={createWebhookMutation.isPending}
              aria-label="Add webhook"
            >
              {createWebhookMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Adding...
                </>
              ) : (
                'Add webhook'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create API Key Dialog */}
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent className="bg-card border-border" aria-describedby="api-key-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create API key</DialogTitle>
            <DialogDescription id="api-key-dialog-description" className="text-muted-foreground">
              Give your key a name to identify it. You won&apos;t be able to see the full key again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key-name" className="text-foreground">
                Key name
              </Label>
              <Input
                id="api-key-name"
                placeholder="e.g. Production API"
                value={newApiKeyName}
                onChange={(e) => setNewApiKeyName(e.target.value)}
                className="bg-background text-foreground placeholder:text-muted-foreground border-border"
                aria-label="API key name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-border text-muted-foreground hover:bg-background"
              onClick={() => setApiKeyDialogOpen(false)}
              aria-label="Cancel creating API key"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-secondary-accent"
              onClick={handleCreateApiKey}
              disabled={createApiKeyMutation.isPending}
              aria-label="Create API key"
            >
              {createApiKeyMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Creating...
                </>
              ) : (
                'Create key'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
