import * as React from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  color?: string
}

function Progress({ className, value, color = '#3D7FFF', ...props }: ProgressProps) {
  return (
    <div
      className={cn('w-full h-2 bg-surface2 rounded-full overflow-hidden', className)}
      {...props}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
      />
    </div>
  )
}

export { Progress }
