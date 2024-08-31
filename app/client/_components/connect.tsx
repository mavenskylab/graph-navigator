'use client'

import { useFormState } from 'react-dom'

import { connect } from '@/app/client/actions'

export default function Connect() {
  const [state, formAction] = useFormState(connect, {})

  return (
    <main className='grid size-full place-items-center'>
      <section className='grid w-full max-w-screen-sm gap-3 rounded border border-gray-800 p-5'>
        <h1 className='text-3xl'>Connection Configuration</h1>
        <form className='grid grid-flow-row gap-3' action={formAction}>
          <div className='grid grid-flow-row gap-1'>
            <label htmlFor='url'>DB URL</label>
            <input
              id='url'
              type='text'
              name='url'
              className='rounded bg-gray-900 p-2'
            />
          </div>
          <button type='submit' className='w-full rounded bg-blue-700 p-2'>
            Connect
          </button>
          {!!state.message && (
            <span className='text-red-500'>{state.message}</span>
          )}
        </form>
      </section>
    </main>
  )
}
