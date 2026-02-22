import { useState, useRef, useEffect } from 'react'
import { Eye, Send, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { AgentField, Message } from '@/types'

export interface PreviewPaneProps {
  agentName: string
  primaryColor: string
  accentColor: string
  theme: 'light' | 'dark'
  avatarUrl?: string
  fields: AgentField[]
  systemInstructions?: string
}

export function PreviewPane({
  agentName,
  primaryColor,
  accentColor,
  theme,
  avatarUrl,
  fields,
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
    if (!text || isStreaming) return

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

  const progress = Math.min(
    Math.round((messages.filter((m) => m.sender === 'user').length / Math.max(fields.length, 1)) * 100),
    100
  )

  const isDark = theme === 'dark'

  return (
    <Card className="bg-secondary-800 p-6 rounded-lg shadow-md sticky top-24 overflow-hidden transition-all duration-300 hover:shadow-card-hover border-divider">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
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
                className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: primaryColor }}
              >
                <Bot className="h-5 w-5" />
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
                  isDark ? 'text-white/60' : 'text-black/50'
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
                  isDark ? 'text-white/60' : 'text-black/50'
                )}
              >
                Progress:
              </span>
              <div className="flex-1 h-2 rounded-full overflow-hidden bg-black/10">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: primaryColor,
                  }}
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
                    className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-xl px-4 py-2.5',
                    msg.sender === 'assistant'
                      ? isDark
                        ? 'bg-white/10 text-preview-fg-dark'
                        : 'bg-white border border-preview-border-light shadow-sm text-preview-fg-light'
                      : ''
                  )}
                  style={
                    msg.sender === 'user'
                      ? {
                          backgroundColor: primaryColor,
                          color: 'rgb(var(--preview-fg-dark))',
                        }
                      : undefined
                  }
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="flex gap-3">
                <div
                  className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Bot className="h-4 w-4" />
                </div>
                <div
                  className={cn(
                    'rounded-xl px-4 py-2.5',
                    isDark ? 'bg-white/10' : 'bg-white border border-preview-border-light'
                  )}
                >
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: primaryColor, opacity: 0.6 }}
                    />
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{
                        backgroundColor: primaryColor,
                        opacity: 0.6,
                        animationDelay: '0.2s',
                      }}
                    />
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{
                        backgroundColor: primaryColor,
                        opacity: 0.6,
                        animationDelay: '0.4s',
                      }}
                    />
                  </div>
                </div>
              </div>
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
                style={{ backgroundColor: primaryColor }}
                className="hover:opacity-90"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
