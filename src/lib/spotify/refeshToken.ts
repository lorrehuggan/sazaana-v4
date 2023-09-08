import { Session } from "next-auth"
import { NextResponse } from "next/server"
import { spotify_url } from "."


export async function refreshToken(session: Session) {
  console.log('refreshToken')
  const exp = session.user.expires_at
  const refreshToken = session.user.refresh_token

  if (!exp || !refreshToken) {
    return NextResponse.error()
  }

  if (Date.now() >= exp * 1000) {
    const SPOTIFY_URL = new URL(`${spotify_url}refresh_token?refresh_token=${refreshToken}`)
    try {
      const response = await fetch(SPOTIFY_URL.toString(), {
        method: 'GET'
      })
      const data = await response.json()
      session.user.access_token = data.access_token
      session.user.expires_at = data.expires_at
      session.user.refresh_token = data.refresh_token
    }
    catch (error: unknown) {
      console.error(error)
      return NextResponse.error()
    }
  }
}
