import { useRef, useState } from 'react'
import { FileText, Upload, Link2, Sparkles, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export interface ContextUploadProps {
  faq: string
  files: string[]
  urls: string[]
  onFaqChange: (value: string) => void
  onFilesChange: (files: string[]) => void
  onUrlsChange: (urls: string[]) => void
  onIndexKnowledge?: () => void
  isIndexing?: boolean
}

const ACCEPTED_MIME = 'application/pdf,text/markdown'

export function ContextUpload({
  faq,
  files,
  urls,
  onFaqChange,
  onFilesChange,
  onUrlsChange,
  onIndexKnowledge,
  isIndexing = false,
}: ContextUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [urlInput, setUrlInput] = useState('')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected?.length) return
    const names = Array.from(selected).map((f) => f.name)
    onFilesChange([...files, ...names])
    e.target.value = ''
  }

  const addUrl = () => {
    const trimmed = urlInput.trim()
    if (trimmed && !urls.includes(trimmed)) {
      onUrlsChange([...urls, trimmed])
      setUrlInput('')
    }
  }

  const removeFile = (name: string) => {
    onFilesChange(files.filter((f) => f !== name))
  }

  const removeUrl = (url: string) => {
    onUrlsChange(urls.filter((u) => u !== url))
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Context
        </CardTitle>
        <CardDescription>FAQ, files, and product docs for the agent to reference</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>FAQ / Context</Label>
          <Textarea
            value={faq}
            onChange={(e) => onFaqChange(e.target.value)}
            placeholder="Paste FAQs or product docs for the agent to reference"
            rows={6}
            className="resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="space-y-2">
          <Label>File upload (PDF / Markdown)</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_MIME}
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload PDF or Markdown files"
          >
            <Upload className="h-4 w-4" aria-hidden />
            Upload files
          </Button>
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {files.map((name) => (
                <Badge key={name} variant="secondary" className="gap-1 pr-1">
                  {name}
                  <button
                    type="button"
                    onClick={() => removeFile(name)}
                    className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                    aria-label={`Remove ${name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>URL for product doc</Label>
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
              placeholder="https://docs.example.com"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addUrl}
              disabled={!urlInput.trim()}
              aria-label="Add URL"
            >
              <Link2 className="h-4 w-4" aria-hidden />
              Add
            </Button>
          </div>
          {urls.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {urls.map((url) => (
                <Badge key={url} variant="secondary" className="gap-1 pr-1 max-w-full truncate">
                  <span className="truncate max-w-[200px]">{url}</span>
                  <button
                    type="button"
                    onClick={() => removeUrl(url)}
                    className="rounded-full p-0.5 hover:bg-muted-foreground/20 shrink-0"
                    aria-label={`Remove ${url}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
        {onIndexKnowledge && (
          <Button
            type="button"
            variant="outline"
            onClick={onIndexKnowledge}
            disabled={isIndexing}
            aria-label={isIndexing ? 'Indexing knowledge base' : 'Index knowledge'}
            aria-busy={isIndexing}
          >
            {isIndexing ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Sparkles className="h-4 w-4" aria-hidden />
            )}
            {isIndexing ? 'Indexing...' : 'Index knowledge'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

