import React from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { Input, Checkbox, Button } from '@/cn/ui'
import { Form } from '@/types/react'
import { useRenderCountFull } from '@/hooks/useRedrawCountFull'
import { useRenderCount, renderCountElement } from '@/hooks/useRedrawCount'

interface MultiOptionFieldProps {
  fieldIndex: number
  type: 'checkbox' | 'select'
}

export function MultiOptionField({ fieldIndex, type }: MultiOptionFieldProps) {
  const renderCount = useRenderCount()
  const { RenderCountVisualizer, updateVisualizer } = useRenderCountFull(
    'AnswerTypeSelect',
    true
  )
  const { control, register } = useFormContext<Form>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: `fields.${fieldIndex}.options`
  })

  return (
    <div className="relative bg-orange-100 p-2">
      {fields.map((option, optionIndex) => (
        <div key={option.id} className="mb-2 flex items-center">
          {type === 'checkbox' ? (
            <Checkbox disabled className="mr-2" />
          ) : (
            <span className="mr-2">{optionIndex + 1}.</span>
          )}
          <Input
            {...register(`fields.${fieldIndex}.options.${optionIndex}.label`)}
            placeholder="Option label"
            className="flex-grow"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => remove(optionIndex)}
            className="ml-2"
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => append({ label: '' })}
        className="mt-2"
      >
        Add Option
      </Button>
      <RenderCountVisualizer />
      {renderCountElement(renderCount, 'MultiOptionField')}
    </div>
  )
}
