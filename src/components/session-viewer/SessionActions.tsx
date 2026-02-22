import {
  Copy,
  FileJson,
  FileSpreadsheet,
  Send,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface SessionActionsProps {
  onCopyTranscript?: () => void
  onExportJson?: () => void
  onExportCsv?: () => void
  onResendWebhook?: () => void
  isResendingWebhook?: boolean
}

export function SessionActions({
  onCopyTranscript,
  onExportJson,
  onExportCsv,
  onResendWebhook,
  isResendingWebhook = false,
}: SessionActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {onCopyTranscript && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCopyTranscript}
          className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
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
          className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
        >
          <FileJson className="h-4 w-4" />
          JSON
        </Button>
      )}
      {onExportCsv && (
        <Button
          variant="outline"
          size="sm"
          onClick={onExportCsv}
          className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
        >
          <FileSpreadsheet className="h-4 w-4" />
          CSV
        </Button>
      )}
      {onResendWebhook && (
        <Button
          size="sm"
          onClick={onResendWebhook}
          disabled={isResendingWebhook}
          className={cn(
            'transition-all duration-200 hover:scale-[1.02] hover:shadow-glow',
            isResendingWebhook && 'opacity-70'
          )}
        >
          {isResendingWebhook ? (
            <RotateCcw className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Resend webhook
        </Button>
      )}
    </div>
  )
}
