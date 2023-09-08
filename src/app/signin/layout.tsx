import type { Metadata } from 'next'
import '../globals.css'


export const metadata: Metadata = {
  title: 'Sign In | Sazaana',
  description: 'Sign in to sazaana',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main className='flex items-center w-screen h-screen'>
          {children}
        </main>
      </body>
    </html>
  )
}
