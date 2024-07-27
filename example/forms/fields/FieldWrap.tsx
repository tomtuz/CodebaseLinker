import type React from 'react'
import { FobButton } from '@/components/forms/shared/FobButton'
import { cn } from '@/lib/utils'

interface FieldWrapProps {
  className: string
  children?: React.ReactNode
}

export function FieldWrap({ children, className }: Readonly<FieldWrapProps>) {
  return (
    <div className={cn('relative grid gap-3 p-6', className)}>{children}</div>
  )
}
