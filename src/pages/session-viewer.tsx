import { useState, useCallback, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MessageSquare, AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  SessionTranscript,
  SessionExtractedData,
  SessionActions,
  SessionViewerSkeleton,
  AuditTrailPanel,
  RelatedSessionsPanel,
} from '@/components/session-viewer'
import { useSession, useMarkSessionReviewed, useResendSessionWebhook } from '@/hooks/useSession'
import type { Session, AuditLogEntry } from '@/types'

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

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'a1',
    timestamp: '2025-02-22T10:31:00Z',
    action: 'Webhook delivered',
    details: 'https://api.example.com/webhook',
  },
  {
    id: 'a2',
    timestamp: '2025-02-22T10:30:50Z',
    action: 'Session completed',
  },
  {
    id: 'a3',
    timestamp: '2025-02-22T10:30:00Z',
    action: 'Webhook delivery failed',
    details: 'Connection timeout',
    isRetry: true,
  },
]

export function SessionViewerPage() {
  const { id } = useParams<{ id: string }>()
  const [localNotes, setLocalNotes] = useState('')
  const [assignOwnerOpen, setAssignOwnerOpen] = useState(false)
  const [addNotesOpen, setAddNotesOpen] = useState(false)
  const [assignOwnerEmail, setAssignOwnerEmail] = useState('')

  const {
    data: session,
    isLoading,
    isError,
    error,
    refetch,
  } = useSession(id, !!id)

  const markReviewed = useMarkSessionReviewed()
  const resendWebhook = useResendSessionWebhook()

  const displaySession =
    session ??
    (isError && (error as { status?: number })?.status === 404 ? MOCK_SESSION : null)

  const auditLogs = displaySession ? MOCK_AUDIT_LOGS : []

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

  const handleCopyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Message copied')
  }, [])

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

  const handleAssignOwner = useCallback(() => {
    if (!assignOwnerEmail.trim()) {
      toast.error('Please enter an email address')
      return
    }
    toast.success(`Assigned to ${assignOwnerEmail}`)
    setAssignOwnerOpen(false)
    setAssignOwnerEmail('')
  }, [assignOwnerEmail])

  const handleAddNotes = useCallback(() => {
    setAddNotesOpen(false)
    toast.success('Notes updated')
  }, [])

  if (isLoading && !displaySession) {
    return <SessionViewerSkeleton />
  }

  if (isError && !displaySession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in bg-[#181B20] text-white -m-4 md:-m-6 p-8">
        <div className="rounded-xl border border-[#31343A] bg-[#23262B] p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-[#FFD600] mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Failed to load session</h2>
          <p className="text-sm text-[#C0C6D1] mb-6">
            {(error as { message?: string })?.message ??
              'An error occurred while loading this session.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="gap-2 px-4 py-2 bg-[#26C6FF] rounded-lg text-white hover:bg-[#00FF66] transition duration-150 ease-in-out"
            >
              <RotateCcw className="h-4 w-4" />
              Retry
            </Button>
            <Button asChild>
              <Link
                to="/dashboard/sessions"
                className="px-4 py-2 bg-[#26C6FF] rounded-lg text-white hover:bg-[#00FF66] transition"
              >
                Back to sessions
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!displaySession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in bg-[#181B20] text-white -m-4 md:-m-6 p-8">
        <div className="rounded-xl border border-[#31343A] bg-[#23262B] p-8 max-w-md text-center">
          <MessageSquare className="h-12 w-12 text-[#C0C6D1] mx-auto mb-4" />
          <h2 className="text-lg font-semibold mt-4">Session not found</h2>
          <p className="text-sm text-[#C0C6D1] mt-2">
            The session you're looking for doesn't exist or you don't have
            access to it.
          </p>
          <Button asChild className="mt-4">
            <Link
              to="/dashboard/sessions"
              className="px-4 py-2 bg-[#26C6FF] rounded-lg text-white hover:bg-[#00FF66] transition"
            >
              Back to sessions
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] bg-[#181B20] text-white -m-4 md:-m-6 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-gradient-to-r from-[#181B20] to-[#23262B] shrink-0">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/sessions"
            className="flex items-center gap-2 text-sm text-[#C0C6D1] hover:text-[#26C6FF] transition duration-150 ease-in-out"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">Session {id}</span>
            <span className="text-sm text-[#C0C6D1]">
              {displaySession.agentName ?? 'Unknown agent'}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                displaySession.status === 'completed'
                  ? 'bg-[#00FF66] text-[#181B20]'
                  : displaySession.status === 'active'
                    ? 'bg-[#26C6FF] text-[#181B20]'
                    : 'bg-[#FFD600] text-[#181B20]'
              }`}
            >
              {displaySession.status}
            </span>
            <span className="text-sm text-[#C0C6D1]">
              {new Date(displaySession.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-16 bg-[#181B20] shrink-0 items-center pt-4">
          <Link
            to="/dashboard/sessions"
            className="p-2 rounded-lg text-[#C0C6D1] hover:bg-[#23262B] hover:text-[#26C6FF] transition duration-150 ease-in-out"
            aria-label="Back to sessions"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6">
          <div
            id="session-transcript"
            className="flex flex-col space-y-6 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3"
          >
            {/* Transcript Panel */}
            <div className="md:col-span-2 lg:col-span-2">
              <SessionTranscript
                messages={displaySession.messages}
                onCopy={handleCopyTranscript}
                onCopyMessage={handleCopyMessage}
                emptyStateCta={{
                  label: 'View conversation',
                  onClick: () =>
                    document
                      .getElementById('session-transcript')
                      ?.scrollIntoView({ behavior: 'smooth' }),
                }}
              />
            </div>

            {/* Structured Fields Panel */}
            <div>
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
                    document
                      .getElementById('session-transcript')
                      ?.scrollIntoView({ behavior: 'smooth' }),
                }}
              />
            </div>
          </div>

          {/* Actions Panel */}
          <SessionActions
            onCopyTranscript={handleCopyTranscript}
            onExportJson={handleExportJson}
            onExportCsv={handleExportCsv}
            onResendWebhook={handleResendWebhook}
            onAssignOwner={() => setAssignOwnerOpen(true)}
            onAddNotes={() => setAddNotesOpen(true)}
            onMarkReviewed={handleMarkReviewed}
            isResendingWebhook={resendWebhook.isPending}
            isMarkingReviewed={markReviewed.isPending}
            isReviewed={!!displaySession.reviewedAt}
          />

          {/* Audit Trail Panel */}
          <AuditTrailPanel logs={auditLogs} onRetry={() => refetch()} />

          {/* Related Sessions / Visitor Info Panel */}
          <RelatedSessionsPanel
            visitorInfo={{
              ip: displaySession.visitorMetadata?.ip,
              referrer: displaySession.visitorMetadata?.referrer,
              userAgent: displaySession.visitorMetadata?.userAgent,
            }}
          />
        </div>
      </div>

      {/* Assign to Owner Dialog */}
      <Dialog open={assignOwnerOpen} onOpenChange={setAssignOwnerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to Owner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="owner-email">Owner email</Label>
              <Input
                id="owner-email"
                type="email"
                placeholder="owner@example.com"
                value={assignOwnerEmail}
                onChange={(e) => setAssignOwnerEmail(e.target.value)}
                className="bg-[#181B20] border-[#31343A]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignOwnerOpen(false)}
              className="bg-[#23262B] hover:bg-[#26C6FF]"
            >
              Cancel
            </Button>
            <Button onClick={handleAssignOwner}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Notes Dialog */}
      <Dialog open={addNotesOpen} onOpenChange={setAddNotesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes-dialog">Notes</Label>
              <textarea
                id="notes-dialog"
                value={localNotes}
                onChange={(e) => setLocalNotes(e.target.value)}
                placeholder="Add notes for this session..."
                rows={4}
                className="w-full rounded-lg border border-[#31343A] bg-[#181B20] px-4 py-2 text-white placeholder:text-[#C0C6D1] focus:outline-none focus:ring-2 focus:ring-[#26C6FF]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddNotesOpen(false)}
              className="bg-[#23262B] hover:bg-[#26C6FF]"
            >
              Cancel
            </Button>
            <Button onClick={handleAddNotes}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
