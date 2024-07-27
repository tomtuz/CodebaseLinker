'use client'

import { useRenderCountFull } from '@/hooks/useRedrawCountFull'
import { useRenderCount, renderCountElement } from '@/hooks/useRedrawCount'
import React from 'react'
import { useForm, useWatch } from 'react-hook-form'

export const TestWatch = () => {
  const renderCount = useRenderCount()
  const { RenderCountVisualizer, updateVisualizer } = useRenderCountFull(
    'TestWatch',
    true
  )
  // const { register, handleSubmit, watch } = useForm()
  const { register, handleSubmit, control } = useForm()
  const onSubmit = (data: any) => console.log(data)

  // const firstName = watch('firstName', '')
  // const lastName = watch('lastName', '')

  // Use useWatch to get the values of the form fields
  const firstName = useWatch({
    control,
    name: 'firstName',
    defaultValue: ''
  })
  const lastName = useWatch({
    control,
    name: 'lastName',
    defaultValue: ''
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>First Name</label>
        <input className="outline outline-1" {...register('firstName')} />
      </div>
      <div>
        <label>Last Name</label>
        <input className="outline outline-1" {...register('lastName')} />
      </div>
      <div className="bg-red-100">
        <label>Full Name Preview</label>
        {/* This will not update live as we type */}
        <p>Name here: {/* full name preview here */}</p>
      </div>
      <div className="bg-green-100">
        <label>Full Name Preview</label>
        {/* Live updating full name preview */}
        <p>Name here: {`${firstName} ${lastName}`}</p>
      </div>
      <button type="submit">Submit</button>
      <RenderCountVisualizer />
      {renderCountElement(renderCount, 'TestWatch')}
    </form>
  )
}
TestWatch.displayName = 'TestWatch'
