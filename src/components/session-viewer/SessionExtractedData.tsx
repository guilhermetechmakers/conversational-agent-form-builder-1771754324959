import { Database } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CapturedField } from '@/types'

export interface SessionExtractedDataProps {
  capturedFields: CapturedField[]
  notes?: string
  isReviewed?: boolean
  onNotesChange?: (notes: string) => void
  onMarkReviewed?: () => void
  isMarkingReviewed?: boolean
}

export function SessionExtractedData({
  capturedFields,
  notes = '',
  isReviewed = false,
  onNotesChange,
  onMarkReviewed,
  isMarkingReviewed = false,
}: SessionExtractedDataProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Extracted Data
        </CardTitle>
        <CardDescription>Captured and validated field values</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {capturedFields.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center rounded-lg border border-dashed border-border">
              <Database className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No fields captured</p>
              <p className="text-xs text-muted-foreground mt-1">
                This session has no extracted structured data
              </p>
            </div>
          ) : (
            capturedFields.map((field, i) => (
              <div key={field.fieldId ?? i} className="space-y-2">
                <Label className="text-muted-foreground">
                  Field {i + 1}
                  {field.type && (
                    <span className="ml-2 text-xs font-normal">({field.type})</span>
                  )}
                </Label>
                <Input
                  value={String(field.validatedValue ?? '')}
                  readOnly
                  className="font-mono bg-muted/50"
                />
              </div>
            ))
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="session-notes">Internal Notes</Label>
          <Textarea
            id="session-notes"
            placeholder="Add internal notes for QA or audit..."
            rows={3}
            value={notes}
            onChange={(e) => onNotesChange?.(e.target.value)}
            className="resize-none"
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
          >
            {isMarkingReviewed ? 'Marking...' : isReviewed ? 'Reviewed' : 'Mark as reviewed'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
