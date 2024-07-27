import React from 'react'
import clsx from 'clsx'

interface FileUploadProps {
  disabled?: boolean
  // onValueChange?(value: string): void
}

export function FileUploadInput({ disabled }: FileUploadProps) {
  return (
    <div className="my-component">
      <div className={clsx({ disabled })}>Upload file here</div>
    </div>
  )
}
