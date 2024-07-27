import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Form } from '@/types/react'
import { useRenderCountFull } from '@/hooks/useRedrawCountFull'
import { useRenderCount, renderCountElement } from '@/hooks/useRedrawCount'
import { Input } from '@/cn/ui'

export function FormHeader() {
  const renderCount = useRenderCount()
  const { RenderCountVisualizer, updateVisualizer } = useRenderCountFull(
    'AnswerTypeSelect',
    true
  )
  const { register } = useFormContext<Form>()

  return (
    <div className="relative bg-purple-100 p-4">
      <div>
        <div>Form Title</div>
        <Input
          {...register('header.title')}
          placeholder="Form Title"
          className="mb-2 w-full rounded border p-2"
        />
      </div>
      <div>
        <div>Form Description</div>
        <Input
          {...register('header.description')}
          placeholder="Form Description"
          className="mb-2 w-full rounded border p-2"
        />
      </div>
      <RenderCountVisualizer />
      {renderCountElement(renderCount, 'FormHeader')}
    </div>
  )
}
