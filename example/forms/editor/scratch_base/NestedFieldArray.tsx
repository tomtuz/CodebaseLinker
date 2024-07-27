/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from '@/cn/ui'
import { useRenderCountFull } from '@/hooks/useRedrawCountFull'
import { useRenderCount, renderCountElement } from '@/hooks/useRedrawCount'
import { Form } from '@/types/react'
import React from 'react'
import {
  Control,
  FieldArrayWithId,
  useFieldArray,
  UseFormRegister
} from 'react-hook-form'

interface MultiOptionFieldProps {
  index: number
  control: Control<Form>
  // fields: FieldArrayWithId<Form, `fields.${number}.options`, 'id'>[]
  register: UseFormRegister<Form>
  // remove: (index?: number | number[]) => void
}

export function MultiOptionField({
  index,
  control,
  // fields,
  register
  // remove
}: Readonly<MultiOptionFieldProps>) {
  const renderCount = useRenderCount()
  const { RenderCountVisualizer, updateVisualizer } = useRenderCountFull(
    'MultiOptionField',
    true
  )
  const { append, fields, remove } = useFieldArray({
    control,
    name: `fields.${index}.options`
  })

  return (
    <div className="bg-orange-100 p-2">
      {fields.map((item, k) => (
        <div className="flex flex-col items-center" key={item.id}>
          <div className="mb-2 flex w-full items-center justify-between gap-2">
            <label className="font-bold">Nested</label>
            <Button className="w-14" onClick={() => remove(k)}>
              Delete
            </Button>
          </div>

          <input
            className="mb-2 outline outline-1"
            placeholder="Text answer..."
            {...register(`fields.${index}.options.${k}.label`)}
          />
        </div>
      ))}
      <Button
        onClick={() =>
          append({
            label: 'test label string'
          })
        }
      >
        Add
      </Button>

      <span className="flex w-[80px] flex-col content-center items-center justify-center bg-red-100 text-sm font-bold outline outline-1 outline-red-300">
        {/* <span>{renderCount}</span> */}
      </span>
    </div>
  )
}

interface NestedFieldArrayProps {
  nestIndex: number
  register: UseFormRegister<Form>
  control: Control<Form>
}

export function NestedFieldArray({
  nestIndex,
  control,
  register
}: NestedFieldArrayProps) {
  const renderCount = useRenderCount()
  const { RenderCountVisualizer, updateVisualizer } = useRenderCountFull(
    'NestedFieldArray',
    true
  )

  return (
    <div className="flex flex-col items-center gap-2 bg-red-100 p-4">
      <MultiOptionField
        index={nestIndex}
        control={control}
        register={register}
        // fields={fields}
        // remove={remove}
      />

      <RenderCountVisualizer />
      {renderCountElement(renderCount, 'NestedFieldArray')}
    </div>
  )
}
