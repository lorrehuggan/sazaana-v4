import { Account, CallbacksOptions, Profile } from "next-auth"

export const callbacks: Partial<CallbacksOptions<Profile, Account>> | undefined = {
  async jwt({ token, account }) {
    if (account?.provider) {
      token.provider = account.provider
    }
    if (account?.access_token) {
      token.access_token = account.access_token
    }
    if (account?.refresh_token) {
      token.refresh_token = account.refresh_token
    }
    if (account?.expires_at) {
      token.expires_at = account.expires_at
    }
    return token
  },
  async session({ session, token }) {
    session.user.id = token.sub ?? ''
    session.user.provider = token.provider ?? ''
    session.user.access_token = token.access_token
    session.user.refresh_token = token.refresh_token
    session.user.expires_at = token.expires_at
    return session
  },
}
