import Sidebar from '@/app/client/_components/sidebar'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='divide-base-200 grid size-full grid-cols-[18rem_1fr] divide-x'>
      <Sidebar />
      <main>{children}</main>
    </div>
  )
}
