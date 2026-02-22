import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Bot, Send, MessageCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useAgentBySlug, getWelcomeMessage } from '@/hooks/usePublicChat'
import type { Message } from '@/types'

function ChatSkeleton() {
  return (
    <div className="p-4 space-y-4" role="status" aria-label="Loading chat">
      <div className="space-y-2">
        <Skeleton className="h-10 w-full skeleton-shimmer" />
        <Skeleton className="h-6 w-3/4 skeleton-shimmer" />
        <Skeleton className="h-6 w-1/2 skeleton-shimmer" />
        <Skeleton className="h-6 w-2/3 skeleton-shimmer" />
        <Skeleton className="h-6 w-1/3 skeleton-shimmer" />
      </div>
      <div className="pt-8">
        <Skeleton className="h-10 w-full skeleton-shimmer" />
      </div>
    </div>
  )
}

function MessagesEmptyState({ onStart }: { onStart: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      role="status"
      aria-live="polite"
    >
      <MessageCircle
        className="w-12 h-12 text-muted-foreground mb-4"
        aria-hidden
      />
      <h2 className="text-foreground text-lg font-semibold mb-2">
        Start a Conversation
      </h2>
      <p className="text-muted-foreground text-sm max-w-sm mb-6">
        Type a message to begin chatting with our agent.
      </p>
      <Button onClick={onStart} className="transition-all duration-200 hover:scale-[1.02]">
        Start Chatting
      </Button>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="max-w-md w-full border-border bg-card">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-notification shrink-0 mt-0.5" aria-hidden />
          <p className="text-foreground text-sm">
            Something went wrong. Please try again.
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button onClick={onRetry} className="w-full sm:w-auto">
          Retry
        </Button>
      </CardFooter>
    </Card>
  )
}

