'use client'

import { useEffect, useState } from 'react'

import Node from '@/app/client/(tabs)/navigator/_components/node'

import { query } from '@/app/client/(tabs)/navigator/actions'

import { Attribute } from '@/lib/dgraph'

export type Breadcrumb = {
  type: string
  filter?: { type: string; by: string; value: string }
  query?: { type: string; attribute: string }
}

export default function Navaigator({
  types,
  attributes,
}: {
  types: string[]
  attributes: Record<string, Attribute[]>
}) {
  const [tab, setTab] = useState(types.at(0))
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([])
  const [results, setResults] = useState<any>()
  const [loading, setLoading] = useState(false)

  const lastBreadcrumb = breadcrumbs.at(-1)
  const type = lastBreadcrumb?.query?.type ?? lastBreadcrumb?.type

  useEffect(() => {
    if (tab) setBreadcrumbs([{ type: tab }])
  }, [tab])

  useEffect(() => {
    if (lastBreadcrumb) {
      setLoading(true)

      query(
        lastBreadcrumb,
        attributes[type!]
          .filter(({ type }) => !type.endsWith('AggregateResult'))
          .map(({ name, type }) => {
            const t = types.find(t => type.includes(t))

            if (!t) return name

            const attribute = (
              attributes[t].find(({ type }) => type === 'ID') ??
              attributes[t].find(({ unique }) => unique)
            )?.name

            return `${name} { ${attribute} }`
          }),
      ).then(results => {
        setResults(results)
        setLoading(false)
      })
    }
  }, [lastBreadcrumb, type, types, attributes])

  function addBreadcrumb(breadcrumb: Breadcrumb) {
    return setBreadcrumbs(breadcrumbs => [...breadcrumbs, breadcrumb])
  }

  return (
    <div className='grid h-full max-h-full grid-rows-[2.5rem_auto] divide-y divide-base-200'>
      <div>
        <div className='breadcrumbs max-w-full text-sm'>
          <ul>
            {breadcrumbs.map((crumb, index) => (
              <li key={index}>
                <button
                  type='button'
                  className='btn btn-link btn-xs px-0 no-underline'
                  onClick={() =>
                    setBreadcrumbs(breadcrumbs =>
                      breadcrumbs.slice(0, index + 1),
                    )
                  }
                >
                  {crumb.type}
                  {!!crumb.filter && `(${crumb.filter.value})`}
                  {!!crumb.query && `.${crumb.query.attribute}`}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='grid h-full max-h-full grid-cols-[16rem_auto] divide-x divide-base-200'>
        <div className='py-3'>
          <span>GraphQL Types ({types.length})</span>
          {types.map(type => (
            <button
              key={type}
              className='flex items-center gap-3 p-2'
              onClick={() => setTab(type)}
            >
              <input
                type='radio'
                className='radio-primary radio'
                checked={tab === type}
                readOnly
              />
              <span className='block'>{type}</span>
            </button>
          ))}
        </div>
        <div className='max-h-full overflow-auto'>
          <div className='grid gap-3 p-3 pe-0 xl:grid-cols-2 2xl:grid-cols-3'>
            {results?.map((node: any, index: number) => (
              <Node
                key={node.id ?? index}
                type={type!}
                attributes={attributes}
                node={node}
                addBreadcrumb={addBreadcrumb}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
