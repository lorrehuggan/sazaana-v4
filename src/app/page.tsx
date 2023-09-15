import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
import Query from "@/components/app/query";
import H1 from "@/components/typography/H1";
import RecentSearch from "@/components/app/recentSearch";
import H2 from "@/components/typography/H2";




export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="dark">
      <div className="container my-8 space-y-2">
        <H1>Discover Your Next Favorite Song</H1>
        <H2>Unearth Your Next Beloved Artist,</H2>
      </div>
      <Query />
      <RecentSearch />
    </main>
  )
}
