'use client'

import { Button } from '@/cn/ui/button'
import Link from 'next/link'
import React, { useCallback, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

type Form = {
  id: string
  inputValue: string
}

export function TestFormDataApi() {
  const [formIds, setFormIds] = useState<string[]>([])

  const createInitialForms = () => Array.from({ length: 2 }, () => uuidv4())

  useEffect(() => {
    // Add initial forms
    setFormIds(createInitialForms())
  }, [])

  const handleAddForm = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      setFormIds((prev) => [...prev, uuidv4()])
    },
    []
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const forms: Form[] = formIds.map((id) => ({
        id,
        inputValue: formData.get(`${id}_inputValue`) as string
      }))
      console.log('Submitted form data:', forms)
      // Here you can send the data to an API or process it further
    },
    [formIds]
  )

  // For large input lists consider using React.memo for <StateInputComp />
  // const MemoizedStateInputComp = React.memo(StateInputComp);
  // {formIds.map((id) => (
  //   <MemoizedStateInputComp key={id} id={id} />
  // ))}
  return (
    <form onSubmit={handleSubmit} className="outline outline-gray-100">
      <h1>TestFormDataAPI</h1>
      <div className="flex flex-col gap-2 bg-pink-200 p-2 outline outline-1">
        {formIds.map((id) => (
          <StateInputComp key={id} id={id} />
        ))}
      </div>
      <div className="flex w-full items-center justify-between">
        <Button type="submit">Save</Button>
        <Button type="button" onClick={handleAddForm}>
          Add
        </Button>
      </div>
    </form>
  )
}

function StateInputComp({ id }: { id: string }) {
  return <input name={`${id}_inputValue`} defaultValue="" />
}
