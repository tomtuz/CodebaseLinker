import React, { useCallback, memo } from 'react'
import { QuestionTitle } from '../QuestionTitle'
import { AnswerField } from '../AnswerField'
import { useRenderCountFull } from '@/hooks/useRedrawCountFull'
import { useRenderCount, renderCountElement } from '@/hooks/useRedrawCount'
// import { useRenderCount, RenderCounter } from '@/hooks/useCountRedraw'
import { FieldArrayWithId } from 'react-hook-form'
import { Form } from '@/types/react'

interface QuestionProps {
  field: FieldArrayWithId<Form, 'fields', 'id'>
  index: number
  remove: (index: number) => void
  isSelected: boolean
  onSelect: (index: number) => void
}

const QuestionTitleMemo = React.memo(QuestionTitle)

export function QuestionComponent({
  field,
  index,
  remove,
  isSelected,
  onSelect
}: QuestionProps) {
  const renderCount = useRenderCount()
  const { RenderCountVisualizer, updateVisualizer } = useRenderCountFull(
    'Question',
    true
  )
  const handleQuestionSelect = useCallback(() => {
    onSelect(index)
  }, [onSelect, index])

  const handleRemove = useCallback(() => remove(index), [remove, index])

  return (
    <div
      role="button"
      onClick={handleQuestionSelect}
      className={isSelected ? 'ring-2 ring-blue-500' : ''}
    >
      <QuestionTitleMemo index={index} remove={handleRemove} />
      <AnswerField index={index} field={field} onSelect={onSelect} />
      <RenderCountVisualizer />
      {renderCountElement(renderCount, 'AnswerField')}
    </div>
  )
}

// export const Question = memo(
//   QuestionComponent
//   // (prevProps, nextProps) => {
//   //   return (
//   //     prevProps.field === nextProps.field &&
//   //     // prevProps.index === nextProps.index &&
//   //     prevProps.isSelected === nextProps.isSelected
//   //   )
//   // }
// )
