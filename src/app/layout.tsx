import Nav from '@/components/app/nav'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import QueryClientProvider from '@/lib/providers/queryProvider'
import NextUIClientProvider from '@/lib/providers/uiProvider'
import { Footer } from '@/components/app/footer'
import { Toaster, toast } from 'sonner'



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
      <body className={`${inter.className} min-h-screen`}>
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
