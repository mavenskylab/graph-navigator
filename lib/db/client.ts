import { cookies } from 'next/headers'

import { DgraphClient, DgraphClientStub } from '@/lib/dgraph'

import { Connection } from '@/types/db'

export const dgraphClient = createClient()

function createClient() {
  const connection = getConnection()

  const stub = new DgraphClientStub(connection.url)

  return new DgraphClient(stub)
}

export function getConnection(): Connection {
  const cookiesStore = cookies()

  const connection = cookiesStore.get('connection')?.value

  if (!connection) {
    throw new Error('Failed to get connection')
  }

  return JSON.parse(connection)
}
