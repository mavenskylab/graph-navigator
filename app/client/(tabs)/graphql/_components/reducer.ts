type QueryAction = {
  type: 'QUERY'
  payload: { query: string; selected: boolean }
}

type MutationAction = {
  type: 'MUTATION'
  payload: { mutation: string; selected: boolean }
}

type SelectParamAction = {
  type: 'SELECT_PARAM'
  payload: { parent: string; param: string; selected: boolean }
}
type SetParamAction = {
  type: 'SET_PARAM'
  payload: { parent: string; param: string; value: any }
}
type VarParamAction = {
  type: 'VAR_PARAM'
  payload: { parent: string; param: string }
}

type FieldAction = {
  type: 'FIELD'
  payload: { parent: string; field: string; type: any; selected: boolean }
}

export type Action =
  | QueryAction
  | MutationAction
  | SelectParamAction
  | SetParamAction
  | VarParamAction
  | FieldAction

export type State = Record<string, QueryState>

export type QueryState = {
  selected: boolean
  params?: Record<string, ParamState>
  fields?: Record<string, FieldState>
} & Record<string, any>

export type ParamState = {
  selected?: boolean
  variable?: boolean
  value?: any
  params?: Record<string, ParamState>
}

export type FieldState = {
  selected?: boolean
  params?: Record<string, ParamState>
  fields?: Record<string, FieldState>
}

type InfiniteRecord<K extends keyof any, T> = {
  [P in K]: InfiniteRecord<K, T>
}

export default function explorerReducer(
  state: State,
  { type, payload }: Action,
): State {
  switch (type) {
    case 'QUERY':
      return handleQueryAction(state, payload)
    case 'MUTATION':
      return handleMutationAction(state, payload)
    case 'SELECT_PARAM':
      return handleSelectParamAction(state, payload)
    case 'SET_PARAM':
      return handleSetParamAction(state, payload)
    case 'VAR_PARAM':
      return handleVarParamAction(state, payload)
    case 'FIELD':
      return handleFieldAction(state, payload)
    default:
      return state
  }
}

function handleQueryAction(
  state: State,
  { query, selected }: QueryAction['payload'],
): State {
  return {
    ...state,
    [query]: {
      ...state[query],
      selected,
    },
  }
}

function handleMutationAction(
  state: State,
  { mutation, selected }: MutationAction['payload'],
): State {
  return {
    ...state,
    [mutation]: {
      ...state[mutation],
      selected,
    },
  }
}

function handleSelectParamAction(
  state: State,
  { parent, param, selected }: SelectParamAction['payload'],
): State {
  return updateByPath(state, [...parent.split('-'), 'params', param], () => ({
    selected,
  })) as State
}

function handleSetParamAction(
  state: State,
  { parent, param, value }: SetParamAction['payload'],
): State {
  return updateByPath(state, [...parent.split('-'), 'params', param], () => ({
    value,
  })) as State
}
function handleVarParamAction(
  state: State,
  { parent, param }: VarParamAction['payload'],
): State {
  return updateByPath(
    state,
    [...parent.split('-'), 'params', param],
    ({ variable = false }) => ({ variable: !variable }),
  ) as State
}

function handleFieldAction(
  state: State,
  { parent, field, type, selected }: FieldAction['payload'],
): State {
  return updateByPath(state, [...parent.split('-'), 'fields', field], () => ({
    selected,
    type,
  })) as State
}

function updateByPath<K extends keyof any = string, T = Object>(
  state: InfiniteRecord<K, T> = {} as any,
  path: K[],
  callback: (state: Record<K, any>) => Object,
): InfiniteRecord<K, T> {
  const [key, ...keys] = path

  if (!keys.length) {
    return {
      ...state,
      [key]: {
        ...state[key],
        ...callback(state[key] ?? {}),
      },
    }
  }

  return {
    ...state,
    [key]: updateByPath(state[key], keys, callback),
  }
}
