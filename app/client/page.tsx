import Connect from '@/app/client/_components/connect'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function Page() {
  const cookieStore = cookies()

  const connection = cookieStore.get('connection')

  if (connection) redirect('/client/overview')

  return <Connect />
}
