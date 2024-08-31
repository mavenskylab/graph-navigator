import '@/app/globals.css'
// import '@/app/dev.css'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Graph Navigator',
  description:
    'GraphNavigator: Simplifying graph database management. Explore, visualize, and query your data with ease.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' data-theme='dark' className='font-mono'>
      <body>{children}</body>
    </html>
  )
}
