'use client'

import React from 'react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/cn/ui/table'

import { useFormContext } from '@/contexts/FormContext'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Button } from '@/cn/ui'
import { LS_FORM_DATA } from '@/constants'

export function FormListTable() {
  const { forms } = useFormContext()
  const { setStorageValue } = useLocalStorage()

  return (
    <Table>
      <TableCaption>A list of your forms</TableCaption>
      <TableCaption>
        <Button type="button" onClick={() => setStorageValue(LS_FORM_DATA, [])}>
          DeleteAll (LocalStorage)
        </Button>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Fields Count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {forms.map((form) => (
          <TableRow key={form.id}>
            <TableCell className="font-medium">
              <Link href={`/forms/${form.id}`}>{form.id.slice(0, 8)}...</Link>
            </TableCell>
            <TableCell>{form.header.title}</TableCell>
            <TableCell>{form.header.description}</TableCell>
            <TableCell className="text-right">{form.fields.length}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
