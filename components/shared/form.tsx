'use client'

import { useFormState } from 'react-dom'

import { cn } from '@/lib/util/cn'

export type FormState<T = never> = {
  success?: boolean
  data?: T
  message?: {
    title: string
    text?: string
  }
}

export default function Form({
  className,
  action,
  children,
}: {
  className?: string
  action: any
  children: React.ReactNode
}) {
  const [state, formAction] = useFormState<FormState>(action, {})

  return (
    <>
      {state.message && (
        <section
          className={cn(
            'flex w-full flex-col gap-1 rounded p-3',
            state.success ? 'bg-green-950/50' : 'bg-red-950/50',
          )}
        >
          <span className={state.success ? 'text-green-400' : 'text-red-400'}>
            {state.message.title}
          </span>
          {!!state.message?.text && (
            <span className='text-sm text-red-300'>{state.message.text}</span>
          )}
        </section>
      )}
      <form className={className} action={formAction}>
        {children}
      </form>
    </>
  )
}
