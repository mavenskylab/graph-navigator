'use client'

import { useEffect, useState } from 'react'

import {
  deploySchema,
  downloadSchema,
  dropAllData,
} from '@/app/client/(tabs)/schema/actions'
import Editor from '@/components/shared/editor'
import Form from '@/components/shared/form'
import { DownloadIcon, DeleteIcon } from '@/components/shared/icons'

export default function FormSchema({ schema = '' }) {
  const [downloadLink, setDownloadLink] = useState('')

  useEffect(() => {
    const blob = new Blob([schema], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    setDownloadLink(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [schema])

  return (
    <Form className='flex size-full flex-col gap-3' action={deploySchema}>
      <Editor className='grow' value={schema} />
      <div className='flex gap-3'>
        <a
          role='button'
          className='group flex gap-1 p-3'
          href={downloadLink}
          download='schema.gql'
        >
          <DownloadIcon className='group-hover:stroke-gray-50' />
          <span className='group-hover:font-semibold'>Download</span>
        </a>
        <button
          type='button'
          className='group flex gap-1 p-3'
          onClick={() => dropAllData()}
        >
          <DeleteIcon className='group-hover:stroke-gray-50' />
          <span className='group-hover:font-semibold'>Drop Data</span>
        </button>
        <span className='grow' />
        <button
          type='submit'
          className='rounded bg-rose-700 p-3 hover:font-semibold'
        >
          Deploy
        </button>
      </div>
    </Form>
  )
}
