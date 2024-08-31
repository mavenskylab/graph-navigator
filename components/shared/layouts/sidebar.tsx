'use client'

import { useState } from 'react'

import { cn } from '@/lib/util'

export default function Sidebar({
  id,
  className,
  initiallyCollapsed = false,
  children,
}: {
  id: string
  className?: string
  initiallyCollapsed?: boolean
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(initiallyCollapsed)

  function toggleCollapsed() {
    setCollapsed(collapsed => !collapsed)
  }

  return (
    <div
      className={cn(
        'max-w-96',
        className,
        'size-full overflow-hidden transition-[max-width] duration-500',
        { 'max-w-0': collapsed },
      )}
    >
      <input
        id={id}
        type='checkbox'
        className='fixed appearance-none opacity-0'
        checked={collapsed}
        onChange={toggleCollapsed}
      />
      <div
        className={cn('size-full min-w-fit transition-transform duration-500', {
          '-translate-x-full': collapsed,
        })}
      >
        {children}
      </div>
    </div>
  )
}
