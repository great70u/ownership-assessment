import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'gradient' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-accent text-white hover:bg-accent/90 active:scale-[0.98]': variant === 'default',
            'border border-border bg-transparent text-primary hover:bg-surface2': variant === 'outline',
            'bg-transparent text-secondary hover:text-primary hover:bg-surface2': variant === 'ghost',
            'gradient-bg text-white hover:opacity-90 active:scale-[0.98] shadow-lg': variant === 'gradient',
            'bg-error text-white hover:bg-error/90': variant === 'destructive',
          },
          {
            'h-8 px-3 text-xs rounded-md': size === 'sm',
            'h-10 px-4 text-sm rounded-md': size === 'md',
            'h-12 px-6 text-base rounded-lg': size === 'lg',
            'h-10 w-10 rounded-md': size === 'icon',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
