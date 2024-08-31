import { ChevronRightIcon, CubeIcon } from '@/components/shared/icons'

import { Attribute } from '@/lib/dgraph'
import { isObject } from '@/lib/util'
import { Breadcrumb } from './navigator'

export default function Node({
  type,
  attributes,
  node,
  addBreadcrumb,
}: {
  type: string
  attributes: Record<string, Attribute[]>
  node: Record<string, any>
  addBreadcrumb: (breadcrumb: Breadcrumb) => void
}) {
  const identifier = (attributes[type].find(({ type }) => type === 'ID') ??
    attributes[type].find(({ unique }) => unique))!

  return (
    <div className='card card-compact bg-base-200 shadow-xl'>
      <div className='card-body'>
        {Object.entries(node).map(([attribute, value]) => {
          const isPointer =
            isObject(value) || (Array.isArray(value) && isObject(value.at(0)))

          if (!isPointer)
            return (
              <div key={attribute} className='flex flex-wrap'>
                <div className='flex gap-2 pe-2'>
                  <CubeIcon className='fill-secondary size-5' />
                  <span className='text-secondary'>{attribute}</span>
                </div>
                <span className='break-all'>{value}</span>
              </div>
            )

          const attr = attributes[type].find(({ name }) => name === attribute)

          if (!attr) return

          const breadcrumb = (
            Array.isArray(value)
              ? {
                  type,
                  filter: {
                    type: identifier.type,
                    by: identifier.name,
                    value: node[identifier.name],
                  },
                  query: {
                    type: attr.type,
                    attribute,
                  },
                }
              : {
                  type: attr.type,
                  filter: Object.fromEntries(
                    Object.entries(value).flatMap(([key, value]) => [
                      [
                        'type',
                        attributes[attr.type].find(({ name }) => name === key)
                          ?.type,
                      ],
                      ['by', key],
                      ['value', value],
                    ]),
                  ),
                }
          ) as Breadcrumb

          return (
            <button
              key={attribute}
              type='button'
              className='btn btn-xs btn-block flex gap-2 border-none p-0 text-sm shadow-none'
              onClick={() => addBreadcrumb(breadcrumb)}
            >
              <CubeIcon className='fill-primary size-5' />
              <span className='text-primary'>{attribute}</span>
              <div className='grid flex-grow place-items-end'>
                <ChevronRightIcon className='fill-primary size-5' />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
