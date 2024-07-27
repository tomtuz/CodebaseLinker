import React from 'react'
import { Control, Controller, useFormContext } from 'react-hook-form'
import { Form } from '@/types/react'

interface HeaderSectionProps {
  control: Control<Form>
}

export function HeaderSection({ control }: HeaderSectionProps) {
  return (
    <div>
      <Controller
        name="header.title"
        control={control}
        render={({ field }) => (
          <input
            {...field}
            placeholder="Form Title"
            className="mb-2 w-full rounded border p-2"
          />
        )}
      />
      <Controller
        name="header.description"
        control={control}
        render={({ field }) => (
          <textarea
            {...field}
            placeholder="Form Description"
            className="mb-4 w-full rounded border p-2"
          />
        )}
      />
    </div>
  )
}
