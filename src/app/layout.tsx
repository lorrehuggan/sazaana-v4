import Nav from '@/components/app/nav'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import QueryClientProvider from '@/lib/providers/queryProvider'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sazaana',
  description: 'Generating the bes playlist for you',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <QueryClientProvider>
        <body className={`${inter.className} min-h-screen`}>
          <Nav />
          <main>
            {children}
          </main>
        </body>
      </QueryClientProvider>
    </html>
  )
}
