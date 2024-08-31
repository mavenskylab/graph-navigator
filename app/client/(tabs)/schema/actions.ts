'use server'

import { FormState } from '@/components/shared/form'
import { dgraphClient } from '@/lib/db/client'
import { DgraphClientStub } from '@/lib/dgraph'
import { cookies } from 'next/headers'

export async function deploySchema(
  state: FormState,
  payload: FormData,
): Promise<FormState> {
  const client = dgraphClient

  const schema = payload.get('editor') as string

  try {
    const validation = (await client.validateSchema(schema)) as any

    const response = await client.admin('updateGQLSchema', { schema })

  } catch (err: any) {
    console.error(err)
    return { success: false, message: { title: err.name, text: err.message } }
  }

  return {
    success: true,
    message: {
      title: 'Success',
    },
  }
}

export async function dropAllData() {
  const client = dgraphClient

  try {
    const response = await client.admin('dropData', undefined)
    console.log(response)
    return { success: true, message: { title: 'Drop', text: response } }
  } catch (err: any) {
    console.error(err)
    return { success: false, message: { title: err.name, text: err.message } }
  }
}

export async function downloadSchema(schema: string) {
  const client = dgraphClient

  try {
    const response = await client.admin('getGQLSchema', undefined)
    console.log(response)
  } catch (err: any) {
    console.error(err)
    return { success: false, message: { title: err.name, text: err.message } }
  }
}
