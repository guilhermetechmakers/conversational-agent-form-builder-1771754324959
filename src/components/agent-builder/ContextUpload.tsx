import { useRef, useState } from 'react'
import { FileText, Upload, Link2, Sparkles, X, Loader2, FileStack, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

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

function EmptyStateFiles({
  onUploadClick,
  isUploading,
}: {
  onUploadClick: () => void
  isUploading: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-border bg-muted/30 px-4 py-8 text-center animate-fade-in',
        'min-h-[120px] sm:min-h-[140px]'
      )}
      role="status"
      aria-label="No files uploaded"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <FileStack className="h-6 w-6 text-muted-foreground" aria-hidden />
      </div>
      <p className="mb-1 text-sm font-medium text-foreground">No files yet</p>
      <p className="mb-4 max-w-[240px] text-xs text-muted-foreground">
        Upload PDF or Markdown files to give your agent product docs and reference material.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onUploadClick}
        disabled={isUploading}
        aria-label="Upload PDF or Markdown files"
        className="min-h-[44px] min-w-[44px] touch-manipulation"
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <Upload className="h-4 w-4" aria-hidden />
        )}
        {isUploading ? 'Uploading...' : 'Upload files'}
      </Button>
    </div>
  )
}

function EmptyStateUrls({
  onAddClick,
  isAdding,
  urlInput,
  onUrlInputChange,
  onKeyDown,
}: {
  onAddClick: () => void
  isAdding: boolean
  urlInput: string
  onUrlInputChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-border bg-muted/30 px-4 py-8 text-center animate-fade-in',
        'min-h-[120px] sm:min-h-[140px]'
      )}
      role="status"
      aria-label="No URLs added"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Globe className="h-6 w-6 text-muted-foreground" aria-hidden />
      </div>
      <p className="mb-1 text-sm font-medium text-foreground">No URLs yet</p>
      <p className="mb-4 max-w-[240px] text-xs text-muted-foreground">
        Add product doc URLs so your agent can reference external documentation.
      </p>
      <div className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
        <Input
          value={urlInput}
          onChange={(e) => onUrlInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="https://docs.example.com"
          className="h-11 min-h-[44px] transition-all duration-200 focus:ring-2 focus:ring-primary/50"
          aria-label="URL for product documentation"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onAddClick}
          disabled={!urlInput.trim() || isAdding}
          aria-label="Add URL"
          className="min-h-[44px] min-w-[44px] touch-manipulation sm:shrink-0"
        >
          {isAdding ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Link2 className="h-4 w-4" aria-hidden />
          )}
          {isAdding ? 'Adding...' : 'Add'}
        </Button>
      </div>
    </div>
  )
}

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
  const [isUploadingFiles, setIsUploadingFiles] = useState(false)
  const [isAddingUrl, setIsAddingUrl] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected?.length) return
    setIsUploadingFiles(true)
    const names = Array.from(selected).map((f) => f.name)
    onFilesChange([...files, ...names])
    e.target.value = ''
    window.setTimeout(() => setIsUploadingFiles(false), 300)
  }

  const addUrl = () => {
    const trimmed = urlInput.trim()
    if (trimmed && !urls.includes(trimmed)) {
      setIsAddingUrl(true)
      onUrlsChange([...urls, trimmed])
      setUrlInput('')
      window.setTimeout(() => setIsAddingUrl(false), 200)
    }
  }

  const removeFile = (name: string) => {
    onFilesChange(files.filter((f) => f !== name))
  }

  const removeUrl = (url: string) => {
    onUrlsChange(urls.filter((u) => u !== url))
  }

  const handleUrlKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addUrl()
    }
  }

  return (
    <Card className="bg-secondary-800 p-6 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-card-hover border-divider">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <FileText className="h-5 w-5 text-accent-500" />
          Context
        </CardTitle>
        <CardDescription className="text-secondary-500">FAQ, files, and product docs for the agent to reference</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="faq-context" className="text-white">FAQ / Context</Label>
          <Textarea
            id="faq-context"
            value={faq}
            onChange={(e) => onFaqChange(e.target.value)}
            placeholder="Paste FAQs or product docs for the agent to reference"
            rows={6}
            className="bg-primary-700 text-white rounded p-3 placeholder:text-secondary-500 resize-none focus:ring-2 focus:ring-accent-500 transition duration-150"
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
            aria-hidden
          />
          {files.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2">
                {files.map((name) => (
                  <Badge
                    key={name}
                    variant="secondary"
                    className="gap-1 pr-1 transition-all duration-200 hover:shadow-md"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => removeFile(name)}
                      className="rounded-full p-0.5 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                      aria-label={`Remove ${name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingFiles}
                aria-label="Upload more PDF or Markdown files"
                className="min-h-[44px] min-w-[44px] touch-manipulation"
              >
                {isUploadingFiles ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Upload className="h-4 w-4" aria-hidden />
                )}
                {isUploadingFiles ? 'Uploading...' : 'Upload more'}
              </Button>
            </>
          ) : (
            <EmptyStateFiles
              onUploadClick={() => fileInputRef.current?.click()}
              isUploading={isUploadingFiles}
            />
          )}
        </div>
        <div className="space-y-2">
          <Label>URL for product doc</Label>
          {urls.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2">
                {urls.map((url) => (
                  <Badge
                    key={url}
                    variant="secondary"
                    className="max-w-full gap-1 pr-1 truncate transition-all duration-200 hover:shadow-md"
                  >
                    <span className="max-w-[200px] truncate sm:max-w-[280px]">{url}</span>
                    <button
                      type="button"
                      onClick={() => removeUrl(url)}
                      className="shrink-0 rounded-full p-0.5 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                      aria-label={`Remove ${url}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={handleUrlKeyDown}
                  placeholder="https://docs.example.com"
                  className="h-11 min-h-[44px] transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                  aria-label="Add another URL"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addUrl}
                  disabled={!urlInput.trim() || isAddingUrl}
                  aria-label="Add URL"
                  className="min-h-[44px] min-w-[44px] touch-manipulation sm:shrink-0"
                >
                  {isAddingUrl ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <Link2 className="h-4 w-4" aria-hidden />
                  )}
                  {isAddingUrl ? 'Adding...' : 'Add'}
                </Button>
              </div>
            </>
          ) : (
            <EmptyStateUrls
              onAddClick={addUrl}
              isAdding={isAddingUrl}
              urlInput={urlInput}
              onUrlInputChange={setUrlInput}
              onKeyDown={handleUrlKeyDown}
            />
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
            className="min-h-[44px] touch-manipulation"
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
