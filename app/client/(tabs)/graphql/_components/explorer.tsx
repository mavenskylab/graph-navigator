'use client'

import { useReducer } from 'react'

import { CloseIcon, PlayIcon } from '@/components/shared/icons'
import Sidebar from '@/components/shared/layouts/sidebar'
import Gql from './gql'
import Query from './query'

import { Attribute } from '@/lib/dgraph'
import explorerReducer, { QueryState, State } from './reducer'
import Mutation from './mutation'

export default function Explorer({
  schema,
  attributes,
  inputs,
  queries,
  mutations
}: {
  schema: string | null
  attributes: Record<string, Attribute[]>
  inputs: Record<string, Attribute[]>
  queries: Record<string, any>
  mutations: Record<string, any>
}) {
  const [state, dispatch] = useReducer(explorerReducer, {})

  console.log(state)

  function transformStateToGraphQL(state: State): string {
    const queries = Object.entries(state)
      .filter(([_, { selected }]) => selected)
      .map(([query, { params, fields }]) => {
        return `${query}${params ? `${transformParams(params)}` : ''} {${transformFields(fields)}}`
      })
      .join(' ')

    return `query TestQuery {_EMPTY_${queries}}`
  }

  function transformParams(params: QueryState['params']): string {
    function helper(params: QueryState['params']): Object {
      if (!params) return {}

      return Object.fromEntries(
        Object.entries(params)
          .filter(([_, { selected }]) => selected)
          .map(([param, { variable, value, params }]) => {
            // TODO: Handle variable case
            return [param, params ? helper(params) : (value ?? '')]
          }),
      )
    }

    const result = helper(params)

    if (!Object.keys(result).length) return ''

    const str = JSON.stringify(result)

    return `(${str.substring(1, str.length - 1).replaceAll(/"([^"]+)":/g, '$1: ')})`
  }

  function transformFields(fields: QueryState['fields']): string {
    if (!fields) return '_EMPTY_'

    return (
      Object.entries(fields)
        .filter(([_, { selected }]) => selected)
        .map(([field, { fields, params }]) => {
          return `${field}${params ? `${transformParams(params)}` : ''}${fields ? ` {${transformFields(fields)}}` : ''}`
        })
        .join(' ') || '_EMPTY_'
    )
  }

  return (
    <div className='grid size-full grid-cols-[auto_1fr]'>
      <Sidebar id='explorer-drawer' className='max-w-64'>
        <div className='grid h-full w-64 grid-rows-[auto_1fr] divide-y divide-base-200 text-base-content'>
          <div className='flex items-center justify-between gap-3 py-2'>
            <span className='text-lg text-primary'>Explorer</span>
            <label
              htmlFor='explorer-drawer'
              className='btn btn-ghost drawer-button btn-sm p-0'
            >
              <span className='sr-only'>Close Sidebar</span>
              <CloseIcon />
            </label>
          </div>
          <div className='overflow-auto'>
            <ul>
              {Object.entries(queries).map(([query, { params, type }]) => (
                <Query
                  key={query}
                  query={query}
                  params={params}
                  type={type}
                  attributes={attributes}
                  inputs={inputs}
                  state={state[query]}
                  dispatch={dispatch}
                />
              ))}
            </ul>
            <ul>
              {Object.entries(mutations).map(([mutation, { params, type }]) => (
                <Mutation
                  key={mutation}
                  mutation={mutation}
                  params={params}
                  type={type}
                  attributes={attributes}
                  inputs={inputs}
                  state={state[mutation]}
                  dispatch={dispatch}
                />
              ))}
            </ul>
          </div>
        </div>
      </Sidebar>
      <Gql schema={schema} gql={transformStateToGraphQL(state)} />
    </div>
  )
}
