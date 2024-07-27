'use client'

import React, { useEffect, useState } from 'react'
import {
  Control,
  useFieldArray,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue
} from 'react-hook-form'
import { Button } from '@/cn/ui'
import { Form } from '@/types/react'
import { useRenderCountFull } from '@/hooks/useRedrawCountFull'
import { useRenderCount, renderCountElement } from '@/hooks/useRedrawCount'
import { NestedFieldArray } from './NestedFieldArray'

interface QuestionHeaderProps {
  index: number
  remove: UseFieldArrayRemove
  register: UseFormRegister<Form>
}

export function QuestionHeader({
  index,
  remove,
  register
}: Readonly<QuestionHeaderProps>) {
  const renderCount = useRenderCount()
  const { RenderCountVisualizer, updateVisualizer } = useRenderCountFull(
    'QuestionHeader',
    true
  )

  return (
    <div className="mb-2 flex items-center justify-center bg-blue-100 p-4 outline outline-1">
      <div className="flex w-full items-center justify-center gap-2 bg-blue-200">
        <input
          className="w-[110px]"
          placeholder="Question Title"
          {...register(`fields.${index}.label`)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => remove()}
          className="bg-red-100"
        >
          Remove
        </Button>

        <RenderCountVisualizer />
        {renderCountElement(renderCount, 'QuestionHeader')}
      </div>
    </div>
  )
}

interface FieldArrayProps {
  control: Control<Form, any>
  register: UseFormRegister<Form>
  setValue: UseFormSetValue<Form>
  getValues: UseFormGetValues<Form>
}

export function FieldArray({
  control,
  register,
  getValues,
  setValue
}: FieldArrayProps) {
  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: 'fields'
  })
  const renderCount = useRenderCount()
  const { RenderCountVisualizer, updateVisualizer } = useRenderCountFull(
    'FieldArray',
    true
  )

  return (
    <div className="mb-4 rounded border bg-white p-4">
      <div className="m-2 flex items-center justify-center gap-6">
        {fields.map((item, index) => (
          <div className="flex flex-col" key={item.id}>
            {/* Question Header / label */}
            <QuestionHeader index={index} remove={remove} register={register} />
            {/* NestedArray / Question Answers / options */}
            <NestedFieldArray nestIndex={index} {...{ control, register }} />
          </div>
        ))}
      </div>

      <section className="flex w-full items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => {
              append({ label: '', type: 'text', options: [] })
            }}
          >
            append
          </Button>
          <Button
            type="button"
            onClick={() => {
              prepend({ label: '', type: 'text', options: [] })
            }}
          >
            prepend
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => {
              setValue('fields', [
                ...(getValues().fields || []),
                {
                  label: '',
                  type: 'text',
                  options: [{ label: 'appended nested' }]
                }
              ])
            }}
          >
            Append Nested
          </Button>
          <Button
            type="button"
            onClick={() => {
              setValue('fields', [
                {
                  label: '',
                  type: 'text',
                  options: [{ label: 'prepend nested' }]
                },
                ...(getValues().fields || [])
              ])
            }}
          >
            Prepend Nested
          </Button>
        </div>
      </section>

      <RenderCountVisualizer />
      {renderCountElement(renderCount, 'FieldArray')}
    </div>
  )
}
