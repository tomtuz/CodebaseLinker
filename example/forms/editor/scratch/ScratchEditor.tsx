'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/cn/ui'
import { FieldArray } from './FieldArray'

interface DefauultValues {
  test: {
    name: string
    nestedArray: {
      field1: string
      field2: string
    }[]
  }[]
}

const defaultValues = {
  test: [
    {
      name: 'useFieldArray1',
      nestedArray: [{ field1: 'field1', field2: 'field2' }]
    },
    {
      name: 'useFieldArray2',
      nestedArray: [{ field1: 'field1', field2: 'field2' }]
    }
  ]
}

export function ScratchEditor() {
  const { control, register, handleSubmit, getValues, reset, setValue } =
    useForm<DefauultValues>({
      defaultValues
    })

  const onSubmit = (data: any) => {
    try {
      console.log(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Error processing form data:', error)
    }
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <h1>Array of Array Fields</h1>
      <p>
        The following example demonstrate the ability of building nested array
        fields.
      </p>

      <FieldArray {...{ control, register, getValues, setValue }} />

      <Button type="button" onClick={() => reset(defaultValues)}>
        Reset
      </Button>

      <Button type="submit">Submit</Button>
    </form>
  )
}
