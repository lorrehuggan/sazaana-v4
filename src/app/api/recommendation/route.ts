import { mockTracks, mockTracks1 } from "@/lib/mockData"
import { spotify_auth_url, spotify_url } from "@/lib/spotify"
import { NextResponse } from "next/server"


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const artistsIDs = searchParams.get('ids')

  if (!artistsIDs) {
    return NextResponse.json({
      error: 'No track IDs provided'
    })
  }

  const client_id = process.env.SPOTIFY_ID
  const client_secret = process.env.SPOTIFY_SECRET

  const get_tracks_url = new URL(`https://api.spotify.com/v1/recommendations?limit=15&seed_artists=${artistsIDs}`)

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

    const recommendationsResponse = await fetch(get_tracks_url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${requestAuth.access_token}`
      }
    })
    const tracksResponse = await recommendationsResponse.json()
    const tracks: Spotify.TrackObjectFull[] = tracksResponse.tracks
    const trackIDs = tracks.map(track => track.id).join(',')
    const get_audio_features_url = new URL(`https://api.spotify.com/v1/audio-features?ids=${trackIDs}`)
    const audioFeaturesResponse = await fetch(get_audio_features_url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${requestAuth.access_token}`
      }
    })
    const audioFeatures = await audioFeaturesResponse.json()
    // link audio features to tracks in new array
    const tracksWithAudioFeatures = tracks.map(track => {
      const audioFeature = audioFeatures.audio_features.find((audioFeature: Spotify.AudioFeaturesObject) => audioFeature.id === track.id)
      return {
        ...track,
        audio_features: audioFeature
      }
    })
    console.log(tracksWithAudioFeatures)
    return NextResponse.json(tracks)
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json({ error: 'Error while fetching artist', status: 500, message: 'Error while fetching artist', data: null })
  }
}
