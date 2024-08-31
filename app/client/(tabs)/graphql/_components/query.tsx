import { PlayIcon } from '@/components/shared/icons'
import Field from './field'
import Param from './param'

import { Attribute } from '@/lib/dgraph'
import { cn } from '@/lib/util'
import { Action, QueryState } from './reducer'

export default function Query({
  query,
  params,
  type,
  attributes,
  inputs,
  state,
  dispatch,
}: {
  query: string
  params: Attribute[]
  type: string
  attributes: Record<string, Attribute[]>
  inputs: Record<string, Attribute[]>
  state: QueryState | undefined
  dispatch: React.Dispatch<Action>
}) {
  const fields = attributes[type]

  return (
    <li>
      <details
        open={state?.open}
        onToggle={(event) =>
          dispatch({
            type: 'QUERY',
            payload: { query, selected: event.currentTarget.open },
          })
        }
      >
        <summary className='flex flex-nowrap items-center'>
          <PlayIcon
            className={cn('size-4 fill-secondary', {
              'rotate-90': state?.open,
            })}
          />
          <span className='ps-1 text-secondary'>{query}</span>
        </summary>
        <ul className='px-4'>
          {params.map(({ name, type, required }) => (
            <Param
              key={name}
              parent={query}
              param={name}
              type={type}
              required={required}
              state={state?.params?.[name]}
              dispatch={dispatch}
              inputs={inputs}
            />
          ))}
          {fields?.map(({ name, type }) => (
            <Field
              key={name}
              parent={query}
              field={name}
              type={type}
              attributes={attributes}
              inputs={inputs}
              state={state?.fields?.[name]}
              dispatch={dispatch}
            />
          ))}
        </ul>
      </details>
    </li>
  )
}
