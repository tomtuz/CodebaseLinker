import React from 'react'
import { Control } from 'react-hook-form'
import { Input, Textarea } from '@/cn/ui'
import { Form, FieldType } from '@/types/react'
import { MultiOptionField } from './MultiOptionField'

interface AnswerPlaceholderProps {
  fieldType: FieldType
  fieldIndex: number
  control: Control<Form>
}

export function AnswerPlaceholder({
  fieldType,
  fieldIndex,
  control
}: AnswerPlaceholderProps) {
  switch (fieldType) {
    case 'text':
      return <Input type="text" placeholder="Text answer..." />
    case 'number':
      return <Input type="number" placeholder="Number answer..." />
    case 'textarea':
      return <Textarea placeholder="Long answer..." />
    case 'checkbox':
      return (
        <MultiOptionField
          fieldIndex={fieldIndex}
          control={control}
          type="checkbox"
        />
      )
    case 'file':
      return <Input type="file" />
    case 'select':
      return (
        <MultiOptionField
          fieldIndex={fieldIndex}
          control={control}
          type="select"
        />
      )
    default:
      return null
  }
}
