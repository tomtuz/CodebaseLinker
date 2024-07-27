/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from '@/cn/ui'
import React from 'react'
import { useFieldArray } from 'react-hook-form'

interface NestedFieldArrayProps {
  nestIndex: number
  control: any
  register: any
}

export function NestedFieldArray({
  nestIndex,
  control,
  register
}: NestedFieldArrayProps) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `test.${nestIndex}.nestedArray`
  })

  return (
    <div className="flex flex-col items-center gap-4">
      {fields.map((item, k) => (
        <div className="flex flex-col items-center gap-4" key={item.id}>
          <label>Nested Array:</label>
          <input
            className="p-1 outline outline-1"
            placeholder="Text answer..."
            {...register(`test.${nestIndex}.nestedArray.${k}.field1`, {
              required: true
            })}
          />

          <input
            className="p-1 outline outline-1"
            {...register(`test.${nestIndex}.nestedArray.${k}.field2`)}
          />
          <Button onClick={() => remove(k)}>Delete Nested</Button>
        </div>
      ))}

      <Button
        onClick={() =>
          append({
            field1: 'field1',
            field2: 'field2'
          })
        }
      >
        Append Nested
      </Button>

      <hr />
    </div>
  )
}
