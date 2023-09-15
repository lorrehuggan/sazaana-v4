import RecentSearch from "@/components/app/recentSearch";
import Query from "@/components/app/query"
import H1 from "@/components/typography/H1"
import Tracklist from "@/components/app/tracklist";
import H3 from "@/components/typography/H3";
import H2 from "@/components/typography/H2";

type Props = {
  params: {
    id: string
  }
}
export default function Artist({ params }: Props) {
  return (
    <main className="dark">
      <div className="container my-8 space-y-2">
        <H1>Discover Your Next Favorite Song</H1>
        <H2>Unearth Your Next Beloved Artist,</H2>
      </div>
      <Query />
      <RecentSearch />
      {/* <Tracklist /> */}
    </main>
  )
}
