import { useState } from 'react'
import { Shield, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

export interface AdvancedSettingsProps {
  webhookUrls: string[]
  passcodeEnabled: boolean
  passcode: string
  rateLimit: number
  retentionDays: number
  onWebhookUrlsChange: (urls: string[]) => void
  onPasscodeEnabledChange: (enabled: boolean) => void
  onPasscodeChange: (value: string) => void
  onRateLimitChange: (value: number) => void
  onRetentionDaysChange: (value: number) => void
}

export function AdvancedSettings({
  webhookUrls,
  passcodeEnabled,
  passcode,
  rateLimit,
  retentionDays,
  onWebhookUrlsChange,
  onPasscodeEnabledChange,
  onPasscodeChange,
  onRateLimitChange,
  onRetentionDaysChange,
}: AdvancedSettingsProps) {
  const [newWebhook, setNewWebhook] = useState('')

  const addWebhook = () => {
    const trimmed = newWebhook.trim()
    if (trimmed && !webhookUrls.includes(trimmed)) {
      onWebhookUrlsChange([...webhookUrls, trimmed])
      setNewWebhook('')
    }
  }

  const removeWebhook = (url: string) => {
    onWebhookUrlsChange(webhookUrls.filter((u) => u !== url))
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Advanced
        </CardTitle>
        <CardDescription>Webhooks, passcode, rate limits, and session retention</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Webhook URL(s)</Label>
          <div className="flex gap-2">
            <Input
              value={newWebhook}
              onChange={(e) => setNewWebhook(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addWebhook())}
              placeholder="https://your-crm.com/webhook"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addWebhook}
              disabled={!newWebhook.trim()}
              aria-label="Add webhook URL"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add
            </Button>
          </div>
          {webhookUrls.length > 0 && (
            <ul className="space-y-2 mt-2">
              {webhookUrls.map((url) => (
                <li
                  key={url}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span className="truncate">{url}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive"
                    onClick={() => removeWebhook(url)}
                    aria-label={`Remove webhook ${url}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <Label>Passcode protection</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Require passcode to access this agent
            </p>
          </div>
          <Switch
            checked={passcodeEnabled}
            onCheckedChange={onPasscodeEnabledChange}
          />
        </div>
        {passcodeEnabled && (
          <div className="space-y-2">
            <Label>Passcode</Label>
            <Input
              type="password"
              value={passcode}
              onChange={(e) => onPasscodeChange(e.target.value)}
              placeholder="Enter passcode"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
            />
          </div>
        )}
        <div className="space-y-2">
          <Label>Rate limit (requests per minute)</Label>
          <Input
            type="number"
            min={1}
            max={1000}
            value={rateLimit || ''}
            onChange={(e) => onRateLimitChange(parseInt(e.target.value, 10) || 0)}
            placeholder="60"
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Session retention (days)</Label>
          <Input
            type="number"
            min={1}
            max={365}
            value={retentionDays || ''}
            onChange={(e) => onRetentionDaysChange(parseInt(e.target.value, 10) || 0)}
            placeholder="30"
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
          />
          <p className="text-xs text-muted-foreground">
            How long to keep session data
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
