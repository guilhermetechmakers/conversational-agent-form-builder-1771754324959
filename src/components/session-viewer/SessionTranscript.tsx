import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Bot, User, Copy, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <div className="flex-1 p-6 bg-[#23262B] rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Transcript</h2>
        {onCopy && !isLoading && !error && messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className="text-[#26C6FF] hover:text-[#00FF66] transition duration-150 ease-in-out"
            aria-label="Copy transcript"
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4" role="status" aria-label="Loading transcript">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-[#31343A] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div
          className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-[#31343A] bg-[#181B20]"
          role="alert"
        >
          <p className="text-sm text-[#FFD600]">Failed to load transcript</p>
          <p className="text-xs text-[#C0C6D1] mt-1 max-w-[240px]">
            {error.message ?? 'An error occurred while loading the conversation.'}
          </p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-4 px-4 py-2 bg-[#26C6FF] rounded-lg text-white hover:bg-[#00FF66] transition duration-150 ease-in-out"
            >
              Retry
            </Button>
          )}
        </div>
      ) : messages.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-12 text-center rounded-lg"
          role="status"
        >
          <MessageSquare className="h-12 w-12 text-[#C0C6D1] mb-4" />
          <p className="text-lg font-semibold mt-4">No messages yet</p>
          <p className="text-sm text-[#C0C6D1] mt-2">
            This session has no conversation transcript
          </p>
          {emptyStateCta.to ? (
            <Button
              asChild
              className="mt-4 px-4 py-2 bg-[#26C6FF] rounded-lg text-white hover:bg-[#00FF66] transition duration-150 ease-in-out"
            >
              <Link to={emptyStateCta.to}>{emptyStateCta.label}</Link>
            </Button>
          ) : emptyStateCta.onClick ? (
            <Button
              className="mt-4 px-4 py-2 bg-[#26C6FF] rounded-lg text-white hover:bg-[#00FF66] transition duration-150 ease-in-out"
              onClick={emptyStateCta.onClick}
            >
              {emptyStateCta.label}
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2" role="log">
          {messages.map((msg, index) => (
            <div
              key={msg.id ?? index}
              className="flex gap-3 p-4 bg-[#181B20] rounded-lg shadow-inner"
            >
              <div
                className={cn(
                  'flex gap-3 flex-1 min-w-0',
                  msg.sender === 'user' && 'flex-row-reverse'
                )}
              >
                {msg.sender === 'assistant' ? (
                  <Bot
                    className="h-5 w-5 text-[#26C6FF] shrink-0 mt-0.5"
                    aria-hidden
                  />
                ) : (
                  <User
                    className="h-5 w-5 text-[#C0C6D1] shrink-0 mt-0.5"
                    aria-hidden
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{msg.content}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopyMessage(msg.content)}
                className="ml-auto text-[#26C6FF] hover:text-[#00FF66] transition duration-150 ease-in-out shrink-0 p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#26C6FF]"
                aria-label={`Copy message from ${msg.sender}`}
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
