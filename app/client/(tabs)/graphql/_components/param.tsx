'use client'

import { PlayIcon } from '@/components/shared/icons'
import { Checkbox } from '@/components/shared/inputs'

import { Attribute } from '@/lib/dgraph'
import { cn } from '@/lib/util'
import { Action, ParamState } from './reducer'
import { useEffect } from 'react'

export type ParamProps = {
  parent: string
  param: string
  type: string
  required: boolean
  inputs: Record<string, Attribute[]>
  state: ParamState | undefined
  dispatch: React.Dispatch<Action>
  exit?: boolean
}

export default function Param({ exit = false, ...props }: ParamProps) {
  if (exit) return

  const params = props.inputs[props.type]

  if (!params) return <SingleParam {...props} />

  return <MultiParam {...props} params={params} />
}

function SingleParam({ parent, param, required, state, dispatch }: ParamProps) {
  useEffect(() => {
    if (required) {
      dispatch({
        type: 'SELECT_PARAM',
        payload: {
          parent,
          param,
          selected: true,
        },
      })
    }
  }, [dispatch, param, parent, required])

  return (
    <li>
      <div
        className={cn('group flex flex-nowrap gap-2 hover:gap-0', {
          'gap-0': state?.variable,
        })}
      >
        <Checkbox
          className='p-0 [&>input]:checkbox-sm [&>span]:text-base [&>span]:text-accent'
          id={`${parent}-params-${param}`}
          name={param}
          checked={state?.selected}
          label={`${param}${required ? '*' : ''}:`}
          onChange={(event) =>
            dispatch({
              type: 'SELECT_PARAM',
              payload: {
                parent,
                param,
                selected: event.target.checked,
              },
            })
          }
        />
        <button
          type='button'
          className={cn(
            'btn btn-ghost btn-xs hidden !bg-transparent text-success group-hover:inline-flex',
            { 'inline-flex': state?.variable },
          )}
          onClick={() =>
            dispatch({
              type: 'VAR_PARAM',
              payload: {
                parent,
                param,
              },
            })
          }
        >
          $
        </button>
        {!state?.variable && (
          <label
            className='input input-xs input-ghost flex items-center gap-2 border-none focus-within:outline-primary focus:outline-primary'
            htmlFor={`${parent}-params-${param}-value`}
            aria-label={`${parent}-params-${param}-value`}
          >
            <input
              className='grow border-b border-base-200'
              id={`${parent}-params-${param}-value`}
              name={`${parent}-params-${param}-value`}
              type='text'
              onChange={(event) =>
                dispatch({
                  type: 'SET_PARAM',
                  payload: {
                    parent,
                    param,
                    value: event.target.value,
                  },
                })
              }
            />
          </label>
        )}
      </div>
    </li>
  )
}

function MultiParam({
  parent,
  param,
  inputs,
  params,
  state,
  dispatch,
}: ParamProps & { params: Attribute[] }) {
  return (
    <li>
      <details
        open={state?.selected}
        onToggle={(event) =>
          dispatch({
            type: 'SELECT_PARAM',
            payload: {
              parent,
              param,
              selected: event.currentTarget.open,
            },
          })
        }
      >
        <summary className='group flex min-w-fit flex-nowrap items-center'>
          <PlayIcon
            className={cn('size-4 fill-accent', {
              'rotate-90': state?.selected,
            })}
          />
          <span className='ps-1 text-accent'>{param}</span>
          <button
            type='button'
            className='btn btn-ghost btn-xs hidden !bg-transparent text-success group-hover:inline-flex'
          >
            $
          </button>
        </summary>
        <ul className='ps-4'>
          {params.map(({ name, type, required }) => (
            <Param
              key={name}
              parent={`${parent}-params-${param}`}
              param={name}
              type={type}
              required={required}
              inputs={inputs}
              state={state?.params?.[name]}
              dispatch={dispatch}
              exit={!state?.selected}
            />
          ))}
        </ul>
      </details>
    </li>
  )
}
