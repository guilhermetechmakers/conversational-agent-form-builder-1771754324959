import {
  Copy,
  FileJson,
  FileSpreadsheet,
  Send,
  RotateCcw,
  UserPlus,
  StickyNote,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface SessionActionsProps {
  onCopyTranscript?: () => void
  onExportJson?: () => void
  onExportCsv?: () => void
  onResendWebhook?: () => void
  onAssignOwner?: () => void
  onAddNotes?: () => void
  onMarkReviewed?: () => void
  isResendingWebhook?: boolean
  isMarkingReviewed?: boolean
  isReviewed?: boolean
}

export function SessionActions({
  onCopyTranscript,
  onExportJson,
  onExportCsv,
  onResendWebhook,
  onAssignOwner,
  onAddNotes,
  onMarkReviewed,
  isResendingWebhook = false,
  isMarkingReviewed = false,
  isReviewed = false,
}: SessionActionsProps) {
  const buttonClasses =
    'transition-all duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'

  return (
    <div className="flex flex-wrap gap-3 sm:gap-4 mt-6" role="group" aria-label="Session actions">
      {onCopyTranscript && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCopyTranscript}
          className={buttonClasses}
          aria-label="Copy transcript to clipboard"
        >
          <Copy className="h-4 w-4" aria-hidden />
          Copy
        </Button>
      )}
      {onExportJson && (
        <Button
          variant="outline"
          size="sm"
          onClick={onExportJson}
          className={buttonClasses}
          aria-label="Export session as JSON"
        >
          <FileJson className="h-4 w-4" aria-hidden />
          Export JSON
        </Button>
      )}
      {onExportCsv && (
        <Button
          variant="outline"
          size="sm"
          onClick={onExportCsv}
          className={buttonClasses}
          aria-label="Export session as CSV"
        >
          <FileSpreadsheet className="h-4 w-4" aria-hidden />
          Export CSV
        </Button>
      )}
      {onResendWebhook && (
        <Button
          size="sm"
          onClick={onResendWebhook}
          disabled={isResendingWebhook}
          className={cn(buttonClasses, isResendingWebhook && 'opacity-70')}
          aria-label={isResendingWebhook ? 'Resending webhook' : 'Forward to webhook'}
        >
          {isResendingWebhook ? (
            <RotateCcw className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Send className="h-4 w-4" aria-hidden />
          )}
          Forward to Webhook
        </Button>
      )}
      {onAssignOwner && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAssignOwner}
          className={buttonClasses}
          aria-label="Assign session to owner"
        >
          <UserPlus className="h-4 w-4" aria-hidden />
          Assign to Owner
        </Button>
      )}
      {onAddNotes && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAddNotes}
          className={buttonClasses}
          aria-label="Add notes to session"
        >
          <StickyNote className="h-4 w-4" aria-hidden />
          Add Notes
        </Button>
      )}
      {onMarkReviewed && (
        <Button
          size="sm"
          onClick={onMarkReviewed}
          disabled={isMarkingReviewed || isReviewed}
          className={cn(buttonClasses, (isMarkingReviewed || isReviewed) && 'opacity-75')}
          aria-label={
            isReviewed
              ? 'Session already reviewed'
              : isMarkingReviewed
                ? 'Marking as reviewed'
                : 'Mark session as reviewed'
          }
        >
          {isMarkingReviewed ? (
            <RotateCcw className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <CheckCircle className="h-4 w-4" aria-hidden />
          )}
          Mark Reviewed
        </Button>
      )}
    </div>
  )
}
