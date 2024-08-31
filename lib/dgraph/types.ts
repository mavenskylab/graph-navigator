import { mutations, queries } from './gql'

export interface Operation {
  schema?: string
  dropAttr?: string
  dropAll?: boolean
}

type AdminInputs = {
  updateGQLSchema: { schema: string }
}

export type AdminVariables = Record<
  Exclude<keyof typeof queries | keyof typeof mutations, keyof AdminInputs>,
  undefined
> &
  AdminInputs

export type AdminQuery = Extract<
  keyof typeof queries | keyof typeof mutations,
  keyof AdminVariables
>

export interface Payload {
  data: {}
}

export interface Request {
  query: string
  vars?: { [k: string]: string }
  startTs?: number
  timeout?: number
  debug?: boolean
  readOnly?: boolean
  bestEffort?: boolean
  hash?: string
}

export interface Response {
  data: {}
  extensions: Extensions
}

export interface UiKeywords {
  keywords: { type: string; name: string }[]
}

export interface LoginResponse {
  data: {
    accessJWT: string
    refreshJWT: string
  }
}

export interface Mutation {
  setJson?: object
  deleteJson?: object
  setNquads?: string
  deleteNquads?: string
  startTs?: number
  commitNow?: boolean
  // Raw mutation text to send;
  mutation?: string
  // Set to true if `mutation` field (above) contains a JSON mutation.
  isJsonString?: boolean
  hash?: string
}

export interface Assigned {
  data: AssignedData
  extensions: Extensions
}

export interface AssignedData {
  uids: { [k: string]: string }
}

export interface Extensions {
  server_latency: Latency
  txn: TxnContext
}

export interface TxnContext {
  start_ts: number
  aborted?: boolean
  keys?: string[]
  preds?: string[]
  readOnly: boolean
  bestEffort: boolean
  hash?: string
}

export interface Latency {
  parsing_ns?: number
  processing_ns?: number
  encoding_ns?: number
}

export interface TxnOptions {
  readOnly?: boolean
  bestEffort?: boolean
}

export interface ErrorNonJson extends Error {
  responseText?: string
}

export type Options = RequestInit & {
  headers?: HeadersInit & {
    'Content-Type'?: string
    'X-Auth-Token'?: string
    'X-Dgraph-AccessToken'?: string
    'X-Dgraph-AuthToken'?: string
    'X-Dgraph-CommitNow'?: string
    'X-Dgraph-MutationType'?: string
  }
}

export interface Config extends RequestInit {
  acceptRawText?: boolean
}

export type HealthStatus = 'healthy' | 'degraded_performance' | 'partial_outage'

export type Health = {
  instance: string
  address: string
  status: HealthStatus
  group: string
  version: string
  uptime: number
  lastEcho: number
  ongoing: string[]
  max_assigned: number
}

export type Attribute = {
  name: string
  type: string
  isArray: boolean
  required: boolean
  unique: boolean
}
