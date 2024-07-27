'use client'

import { Button } from '@/cn/ui/button'
import Link from 'next/link'
// import * as React from 'react'

import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef
} from 'react'

// import type forwardRef from 'react'
// import * as React from 'react'

import { v4 as uuidv4 } from 'uuid'

type InputRefCallback = (instance: HTMLInputElement | null) => void
type Form = {
  id: string
  title: string
  inputValue: string
  header: { title: string; description: string }
  fields: Array<string>
}

function useFormState() {
  const formsRef = useRef<{ [key: string]: Form }>({})

  const addForm = useCallback(() => {
    const id = uuidv4()
    formsRef.current[id] = {
      id,
      title: '',
      inputValue: '',
      header: { title: '', description: '' },
      fields: []
    }
    return id
  }, [])

  // const getForms = useCallback(() => Object.values(formsRef.current), [])
  const getForms = useCallback(
    (ids: string[]) => ids.map((id) => formsRef.current[id]).filter(Boolean),
    []
  )

  const updateForms = useCallback((formData: { [key: string]: string }) => {
    Object.entries(formData).forEach(([id, value]) => {
      if (formsRef.current[id]) {
        formsRef.current[id].inputValue = value
      }
    })
  }, [])

  return { addForm, updateForms, getForms }
}

// const FormMessage = React.forwardRef<
//   HTMLParagraphElement,
//   React.HTMLAttributes<HTMLParagraphElement>
// >

// const FormMessage = React.forwardRef<
//   HTMLParagraphElement,
//   React.HTMLAttributes<HTMLParagraphElement>
// >

// function TestFormRefs(): React.HTMLAttributes<HTMLParagraphElement> {

// export declare const FormProvider: <TFieldValues extends FieldValues, TContext = any, TTransformedValues extends FieldValues | undefined = undefined>(props: FormProviderProps<TFieldValues, TContext, TTransformedValues>) => React.JSX.Element;
// React.JSX.Element,

const TestFormRefs = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => {
  const [formIds, setFormIds] = useState<string[]>([])
  const { addForm, updateForms, getForms } = useFormState()
  const inputRefs = useRef<{ [key: string]: HTMLInputElement }>({})

  useEffect(() => {
    // Add initial forms
    setFormIds([addForm(), addForm()])
  }, [addForm])

  const handleAddForm = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      setFormIds((prev) => [...prev, addForm()])
    },
    [addForm]
  )

  // validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = useCallback(
    () => true,
    // const newErrors: { [key: string]: string } = {}
    // Object.entries(inputRefs.current).forEach(([id, inputElement]) => {
    //   if (!inputElement.value.trim()) {
    //     newErrors[id] = 'This field is required'
    //   }
    // })
    // setErrors(newErrors)
    // return Object.keys(newErrors).length === 0
    []
  )

  const doAction = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (validateForm()) {
        const formData: { [key: string]: string } = {}
        Object.entries(inputRefs.current).forEach(([id, inputElement]) => {
          formData[id] = inputElement.value
        })
        updateForms(formData)
        console.log('formData: ', getForms(formIds))
      } else {
        console.log('errors: ', errors)
      }
    },
    [getForms, formIds, updateForms, errors]
  )

  const forms = useMemo(() => getForms(formIds), [getForms, formIds])

  // ref={ref}
  // className={cn(error && 'text-destructive', className)}
  // htmlFor={formItemId}
  // {...props}

  return (
    <form className="outline outline-gray-100">
      <h1 ref={ref}>TestFormRefs</h1>
      <div className="flex flex-col gap-2 bg-pink-200 p-2 outline outline-1">
        {forms.map((form) => (
          <StateInputComp
            key={form.id}
            initialValue={form.inputValue}
            inputRef={(el) => {
              if (el) inputRefs.current[form.id] = el
              else delete inputRefs.current[form.id]
            }}
          />
        ))}
      </div>
      <div className="flex w-full items-center justify-between">
        <Button onClick={doAction}>Save</Button>
        <Button onClick={handleAddForm}>Add</Button>
      </div>
    </form>
  )
})
TestFormRefs.displayName = 'TestFormRefs'

function StateInputComp({
  initialValue,
  inputRef
}: {
  initialValue: string
  inputRef: InputRefCallback
}) {
  const [value, setValue] = useState(initialValue)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return <input value={value} onChange={handleChange} ref={inputRef} />
}

export { TestFormRefs }
