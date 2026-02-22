import { useParams, Link } from 'react-router-dom'
import {
  Copy,
  Send,
  User,
  Bot,
  FileJson,
  FileSpreadsheet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const mockSession = {
  id: 's1',
  agentName: 'Lead Capture',
  status: 'completed' as const,
  createdAt: '2025-02-22T10:30:00Z',
  messages: [
    { id: 'm1', sender: 'assistant' as const, content: "Hi! What's your name?", timestamp: '2025-02-22T10:30:00Z' },
    { id: 'm2', sender: 'user' as const, content: 'John Doe', timestamp: '2025-02-22T10:30:15Z' },
    { id: 'm3', sender: 'assistant' as const, content: "Thanks! What's your email?", timestamp: '2025-02-22T10:30:16Z' },
    { id: 'm4', sender: 'user' as const, content: 'john@example.com', timestamp: '2025-02-22T10:30:45Z' },
  ],
  capturedFields: [
    { fieldId: '1', type: 'text' as const, validatedValue: 'John Doe' },
    { fieldId: '2', type: 'email' as const, validatedValue: 'john@example.com' },
  ],
}

export function SessionViewerPage() {
  const { id } = useParams()

  const handleCopyTranscript = () => {
    const text = mockSession.messages
      .map((m) => `${m.sender}: ${m.content}`)
      .join('\n')
    navigator.clipboard.writeText(text)
    toast.success('Transcript copied')
  }

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(mockSession, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `session-${id}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported JSON')
  }

  const handleExportCsv = () => {
    const headers = mockSession.capturedFields.map((f) => f.fieldId).join(',')
    const row = mockSession.capturedFields
      .map((f) => String(f.validatedValue))
      .join(',')
    const csv = `${headers}\n${row}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `session-${id}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported CSV')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            to="/dashboard/sessions"
            className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
          >
            ← Back to sessions
          </Link>
          <h1 className="text-2xl font-semibold">Session {id}</h1>
          <p className="text-muted-foreground mt-1">
            {mockSession.agentName} · {mockSession.status} ·{' '}
            {new Date(mockSession.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyTranscript}>
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportJson}>
            <FileJson className="h-4 w-4" />
            JSON
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            <FileSpreadsheet className="h-4 w-4" />
            CSV
          </Button>
          <Button size="sm">
            <Send className="h-4 w-4" />
            Resend webhook
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transcript */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transcript</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleCopyTranscript}>
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {mockSession.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-3',
                    msg.sender === 'user' && 'flex-row-reverse'
                  )}
                >
                  {msg.sender === 'assistant' ? (
                    <Bot className="h-5 w-5 text-primary shrink-0" />
                  ) : (
                    <User className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                  <div
                    className={cn(
                      'rounded-lg px-3 py-2 text-sm max-w-[85%]',
                      msg.sender === 'assistant'
                        ? 'bg-muted'
                        : 'bg-primary/20'
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Structured fields */}
        <Card>
          <CardHeader>
            <CardTitle>Captured fields</CardTitle>
            <CardDescription>Extracted and validated values</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSession.capturedFields.map((field, i) => (
                <div key={field.fieldId} className="space-y-2">
                  <Label>Field {i + 1}</Label>
                  <Input
                    defaultValue={String(field.validatedValue)}
                    className="font-mono"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Add internal notes..." rows={3} />
            </div>
            <Button variant="secondary" className="mt-4">
              Mark reviewed
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
