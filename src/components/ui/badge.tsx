import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium shadow-badge transition-all duration-200',
  {
    variants: {
      variant: {
        default:
          'bg-primary/20 text-primary border border-primary/30 hover:shadow-card',
        secondary:
          'bg-muted text-muted-foreground border border-border hover:shadow-card',
        outline:
          'border border-border text-foreground bg-transparent hover:shadow-card',
        destructive:
          'bg-destructive/20 text-destructive border border-destructive/30 hover:shadow-card',
        success:
          'bg-success/20 text-success border border-success/30 hover:shadow-card',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
