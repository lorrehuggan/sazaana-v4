import './globals.css'
import { Toaster, toast } from 'sonner'
import { Inter } from 'next/font/google'

import Nav from '@/components/app/nav'
import QueryClientProvider from '@/lib/providers/queryProvider'
import NextUIClientProvider from '@/lib/providers/uiProvider'
import { Footer } from '@/components/app/footer'

import type { Metadata } from 'next'



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
      <body className={`${inter.className} min-h-screen scrollbar-thumb-muted/70 scrollbar-track-background scrollbar-thin`}>
        <Toaster theme='dark' position='bottom-center' />
        <QueryClientProvider>
          <NextUIClientProvider>
            <Nav />
            <main className='min-h-[calc(100vh-9rem)]'>
              {children}
            </main>
            <Footer />
          </NextUIClientProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
