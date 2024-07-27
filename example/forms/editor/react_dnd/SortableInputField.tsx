import React, { useEffect, useRef, KeyboardEvent } from 'react'
import { Control, Controller, useWatch } from 'react-hook-form'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button, Input } from '@/cn/ui'
import { GripVertical } from 'lucide-react'
import clsx from 'clsx'

import { Form, FieldType } from '@/types/react'
import { AnswerPlaceholder } from './AnswerPlaceholder'
import { FieldTypeSelect } from './FieldTypeSelect'

interface SortableInputFieldProps {
  id: string
  index: number
  control: Control<Form>
  remove: () => void
  setLastUsedType: (type: FieldType) => void
  isSelected: boolean
  onSelect: (index: number) => void
  onRemove: () => void
}

// Nested field array
export function SortableInputField({
  id,
  index,
  control,
  remove,
  setLastUsedType,
  isSelected,
  onSelect,
  onRemove
}: SortableInputFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: transform ? 1000 : 'auto'
  }

  const fieldType = useWatch({
    control,
    name: `fields.${index}.type`,
    defaultValue: 'text' as FieldType
  })

  useEffect(() => {
    setLastUsedType(fieldType)
  }, [fieldType, setLastUsedType])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onSelect(index)
    if (e.target instanceof HTMLInputElement) {
      e.target.focus()
    } else {
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onSelect(index)
      inputRef.current?.focus()
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'mb-4 rounded border bg-white p-4',
        isSelected && 'ring-2 ring-blue-500'
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="SelectQuestion"
    >
      <QuestionHeader
        index={index}
        control={control}
        attributes={attributes}
        listeners={listeners}
        inputRef={inputRef}
        remove={remove}
      />
      <FieldTypeSelect index={index} control={control} />
      <AnswerPlaceholder
        fieldType={fieldType}
        fieldIndex={index}
        control={control}
      />
    </div>
  )
}

interface QuestionHeaderProps {
  index: number
  control: Control<Form>
  attributes: ReturnType<typeof useSortable>['attributes']
  listeners: ReturnType<typeof useSortable>['listeners']
  inputRef: React.RefObject<HTMLInputElement>
  remove: () => void
}

function QuestionHeader({
  index,
  control,
  attributes,
  listeners,
  inputRef,
  remove
}: QuestionHeaderProps) {
  const handleDragHandleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // Trigger drag start
    }
  }

  return (
    <div className="mb-2 flex items-center">
      <div
        {...attributes}
        {...listeners}
        className="mr-2 cursor-move p-2"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleDragHandleKeyDown}
        role="button"
        tabIndex={0}
      >
        <GripVertical size={20} />
      </div>
      <div className="flex w-full">
        <Controller
          name={`fields.${index}.label`}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              ref={inputRef}
              placeholder="Question"
              className="w-full"
            />
          )}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={remove}
          className="ml-2 bg-red-100"
        >
          Remove
        </Button>
      </div>
    </div>
  )
}
