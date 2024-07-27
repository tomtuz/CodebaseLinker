'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '@/cn/ui'

// https://github.com/react-hook-form/devtools/issues/187#issuecomment-1369182795
import dynamic from 'next/dynamic'
const DevT: React.ElementType = dynamic(
  () => import('@hookform/devtools').then((module) => module.DevTool),
  { ssr: false }
)

export function TestFormReactDev() {
  const { register, control, handleSubmit } = useForm({
    mode: 'onChange'
  })

  return (
    <>
      <form
        className="outline outline-gray-100"
        onSubmit={handleSubmit((d) => console.log(d))}
      >
        <h1>TestReactHookDevForm</h1>
        <div className="flex flex-col gap-2 bg-pink-200 p-2 outline outline-1">
          <input placeholder="Enter value" {...register('test')} />
        </div>
        <div className="flex w-full items-center justify-between">
          <Button type="submit">Save</Button>
        </div>
      </form>
      <DevT control={control} placement="top-left" />
    </>
  )
}
