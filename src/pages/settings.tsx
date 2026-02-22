import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  User,
  Users,
  CreditCard,
  Webhook,
  Key,
  Palette,
  Webhook as WebhookIcon,
  KeyRound,
  Brush,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
})

type ProfileFormData = z.infer<typeof profileSchema>

const EMPTY_STATE_ICON_SIZE = 'h-10 w-10'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  secondaryDescription?: string
  actionLabel: string
  onAction?: () => void
  actionDisabled?: boolean
}

function EmptyState({
  icon,
  title,
  description,
  secondaryDescription,
  actionLabel,
  onAction,
  actionDisabled = false,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4 sm:py-16 text-center animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <div className="rounded-full bg-primary/10 p-5 mb-6 ring-4 ring-primary/5">
        {icon}
      </div>
      <h3 className="font-semibold text-lg sm:text-xl mb-2 text-foreground">
        {title}
      </h3>
      <p className="text-muted-foreground mb-2 max-w-sm text-sm sm:text-base leading-relaxed">
        {description}
      </p>
      {secondaryDescription && (
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          {secondaryDescription}
        </p>
      )}
      {!secondaryDescription && <div className="mb-6" />}
      <Button
        variant="outline"
        onClick={onAction}
        disabled={actionDisabled}
        aria-label={actionLabel}
        className="transition-all duration-200 hover:scale-[1.02] hover:shadow-card"
      >
        {actionLabel}
      </Button>
    </div>
  )
}

export function SettingsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', email: '' },
  })

  const onProfileSubmit = (_data: ProfileFormData) => {
    toast.success('Profile updated')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and workspace
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Webhooks</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Branding</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account profile</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Name</Label>
                  <Input
                    id="profile-name"
                    placeholder="Your name"
                    className={cn(errors.name && 'border-destructive focus-visible:ring-destructive animate-shake')}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'profile-name-error' : undefined}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p
                      id="profile-name-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    placeholder="you@example.com"
                    className={cn(errors.email && 'border-destructive focus-visible:ring-destructive animate-shake')}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'profile-email-error' : undefined}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p
                      id="profile-email-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Team & seats</CardTitle>
              <CardDescription>Invite team members and manage roles</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<Users className={cn(EMPTY_STATE_ICON_SIZE, 'text-primary')} aria-hidden />}
                title="No team members yet"
                description="Invite collaborators to collaborate on your agents and forms."
                secondaryDescription="Add team members to share access and manage permissions."
                actionLabel="Invite member"
                actionDisabled
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing & subscription</CardTitle>
              <CardDescription>Manage your plan and payment</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<CreditCard className={cn(EMPTY_STATE_ICON_SIZE, 'text-primary')} aria-hidden />}
                title="No billing plan"
                description="Upgrade your plan to unlock premium features and higher limits."
                secondaryDescription="Stripe integration coming soon."
                actionLabel="Upgrade plan"
                actionDisabled
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook manager</CardTitle>
              <CardDescription>Add and test webhook endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<WebhookIcon className={cn(EMPTY_STATE_ICON_SIZE, 'text-primary')} aria-hidden />}
                title="No webhooks configured"
                description="Add webhook endpoints to receive real-time notifications when events occur."
                secondaryDescription="Configure workspace-level webhooks for form submissions and agent events."
                actionLabel="Add webhook"
                onAction={() => toast.info('Webhook configuration coming soon')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API keys</CardTitle>
              <CardDescription>Scoped API keys for integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<KeyRound className={cn(EMPTY_STATE_ICON_SIZE, 'text-primary')} aria-hidden />}
                title="No API keys"
                description="Create API keys to integrate with external services and automate workflows."
                secondaryDescription="API keys are scoped to your workspace and can be revoked at any time."
                actionLabel="Create API key"
                onAction={() => toast.info('API key management coming soon')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding defaults</CardTitle>
              <CardDescription>Default appearance for new agents</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<Brush className={cn(EMPTY_STATE_ICON_SIZE, 'text-primary')} aria-hidden />}
                title="No branding defaults set"
                description="Set default colors, fonts, and logos for new agents."
                secondaryDescription="New agents will inherit these settings when created."
                actionLabel="Configure branding"
                onAction={() => toast.info('Branding configuration coming soon')}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
