'use client'

import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Button } from '@cn/ui/button'
import type { Form } from '@/types/react'
import { FormHeader } from './FormHeader'
import { FieldArray } from './FieldArray'

const defaultValues: Form = {
  header: { title: '', description: '' },
  fields: []
}

export function ReactFormEditor() {
  // Use useForm hook to manage form state
  const methods = useForm<Form>({
    defaultValues
  })

  // Form submission handler
  const onSubmit = (data: Form) => {
    try {
      console.log(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Error processing form data:', error)
    }
  }

  // Handler to print current form data
  const handlePrintData = () => {
    const data = methods.getValues()
    console.log(JSON.stringify(data, null, 2))
  }

  return (
    // Provide form context to child components
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-2/3 space-y-6"
      >
        <h1 className="w-full p-4 text-center text-3xl">React Base</h1>

        <FormHeader />
        <FieldArray />

        <div className="flex space-x-4">
          <Button type="submit">Submit Form</Button>
          <Button type="button" onClick={handlePrintData}>
            Print Data
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
