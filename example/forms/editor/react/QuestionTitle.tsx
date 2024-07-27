import React from 'react'
import { Button } from '@/cn/ui'
import { Form } from '@/types/react'
import { useFormContext } from 'react-hook-form'
import { useRenderCountFull } from '@/hooks/useRedrawCountFull'
import { useRenderCount, renderCountElement } from '@/hooks/useRedrawCount'
import { register } from 'module'

interface QuestionTitleProps {
  index: number
  remove: () => void
}

export function QuestionTitle({ index, remove }: QuestionTitleProps) {
  const renderCount = useRenderCount()
  const { RenderCountVisualizer, updateVisualizer } = useRenderCountFull(
    'AnswerTypeSelect',
    true
  )
  const { register } = useFormContext<Form>()

  return (
    <div className="relative mb-2 flex items-center justify-center bg-blue-100 p-4 outline outline-1">
      <div className="flex w-full items-center justify-center gap-2 bg-blue-200">
        <div className="flex flex-col">
          <div>Question Title</div>
          <div className="flex">
            <input
              {...register(`fields.${index}.label`)}
              placeholder="Question"
              className="w-full"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="bg-red-100"
              onClick={remove}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
      <RenderCountVisualizer />
      {renderCountElement(renderCount, 'QuestionTitle')}
    </div>
  )
}
