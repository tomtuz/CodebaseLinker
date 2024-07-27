import React from 'react'
import { FieldArrayWithId, useFormContext, useWatch } from 'react-hook-form'
import { Input, Textarea } from '@/cn/ui'
import { Form, FieldType } from '@/types/react'
import { MultiOptionField } from './MultiOptionField'

interface AnswerPlaceholderProps {
  index: number
  field: FieldArrayWithId<Form, 'fields', 'id'>
}

export function AnswerPlaceholder({ field, index }: AnswerPlaceholderProps) {
  const { register } = useFormContext<Form>()
  const { control } = useFormContext<Form>()

  const fieldType = useWatch({
    control,
    name: `fields.${index}.type`,
    defaultValue: field.type as FieldType
  })

  switch (fieldType) {
    case 'text':
      return (
        <input
          {...register(`fields.${index}.options.0.label`)}
          type="text"
          placeholder="Text answer..."
        />
      )

    case 'number':
      return (
        <input
          {...register(`fields.${index}.options.0.label`, {
            valueAsNumber: true
          })}
          type="number"
          placeholder="Number answer..."
        />
      )

    case 'textarea':
      return (
        <Textarea
          {...register(`fields.${index}.options.0.label`)}
          placeholder="TextArea answer..."
        />
      )

    case 'checkbox':
      return <MultiOptionField fieldIndex={index} type="checkbox" />

    case 'file':
      return <Input type="file" />

    case 'select':
      return <MultiOptionField fieldIndex={index} type="select" />

    default:
      return null
  }
}
