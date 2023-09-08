import NextAuth, { DefaultSession, Account } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string
      provider?: string
      access_token: string
      refresh_token: string
      expires_at: number
    } & DefaultSession["user"]
  }

}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    provider?: string
    access_token: string
    refresh_token: string
    expires_at: number
  }
}
