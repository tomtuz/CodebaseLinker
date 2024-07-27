import React from 'react'
import { Label } from '@/cn/ui/label'

interface BaseInputProps {
  title?: string
  labelId?: string
  children: React.ReactNode
}

export function BaseInput({
  children,
  title,
  labelId
}: Readonly<BaseInputProps>) {
  return (
    <div className="grid gap-3">
      <Label htmlFor={labelId}>{title}</Label>
      {children}
    </div>
  )
}
