import React from 'react'
import { Form } from '@/types/react'
import { AnswerTypeSelect } from './AnswerTypeSelect'
import { AnswerPlaceholder } from './AnswerPlaceholder'
import { FieldArrayWithId } from 'react-hook-form'
import { useRenderCountFull } from '@/hooks/useRedrawCountFull'
import { useRenderCount, renderCountElement } from '@/hooks/useRedrawCount'

interface AnswerFieldProps {
  index: number
  field: FieldArrayWithId<Form, 'fields', 'id'>
  onSelect: (index: number) => void
}

const MemoizedAnswerTypeSelect = React.memo(AnswerTypeSelect)
// const MemoizedAnswerPlaceholder = React.memo(AnswerPlaceholder)

export function AnswerField({ index, field, onSelect }: AnswerFieldProps) {
  const renderCount = useRenderCount()
  const { RenderCountVisualizer } = useRenderCountFull('AnswerField', true)

  return (
    <div className="mb-4 rounded bg-red-100 p-4 outline outline-1">
      <MemoizedAnswerTypeSelect
        index={index}
        onSelect={onSelect}
        field={field}
      />
      <AnswerPlaceholder field={field} index={index} />
      <RenderCountVisualizer />
      {renderCountElement(renderCount, 'AnswerField')}
    </div>
  )
}
