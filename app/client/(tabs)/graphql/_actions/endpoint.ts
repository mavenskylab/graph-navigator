'use server'

import { cookies } from 'next/headers'

import { FormState } from '@/components/shared/form'
import { LiteralsFromSet } from '@/types/helpers'

const endpoints = new Set(['client', 'admin'] as const)
export type EndpointType = LiteralsFromSet<typeof endpoints>

export type EndpointState = {
  endpoint: EndpointType
  url: string
}

export type EndpointFormState = FormState<EndpointState>

export async function setEndpoint(
  state: EndpointFormState,
  payload: FormData,
): Promise<EndpointFormState> {
  const cookieStore = cookies()

  const rawEndpoint = payload.get('endpoint') as EndpointType

  const endpoint = endpoints.has(rawEndpoint) ? rawEndpoint : 'client'

  cookieStore.set('endpoint', endpoint)

  return {
    success: true,
    data: {
      ...state.data!,
      endpoint,
    },
  }
}

export async function getEndpoint() {
  const cookieStore = cookies()

  return (cookieStore.get('endpoint')?.value ?? 'client') as EndpointType
}
