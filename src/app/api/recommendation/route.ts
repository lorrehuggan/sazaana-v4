import { spotify_auth_url, spotify_url } from "@/lib/spotify"
import { NextResponse } from "next/server"


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const trackIDs = searchParams.get('ids')

  if (!trackIDs) {
    return NextResponse.json({
      error: 'No track IDs provided'
    })
  }

  const client_id = process.env.SPOTIFY_ID
  const client_secret = process.env.SPOTIFY_SECRET

  const url = new URL(`https://api.spotify.com/v1/recommendations?limit=10&seed_artists=${trackIDs}`)

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

    const recommendationsResponse = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${requestAuth.access_token}`
      }
    })
    const response = await recommendationsResponse.json()
    const tracks: Spotify.TrackObjectFull[] = response.tracks
    return NextResponse.json(tracks)
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json({ error: 'Error while fetching artist', status: 500, message: 'Error while fetching artist', data: null })
  }
}
