'use client'

import { useFormState } from 'react-dom'

import { CopyIcon } from '@/components/shared/icons'
import Radio from '@/components/shared/inputs/radio'

import { EndpointState, setEndpoint } from '../_actions/endpoint'

export default function FormEndpoint({ data }: { data: EndpointState }) {
  const [state, formAction] = useFormState(setEndpoint, { data })

  const url = `${state.data?.url}${state.data?.endpoint === 'admin' ? 'admin' : 'graphql'}`

  function handleCopy() {
    navigator.clipboard.writeText(url)
  }

  return (
    <div className='flex items-center gap-5'>
      <form
        className='min-w-fit'
        action={formAction}
        onChange={event => event.currentTarget.requestSubmit()}
      >
        <fieldset className='flex items-center gap-3'>
          <div>
            <legend className='text-nowrap text-lg font-bold'>
              GraphQL Endpoint
            </legend>
          </div>
          <Radio
            className='p-0'
            id='endpoint-client'
            name='endpoint'
            label='Client'
            value='client'
            checked={state.data?.endpoint === 'client'}
          />
          <Radio
            className='p-0'
            id='endpoint-admin'
            name='endpoint'
            label='Admin'
            value='admin'
            checked={state.data?.endpoint === 'admin'}
          />
        </fieldset>
      </form>
      <div>
        <button
          type='button'
          className='btn btn-primary btn-sm flex max-w-full flex-nowrap'
          onClick={handleCopy}
        >
          <span className='truncate'>{url}</span>
          <CopyIcon className='min-h-6 min-w-6' />
        </button>
      </div>
    </div>
  )
}
