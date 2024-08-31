'use server'

import { cookies } from 'next/headers'

import { DgraphClient, DgraphClientStub } from '@/lib/dgraph'

export interface IConnectState {
  success?: boolean
  message?: string
}

export async function connect(
  state: IConnectState,
  payload: FormData,
): Promise<IConnectState> {
  const cookieStore = cookies()

  const connection = {
    url: payload.get('url') as string,
  }

  try {
    const stub = new DgraphClientStub(connection.url)

    const dgraphClient = new DgraphClient(stub)

    await dgraphClient.getHealth()

    cookieStore.set('connection', JSON.stringify(connection), { secure: true })

    return { success: true }
  } catch (err: any) {
    console.error(err)
    return { success: false, message: err.message as string }
  }
}
