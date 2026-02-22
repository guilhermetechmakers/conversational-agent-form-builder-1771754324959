import { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bot, User, Copy, MessageSquare, AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Message } from '@/types'

export interface EmptyStateCta {
  label: string
  to?: string
  onClick?: () => void
}

export interface SessionTranscriptProps {
  messages: Message[]
  onCopy?: () => void
  onCopyMessage?: (content: string) => void
  isLoading?: boolean
  error?: Error | null
  onRetry?: () => void
  emptyStateCta?: EmptyStateCta
}

const DEFAULT_EMPTY_CTA: EmptyStateCta = {
  label: 'Back to sessions',
  to: '/dashboard/sessions',
}

export function SessionTranscript({
  messages,
  onCopy,
  onCopyMessage,
  isLoading = false,
  error = null,
  onRetry,
  emptyStateCta = DEFAULT_EMPTY_CTA,
}: SessionTranscriptProps) {
  const effectiveEmptyCta = useMemo(() => {
    if (emptyStateCta.to || emptyStateCta.onClick) return emptyStateCta
    return { ...emptyStateCta, ...DEFAULT_EMPTY_CTA }
  }, [emptyStateCta])

  const handleCopyMessage = useCallback(
    (content: string) => {
      if (onCopyMessage) {
        onCopyMessage(content)
      } else {
        navigator.clipboard.writeText(content)
        toast.success('Message copied')
      }
    },
    [onCopyMessage]
  )

  return (
    <Card className="flex-1 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <h1 className="text-xl font-semibold leading-none tracking-tight">
          Transcript
        </h1>
        {onCopy && !isLoading && !error && messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className="text-primary hover:text-secondary-accent transition-all duration-200 hover:scale-[1.02]"
            aria-label="Copy transcript"
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div
            className="space-y-4"
            role="status"
            aria-label="Loading transcript"
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-12 bg-muted rounded-lg skeleton-shimmer animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div
            className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-border bg-background"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle
              className="h-12 w-12 text-notification mb-4"
              aria-hidden
            />
            <p className="text-sm font-medium text-notification">
              Failed to load transcript
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
              {error.message ??
                'An error occurred while loading the conversation.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              {onRetry && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onRetry}
                  className="gap-2"
                  aria-label="Retry loading transcript"
                >
                  <RotateCcw className="h-4 w-4" />
                  Retry
                </Button>
              )}
              <Button asChild variant="secondary" size="sm">
                <Link
                  to="/dashboard/sessions"
                  className="gap-2"
                  aria-label="Back to sessions list"
                >
                  Back to sessions
                </Link>
              </Button>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-12 text-center rounded-lg"
            role="status"
          >
            <MessageSquare
              className="h-12 w-12 text-muted-foreground mb-4"
              aria-hidden
            />
            <p className="text-lg font-semibold text-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              This session has no conversation transcript
            </p>
            {effectiveEmptyCta.to ? (
              <Button asChild className="mt-4" size="default">
                <Link to={effectiveEmptyCta.to}>{effectiveEmptyCta.label}</Link>
              </Button>
            ) : effectiveEmptyCta.onClick ? (
              <Button
                className="mt-4"
                size="default"
                onClick={effectiveEmptyCta.onClick}
              >
                {effectiveEmptyCta.label}
              </Button>
            ) : (
              <Button asChild className="mt-4" size="default">
                <Link to={DEFAULT_EMPTY_CTA.to!}>
                  {DEFAULT_EMPTY_CTA.label}
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div
            className="space-y-4 max-h-[400px] overflow-y-auto pr-2"
            role="log"
            aria-label="Conversation transcript"
          >
            {messages.map((msg, index) => (
              <div
                key={msg.id ?? index}
                className="flex gap-3 p-4 bg-background rounded-lg shadow-inner border border-border transition-all duration-200 hover:shadow-card"
              >
                <div
                  className={cn(
                    'flex gap-3 flex-1 min-w-0',
                    msg.sender === 'user' && 'flex-row-reverse'
                  )}
                >
                  {msg.sender === 'assistant' ? (
                    <Bot
                      className="h-5 w-5 text-primary shrink-0 mt-0.5"
                      aria-hidden
                    />
                  ) : (
                    <User
                      className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5"
                      aria-hidden
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{msg.content}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleCopyMessage(msg.content)}
                  className="ml-auto text-primary hover:text-secondary-accent shrink-0 transition-all duration-200 hover:scale-[1.02]"
                  aria-label={`Copy message from ${msg.sender}`}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
