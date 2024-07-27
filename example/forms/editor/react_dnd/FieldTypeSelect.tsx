import React from 'react'
import { Control, Controller } from 'react-hook-form'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/cn/ui/select'
import { Form, FieldType } from '@/types/react'

interface FieldTypeSelectProps {
  index: number
  control: Control<Form>
}

const fieldTypes: FieldType[] = [
  'text',
  'number',
  'textarea',
  'checkbox',
  'file',
  'select'
]

export function FieldTypeSelect({ index, control }: FieldTypeSelectProps) {
  return (
    <Controller
      name={`fields.${index}.type`}
      control={control}
      render={({ field }) => (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger className="mb-2 w-full">
            <SelectValue placeholder="Select answer type" />
          </SelectTrigger>
          <SelectContent>
            {fieldTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  )
}
