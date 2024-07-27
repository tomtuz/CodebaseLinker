// Native
import React, { useState, useEffect, useCallback } from 'react'
import { useDebouncedCallback } from 'use-debounce'

// CN UI
import { Input } from '@/cn/ui/input'
import { Textarea } from '@/cn/ui/textarea'

// UI
import { SimpleSelectorInput } from '@/components/forms/fields/SimpleSelectorInput'
import { CheckboxInput } from '@/components/forms/fields/CheckboxInput'
import { FileUploadInput } from '@/components/forms/fields/FileUploadInput'
import { FieldWrap } from '@/components/forms/fields/FieldWrap'
import { FobButton } from '@/components/forms/shared/FobButton'

// Types
import type { FormField, FieldType } from '@/types'

type PlaceholderProps = {
  [key in FieldType]?: React.FC<{
    disabled?: boolean
  }>
}

// 'text' | 'number' | 'textarea' | 'checkbox' | 'file' | 'select';
const AnswerPlaceholders: PlaceholderProps = {
  text: ({ disabled }) => (
    <Input
      type="text"
      placeholder="Answer will be here..."
      disabled={disabled}
    />
  ),
  number: ({ disabled }) => (
    <Input
      type="number"
      placeholder="Number answer will be here..."
      disabled={disabled}
    />
  ),
  textarea: ({ disabled }) => (
    <Textarea placeholder="Answer will be here..." disabled={disabled} />
  ),
  checkbox: ({ disabled }) => <CheckboxInput disabled={disabled} />,
  file: ({ disabled }) => <FileUploadInput disabled={disabled} />,
  select: ({ disabled }) => <SimpleSelectorInput disabled={disabled} />
}

const FieldAnswerComponent: React.FC<{
  type: FieldType
  disabled?: boolean
}> = ({ type, disabled }) => {
  const Component = AnswerPlaceholders[type]
  return Component?.({ disabled })
}

// MAIN

interface FormFieldProps {
  field: FormField
  onInputChange: (id: string, label: Partial<FormField>) => void
  onDelete: (id: string) => void
}

export function FormFieldInput({
  field,
  onInputChange,
  onDelete
}: FormFieldProps) {
  const [localTitle, setLocalTitle] = useState(field.label)

  useEffect(() => {
    setLocalTitle(field.label)
  }, [field])

  const debouncedOnInputChange = useDebouncedCallback(
    (id: string, label: string) => {
      onInputChange(id, { label }) // call hook to update value
    },
    300
  )

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value
      setLocalTitle(newTitle)
      debouncedOnInputChange(field.id, newTitle)
    },
    [debouncedOnInputChange, field.id]
  )

  const handleFieldDelete = useCallback(() => {
    onDelete(field.id)
  }, [field.id, onDelete])

  // > FormField
  //   > FormTypePicker
  //   > FormTypeRender (disabled/active)
  return (
    <FieldWrap className="relative transition duration-150 ease-in-out hover:bg-slate-100">
      <Input
        id={field.id}
        type="text"
        placeholder="Question label"
        value={localTitle}
        onChange={handleTitleChange}
      />
      <FieldAnswerComponent type={field.type} disabled />
      <FobButton onClickDelete={handleFieldDelete} />
    </FieldWrap>
  )
}
