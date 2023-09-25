import { queryArtist } from "@/lib/api/queryArtist";
import { spotify_auth_url, spotify_url } from "@/lib/spotify";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const artist = searchParams.get('artist')
  const track = searchParams.get('track')

  const client_id = process.env.SPOTIFY_ID
  const client_secret = process.env.SPOTIFY_SECRET

  if (!artist) {
    return NextResponse.json({ error: 'Missing artist', status: 400, message: 'Missing artist', data: null })
  }

  const SPOTIFY_URL = new URL(`${spotify_url}search?q=${artist.replace(' ', '+')}&type=artist&market=US`)

  try {
    const requestAuthResponse = await fetch(spotify_auth_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials',
    })

    const requestAuth = await requestAuthResponse.json()

    const artistResponse = await fetch(SPOTIFY_URL.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${requestAuth.access_token}`
      }
    })
    const artist: Spotify.SingleArtistResponse = await artistResponse.json()
    return NextResponse.json(artist)
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json({ error: 'Error while fetching artist', status: 500, message: 'Error while fetching artist', data: null })
  }

}
