import Nav from '@/components/app/nav'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import QueryClientProvider from '@/lib/providers/queryProvider'
import RecentSearch from '@/components/app/recentSearch'
import Query from '@/components/app/query'
import H1 from '@/components/typography/H1'
import H2 from '@/components/typography/H2'


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
          <div className="container my-8 space-y-2">
            <H1>Discover Your Next Favorite Song</H1>
            <H2>Unearth Your Next Beloved Artist,</H2>
          </div>
          <Query />
          <RecentSearch />
          {children}
        </body>
      </QueryClientProvider>
    </html>
  )
}
