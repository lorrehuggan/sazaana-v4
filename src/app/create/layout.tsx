import RecentSearch from '@/components/app/recentSearch'
import '../globals.css'
import type { Metadata } from 'next'
import Query from '@/components/app/query'
import H1 from '@/components/typography/H1'
import H2 from '@/components/typography/H2'
import H4 from '@/components/typography/H4'



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
    <>
      <div className="container my-8 space-y-2">
        <H1>Discover Your Next Favorite Song</H1>
        <H2>Unearth Your Next Beloved Artist,</H2>
      </div>
      <Query />
      <RecentSearch />
      {children}
    </>
  )
}
