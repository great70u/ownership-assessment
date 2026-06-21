import * as React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-accent/15 text-accent': variant === 'default',
          'bg-success/15 text-success': variant === 'success',
          'bg-error/15 text-error': variant === 'error',
          'bg-warning/15 text-warning': variant === 'warning',
          'border border-border text-secondary': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
