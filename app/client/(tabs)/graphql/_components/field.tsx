import { PlayIcon } from '@/components/shared/icons'
import { Checkbox } from '@/components/shared/inputs'
import Param from './param'

import { Attribute } from '@/lib/dgraph'
import { cn } from '@/lib/util'
import { Action, FieldState } from './reducer'

export default function Field({
  parent,
  field,
  type,
  attributes,
  inputs,
  state,
  dispatch,
  exit = false,
}: {
  parent: string
  field: string
  type: string
  attributes: Record<string, Attribute[]>
  inputs: Record<string, Attribute[]>
  state: FieldState | undefined
  dispatch: React.Dispatch<Action>
  exit?: boolean
}) {
  const fields = attributes[type]

  if (!fields)
    return (
      <li>
        <Checkbox
          className='p-0 [&>input]:checkbox-sm [&>span]:text-base [&>span]:text-secondary'
          id={`${parent}-fields-${field}`}
          name={field}
          label={field}
          onChange={(event) =>
            dispatch({
              type: 'FIELD',
              payload: {
                parent,
                field,
                type,
                selected: event.target.checked,
              },
            })
          }
        />
      </li>
    )

  if (exit) return

  return (
    <li>
      <details
        open={state?.selected}
        onToggle={(event) =>
          dispatch({
            type: 'FIELD',
            payload: {
              parent,
              field,
              type,
              selected: event.currentTarget.open,
            },
          })
        }
      >
        <summary className='flex min-w-fit flex-nowrap items-center'>
          <PlayIcon
            className={cn('size-4 fill-secondary', {
              'rotate-90': state?.selected,
            })}
          />
          <span className='ps-1 text-secondary'>{field}</span>
        </summary>
        <ul className='ps-4'>
          <Param
            parent={`${parent}-fields-${field}`}
            param='filter'
            type={`${type}Filter`}
            required={false}
            state={state?.params?.filter}
            dispatch={dispatch}
            inputs={inputs}
          />
          {fields.map(({ name, type }) => (
            <Field
              key={name}
              parent={`${parent}-fields-${field}`}
              field={name}
              type={type}
              attributes={attributes}
              inputs={inputs}
              state={state?.fields?.[name]}
              dispatch={dispatch}
              exit={!state?.selected}
            />
          ))}
        </ul>
      </details>
    </li>
  )
}
