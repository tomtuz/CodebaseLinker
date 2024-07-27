import React from 'react'

interface FieldGroupProps {
  children: React.ReactNode
}

export function FieldGroup({ children }: Readonly<FieldGroupProps>) {
  return <fieldset className="grid gap-6 rounded-lg p-4">{children}</fieldset>
}
