'use server'

import { FormState } from '@/components/shared/form'

import { dgraphClient } from '@/lib/db/client'

export type ExplorerState = {
  response: string
}

export type ExplorerFormState = FormState<ExplorerState>

export async function executeQuery(gql: string): Promise<ExplorerFormState> {
  const client = dgraphClient.anyClient()

  const response = JSON.stringify(await client.query(gql, undefined))

  return {
    success: true,
    data: {
      response,
    },
  }
}
