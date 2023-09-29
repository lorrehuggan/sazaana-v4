import RecentSearch from '@/components/app/recentSearch'
import '../globals.css'
import type { Metadata } from 'next'
import Query from '@/components/app/query'
import H1 from '@/components/typography/H1'
import H2 from '@/components/typography/H2'
import H4 from '@/components/typography/H4'
import { Toaster } from 'sonner'



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
      <section className="container my-8 space-y-3">
        {/* <H1>Discover Your Next Favorite Song</H1> */}
        <H1>{`"Threads of Sound"`}</H1>
        {/* <H2>Unearth Your Next Beloved Artist,</H2> */}
        <H2>Unlock Your Soundtrack: Discover Your Perfect Beat</H2>
        <H4>Playlist Alchemy: Fuse Artists, Create Your Unique Sound</H4>
        <p className='text-xs text-neutral-500'>{`Ready to turn 
          your music experience into a sonic adventure? Unleash your inner DJ, crafting playlists from your favorite artists, 
          and discover musical treasures like never before. With the power of strings and alchemy, 
          you're in control of your sound journey. Mix, match, and create your unique soundtrack—no limits, just pure musical magic.`}`
        </p>
      </section>
      <Query />
      <RecentSearch />
      {children}
    </>
  )
}
