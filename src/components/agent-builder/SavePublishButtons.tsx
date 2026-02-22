import { Save, Send, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface SavePublishButtonsProps {
  status: 'draft' | 'published'
  isSaving?: boolean
  isPublishing?: boolean
  onSave: () => void
  onPublish: () => void
  validationErrors?: string[]
  canPublish?: boolean
}

export function SavePublishButtons({
  status,
  isSaving = false,
  isPublishing = false,
  onSave,
  onPublish,
  validationErrors = [],
  canPublish = true,
}: SavePublishButtonsProps) {
  const hasErrors = validationErrors.length > 0
  const isBusy = isSaving || isPublishing

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {hasErrors && (
        <div className="flex-1 text-sm text-destructive">
          {validationErrors[0]}
        </div>
      )}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={onSave}
          disabled={isBusy}
          className="transition-all duration-200 hover:scale-[1.02]"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Draft
        </Button>
        <Button
          onClick={onPublish}
          disabled={isBusy || !canPublish || hasErrors}
          className="transition-all duration-200 hover:scale-[1.02] hover:shadow-glow bg-gradient-to-r from-primary to-[rgb(var(--secondary-accent))]"
        >
          {isPublishing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : status === 'published' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {status === 'published' ? 'Published' : 'Publish'}
        </Button>
      </div>
      {status === 'published' && (
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-xs font-medium',
            'bg-[rgb(var(--success))]/20 text-[rgb(var(--success))]'
          )}
        >
          Live
        </span>
      )}
    </div>
  )
}
