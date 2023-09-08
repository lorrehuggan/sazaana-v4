import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
import Query from "@/components/app/query";
import H1 from "@/components/typography/H1";


export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <>
      <div className="container mb-8">
        <H1>Discover Your Next Favorite Song:</H1>
      </div>
      <Query />
    </>
  )
}
