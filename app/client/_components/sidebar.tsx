'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  DatabaseIcon,
  GraphqlIcon,
  HomeIcon,
  SearchIcon,
  SettingsIcon,
} from '@/components/shared/icons'

import { cn } from '@/lib/util/cn'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className='flex flex-col gap-5 py-5'>
      <section>
        <Link
          href='./overview'
          className={cn(
            'flex w-full gap-3 p-3',
            `${pathname.endsWith('overview') ? '' : 'hover:'}bg-gray-900`,
          )}
        >
          <HomeIcon />
          <span>Overview</span>
        </Link>
      </section>
      <section>
        <h2 className='px-3 text-lg font-semibold text-primary'>Develop</h2>
        <Link
          href='./schema'
          className={cn(
            'flex w-full gap-3 p-3',
            `${pathname.endsWith('schema') ? '' : 'hover:'}bg-gray-900`,
          )}
        >
          <DatabaseIcon />
          <span>Schema</span>
        </Link>
        <Link
          href='./graphql'
          className={cn(
            'flex w-full gap-3 p-3',
            `${pathname.endsWith('graphql') ? '' : 'hover:'}bg-gray-900`,
          )}
        >
          <GraphqlIcon />
          <span>GraphQL</span>
        </Link>
        <Link
          href='./navigator'
          className={cn(
            'flex w-full gap-3 p-3',
            `${pathname.endsWith('navigator') ? '' : 'hover:'}bg-gray-900`,
          )}
        >
          <SearchIcon />
          <span>Navigator</span>
        </Link>
      </section>
      <section>
        <h2 className='px-3 text-lg font-semibold text-primary'>Admin</h2>
        <Link
          href='./settings'
          className={cn(
            'flex w-full gap-3 p-3',
            `${pathname.endsWith('settings') ? '' : 'hover:'}bg-gray-900`,
          )}
        >
          <SettingsIcon />
          <span>Settings</span>
        </Link>
      </section>
    </aside>
  )
}
