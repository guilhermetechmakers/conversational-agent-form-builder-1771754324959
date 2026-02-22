import { useState } from 'react'
import { Settings, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
export interface AgentMetadataErrors {
  name?: string
  slug?: string
}

export interface AgentMetadataProps {
  name: string
  slug: string
  description: string
  tags: string[]
  onNameChange: (value: string) => void
  onSlugChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onTagsChange: (tags: string[]) => void
  isNew?: boolean
  errors?: AgentMetadataErrors
}

export function AgentMetadata({
  name,
  slug,
  description,
  tags,
  onNameChange,
  onSlugChange,
  onDescriptionChange,
  onTagsChange,
  isNew = true,
  errors = {},
}: AgentMetadataProps) {
  const [tagInput, setTagInput] = useState('')

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    onTagsChange(tags.filter((t) => t !== tag))
  }

  const handleNameChange = (value: string) => {
    onNameChange(value)
    if (isNew) {
      onSlugChange(value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    }
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Agent metadata
        </CardTitle>
        <CardDescription>Name, slug, description, and tags</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="agent-name">Name</Label>
          <Input
            id="agent-name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="My Agent"
            className={cn(
              'transition-all duration-200 focus:ring-2 focus:ring-primary/50',
              errors.name && 'border-destructive focus-visible:ring-destructive'
            )}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'agent-name-error' : undefined}
          />
          {errors.name && (
            <p
              id="agent-name-error"
              className="text-sm text-destructive animate-fade-in"
              role="alert"
            >
              {errors.name}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="agent-slug">Slug (public path)</Label>
          <Input
            id="agent-slug"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="my-agent"
            className={cn(
              'font-mono text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/50',
              errors.slug && 'border-destructive focus-visible:ring-destructive'
            )}
            aria-invalid={!!errors.slug}
            aria-describedby={errors.slug ? 'agent-slug-error' : undefined}
          />
          {errors.slug && (
            <p
              id="agent-slug-error"
              className="text-sm text-destructive animate-fade-in"
              role="alert"
            >
              {errors.slug}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Public URL: /chat/{slug || 'your-slug'}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="agent-description">Description</Label>
          <Textarea
            id="agent-description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="What does this agent collect?"
            rows={3}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="agent-tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="agent-tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add tag..."
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addTag}
              disabled={!tagInput.trim()}
              aria-label="Add tag"
            >
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 pr-1 transition-all duration-200 hover:border-primary/50"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="rounded-full p-0.5 hover:bg-muted-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

