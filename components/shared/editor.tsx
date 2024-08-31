'use client'

import { ClassValue } from 'clsx'

import { cn } from '@/lib/util/cn'

export default function Editor({
  className,
  name = 'editor',
  value,
}: {
  className?: ClassValue
  name?: string
  value?: string
}) {
  return (
    <textarea
      id={name}
      className={cn(
        'rounded bg-gray-950 p-5 outline outline-1 outline-gray-900',
        className,
      )}
      name={name}
      defaultValue={value}
    />
  )
}
