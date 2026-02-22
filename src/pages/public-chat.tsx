import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Bot, Send, AlertCircle, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Message } from '@/types'

const WELCOME_MESSAGE: Message = {
  id: '1',
  sender: 'assistant',
  content:
    "Hi! I'm your conversational assistant. I'll help you provide the information we need. What's your name?",
  timestamp: new Date().toISOString(),
}

function MessageSkeleton() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-48 rounded-lg" />
        <Skeleton className="h-4 w-32 rounded-lg" />
      </div>
    </div>
  )
}

function MessagesEmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-border bg-card/30"
      role="status"
      aria-live="polite"
    >
      <div className="rounded-full bg-muted p-4 mb-4" aria-hidden>
        <MessageCircle className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="font-semibold text-lg mb-2">No messages yet</h2>
      <p className="text-muted-foreground text-sm max-w-sm">
        Start the conversation by typing a message below. The assistant will
        guide you through the form.
      </p>
    </div>
  )
}

export function PublicChatPage() {
  const { slug } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([WELCOME_MESSAGE])
      setIsLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

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

    // Mock streaming response
    await new Promise((r) => setTimeout(r, 800))
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'assistant',
      content: "Thanks! I've got that. Could you share your email address?",
      timestamp: new Date().toISOString(),
    }
    setMessages((m) => [...m, assistantMessage])
    setIsStreaming(false)
    toast.success('Message sent')
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
          aria-hidden
        >
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-semibold">Agent {slug ?? 'Chat'}</h1>
          <p className="text-xs text-muted-foreground">Conversational form</p>
        </div>
      </header>

      {/* Progress pill */}
      <div className="px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <span
            id="progress-label"
            className="text-sm text-muted-foreground"
          >
            Progress:
          </span>
          <div
            className="flex-1 h-2 rounded-full bg-muted overflow-hidden"
            role="progressbar"
            aria-valuenow={25}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-labelledby="progress-label"
          >
            <div className="h-full w-1/4 bg-primary rounded-full transition-all duration-300" />
          </div>
          <span className="text-sm font-medium">1/4 fields</span>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-label="Chat messages"
      >
        {isLoading ? (
          <div className="space-y-4">
            <MessageSkeleton />
            <MessageSkeleton />
          </div>
        ) : messages.length === 0 ? (
          <MessagesEmptyState />
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
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    aria-hidden
                  >
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-xl px-4 py-2.5',
                    msg.sender === 'assistant'
                      ? 'bg-card border border-border'
                      : 'bg-primary text-primary-foreground'
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="flex gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  aria-hidden
                >
                  <Bot className="h-4 w-4" />
                </div>
                <div
                  className="rounded-xl bg-card border border-border px-4 py-2.5"
                  aria-live="polite"
                  aria-label="Assistant is typing"
                >
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse animation-delay-200" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse animation-delay-500" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            disabled={isStreaming}
            className="flex-1"
            aria-label="Message input"
            aria-describedby="input-hint"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            size="icon"
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
      <footer className="px-4 py-2 border-t border-border text-center text-xs text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
        <AlertCircle className="h-3 w-3 shrink-0" aria-hidden />
        <Link
          to="/privacy"
          className="hover:text-foreground transition-colors duration-200"
        >
          Privacy
        </Link>
        <span aria-hidden>·</span>
        <button
          type="button"
          className="hover:text-foreground transition-colors duration-200"
          aria-label="Report abuse"
        >
          Report abuse
        </button>
        <span aria-hidden>·</span>
        <button
          type="button"
          className="hover:text-foreground transition-colors duration-200"
          aria-label="End session"
        >
          End session
        </button>
      </footer>
    </div>
  )
}
