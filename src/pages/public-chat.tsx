import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Bot, Send, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Message } from '@/types'

export function PublicChatPage() {
  const { slug } = useParams()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      content: "Hi! I'm your conversational assistant. I'll help you provide the information we need. What's your name?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
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
          <span className="text-sm text-muted-foreground">Progress:</span>
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: '25%' }}
            />
          </div>
          <span className="text-sm font-medium">1/4 fields</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex gap-3 animate-fade-in',
              msg.sender === 'user' && 'flex-row-reverse'
            )}
          >
            {msg.sender === 'assistant' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
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
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-xl bg-card border border-border px-4 py-2.5">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            disabled={isStreaming}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-2 border-t border-border text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
        <AlertCircle className="h-3 w-3" />
        <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
        <span>·</span>
        <button type="button" className="hover:text-foreground">Report abuse</button>
        <span>·</span>
        <button type="button" className="hover:text-foreground">End session</button>
      </footer>
    </div>
  )
}
