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
      <div className="rounded-full bg-[#31343A] p-5 mb-6">
        <Icon className="h-10 w-10 text-[#C0C6D1]" aria-hidden />
      </div>
      <h3 className="font-semibold text-lg text-[#FFFFFF] mb-2">{title}</h3>
      <p className="text-[#C0C6D1] mb-6 max-w-sm text-sm leading-relaxed">{description}</p>
      <Button
        className="bg-[#26C6FF] text-[#FFFFFF] hover:bg-[#00FF66] transition-colors duration-200 focus:ring-2 focus:ring-[#26C6FF]"
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
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <p className="text-[#FFD600] mb-4">{message}</p>
      <Button
        className="bg-[#FFD600] text-[#181B20] hover:bg-[#26C6FF] transition-colors duration-200"
        onClick={onRetry}
      >
        Retry
      </Button>
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 bg-[#31343A] rounded-md" />
        <Skeleton className="h-4 w-full bg-[#31343A] rounded-md" />
        <Skeleton className="h-4 w-3/4 bg-[#31343A] rounded-md" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full bg-[#31343A] rounded-md" />
        <Skeleton className="h-12 w-full bg-[#31343A] rounded-md" />
        <Skeleton className="h-12 w-32 bg-[#31343A] rounded-md" />
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

  return (
    <div className="flex flex-col md:flex-row bg-[#181B20] min-h-[calc(100vh-8rem)] -m-4 md:-m-6 p-4 md:p-8">
      {/* Sidebar */}
      <aside className="flex flex-col items-center bg-[#23262B] w-full md:w-20 lg:w-64 py-6 md:py-8 rounded-lg md:rounded-none md:rounded-l-lg overflow-hidden">
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
                  isActive ? 'text-[#26C6FF] bg-[#181B20]/50' : 'text-[#C0C6D1] hover:text-[#26C6FF]'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="hidden lg:inline">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4 hidden lg:inline ml-auto" />}
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
            <Card className="bg-[#23262B] shadow-lg rounded-lg border-[#31343A]">
              <CardHeader>
                <CardTitle className="text-[#FFFFFF]">Account Profile</CardTitle>
                <CardDescription className="text-[#C0C6D1]">
                  Update your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {profileQuery.isLoading ? (
                  <SettingsSkeleton />
                ) : (
                  <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user?.avatarUrl} alt="" />
                        <AvatarFallback className="bg-[#181B20] text-[#26C6FF] text-xl">
                          {(user?.name ?? user?.email ?? 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-name" className="text-[#FFFFFF]">
                        Name
                      </Label>
                      <Input
                        id="profile-name"
                        placeholder="Your name"
                        className="bg-[#181B20] text-[#FFFFFF] placeholder-[#C0C6D1] rounded-md border-[#31343A] focus:ring-2 focus:ring-[#26C6FF]"
                        aria-invalid={!!errors.name}
                        {...register('name')}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive" role="alert">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-email" className="text-[#FFFFFF]">
                        Email
                      </Label>
                      <Input
                        id="profile-email"
                        type="email"
                        placeholder="you@example.com"
                        className="bg-[#181B20] text-[#FFFFFF] placeholder-[#C0C6D1] rounded-md border-[#31343A] focus:ring-2 focus:ring-[#26C6FF]"
                        aria-invalid={!!errors.email}
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive" role="alert">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting || updateProfileMutation.isPending}
                      className="bg-[#26C6FF] text-[#FFFFFF] hover:bg-[#00FF66] transition-colors duration-200"
                    >
                      {isSubmitting || updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
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
            <Card className="bg-[#23262B] shadow-lg rounded-lg border-[#31343A]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[#FFFFFF]">Team & Seats</CardTitle>
                  <CardDescription className="text-[#C0C6D1]">
                    Invite team members and manage roles
                  </CardDescription>
                </div>
                <Button
                  className="bg-[#26C6FF] text-[#FFFFFF] hover:bg-[#00FF66] transition-colors duration-200"
                  onClick={() => toast.info('Team invites coming soon')}
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
                      <Label htmlFor="sso-toggle" className="text-[#FFFFFF]">
                        Enable SSO
                      </Label>
                      <Switch
                        id="sso-toggle"
                        className="data-[state=checked]:bg-[#26C6FF]"
                        onCheckedChange={() => toast.info('SSO configuration coming soon')}
                      />
                    </div>
                    <div className="rounded-md border border-[#31343A] overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-[#31343A] hover:bg-transparent">
                            <TableHead className="text-[#C0C6D1]">Member</TableHead>
                            <TableHead className="text-[#C0C6D1]">Role</TableHead>
                            <TableHead className="text-[#C0C6D1]">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                      <TableBody>
                        {teamQuery.data.map((m) => (
                          <TableRow key={m.id} className="border-[#31343A]">
                            <TableCell className="text-[#FFFFFF]">
                              {m.name ?? m.email}
                            </TableCell>
                            <TableCell>
                              <Select defaultValue={m.role}>
                                <SelectTrigger className="bg-[#181B20] text-[#FFFFFF] border-[#31343A] w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#23262B] border-[#31343A]">
                                  <SelectItem value="owner" className="text-[#FFFFFF]">
                                    Owner
                                  </SelectItem>
                                  <SelectItem value="admin" className="text-[#FFFFFF]">
                                    Admin
                                  </SelectItem>
                                  <SelectItem value="editor" className="text-[#FFFFFF]">
                                    Editor
                                  </SelectItem>
                                  <SelectItem value="viewer" className="text-[#FFFFFF]">
                                    Viewer
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-[#C0C6D1]">Active</TableCell>
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
            <Card className="bg-[#23262B] shadow-lg rounded-lg border-[#31343A]">
              <CardHeader>
                <CardTitle className="text-[#FFFFFF]">Billing & Subscription</CardTitle>
                <CardDescription className="text-[#C0C6D1]">
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
                    <p className="text-[#FFFFFF]">
                      Plan: {subscriptionQuery.data.planName} (
                      {subscriptionQuery.data.status})
                    </p>
                    <Button
                      className="bg-[#26C6FF] text-[#FFFFFF] hover:bg-[#00FF66] transition-colors duration-200"
                      onClick={() => window.location.assign('/checkout')}
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
            <Card className="bg-[#23262B] shadow-lg rounded-lg border-[#31343A]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[#FFFFFF]">Webhook Manager</CardTitle>
                  <CardDescription className="text-[#C0C6D1]">
                    Add and test webhook endpoints
                  </CardDescription>
                </div>
                <Button
                  className="bg-[#26C6FF] text-[#FFFFFF] hover:bg-[#00FF66] transition-colors duration-200"
                  onClick={() => setWebhookDialogOpen(true)}
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
                  <div className="rounded-md border border-[#31343A] overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#31343A] hover:bg-transparent">
                          <TableHead className="text-[#C0C6D1]">URL</TableHead>
                          <TableHead className="text-[#C0C6D1]">Events</TableHead>
                          <TableHead className="text-[#C0C6D1]">Status</TableHead>
                          <TableHead className="text-[#C0C6D1] w-24" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {webhooksQuery.data.map((w) => (
                          <TableRow key={w.id} className="border-[#31343A]">
                            <TableCell className="text-[#FFFFFF] font-mono text-sm truncate max-w-[200px]">
                              {w.url}
                            </TableCell>
                            <TableCell className="text-[#C0C6D1]">
                              {w.events.join(', ')}
                            </TableCell>
                            <TableCell className="text-[#C0C6D1]">
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
            <Card className="bg-[#23262B] shadow-lg rounded-lg border-[#31343A]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[#FFFFFF]">API Keys</CardTitle>
                  <CardDescription className="text-[#C0C6D1]">
                    Scoped API keys for integrations
                  </CardDescription>
                </div>
                <Button
                  className="bg-[#26C6FF] text-[#FFFFFF] hover:bg-[#00FF66] transition-colors duration-200"
                  onClick={() => setApiKeyDialogOpen(true)}
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
                  <div className="rounded-md border border-[#31343A] overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#31343A] hover:bg-transparent">
                          <TableHead className="text-[#C0C6D1]">Name</TableHead>
                          <TableHead className="text-[#C0C6D1]">Key</TableHead>
                          <TableHead className="text-[#C0C6D1]">Last used</TableHead>
                          <TableHead className="text-[#C0C6D1] w-24" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {apiKeysQuery.data.map((k) => (
                          <TableRow key={k.id} className="border-[#31343A]">
                            <TableCell className="text-[#FFFFFF]">{k.name}</TableCell>
                            <TableCell className="text-[#C0C6D1] font-mono text-sm">
                              {k.prefix}•••••••
                            </TableCell>
                            <TableCell className="text-[#C0C6D1]">
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
            <Card className="bg-[#23262B] shadow-lg rounded-lg border-[#31343A]">
              <CardHeader>
                <CardTitle className="text-[#FFFFFF]">Branding Defaults</CardTitle>
                <CardDescription className="text-[#C0C6D1]">
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
                      <Label htmlFor="primary-color" className="text-[#FFFFFF]">
                        Primary color
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary-color"
                          type="color"
                          className="h-10 w-14 p-1 bg-[#181B20] border-[#31343A] cursor-pointer"
                          {...brandingForm.register('primaryColor')}
                        />
                        <Input
                          className="flex-1 bg-[#181B20] text-[#FFFFFF] placeholder-[#C0C6D1] rounded-md border-[#31343A]"
                          value={brandingForm.watch('primaryColor')}
                          onChange={(e) =>
                            brandingForm.setValue('primaryColor', e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accent-color" className="text-[#FFFFFF]">
                        Accent color
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="accent-color"
                          type="color"
                          className="h-10 w-14 p-1 bg-[#181B20] border-[#31343A] cursor-pointer"
                          {...brandingForm.register('accentColor')}
                        />
                        <Input
                          className="flex-1 bg-[#181B20] text-[#FFFFFF] placeholder-[#C0C6D1] rounded-md border-[#31343A]"
                          value={brandingForm.watch('accentColor')}
                          onChange={(e) =>
                            brandingForm.setValue('accentColor', e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="footer-text" className="text-[#FFFFFF]">
                        Footer text
                      </Label>
                      <Textarea
                        id="footer-text"
                        placeholder="Custom footer text for chat widget"
                        className="bg-[#181B20] text-[#FFFFFF] placeholder-[#C0C6D1] rounded-md border-[#31343A] focus:ring-2 focus:ring-[#26C6FF] min-h-[80px]"
                        {...brandingForm.register('footerText')}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={updateBrandingMutation.isPending}
                      className="bg-[#26C6FF] text-[#FFFFFF] hover:bg-[#00FF66] transition-colors duration-200"
                    >
                      {updateBrandingMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
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
            <Card className="bg-[#23262B] shadow-lg rounded-lg border-[#31343A]">
              <CardHeader>
                <CardTitle className="text-[#FFFFFF]">Data & Privacy</CardTitle>
                <CardDescription className="text-[#C0C6D1]">
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
                      <Label htmlFor="retention" className="text-[#FFFFFF]">
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
                          className="bg-[#181B20] text-[#FFFFFF] border-[#31343A]"
                        >
                          <SelectValue placeholder="Select retention" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#23262B] border-[#31343A]">
                          {RETENTION_OPTIONS.map((opt) => (
                            <SelectItem
                              key={`${opt.value}-${opt.unit}`}
                              value={`${opt.value}-${opt.unit}`}
                              className="text-[#FFFFFF]"
                            >
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-[#C0C6D1]">
                        Sessions older than this will be automatically deleted.
                      </p>
                    </div>
                    <div>
                      <Label className="text-[#FFFFFF]">Export data</Label>
                      <p className="text-sm text-[#C0C6D1] mb-2">
                        Download your session data in JSON or CSV format.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          className="bg-[#26C6FF] text-[#FFFFFF] hover:bg-[#00FF66] transition-colors duration-200"
                          onClick={() => handleExportData('json')}
                        >
                          Export JSON
                        </Button>
                        <Button
                          className="bg-[#26C6FF] text-[#FFFFFF] hover:bg-[#00FF66] transition-colors duration-200"
                          onClick={() => handleExportData('csv')}
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
        <DialogContent className="bg-[#23262B] border-[#31343A]">
          <DialogHeader>
            <DialogTitle className="text-[#FFFFFF]">Add webhook</DialogTitle>
            <DialogDescription className="text-[#C0C6D1]">
              Enter the URL to receive event payloads.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url" className="text-[#FFFFFF]">
                Webhook URL
              </Label>
              <Input
                id="webhook-url"
                placeholder="https://example.com/webhook"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                className="bg-[#181B20] text-[#FFFFFF] placeholder-[#C0C6D1] border-[#31343A]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-[#31343A] text-[#C0C6D1] hover:bg-[#181B20]"
              onClick={() => setWebhookDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#26C6FF] text-[#FFFFFF] hover:bg-[#00FF66]"
              onClick={handleAddWebhook}
              disabled={createWebhookMutation.isPending}
            >
              {createWebhookMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
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
        <DialogContent className="bg-[#23262B] border-[#31343A]">
          <DialogHeader>
            <DialogTitle className="text-[#FFFFFF]">Create API key</DialogTitle>
            <DialogDescription className="text-[#C0C6D1]">
              Give your key a name to identify it. You won&apos;t be able to see the full key again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key-name" className="text-[#FFFFFF]">
                Key name
              </Label>
              <Input
                id="api-key-name"
                placeholder="e.g. Production API"
                value={newApiKeyName}
                onChange={(e) => setNewApiKeyName(e.target.value)}
                className="bg-[#181B20] text-[#FFFFFF] placeholder-[#C0C6D1] border-[#31343A]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-[#31343A] text-[#C0C6D1] hover:bg-[#181B20]"
              onClick={() => setApiKeyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#26C6FF] text-[#FFFFFF] hover:bg-[#00FF66]"
              onClick={handleCreateApiKey}
              disabled={createApiKeyMutation.isPending}
            >
              {createApiKeyMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
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
