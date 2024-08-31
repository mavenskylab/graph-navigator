import FormSchema from './_components/form-schema'

import { dgraphClient } from '@/lib/db/client'

export default async function Page() {
  const client = dgraphClient.anyClient()

  const {
    data: { getGQLSchema },
  } = (await client.admin('getGQLSchema', undefined)) as any

  return (
    <div className='flex size-full justify-center'>
      <section className='flex size-full max-w-screen-2xl flex-col gap-3 p-10 px-5'>
        <h1 className='text-4xl text-rose-700'>Schema</h1>
        <FormSchema schema={getGQLSchema?.schema} />
      </section>
    </div>
  )
}
