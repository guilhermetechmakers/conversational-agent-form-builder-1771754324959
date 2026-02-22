import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Book, Code, MessageCircle, Bot, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const articles = [
  { id: '1', title: 'Quickstart guide', category: 'Getting started' },
  { id: '2', title: 'Creating your first agent', category: 'Getting started' },
  { id: '3', title: 'Webhook reference', category: 'API' },
  { id: '4', title: 'Field types and validation', category: 'Builder' },
]

export function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const isStandalone = useLocation().pathname === '/docs'

  return (
    <div className="space-y-6 animate-fade-in">
      {isStandalone && (
        <header className="border-b border-border px-4 py-4 -mx-4 -mt-4 mb-6">
          <Link to="/" className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="font-semibold">Agent Builder</span>
          </Link>
        </header>
      )}
      <div>
        <h1 className="text-2xl font-semibold">Help & Documentation</h1>
        <p className="text-muted-foreground mt-1">
          Onboarding, docs, and API reference
        </p>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Quickstart
            </CardTitle>
            <CardDescription>Get up and running in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create an agent, add fields, configure persona, and publish your public chat link.
            </p>
            <Button variant="outline" size="sm">Read guide</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              API & Webhook reference
            </CardTitle>
            <CardDescription>Integrate with your tools</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Webhook payload schema, HMAC signing, and delivery retries.
            </p>
            <Button variant="outline" size="sm">View reference</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Popular articles</CardTitle>
        </CardHeader>
        <CardContent>
          {articles.length > 0 ? (
            <div className="space-y-2">
              {articles.map((article) => (
                <a
                  key={article.id}
                  href="#"
                  className="flex items-center justify-between rounded-lg border border-border p-3 hover:border-primary/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{article.title}</p>
                    <p className="text-sm text-muted-foreground">{article.category}</p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-12 px-4 text-center"
              role="status"
              aria-label="No popular articles available"
            >
              <div className="rounded-full bg-muted/50 p-4 mb-4">
                <FileText className="h-10 w-10 text-muted-foreground" aria-hidden />
              </div>
              <h3 className="font-medium text-base mb-1">No popular articles yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                Popular articles will appear here as users explore the documentation. Check out the Quickstart and API reference above to get started.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/">Explore documentation</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Contact support
          </CardTitle>
          <CardDescription>Need help? Reach out to our team</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            support@agentbuilder.example.com
          </p>
          <Button variant="outline">Contact support</Button>
        </CardContent>
      </Card>
    </div>
  )
}
