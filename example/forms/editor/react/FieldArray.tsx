import React, { useRef, useEffect, useState, useCallback, memo } from 'react'
import { Form } from '@/types/react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '@/cn/ui'
import { QuestionComponent } from './memoized/Question'
import { useRenderCountFull } from '@/hooks/useRedrawCountFull'
import { useRenderCount, renderCountElement } from '@/hooks/useRedrawCount'
import clsx from 'clsx'

export const QuestionMemo = memo(QuestionComponent)

export function FieldArray() {
  const renderCount2 = useRenderCount()
  const { renderCount, RenderCountVisualizer } = useRenderCountFull(
    'FieldArray',
    true
  )

  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(
    0
  )
  const activeQuestionIndexRef = useRef<number | null>(activeQuestionIndex)
  const newQuestionRef = useRef<number | null>(0)

  const { control, reset } = useFormContext<Form>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields'
  })

  // const renderHandler = useCallback(function resetHandler() {
  //   rerender(!render)
  // }, [])

  const resetHandler = useCallback(function resetHandler() {
    reset({
      header: { title: '', description: '' },
      fields: []
    })
  }, [])

  useEffect(() => {
    activeQuestionIndexRef.current = activeQuestionIndex
    console.log('activeQuestionIndexRef: ', activeQuestionIndexRef)
  }, [activeQuestionIndex])

  const handleRemove = useCallback(
    (index: number) => {
      remove(index)
      if (activeQuestionIndexRef.current === index) {
        setActiveQuestionIndex(null)
      }
    },
    [remove]
  )

  const addQuestion = useCallback(() => {
    append({ label: '', type: 'text', options: [] })
    newQuestionRef.current = fields.length
    // updateHistory()
    newQuestionRef.current = renderCount2

    // setFields((currentFields) => {
    //   newQuestionRef.current = currentFields.length
    //   return currentFields
    // })
  }, [append, fields.length])

  const handleQuestionActive = useCallback((index: number) => {
    setActiveQuestionIndex((prevIndex) => (prevIndex === index ? index : index))
  }, [])

  useEffect(() => {
    if (newQuestionRef.current !== null) {
      setActiveQuestionIndex(newQuestionRef.current)
      newQuestionRef.current = null
    }
  }, [fields.length])

  return (
    <div className="p-4">
      {fields.map((field, index) => (
        <div
          key={`${field.id}-div`}
          className={clsx('mb-4 rounded border bg-red-100')}
        >
          <span>idx: {index}</span>
          <QuestionMemo
            key={field.id}
            field={field}
            index={index}
            remove={handleRemove}
            onSelect={handleQuestionActive}
            isSelected={activeQuestionIndex === index}
          />
        </div>
      ))}
      <div className="flex">
        {/* <Button type="button" onClick={renderHandler}>
          Render
        </Button> */}
        <Button type="button" onClick={addQuestion}>
          Add
        </Button>
        <Button type="button" onClick={resetHandler}>
          Reset
        </Button>
      </div>
      {renderCountElement(renderCount2, 'FieldArray')}
      <RenderCountVisualizer />
    </div>
  )
}
