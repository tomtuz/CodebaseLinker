import React, { useState, useEffect, useCallback } from 'react'
import { Input } from '@/cn/ui/input'
import { useDebouncedCallback } from 'use-debounce'

interface HeaderProps {
  title: string
  description: string
  onUpdate: (key: 'title' | 'description', value: string) => void
}

export function FormHeader({ title, description, onUpdate }: HeaderProps) {
  const [localTitle, setLocalTitle] = useState(title)
  const [localDescription, setLocalDescription] = useState(description)

  useEffect(() => {
    setLocalTitle(title)
    setLocalDescription(description)
  }, [title, description])

  const debouncedUpdate = useDebouncedCallback(
    (key: 'title' | 'description', value: string) => {
      onUpdate(key, value)
    },
    300
  )

  const handleChange = useCallback(
    (key: 'title' | 'description') =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target

        if (key === 'title') {
          setLocalTitle(value)
        } else {
          setLocalDescription(value)
        }
        debouncedUpdate(key, value)
      },
    [debouncedUpdate]
  )

  return (
    <div className="bg-card p-6">
      <div>
        Title:
        <Input value={localTitle} onChange={handleChange('title')} />
      </div>
      <div>
        Description:
        <Input
          value={localDescription}
          onChange={handleChange('description')}
        />
      </div>
    </div>
  )
}
