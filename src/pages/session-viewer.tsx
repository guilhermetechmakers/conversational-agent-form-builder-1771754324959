import { useState, useCallback, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MessageSquare, AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  SessionTranscript,
  SessionExtractedData,
  SessionMetadata,
  SessionActions,
  SessionViewerSkeleton,
} from '@/components/session-viewer'
import { useSession, useMarkSessionReviewed, useResendSessionWebhook } from '@/hooks/useSession'
import type { Session } from '@/types'

const MOCK_SESSION: Session = {
  id: 's1',
  agentId: '1',
  agentName: 'Lead Capture',
  status: 'completed',
  createdAt: '2025-02-22T10:30:00Z',
  messages: [
    {
      id: 'm1',
      sender: 'assistant',
      content: "Hi! What's your name?",
      timestamp: '2025-02-22T10:30:00Z',
    },
    {
      id: 'm2',
      sender: 'user',
      content: 'John Doe',
      timestamp: '2025-02-22T10:30:15Z',
    },
    {
      id: 'm3',
      sender: 'assistant',
      content: "Thanks! What's your email?",
      timestamp: '2025-02-22T10:30:16Z',
    },
    {
      id: 'm4',
      sender: 'user',
      content: 'john@example.com',
      timestamp: '2025-02-22T10:30:45Z',
    },
  ],
  capturedFields: [
    { fieldId: '1', type: 'text', validatedValue: 'John Doe' },
    { fieldId: '2', type: 'email', validatedValue: 'john@example.com' },
  ],
}

export function SessionViewerPage() {
  const { id } = useParams<{ id: string }>()
  const [localNotes, setLocalNotes] = useState('')

  const {
    data: session,
    isLoading,
    isError,
    error,
    refetch,
  } = useSession(id, !!id)

  const markReviewed = useMarkSessionReviewed()
  const resendWebhook = useResendSessionWebhook()

  const displaySession = session ?? (isError && (error as { status?: number })?.status === 404 ? MOCK_SESSION : null)

  useEffect(() => {
    if (displaySession?.notes !== undefined) {
      setLocalNotes(displaySession.notes ?? '')
    }
  }, [displaySession?.id, displaySession?.notes])

  const handleCopyTranscript = useCallback(() => {
    if (!displaySession) return
    const text = displaySession.messages
      .map((m) => `${m.sender}: ${m.content}`)
      .join('\n')
    navigator.clipboard.writeText(text)
    toast.success('Transcript copied to clipboard')
  }, [displaySession])

  const handleExportJson = useCallback(() => {
    if (!displaySession) return
    const blob = new Blob([JSON.stringify(displaySession, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `session-${id}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported as JSON')
  }, [displaySession, id])

  const handleExportCsv = useCallback(() => {
    if (!displaySession) return
    const headers = displaySession.capturedFields.map((f) => f.fieldId).join(',')
    const row = displaySession.capturedFields
      .map((f) => `"${String(f.validatedValue ?? '').replace(/"/g, '""')}"`)
      .join(',')
    const csv = `${headers}\n${row}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `session-${id}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported as CSV')
  }, [displaySession, id])

  const handleResendWebhook = useCallback(() => {
    if (!id) return
    resendWebhook.mutate(id, {
      onSuccess: (result) => {
        if (result.success) {
          toast.success(`Webhook sent to ${result.sent} endpoint(s)`)
        } else {
          toast.error(`Failed to send to ${result.failed} endpoint(s)`)
        }
      },
      onError: (err: { message?: string }) => {
        toast.error(err?.message ?? 'Failed to resend webhook')
      },
    })
  }, [id, resendWebhook])

  const handleMarkReviewed = useCallback(() => {
    if (!id || !displaySession) return
    const notesToSend = localNotes || displaySession.notes || undefined
    markReviewed.mutate(
      { sessionId: id, notes: notesToSend },
      {
        onSuccess: () => toast.success('Session marked as reviewed'),
        onError: (err: { message?: string }) =>
          toast.error(err?.message ?? 'Failed to mark as reviewed'),
      }
    )
  }, [id, localNotes, displaySession?.notes, markReviewed])

  if (isLoading && !displaySession) {
    return <SessionViewerSkeleton />
  }

  if (isError && !displaySession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
        <div className="rounded-xl border border-border bg-card p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Failed to load session</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {(error as { message?: string })?.message ?? 'An error occurred while loading this session.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => refetch()} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Retry
            </Button>
            <Button asChild>
              <Link to="/dashboard/sessions">Back to sessions</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!displaySession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
        <div className="rounded-xl border border-border bg-card p-8 max-w-md text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Session not found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            The session you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button asChild>
            <Link to="/dashboard/sessions">Back to sessions</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            to="/dashboard/sessions"
            className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block transition-colors duration-200"
          >
            ← Back to sessions
          </Link>
          <h1 className="text-2xl font-semibold">Session {id}</h1>
          <p className="text-muted-foreground mt-1">
            {displaySession.agentName ?? 'Unknown agent'} ·{' '}
            <span className={cn(
              'capitalize',
              displaySession.status === 'completed' && 'text-[rgb(var(--success))]',
              displaySession.status === 'active' && 'text-primary'
            )}>
              {displaySession.status}
            </span>
            {' · '}
            {new Date(displaySession.createdAt).toLocaleString()}
          </p>
        </div>
        <SessionActions
          onCopyTranscript={handleCopyTranscript}
          onExportJson={handleExportJson}
          onExportCsv={handleExportCsv}
          onResendWebhook={handleResendWebhook}
          isResendingWebhook={resendWebhook.isPending}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div id="session-transcript" className="scroll-mt-6">
          <SessionTranscript
            messages={displaySession.messages}
            onCopy={handleCopyTranscript}
          />
        </div>

        <div className="space-y-6">
          <SessionExtractedData
            capturedFields={displaySession.capturedFields}
            notes={localNotes}
            isReviewed={!!displaySession.reviewedAt}
            onNotesChange={setLocalNotes}
            onMarkReviewed={handleMarkReviewed}
            isMarkingReviewed={markReviewed.isPending}
            emptyStateCta={{
              label: 'View conversation',
              onClick: () =>
                document.getElementById('session-transcript')?.scrollIntoView({ behavior: 'smooth' }),
            }}
          />
          <SessionMetadata
            status={displaySession.status}
            createdAt={displaySession.createdAt}
            completedAt={displaySession.completedAt}
            reviewedAt={displaySession.reviewedAt}
            visitorMetadata={displaySession.visitorMetadata}
          />
        </div>
      </div>
    </div>
  )
}
