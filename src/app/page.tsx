import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";




export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <section className="dark">
    </section>
  )
}
