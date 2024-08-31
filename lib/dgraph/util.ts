import { writeFile, writeFileSync } from 'fs'
import { APIError, APIResultError } from './errors'
import { Attribute } from './types'

export function isAbortedError(error: any): boolean {
  if (!(error instanceof APIError)) {
    return false
  }

  if (error.errors.length === 0) {
    return false
  }
  const firstError: APIResultError = error.errors[0]

  const message = firstError.message.toLowerCase()
  return message.indexOf('abort') >= 0 && message.indexOf('retry') >= 0
}

export function isConflictError(error: any): boolean {
  if (!(error instanceof APIError)) {
    return false
  }

  if (error.errors.length === 0) {
    return false
  }
  const firstError: APIResultError = error.errors[0]

  const message = firstError.message.toLowerCase()
  return message.indexOf('conflict') >= 0
}

export function stringifyMessage(msg: object): string {
  return JSON.stringify(msg)
}

export function breakdownGeneratedSchema(schema: string | null) {
  const sections = schema?.split('#######################\n# ')

  writeFileSync('schema.txt', schema!)

  const attributes = getAttributes(sections)

  const types = Object.keys(attributes)

  const inputs = getInputs(sections)

  const queries = getQueries(sections)

  return { types, attributes, inputs, queries }
}

function getAttribute(attribute: string): Attribute {
  const [name, type] = attribute
    .split(/\([\w\s:,]+\):|:/)
    .map(part => part.trim().split(' ').at(0)!)

  return {
    name,
    type: type?.replaceAll(/[\[\]!]/g, ''),
    isArray: type?.includes('['),
    required: type?.includes('!'),
    unique: type === 'ID' || attribute.includes('@id'),
  }
}

function getAttributes(sections?: string[]): Record<string, Attribute[]> {
  const matches = sections?.at(1)?.matchAll(/^type\s+(\w+)\s{([^}]*)}/gm)

  if (!matches) return {}

  return Object.fromEntries(
    [...matches].map(([_, type, fields]) => [
      type,
      fields.split('\n').filter(Boolean).map(getAttribute),
    ]),
  )
}

function getInputs(sections?: string[]): Record<string, Attribute[]> {
  const matches = sections?.at(5)?.matchAll(/input\s(\w+)\s{([^}]*)}/gm)

  if (!matches) return {}

  return Object.fromEntries(
    [...matches].map(([_, input, fields]) => [
      input,
      fields.split('\n').filter(Boolean).map(getAttribute),
    ]),
  )
}

function getQueries(sections?: string[]) {
  const matches = sections?.at(6)?.matchAll(/^\s+(\w+)\((.*)\):\s(.*)/gm)

  if (!matches) return {}

  return Object.fromEntries(
    [...matches].map(([_, query, params, type]) => [
      query.trim(),
      {
        params: params.split(', ').map(getAttribute),
        type: type?.replaceAll(/[\[\]!]/g, ''),
        isArray: type?.includes('['),
      },
    ]),
  )
}
