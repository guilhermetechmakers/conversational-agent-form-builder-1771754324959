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
        <div className="flex-1 text-sm text-warning-500 font-medium">
          {validationErrors[0]}
        </div>
      )}
      <div className="flex gap-2">
        <Button
          onClick={onSave}
          disabled={isBusy}
          className="bg-accent-500 text-white rounded px-4 py-2 hover:bg-accent-600 transition duration-150 hover:scale-[1.02]"
          aria-label={isSaving ? 'Saving draft' : 'Save draft'}
          aria-busy={isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Save className="h-4 w-4" aria-hidden />
          )}
          Save Draft
        </Button>
        <Button
          onClick={onPublish}
          disabled={isBusy || !canPublish || hasErrors}
          className="bg-success text-primary-foreground rounded px-4 py-2 hover:bg-success/90 transition duration-150 hover:scale-[1.02]"
          aria-label={
            isPublishing
              ? 'Publishing agent'
              : status === 'published'
                ? 'Agent is published'
                : 'Publish agent'
          }
          aria-busy={isPublishing}
        >
          {isPublishing ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : status === 'published' ? (
            <CheckCircle className="h-4 w-4" aria-hidden />
          ) : (
            <Send className="h-4 w-4" aria-hidden />
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