export function PublicChatPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [hasError, setHasError] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: agent, isLoading: agentLoading, error: agentError, refetch } = useAgentBySlug(slug)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (agent && messages.length === 0) {
      setMessages([getWelcomeMessage(agent)])
    }
  }, [agent, messages.length])

  const completedFields = Math.min(
    messages.filter((m) => m.sender === 'user').length,
    agent?.fields?.length ?? 4
  )
  const totalFields = agent?.fields?.length ?? 4
  const progressPercent = totalFields > 0 ? (completedFields / totalFields) * 100 : 0

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isStreaming) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    setMessages((m) => [...m, userMessage])
    setInput('')
    setIsStreaming(true)
    setHasError(false)

    try {
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400))
      const nextFieldIndex = completedFields
      const nextField = agent?.fields?.[nextFieldIndex]
      const assistantContent = nextField
        ? `Thanks! I've got that. ${nextField.label || 'Could you share the next piece of information?'}`
        : "Thanks! I've collected all the information. Is there anything else you'd like to add?"
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'assistant',
        content: assistantContent,
        timestamp: new Date().toISOString(),
      }
      setMessages((m) => [...m, assistantMessage])
    } catch {
      setHasError(true)
      toast.error('Failed to send message')
    } finally {
      setIsStreaming(false)
    }
  }

  const handleEndSession = () => {
    setMessages([])
    setInput('')
    navigate('/')
    toast.success('Session ended')
  }

  const isLoading = agentLoading && !agent
  const showError = (agentError || (!agentLoading && !agent && slug)) && !agent

  if (showError) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="flex items-center justify-between p-4 bg-gradient-to-b from-background to-card border-b border-border">
          <h1 className="text-foreground text-lg font-semibold">Agent Chat</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center">
          <ErrorState onRetry={() => refetch()} />
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gradient-to-b from-background to-card border-b border-border">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 rounded-full shrink-0">
            {agent?.persona?.avatarUrl ? (
              <AvatarImage src={agent.persona.avatarUrl} alt={agent.name} />
            ) : null}
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" aria-hidden />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-foreground text-lg font-semibold truncate">
              Agent Chat
            </h1>
            <p className="text-primary text-sm truncate">
              {agent?.name ?? slug ?? 'Agent'} · {agent?.appearance?.theme === 'light' ? 'Light' : 'Dark'} theme
            </p>
          </div>
        </div>
      </header>

      {/* Progress / Field Collection Indicator */}
      {agent && totalFields > 0 && (
        <div className="px-4 py-2 bg-card border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0 h-1 rounded-full overflow-hidden bg-muted">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-muted-foreground text-sm whitespace-nowrap">
              {completedFields}/{totalFields} fields completed
            </span>
          </div>
        </div>
      )}

      {/* Chat Viewport */}
      <main
        className="flex-1 overflow-y-auto p-4 bg-background"
        role="log"
        aria-label="Chat messages"
      >
        {isLoading ? (
          <ChatSkeleton />
        ) : messages.length === 0 ? (
          <MessagesEmptyState
            onStart={() => {
              if (agent) {
                setMessages([getWelcomeMessage(agent)])
              }
            }}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex animate-fade-in',
                  msg.sender === 'assistant'
                    ? 'items-start gap-2'
                    : 'items-end justify-end gap-2 flex-row-reverse'
                )}
              >
                {msg.sender === 'assistant' && (
                  <Avatar className="h-8 w-8 rounded-full shrink-0">
                    {agent?.persona?.avatarUrl ? (
                      <AvatarImage src={agent.persona.avatarUrl} alt="" />
                    ) : null}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" aria-hidden />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'p-3 rounded-lg shadow-card max-w-[85%] sm:max-w-[80%]',
                    msg.sender === 'assistant'
                      ? 'bg-card text-card-foreground'
                      : 'bg-primary text-primary-foreground'
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="flex items-center gap-2" aria-live="polite" aria-label="Agent is typing">
                <Avatar className="h-8 w-8 rounded-full shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" aria-hidden />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-card text-card-foreground p-3 rounded-lg shadow-card">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary w-2 h-2 rounded-full animate-pulse" />
                    <span
                      className="bg-primary w-2 h-2 rounded-full animate-pulse"
                      style={{ animationDelay: '200ms' }}
                      aria-hidden
                    />
                    <span
                      className="bg-primary w-2 h-2 rounded-full animate-pulse"
                      style={{ animationDelay: '400ms' }}
                      aria-hidden
                    />
                  </div>
                </div>
                <span className="text-muted-foreground text-sm">Agent is typing...</span>
              </div>
            )}
            {hasError && (
              <div className="flex justify-center pt-2">
                <ErrorState onRetry={() => setHasError(false)} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-card border-t border-border p-4">
        {agent?.fields && agent.fields.length > 0 && messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {agent.fields.slice(0, 2).map((f) => (
              <Button
                key={f.id}
                variant="secondary"
                size="sm"
                className="text-xs"
                onClick={() => setInput(f.sampleData || f.placeholder || '')}
              >
                {f.sampleData || f.label}
              </Button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <Input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            disabled={isStreaming || isLoading}
            className="flex-1 bg-background"
            aria-label="Message input"
            aria-describedby="input-hint"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming || isLoading}
            size="icon"
            className="shrink-0 transition-all duration-200 hover:scale-[1.02]"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" aria-hidden />
          </Button>
        </div>
        <p id="input-hint" className="sr-only">
          Press Enter to send
        </p>
      </div>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-card border-t border-border">
        <div className="flex items-center justify-between sm:justify-start gap-4 order-2 sm:order-1">
          <Link
            to="/privacy"
            className="text-muted-foreground text-xs hover:text-foreground transition-colors"
          >
            Privacy Notice
          </Link>
          <button
            type="button"
            className="text-notification text-xs underline hover:opacity-90 transition-opacity"
            onClick={() => toast.info('Report submitted')}
          >
            Report Abuse
          </button>
        </div>
        <Button
          variant="destructive"
          onClick={handleEndSession}
          className="order-1 sm:order-2 transition-all duration-200 hover:scale-[1.02] w-full sm:w-auto"
        >
          End Session
        </Button>
      </footer>
    </div>
  )
}
