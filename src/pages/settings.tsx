import { useState } from 'react'
import { User, Users, CreditCard, Webhook, Key, Palette } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

export function SettingsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and workspace
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account profile</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                />
              </div>
              <Button onClick={() => toast.success('Profile updated')}>
                Save changes
              </Button>
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
              <p className="text-muted-foreground">
                Team management coming soon.
              </p>
              <Button variant="outline" className="mt-4" disabled>
                Invite member
              </Button>
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
              <p className="text-muted-foreground">
                Stripe integration coming soon.
              </p>
              <Button variant="outline" className="mt-4" disabled>
                Upgrade plan
              </Button>
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
              <p className="text-muted-foreground">
                Workspace-level webhooks configuration.
              </p>
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
              <p className="text-muted-foreground">
                API key management coming soon.
              </p>
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
              <p className="text-muted-foreground">
                Branding defaults configuration.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
