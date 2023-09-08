import { spotify_url } from "@/lib/spotify";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { signOut } from "next-auth/react";
import { refreshToken } from "@/lib/spotify/refeshToken";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    signOut()
    return NextResponse.redirect('/signin')
  }

  refreshToken(session)

  const { searchParams } = new URL(request.url)
  const artist = searchParams.get('artist')

  if (!artist) {
    return NextResponse.error()
  }

  const SPOTIFY_URL = new URL(`${spotify_url}search?q=${artist.replace(' ', '+')}&type=artist`)

  try {
    const response = await fetch(SPOTIFY_URL.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.user.access_token}`
      }
    })
    const artist: Spotify.SingleArtistResponse = await response.json()
    return NextResponse.json(artist)
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.error()
  }
}
