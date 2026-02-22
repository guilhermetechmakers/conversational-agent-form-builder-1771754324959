import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Bot, Send, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useAgentBySlug, getWelcomeMessage } from '@/hooks/usePublicChat'
import type { Message } from '@/types'

function ChatSkeleton() {
  return (
    <div className="animate-pulse p-4 space-y-4">
      <div className="h-10 bg-[#31343A] rounded-lg mb-4" />
      <div className="h-6 bg-[#31343A] rounded-lg mb-2 w-3/4" />
      <div className="h-6 bg-[#31343A] rounded-lg mb-2 w-1/2" />
      <div className="h-6 bg-[#31343A] rounded-lg mb-2 w-2/3" />
      <div className="h-6 bg-[#31343A] rounded-lg mb-2 w-1/3" />
      <div className="h-10 bg-[#31343A] rounded-lg mt-8" />
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
        className="w-12 h-12 text-[#C0C6D1] mb-4"
        aria-hidden
      />
      <h2 className="text-white text-lg font-semibold mb-2">
        Start a Conversation
      </h2>
      <p className="text-[#C0C6D1] text-sm max-w-sm mb-6">
        Type a message to begin chatting with our agent.
      </p>
      <Button
        onClick={onStart}
        className="bg-[#26C6FF] text-white p-2 rounded-lg hover:bg-[#26C6FF]/90 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#26C6FF]"
      >
        Start Chatting
      </Button>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-[#FFD600] text-black p-3 rounded-lg max-w-md w-full">
        <span className="block mb-3">Something went wrong. Please try again.</span>
        <Button
          onClick={onRetry}
          className="bg-[#26C6FF] text-white p-2 rounded-lg hover:bg-[#26C6FF]/90 transition-all duration-200"
        >
          Retry
        </Button>
      </div>
    </div>
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
      <div className="flex flex-col h-screen bg-[#181B20]">
        <header className="flex items-center justify-between p-4 bg-gradient-to-b from-[#181B20] to-[#23262B]">
          <h1 className="text-white text-lg font-semibold">Agent Chat</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-4 bg-[#181B20]">
          <ErrorState onRetry={() => refetch()} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#181B20]">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gradient-to-b from-[#181B20] to-[#23262B]">
        <div className="flex items-center space-x-4">
          <Avatar className="w-10 h-10 rounded-full">
            {agent?.persona?.avatarUrl ? (
              <AvatarImage src={agent.persona.avatarUrl} alt={agent.name} />
            ) : null}
            <AvatarFallback className="bg-[#26C6FF] text-[#181B20]">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-white text-lg font-semibold">
              {agent?.name ?? slug ?? 'Agent'}
            </h1>
            <span className="text-[#26C6FF] text-sm">
              {agent?.appearance?.theme === 'light' ? 'Light' : 'Dark'} theme
            </span>
          </div>
        </div>
      </header>

      {/* Progress / Field Collection Indicator */}
      {agent && totalFields > 0 && (
        <div className="px-4 py-2 bg-[#23262B] border-b border-[#31343A]">
          <div className="flex items-center space-x-2">
            <div className="w-full bg-[#31343A] h-1 rounded-full overflow-hidden flex-1">
              <div
                className="bg-[#26C6FF] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[#C0C6D1] text-sm whitespace-nowrap">
              {completedFields}/{totalFields} fields completed
            </span>
          </div>
        </div>
      )}

      {/* Chat Viewport */}
      <div
        className="flex-1 overflow-y-auto p-4 bg-[#181B20]"
        role="log"
        aria-label="Chat messages"
      >
        {isLoading ? (
          <ChatSkeleton />
        ) : messages.length === 0 ? (
          <MessagesEmptyState onStart={() => {
            if (agent) {
              setMessages([getWelcomeMessage(agent)])
            }
          }} />
        ) : (
          <div className="flex flex-col space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex animate-fade-in',
                  msg.sender === 'assistant'
                    ? 'items-start space-x-2'
                    : 'items-end justify-end space-x-2 flex-row-reverse'
                )}
              >
                {msg.sender === 'assistant' && (
                  <Avatar className="w-8 h-8 rounded-full shrink-0">
                    {agent?.persona?.avatarUrl ? (
                      <AvatarImage src={agent.persona.avatarUrl} alt="" />
                    ) : null}
                    <AvatarFallback className="bg-[#26C6FF] text-[#181B20]">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'p-3 rounded-lg shadow-md max-w-[80%]',
                    msg.sender === 'assistant'
                      ? 'bg-[#23262B] text-white'
                      : 'bg-[#26C6FF] text-white'
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="flex items-center space-x-2" aria-live="polite">
                <Avatar className="w-8 h-8 rounded-full shrink-0">
                  <AvatarFallback className="bg-[#26C6FF] text-[#181B20]">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-[#23262B] text-white p-3 rounded-lg shadow-md">
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#26C6FF] w-2 h-2 rounded-full animate-pulse" />
                    <span
                      className="bg-[#26C6FF] w-2 h-2 rounded-full animate-pulse"
                      style={{ animationDelay: '200ms' }}
                    />
                    <span
                      className="bg-[#26C6FF] w-2 h-2 rounded-full animate-pulse"
                      style={{ animationDelay: '400ms' }}
                    />
                  </div>
                </div>
                <span className="text-[#C0C6D1] text-sm">Agent is typing...</span>
              </div>
            )}
            {hasError && (
              <ErrorState onRetry={() => setHasError(false)} />
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-[#23262B] p-4">
        {agent?.fields && agent.fields.length > 0 && messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {agent.fields.slice(0, 2).map((f) => (
              <Button
                key={f.id}
                variant="ghost"
                size="sm"
                className="bg-[#26C6FF] text-white p-2 rounded-lg hover:bg-[#26C6FF]/90 transition-all duration-200 text-xs"
                onClick={() => setInput(f.sampleData || f.placeholder || '')}
              >
                {f.sampleData || f.label}
              </Button>
            ))}
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            disabled={isStreaming || isLoading}
            className="flex-1 bg-[#181B20] text-white p-2 rounded-lg border-[#31343A] placeholder:text-[#C0C6D1] focus:outline-none focus:ring-2 focus:ring-[#26C6FF] transition-all duration-200"
            aria-label="Message input"
            aria-describedby="input-hint"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming || isLoading}
            size="icon"
            className="bg-[#26C6FF] text-white hover:bg-[#26C6FF]/90 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#26C6FF]"
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
      <footer className="flex items-center justify-between p-4 bg-[#23262B]">
        <Link
          to="/privacy"
          className="text-[#C0C6D1] text-xs hover:text-white transition-colors"
        >
          Privacy Notice
        </Link>
        <a
          href="#"
          className="text-[#FFD600] text-xs underline hover:text-[#FFD600]/90 transition-colors"
          onClick={(e) => {
            e.preventDefault()
            toast.info('Report submitted')
          }}
        >
          Report Abuse
        </a>
        <Button
          onClick={handleEndSession}
          className="bg-[#FF0000] text-white p-2 rounded-lg hover:bg-[#FF0000]/90 transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#26C6FF]"
        >
          End Session
        </Button>
      </footer>
    </div>
  )
}
