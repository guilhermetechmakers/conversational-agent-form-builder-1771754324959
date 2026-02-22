import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:scale-[1.02] hover:shadow-glow active:scale-[0.98]',
        secondary:
          'bg-card text-foreground border border-border hover:scale-[1.02] hover:border-primary active:scale-[0.98]',
        outline:
          'border border-primary text-primary bg-transparent hover:bg-primary/10 active:scale-[0.98]',
        ghost: 'hover:bg-card hover:text-foreground active:scale-[0.98]',
        destructive:
          'bg-destructive text-white hover:opacity-90 active:scale-[0.98]',
        success:
          'bg-[rgb(var(--success))] text-background hover:opacity-90 active:scale-[0.98]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-lg px-8',
        icon: 'h-10 w-10',
        'icon-sm': 'h-9 w-9',
        'icon-lg': 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
