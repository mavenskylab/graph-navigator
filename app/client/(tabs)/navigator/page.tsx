
import Navaigator from './_components/navigator'

import { dgraphClient } from '@/lib/db/client'
import { breakdownGeneratedSchema } from '@/lib/dgraph'

export default async function Page() {
  const client = dgraphClient.anyClient()

  const {
    data: { getGQLSchema },
  } = (await client.admin('getDgraphSchema', undefined)) as any

  const schema: string | null = getGQLSchema.generatedSchema

  const { types, attributes } = breakdownGeneratedSchema(schema)

  return (
    <div className='flex size-full justify-center'>
      <section className='flex size-full max-h-dvh max-w-screen-2xl flex-col gap-3 p-10 px-5'>
        <h1 className='text-4xl text-rose-700'>Navigator</h1>
        <Navaigator types={types} attributes={attributes} />
      </section>
    </div>
  )
}
