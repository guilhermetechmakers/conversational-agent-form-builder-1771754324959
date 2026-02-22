import { useState, useRef, useEffect } from 'react'
import { Eye, Send, Bot, MessageCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { AgentField, Message } from '@/types'

const PREVIEW_MESSAGE_INPUT_ID = 'preview-message-input'

export interface PreviewPaneProps {
  agentName: string
  primaryColor: string
  accentColor: string
  theme: 'light' | 'dark'
  avatarUrl?: string
  fields: AgentField[]
  systemInstructions?: string
  /** When true, shows skeleton loader instead of preview content */
  isLoading?: boolean
  /** Optional error message to display inline below the input */
  error?: string
}

export function PreviewPane({
  agentName,
  primaryColor,
  accentColor,
  theme,
  avatarUrl,
  fields,
  isLoading = false,
  error,
}: PreviewPaneProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      content: "Hi! I'm your conversational assistant. I'll help you provide the information we need. What's your name?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    const text = input.trim()
    if (isStreaming) return

    if (!text) {
      setInputError('Please enter a message')
      return
    }
    setInputError(null)

    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setIsStreaming(true)

    // Mock response for preview
    setTimeout(() => {
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        sender: 'assistant',
        content: "Thanks! I've got that. Could you share your email address?",
        timestamp: new Date().toISOString(),
      }
      setMessages((m) => [...m, assistantMsg])
      setIsStreaming(false)
    }, 600)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    if (inputError) setInputError(null)
  }

  const progress = Math.min(
    Math.round((messages.filter((m) => m.sender === 'user').length / Math.max(fields.length, 1)) * 100),
    100
  )

  const isDark = theme === 'dark'
  const displayError = error ?? inputError

  return (
    <Card className="bg-secondary-800 p-4 sm:p-6 rounded-lg shadow-md sticky top-24 overflow-hidden transition-all duration-300 hover:shadow-card-hover border-divider">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" aria-hidden />
          Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <PreviewSkeleton isDark={isDark} />
        ) : (
          <div
            className={cn(
              'rounded-b-xl border-t min-h-[400px] flex flex-col',
              isDark ? 'bg-preview-bg-dark' : 'bg-preview-bg-light'
            )}
            style={{
              ['--preview-primary' as string]: primaryColor,
              ['--preview-accent' as string]: accentColor,
            }}
          >
            {/* Header */}
            <header
              className={cn(
                'flex items-center gap-3 px-4 py-3 border-b',
                isDark ? 'border-preview-border-dark' : 'border-preview-border-light'
              )}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Agent avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium bg-[var(--preview-primary)]"
                  aria-hidden
                >
                  <Bot className="h-5 w-5" aria-hidden />
                </div>
              )}
              <div>
                <h2
                  className={cn(
                    'font-semibold',
                    isDark ? 'text-preview-fg-dark' : 'text-preview-fg-light'
                  )}
                >
                  {agentName || 'Agent name'}
                </h2>
                <p
                  className={cn(
                    'text-xs',
                    isDark ? 'text-muted-foreground' : 'text-muted-foreground'
                  )}
                >
                  Conversational form
                </p>
              </div>
            </header>

            {/* Progress */}
            <div
              className={cn(
                'px-4 py-2 border-b',
                isDark ? 'border-preview-border-dark' : 'border-preview-border-light'
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-sm',
                    isDark ? 'text-muted-foreground' : 'text-muted-foreground'
                  )}
                >
                  Progress:
                </span>
                <div className="flex-1 h-2 rounded-full overflow-hidden bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-300 bg-[var(--preview-primary)]"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Form completion progress"
                  />
                </div>
                <span
                  className={cn(
                    'text-sm font-medium',
                    isDark ? 'text-preview-fg-dark' : 'text-preview-fg-light'
                  )}
                >
                  {progress}%
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
              {messages.length === 0 ? (
                <EmptyMessagesState isDark={isDark} />
              ) : (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex gap-3 animate-fade-in',
                        msg.sender === 'user' && 'flex-row-reverse'
                      )}
                    >
                      {msg.sender === 'assistant' && (
                        <div
                          className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-white bg-[var(--preview-primary)]"
                          aria-hidden
                        >
                          <Bot className="h-4 w-4" aria-hidden />
                        </div>
                      )}
                      <div
                        className={cn(
                          'max-w-[80%] rounded-xl px-4 py-2.5',
                          msg.sender === 'assistant'
                            ? isDark
                              ? 'bg-white/10 text-preview-fg-dark'
                              : 'bg-white border border-preview-border-light shadow-sm text-preview-fg-light'
                            : 'bg-[var(--preview-primary)] text-white'
                        )}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isStreaming && (
                    <div className="flex gap-3">
                      <div
                        className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-white bg-[var(--preview-primary)]"
                        aria-hidden
                      >
                        <Bot className="h-4 w-4" aria-hidden />
                      </div>
                      <div
                        className={cn(
                          'rounded-xl px-4 py-2.5',
                          isDark ? 'bg-white/10' : 'bg-white border border-preview-border-light'
                        )}
                      >
                        <div className="flex gap-1" aria-label="Agent is typing">
                          <span
                            className="w-2 h-2 rounded-full animate-pulse bg-[var(--preview-primary)] opacity-60"
                            style={{ animationDelay: '0s' }}
                          />
                          <span
                            className="w-2 h-2 rounded-full animate-pulse bg-[var(--preview-primary)] opacity-60"
                            style={{ animationDelay: '0.2s' }}
                          />
                          <span
                            className="w-2 h-2 rounded-full animate-pulse bg-[var(--preview-primary)] opacity-60"
                            style={{ animationDelay: '0.4s' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className={cn(
                'p-4 border-t',
                isDark ? 'border-preview-border-dark' : 'border-preview-border-light'
              )}
            >
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="flex-1 min-w-0">
                    <Label
                      htmlFor={PREVIEW_MESSAGE_INPUT_ID}
                      className="sr-only"
                    >
                      Type your message
                    </Label>
                    <Input
                      id={PREVIEW_MESSAGE_INPUT_ID}
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type your message..."
                      disabled={isStreaming}
                      className={cn(
                        'flex-1',
                        displayError && 'border-destructive focus-visible:ring-destructive'
                      )}
                      aria-invalid={!!displayError}
                      aria-describedby={displayError ? 'preview-input-error' : undefined}
                    />
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isStreaming}
                    size="icon"
                    className="bg-[var(--preview-primary)] text-white hover:opacity-90 shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
                {displayError && (
                  <div
                    id="preview-input-error"
                    className="flex items-center gap-2 text-sm text-destructive animate-fade-in"
                    role="alert"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
                    <span>{displayError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function PreviewSkeleton({ isDark }: { isDark: boolean }) {
  return (
    <div
      className={cn(
        'rounded-b-xl border-t min-h-[400px] flex flex-col',
        isDark ? 'bg-preview-bg-dark' : 'bg-preview-bg-light'
      )}
    >
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 border-b',
          isDark ? 'border-preview-border-dark' : 'border-preview-border-light'
        )}
      >
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div
        className={cn(
          'px-4 py-2 border-b',
          isDark ? 'border-preview-border-dark' : 'border-preview-border-light'
        )}
      >
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="flex-1 h-2 rounded-full" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
      <div className="flex-1 p-4 space-y-4 min-h-[200px]">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <Skeleton className="h-12 flex-1 max-w-[80%] rounded-xl" />
          </div>
        ))}
      </div>
      <div
        className={cn(
          'p-4 border-t',
          isDark ? 'border-preview-border-dark' : 'border-preview-border-light'
        )}
      >
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
        </div>
      </div>
    </div>
  )
}

function EmptyMessagesState({ isDark }: { isDark: boolean }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        isDark ? 'text-white/60' : 'text-black/50'
      )}
    >
      <div
        className={cn(
          'rounded-full p-4 mb-4 flex items-center justify-center',
          isDark ? 'bg-white/10' : 'bg-black/5'
        )}
        aria-hidden
      >
        <MessageCircle className={cn('h-10 w-10', isDark ? 'text-white/60' : 'text-black/50')} aria-hidden />
      </div>
      <p className="text-sm font-medium mb-1">No messages yet</p>
      <p className="text-xs max-w-[200px]">
        Start the conversation by typing a message below.
      </p>
    </div>
  )
}
