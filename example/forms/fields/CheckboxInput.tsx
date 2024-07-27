import React from 'react'
import { Checkbox } from '@/cn/ui/checkbox'

interface InputProps {
  disabled?: boolean
  // onValueChange?(value: string): void
}

export function CheckboxInput({ disabled }: InputProps) {
  return (
    <div className="my-component">
      <Checkbox disabled={disabled} />
    </div>
  )
}
