
import Explorer from './_components/explorer'
import FormEndpoint from './_components/form-endpoint'

import { dgraphClient } from '@/lib/db/client'
import { breakdownGeneratedSchema } from '@/lib/dgraph'
import { getEndpoint } from './_actions/endpoint'

export default async function Page() {
  const client = dgraphClient.anyClient()

  const url = client.getURL()

  const endpoint = await getEndpoint()

  const {
    data: { getGQLSchema },
  } = (await client.admin('getDgraphSchema', undefined)) as any

  const schema: string | null = getGQLSchema.generatedSchema

  const { types, attributes, inputs, queries } = breakdownGeneratedSchema(schema)

  return (
    <div className='flex size-full justify-center'>
      <section className='flex size-full max-h-dvh max-w-screen-2xl flex-col gap-3 divide-y divide-base-200 p-5'>
        <FormEndpoint data={{ endpoint, url }} />
        <Explorer schema={schema} attributes={attributes} inputs={inputs} queries={queries}  />
      </section>
    </div>
  )
}
