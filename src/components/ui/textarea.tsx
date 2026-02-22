import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** When true, applies error state styling using design tokens */
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        aria-invalid={error}
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border px-4 py-2 font-normal',
          'bg-card text-foreground placeholder:text-muted-foreground',
          'border-input ring-offset-background',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-all duration-200',
          'invalid:border-destructive invalid:focus-visible:ring-destructive',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
