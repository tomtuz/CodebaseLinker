'use client'

import Link from 'next/link'
import React, { useCallback } from 'react'
import { useFieldArray, useForm, Controller } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/cn/ui/button'
import { DevTool } from '@hookform/devtools'

type FormField = {
  id: string
  inputValue: string
}

type FormData = {
  fields: FormField[]
}

export function TestFormReact() {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      fields: [
        { id: uuidv4(), inputValue: '' },
        { id: uuidv4(), inputValue: '' }
      ]
    }
  })

  const { fields, append } = useFieldArray({
    control,
    name: 'fields'
  })

  const onSubmit = useCallback((data: FormData) => {
    console.log('Submitted form data:', data)
    // Here you can send the data to an API or process it further
  }, [])

  const handleAddForm = useCallback(() => {
    append({ id: uuidv4(), inputValue: '' })
  }, [append])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="outline outline-gray-100"
    >
      <h1>TestReactHookForm</h1>
      <div className="flex flex-col gap-2 bg-pink-200 p-2 outline outline-1">
        {fields.map((field, index) => (
          <StateInputComp key={field.id} control={control} index={index} />
        ))}
      </div>
      <div className="flex w-full items-center justify-between">
        <Button type="submit">Save</Button>
        <Button type="button" onClick={handleAddForm}>
          Add
        </Button>
      </div>
    </form>
  )
}

function StateInputComp({ control, index }: { control: any; index: number }) {
  return (
    <Controller
      name={`fields.${index}.inputValue`}
      control={control}
      rules={{ required: 'This field is required' }}
      render={({ field, fieldState: { error } }) => (
        <div>
          <input {...field} placeholder="Enter value" />
          {error && (
            <span className="text-sm text-red-500">{error.message}</span>
          )}
        </div>
      )}
    />
  )
}
