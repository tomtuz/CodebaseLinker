'use client'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/cn/ui/select'
import React from 'react'

interface SelectorProps {
  disabled?: boolean
  // onValueChange?(value: string): void
}

export function SimpleSelectorInput({ disabled }: Readonly<SelectorProps>) {
  return (
    <Select disabled={disabled} defaultValue="system">
      <SelectTrigger>
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="system">System</SelectItem>
        <SelectItem value="user">User</SelectItem>
        <SelectItem value="assistant">Assistant</SelectItem>
      </SelectContent>
    </Select>
  )
}
