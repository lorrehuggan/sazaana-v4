import db from "@/db/index";
import { callbacks } from "@/lib/auth/callbacks";
import { providers } from "@/lib/auth/providers";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import "dotenv/config"
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers,
  callbacks,
  adapter: DrizzleAdapter(db),
  secret: process.env.NEXTAUTH_SECRET ?? '',
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/signin',
    newUser: '/signup'
  },
  events: {
    async signIn(message) {
      // console.log({ message })
    },
    async signOut(message) {
      // console.log({ message })
    }
  }

}
