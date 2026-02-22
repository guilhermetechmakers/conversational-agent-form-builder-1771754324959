import {
  Copy,
  FileJson,
  FileSpreadsheet,
  Send,
  RotateCcw,
  UserPlus,
  StickyNote,
  CheckCircle,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

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

const BUTTON_BASE_CLASSES =
  'transition-all duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

function hasAnyAction(props: SessionActionsProps): boolean {
  return !!(
    props.onCopyTranscript ||
    props.onExportJson ||
    props.onExportCsv ||
    props.onResendWebhook ||
    props.onAssignOwner ||
    props.onAddNotes ||
    props.onMarkReviewed
  )
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
  const actions = [
    onCopyTranscript && {
      key: 'copy',
      label: 'Copy',
      onClick: onCopyTranscript,
      variant: 'outline' as const,
      icon: Copy,
      ariaLabel: 'Copy transcript to clipboard',
    },
    onExportJson && {
      key: 'export-json',
      label: 'Export JSON',
      onClick: onExportJson,
      variant: 'outline' as const,
      icon: FileJson,
      ariaLabel: 'Export session as JSON',
    },
    onExportCsv && {
      key: 'export-csv',
      label: 'Export CSV',
      onClick: onExportCsv,
      variant: 'outline' as const,
      icon: FileSpreadsheet,
      ariaLabel: 'Export session as CSV',
    },
    onResendWebhook && {
      key: 'webhook',
      label: 'Forward to Webhook',
      onClick: onResendWebhook,
      variant: 'default' as const,
      icon: Send,
      ariaLabel: isResendingWebhook ? 'Resending webhook' : 'Forward to webhook',
      isLoading: isResendingWebhook,
      disabled: isResendingWebhook,
    },
    onAssignOwner && {
      key: 'assign',
      label: 'Assign to Owner',
      onClick: onAssignOwner,
      variant: 'outline' as const,
      icon: UserPlus,
      ariaLabel: 'Assign session to owner',
    },
    onAddNotes && {
      key: 'notes',
      label: 'Add Notes',
      onClick: onAddNotes,
      variant: 'outline' as const,
      icon: StickyNote,
      ariaLabel: 'Add notes to session',
    },
    onMarkReviewed && {
      key: 'reviewed',
      label: 'Mark Reviewed',
      onClick: onMarkReviewed,
      variant: 'default' as const,
      icon: CheckCircle,
      ariaLabel: isReviewed
        ? 'Session already reviewed'
        : isMarkingReviewed
          ? 'Marking as reviewed'
          : 'Mark session as reviewed',
      isLoading: isMarkingReviewed,
      disabled: isMarkingReviewed || isReviewed,
    },
  ].filter(Boolean) as Array<{
    key: string
    label: string
    onClick: () => void
    variant: 'default' | 'outline'
    icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
    ariaLabel: string
    isLoading?: boolean
    disabled?: boolean
  }>

  if (!hasAnyAction({ onCopyTranscript, onExportJson, onExportCsv, onResendWebhook, onAssignOwner, onAddNotes, onMarkReviewed })) {
    return (
      <Card className="mt-4 sm:mt-6">
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold">Actions</h2>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center py-8 sm:py-12 text-center"
            role="status"
          >
            <Zap
              className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4"
              aria-hidden
            />
            <p className="text-sm font-medium text-muted-foreground mb-1">
              No actions available
            </p>
            <p className="text-xs text-muted-foreground max-w-sm">
              Session actions will appear here when available for this session.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-4 sm:mt-6">
      <CardHeader className="pb-2">
        <h2 className="text-lg font-semibold">Actions</h2>
      </CardHeader>
      <CardContent>
        <div
          className="flex flex-wrap gap-3 sm:gap-4"
          role="group"
          aria-label="Session actions"
        >
          {actions.map(({ key, label, onClick, variant, icon: Icon, ariaLabel, isLoading, disabled }) => (
            <Button
              key={key}
              variant={variant}
              size="sm"
              onClick={onClick}
              disabled={disabled}
              className={BUTTON_BASE_CLASSES}
              aria-label={ariaLabel}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <RotateCcw className="h-4 w-4 animate-spin shrink-0" aria-hidden />
              ) : (
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
              )}
              {label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
