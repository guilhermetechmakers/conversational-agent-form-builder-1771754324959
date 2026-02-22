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
  return (
    <div className="flex flex-wrap gap-4 mt-6">
      {onCopyTranscript && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCopyTranscript}
          className="px-4 py-2 bg-[#23262B] rounded-lg shadow-md hover:bg-[#26C6FF] hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#26C6FF]"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
      )}
      {onExportJson && (
        <Button
          variant="outline"
          size="sm"
          onClick={onExportJson}
          className="px-4 py-2 bg-[#23262B] rounded-lg shadow-md hover:bg-[#26C6FF] hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#26C6FF]"
        >
          <FileJson className="h-4 w-4" />
          Export JSON
        </Button>
      )}
      {onExportCsv && (
        <Button
          variant="outline"
          size="sm"
          onClick={onExportCsv}
          className="px-4 py-2 bg-[#23262B] rounded-lg shadow-md hover:bg-[#26C6FF] hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#26C6FF]"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export CSV
        </Button>
      )}
      {onResendWebhook && (
        <Button
          size="sm"
          onClick={onResendWebhook}
          disabled={isResendingWebhook}
          className={cn(
            'px-4 py-2 bg-[#23262B] rounded-lg shadow-md hover:bg-[#26C6FF] hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#26C6FF]',
            isResendingWebhook && 'opacity-70'
          )}
        >
          {isResendingWebhook ? (
            <RotateCcw className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Forward to Webhook
        </Button>
      )}
      {onAssignOwner && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAssignOwner}
          className="px-4 py-2 bg-[#23262B] rounded-lg shadow-md hover:bg-[#26C6FF] hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#26C6FF]"
        >
          <UserPlus className="h-4 w-4" />
          Assign to Owner
        </Button>
      )}
      {onAddNotes && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAddNotes}
          className="px-4 py-2 bg-[#23262B] rounded-lg shadow-md hover:bg-[#26C6FF] hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#26C6FF]"
        >
          <StickyNote className="h-4 w-4" />
          Add Notes
        </Button>
      )}
      {onMarkReviewed && (
        <Button
          size="sm"
          onClick={onMarkReviewed}
          disabled={isMarkingReviewed || isReviewed}
          className={cn(
            'px-4 py-2 bg-[#23262B] rounded-lg shadow-md hover:bg-[#26C6FF] hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#26C6FF]',
            (isMarkingReviewed || isReviewed) && 'opacity-75'
          )}
        >
          {isMarkingReviewed ? (
            <RotateCcw className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Mark Reviewed
        </Button>
      )}
    </div>
  )
}
