import { ClassValue } from 'clsx'

import { cn } from '@/lib/util/cn'

export function SearchIcon({ className }: { className?: ClassValue }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      className={cn('size-6 fill-gray-950 dark:fill-gray-50', className)}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z'
      />
    </svg>
  )
}
