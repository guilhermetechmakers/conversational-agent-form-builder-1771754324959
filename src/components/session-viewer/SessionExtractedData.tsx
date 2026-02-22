import { Link } from 'react-router-dom'
import { Database, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CapturedField } from '@/types'

export interface EmptyStateCta {
  label: string
  to?: string
  onClick?: () => void
}

const DEFAULT_EMPTY_CTA: EmptyStateCta = {
  label: 'Back to sessions',
  to: '/dashboard/sessions',
}

export interface SessionExtractedDataProps {
  capturedFields: CapturedField[]
  notes?: string
  isReviewed?: boolean
  onNotesChange?: (notes: string) => void
  onMarkReviewed?: () => void
  isMarkingReviewed?: boolean
  emptyStateCta?: EmptyStateCta
}

const NOTES_INPUT_ID = 'session-extracted-notes'

export function SessionExtractedData({
  capturedFields,
  notes = '',
  isReviewed = false,
  onNotesChange,
  onMarkReviewed,
  isMarkingReviewed = false,
  emptyStateCta = DEFAULT_EMPTY_CTA,
}: SessionExtractedDataProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-card-foreground">
          <Database className="h-5 w-5 text-primary" aria-hidden />
          Extracted Data
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Captured and validated field values
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {capturedFields.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-border bg-muted/30"
              role="status"
              aria-label="No extracted data"
            >
              <Database
                className="h-12 w-12 text-muted-foreground mb-4"
                aria-hidden
              />
              <p className="text-sm font-medium text-muted-foreground">
                No fields captured
              </p>
              <p className="text-xs text-muted-foreground mt-1 mb-4 max-w-[240px]">
                This session has no extracted structured data. View the conversation to see what was discussed.
              </p>
              {emptyStateCta.to ? (
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="gap-2 transition-all duration-200 hover:scale-[1.02]"
                >
                  <Link to={emptyStateCta.to}>
                    <MessageSquare className="h-4 w-4" aria-hidden />
                    {emptyStateCta.label}
                  </Link>
                </Button>
              ) : emptyStateCta.onClick ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={emptyStateCta.onClick}
                  className="gap-2 transition-all duration-200 hover:scale-[1.02]"
                >
                  <MessageSquare className="h-4 w-4" aria-hidden />
                  {emptyStateCta.label}
                </Button>
              ) : (
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="gap-2 transition-all duration-200 hover:scale-[1.02]"
                >
                  <Link to="/dashboard/sessions">{emptyStateCta.label}</Link>
                </Button>
              )}
            </div>
          ) : (
            capturedFields.map((field, i) => {
              const fieldId = `extracted-field-${field.fieldId ?? i}`
              const fieldLabel = `Field ${i + 1}${field.type ? ` (${field.type})` : ''}`
              return (
                <div key={field.fieldId ?? i} className="space-y-2">
                  <Label
                    htmlFor={fieldId}
                    className="text-muted-foreground"
                  >
                    Field {i + 1}
                    {field.type && (
                      <span className="ml-2 text-xs font-normal">({field.type})</span>
                    )}
                  </Label>
                  <Input
                    id={fieldId}
                    value={String(field.validatedValue ?? '')}
                    readOnly
                    className="font-mono bg-muted/50"
                    aria-label={fieldLabel}
                  />
                </div>
              )
            })
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={NOTES_INPUT_ID}>Internal Notes</Label>
          <Textarea
            id={NOTES_INPUT_ID}
            placeholder="Add internal notes for QA or audit..."
            rows={3}
            value={notes}
            onChange={(e) => onNotesChange?.(e.target.value)}
            className="resize-none"
            aria-label="Internal notes for QA or audit"
          />
        </div>

        {onMarkReviewed && (
          <Button
            variant={isReviewed ? 'secondary' : 'default'}
            className={cn(
              'w-full transition-all duration-200 hover:scale-[1.01]',
              isReviewed && 'opacity-75'
            )}
            onClick={onMarkReviewed}
            disabled={isMarkingReviewed || isReviewed}
            aria-label={isReviewed ? 'Session reviewed' : 'Mark session as reviewed'}
          >
            {isMarkingReviewed ? 'Marking...' : isReviewed ? 'Reviewed' : 'Mark as reviewed'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
