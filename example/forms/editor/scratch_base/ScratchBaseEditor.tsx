'use client'

import React from 'react'
import { useForm, UseFormRegister } from 'react-hook-form'
import { Button } from '@/cn/ui'
import { Form } from '@/types/react'

import { useRenderCountFull } from '@/hooks/useRedrawCountFull'
import { useRenderCount, renderCountElement } from '@/hooks/useRedrawCount'
import { FieldArray } from './FieldArray'

const defaultFormData = {
  header: { title: '', description: '' },
  fields: []
}

interface HeaderSectionProps {
  register: UseFormRegister<Form>
}

export function FormHeader({ register }: Readonly<HeaderSectionProps>) {
  const renderCount = useRenderCount()
  const { RenderCountVisualizer, updateVisualizer } = useRenderCountFull(
    'FormHeader',
    true
  )

  return (
    <div className="bg-purple-100 p-4 outline outline-1">
      <input
        className="mb-2 w-full rounded border p-2"
        {...register('header.title')}
      />

      <input
        className="mb-4 w-full rounded border p-2"
        {...register('header.description')}
      />
      <RenderCountVisualizer />
      {renderCountElement(renderCount, 'FormHeader')}
    </div>
  )
}

export function ScratchBaseEditor() {
  const renderCount = useRenderCount()
  const { RenderCountVisualizer, updateVisualizer } = useRenderCountFull(
    'ScratchBaseEditor',
    true
  )

  const { control, register, handleSubmit, getValues, reset, setValue } =
    useForm<Form>({
      defaultValues: defaultFormData
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
      <h1 className="w-full p-4 text-center text-3xl">Scratch Base</h1>

      <FormHeader register={register} />

      <div className="p-2 outline outline-1 outline-pink-100">
        <FieldArray {...{ control, register, getValues, setValue }} />
      </div>

      <div className="flex w-full justify-end gap-3">
        <Button type="button" onClick={() => reset(defaultFormData)}>
          Reset
        </Button>
        <Button type="submit">Save</Button>
      </div>
      <RenderCountVisualizer />
      {renderCountElement(renderCount, 'ScratchBaseEditor')}
    </form>
  )
}
