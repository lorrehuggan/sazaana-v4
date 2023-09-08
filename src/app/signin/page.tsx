import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

import SignInForm from "@/components/signin/form";
import Small from "@/components/typography/Small";
import H4 from "@/components/typography/H4";
import H3 from "@/components/typography/H3";

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/')
  }

  return (
    <section className="mx-auto w-72">
      <div className="mb-6 text-center uppercase">
        <H3>Sazaana</H3>
      </div>
      <div className="mb-6 text-center">
        <H4>Sign in to your account</H4>
      </div>
      <SignInForm />
      <div className="mt-2 text-center">
        <Small>Dont have an account?
          <a href="/signup" className="color-fade hover:text-muted">Sign up</a>
        </Small>
      </div>
    </section>
  )
}
