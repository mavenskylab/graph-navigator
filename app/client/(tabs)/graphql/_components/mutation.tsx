import { PlayIcon } from '@/components/shared/icons'
import Field from './field'
import Param from './param'

import { Attribute } from '@/lib/dgraph'
import { cn } from '@/lib/util'
import { Action, QueryState } from './reducer'

export default function Mutation({
  mutation,
  params,
  type,
  attributes,
  inputs,
  state,
  dispatch,
}: {
  mutation: string
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
            type: 'MUTATION',
            payload: { mutation, selected: event.currentTarget.open },
          })
        }
      >
        <summary className='flex flex-nowrap items-center'>
          <PlayIcon
            className={cn('size-4 fill-secondary', {
              'rotate-90': state?.open,
            })}
          />
          <span className='ps-1 text-secondary'>{mutation}</span>
        </summary>
        <ul className='px-4'>
          {params.map(({ name, type, required }) => (
            <Param
              key={name}
              parent={mutation}
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
              parent={mutation}
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
