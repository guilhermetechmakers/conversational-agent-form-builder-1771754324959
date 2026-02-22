import { Link } from 'react-router-dom'
import { Bot, User, Copy, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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
  isLoading = false,
  error = null,
  onRetry,
  emptyStateCta = DEFAULT_EMPTY_CTA,
}: SessionTranscriptProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h2
          id="transcript-heading"
          className="text-lg font-semibold leading-none tracking-tight text-card-foreground"
        >
          Transcript
        </h2>
        {onCopy && !isLoading && !error && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className="transition-transform duration-200 hover:scale-[1.02]"
            aria-label="Copy transcript"
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4 max-h-[400px]" role="status" aria-label="Loading transcript">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-5 w-5 shrink-0 rounded" />
                <Skeleton
                  className="h-12 rounded-lg bg-muted"
                  style={{ width: `${60 + (i % 3) * 15}%` }}
                />
              </div>
            ))}
          </div>
        ) : error ? (
          <div
            className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-border bg-muted/30"
            role="alert"
          >
            <AlertCircle className="h-12 w-12 text-destructive mb-4" aria-hidden />
            <p className="text-sm font-medium text-foreground">Failed to load transcript</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
              {error.message ?? 'An error occurred while loading the conversation.'}
            </p>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="mt-4 transition-all duration-200 hover:scale-[1.02]"
              >
                Try again
              </Button>
            )}
          </div>
        ) : messages.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-border"
            role="status"
          >
            <Bot className="h-12 w-12 text-muted-foreground/50 mb-4" aria-hidden />
            <p className="text-sm font-medium text-muted-foreground">No messages yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              This session has no conversation transcript
            </p>
            {emptyStateCta.to ? (
              <Button asChild variant="default" size="sm" className="transition-all duration-200 hover:scale-[1.02]">
                <Link to={emptyStateCta.to}>{emptyStateCta.label}</Link>
              </Button>
            ) : emptyStateCta.onClick ? (
              <Button
                variant="default"
                size="sm"
                onClick={emptyStateCta.onClick}
                className="transition-all duration-200 hover:scale-[1.02]"
              >
                {emptyStateCta.label}
              </Button>
            ) : null}
          </div>
        ) : (
          <div
            className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin"
            role="log"
            aria-labelledby="transcript-heading"
            aria-label="Conversation transcript"
          >
            {messages.map((msg, index) => (
              <div
                key={msg.id ?? index}
                className={cn(
                  'flex gap-3 animate-fade-in',
                  msg.sender === 'user' && 'flex-row-reverse'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
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
                <div
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm max-w-[85%] transition-all duration-200',
                    msg.sender === 'assistant'
                      ? 'bg-muted text-foreground'
                      : 'bg-primary/20 text-foreground'
                  )}
                >
                  <span className="prose prose-sm dark:prose-invert max-w-none text-inherit">
                    {msg.content}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
