import React from 'react'
import { Control, useFieldArray, Controller } from 'react-hook-form'
import { Input, Checkbox, Button } from '@/cn/ui'
import { Form } from '@/types/react'

interface MultiOptionFieldProps {
  fieldIndex: number
  control: Control<Form>
  type: 'checkbox' | 'select'
}

export function MultiOptionField({
  fieldIndex,
  control,
  type
}: MultiOptionFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `fields.${fieldIndex}.options`
  })

  return (
    <div>
      {fields.map((option, optionIndex) => (
        <div key={option.id} className="mb-2 flex items-center">
          {type === 'checkbox' ? (
            <Checkbox disabled className="mr-2" />
          ) : (
            <span className="mr-2">{optionIndex + 1}.</span>
          )}
          <Controller
            name={`fields.${fieldIndex}.options.${optionIndex}.label`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Option label"
                className="flex-grow"
              />
            )}
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
    </div>
  )
}
