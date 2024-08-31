'use server'

import { Breadcrumb } from '@/app/client/(tabs)/navigator/_components/navigator'
import { dgraphClient } from '@/lib/db/client'

export async function queryAll(type: string, attributes: string[]) {
  const client = dgraphClient

  const {
    data: { [`query${type}`]: result },
  } = (await client.query(
    /* GraphQL */ `
    query GetAll${type} {
      query${type} {
        ${attributes.join('\n')}
      }
    }
  `,
    undefined,
  )) as any

  return result as any[]
}

export async function query(breadcrumb: Breadcrumb, attributes: string[]) {
  const client = dgraphClient

  const queryTag = `${breadcrumb.filter ? 'get' : 'query'}${breadcrumb.type}`

  const query = breadcrumb.query
    ? `${breadcrumb.query.attribute} { ${attributes.join(' ')} }`
    : attributes.join(' ')

  const { data } = (await client.query(
    /* GraphQL */ `
    query NavigatorQuery${breadcrumb.type}${breadcrumb.filter ? `($${breadcrumb.filter.by}: ${breadcrumb.filter.type}!)` : ''} {
      ${queryTag}${breadcrumb.filter ? `(${breadcrumb.filter.by}: $${breadcrumb.filter.by})` : ''} {
        ${query}
      }
    }
  `,
    {
      ...(breadcrumb.filter && {
        [breadcrumb.filter.by]: breadcrumb.filter.value,
      }),
    },
  )) as any

  const { [queryTag]: result } = data

  return (
    breadcrumb.query
      ? result[breadcrumb.query.attribute]
      : breadcrumb.filter
        ? [result]
        : result
  ) as any[]
}
