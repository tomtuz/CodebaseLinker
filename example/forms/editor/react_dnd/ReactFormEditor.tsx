'use client'

import React, { useCallback, useState } from 'react'
import { useFieldArray, useForm, Control } from 'react-hook-form'

// CN UI
import { Button } from '@cn/ui/button'

import type { Form, FieldType } from '@/types/react'

// Components
import { HeaderSection } from './HeaderSection'
import { DNDQuestionList } from './dnd/QuestionList'

const defaultFieldType: FieldType = 'text'

// Form state management hook
function useFormEditor() {
  const [lastUsedType, setLastUsedType] = useState<FieldType>(defaultFieldType)

  // Selected Question index state for outline
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null)

  const { control, handleSubmit, watch } = useForm<Form>({
    defaultValues: {
      header: { title: '', description: '' },
      fields: []
    }
  })

  const { fields, append, move, remove } = useFieldArray({
    control,
    name: 'fields'
  })

  // const watchFieldArray = watch('fields')
  // const controlledFields = fields.map((field, index) => ({
  //   ...field,
  //   ...watchFieldArray[index]
  // }))

  const addQuestion = useCallback(() => {
    append({ label: '', type: lastUsedType, options: [] })
    setSelectedQuestionIndex(fields.length)
  }, [append, lastUsedType, fields.length])

  const handleSelect = useCallback((index: number) => {
    setSelectedQuestionIndex(index)
  }, [])

  return {
    lastUsedType,
    setLastUsedType,
    selectedQuestionIndex,
    setSelectedQuestionIndex,
    control,
    handleSubmit,
    fields,
    // controlledFields,
    move,
    remove,
    addQuestion,
    handleSelect
  }
}

export function ReactFormEditor() {
  const {
    setLastUsedType,
    selectedQuestionIndex,
    control,
    handleSubmit,
    fields,
    // controlledFields,
    move,
    remove,
    addQuestion,
    handleSelect
  } = useFormEditor()

  const onSubmit = (data: Form) => {
    try {
      console.log(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Error processing form data:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header */}
      <HeaderSection control={control} />
      {/* Questions */}
      <DNDQuestionList
        control={control}
        fields={fields}
        // fields={controlledFields}
        move={move}
        remove={remove}
        selectedQuestionIndex={selectedQuestionIndex}
        setLastUsedType={setLastUsedType}
        handleSelect={handleSelect}
        setSelectedQuestionIndex={handleSelect}
      />
      {/* Controls */}
      <Button type="button" onClick={addQuestion}>
        Add Question
      </Button>
      <Button type="submit">Print Form Data</Button>
    </form>
  )
}
