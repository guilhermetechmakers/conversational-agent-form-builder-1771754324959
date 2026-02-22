import { Bot, User, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Message } from '@/types'

export interface SessionTranscriptProps {
  messages: Message[]
  onCopy?: () => void
}

export function SessionTranscript({ messages, onCopy }: SessionTranscriptProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Transcript</CardTitle>
        {onCopy && (
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
        <div
          className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin"
          role="log"
          aria-label="Conversation transcript"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bot className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-sm font-medium text-muted-foreground">No messages yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                This session has no conversation transcript
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
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
                      ? 'bg-muted'
                      : 'bg-primary/20 text-primary-foreground'
                  )}
                >
                  <span className="prose prose-sm dark:prose-invert max-w-none">
                    {msg.content}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
