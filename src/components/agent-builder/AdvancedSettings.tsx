import { useState, useRef } from 'react'
import { Shield, Plus, Trash2, Webhook, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

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
  /** When true, shows loading state on add/remove webhook actions (e.g. during autosave) */
  isSaving?: boolean
  /** Error message to display when save/API operations fail */
  saveError?: string
  /** Optional callback when user retries after a save error */
  onRetrySave?: () => void
}

const WEBHOOK_URL_REGEX = /^https?:\/\/.+\..+/

function WebhookEmptyState({
  onFocusInput,
  isAdding,
}: {
  onFocusInput: () => void
  isAdding: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-border bg-muted/30 px-4 py-8 text-center animate-fade-in',
        'min-h-[120px] sm:min-h-[140px]'
      )}
      role="status"
      aria-label="No webhook URLs configured"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Webhook className="h-6 w-6 text-muted-foreground" aria-hidden />
      </div>
      <p className="mb-1 text-sm font-medium text-foreground">No webhook URLs yet</p>
      <p className="mb-4 max-w-[240px] text-xs text-muted-foreground">
        Add webhook endpoints to receive real-time notifications when form submissions occur.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onFocusInput}
        disabled={isAdding}
        aria-label="Add your first webhook URL"
        className="min-h-[44px] min-w-[44px] touch-manipulation"
      >
        {isAdding ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <Plus className="h-4 w-4" aria-hidden />
        )}
        {isAdding ? 'Adding...' : 'Add webhook URL'}
      </Button>
    </div>
  )
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
  isSaving = false,
  saveError,
  onRetrySave,
}: AdvancedSettingsProps) {
  const [newWebhook, setNewWebhook] = useState('')
  const [webhookError, setWebhookError] = useState<string | null>(null)
  const webhookInputRef = useRef<HTMLInputElement>(null)

  const addWebhook = () => {
    setWebhookError(null)
    const trimmed = newWebhook.trim()
    if (!trimmed) return
    if (webhookUrls.includes(trimmed)) {
      setWebhookError('This webhook URL is already added')
      return
    }
    if (!WEBHOOK_URL_REGEX.test(trimmed)) {
      setWebhookError('Please enter a valid URL (e.g. https://example.com/webhook)')
      return
    }
    onWebhookUrlsChange([...webhookUrls, trimmed])
    setNewWebhook('')
  }

  const removeWebhook = (url: string) => {
    onWebhookUrlsChange(webhookUrls.filter((u) => u !== url))
  }

  const focusWebhookInput = () => {
    webhookInputRef.current?.focus()
  }

  const isAdding = isSaving

  return (
    <Card className="bg-secondary-800 p-6 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-card-hover border-divider">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Shield className="h-5 w-5 text-accent-500" />
          Advanced
        </CardTitle>
        <CardDescription className="text-secondary-500">Webhooks, passcode, rate limits, and session retention</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {saveError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden />
            <div className="flex-1 min-w-0">
              <p className="font-medium">Save failed</p>
              <p className="mt-0.5 text-destructive/90">{saveError}</p>
              {onRetrySave && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 border-destructive/50 text-destructive hover:bg-destructive/10"
                  onClick={onRetrySave}
                  aria-label="Retry save"
                >
                  Retry save
                </Button>
              )}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="advanced-webhook-input" className="text-white">
            Webhook URL(s)
          </Label>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
            <Input
              id="advanced-webhook-input"
              ref={webhookInputRef}
              value={newWebhook}
              onChange={(e) => {
                setNewWebhook(e.target.value)
                setWebhookError(null)
              }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addWebhook())}
              placeholder="https://your-crm.com/webhook"
              className="bg-primary-700 text-white rounded p-3 placeholder:text-secondary-500 focus:ring-2 focus:ring-accent-500 transition duration-150 min-h-[44px]"
              aria-label="Webhook URL"
              aria-invalid={!!webhookError}
              aria-describedby={webhookError ? 'webhook-error' : undefined}
              disabled={isSaving}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addWebhook}
              disabled={!newWebhook.trim() || isSaving}
              aria-label="Add webhook URL"
              className="min-h-[44px] min-w-[44px] touch-manipulation sm:shrink-0"
            >
              {isAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Plus className="h-4 w-4" aria-hidden />
              )}
              {isAdding ? 'Adding...' : 'Add'}
            </Button>
          </div>
          {webhookError && (
            <p id="webhook-error" role="alert" className="text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
              {webhookError}
            </p>
          )}
          {webhookUrls.length > 0 ? (
            <ul className="space-y-2 mt-2" role="list">
              {webhookUrls.map((url) => (
                <li
                  key={url}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm transition-all duration-200 hover:shadow-md hover:border-accent-500/30"
                >
                  <span className="truncate">{url}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive min-h-[44px] min-w-[44px] touch-manipulation disabled:opacity-50"
                    onClick={() => removeWebhook(url)}
                    disabled={isSaving}
                    aria-label={`Remove webhook ${url}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-2">
              <WebhookEmptyState onFocusInput={focusWebhookInput} isAdding={isAdding} />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between rounded-lg border border-divider p-4 bg-primary-700/50">
          <div>
            <Label className="text-white">Passcode protection</Label>
            <p className="text-xs text-secondary-500 mt-0.5">
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
            <Label htmlFor="advanced-passcode" className="text-white">
              Passcode
            </Label>
            <Input
              id="advanced-passcode"
              type="password"
              value={passcode}
              onChange={(e) => onPasscodeChange(e.target.value)}
              placeholder="Enter passcode"
              className="bg-primary-700 text-white rounded p-3 placeholder:text-secondary-500 focus:ring-2 focus:ring-accent-500 transition duration-150 min-h-[44px]"
              aria-label="Passcode for agent access"
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="advanced-rate-limit" className="text-white">
            Rate limit (requests per minute)
          </Label>
          <Input
            id="advanced-rate-limit"
            type="number"
            min={1}
            max={1000}
            value={rateLimit || ''}
            onChange={(e) => onRateLimitChange(parseInt(e.target.value, 10) || 0)}
            placeholder="60"
            className="bg-primary-700 text-white rounded p-3 placeholder:text-secondary-500 focus:ring-2 focus:ring-accent-500 transition duration-150 min-h-[44px]"
            aria-label="Rate limit in requests per minute"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="advanced-retention-days" className="text-white">
            Session retention (days)
          </Label>
          <Input
            id="advanced-retention-days"
            type="number"
            min={1}
            max={365}
            value={retentionDays || ''}
            onChange={(e) => onRetentionDaysChange(parseInt(e.target.value, 10) || 0)}
            placeholder="30"
            className="bg-primary-700 text-white rounded p-3 placeholder:text-secondary-500 focus:ring-2 focus:ring-accent-500 transition duration-150 min-h-[44px]"
            aria-label="Session retention in days"
            aria-describedby="advanced-retention-description"
          />
          <p id="advanced-retention-description" className="text-xs text-muted-foreground">
            How long to keep session data
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
