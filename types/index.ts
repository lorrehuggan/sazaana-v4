export type AlbumWithAudioFeatures = Spotify.AlbumObjectFull & {
  audio_features: Spotify.AudioFeaturesObject
}

export type TrackWithFeatures = {
  audio_features: Spotify.AudioFeaturesObject
  track: Spotify.TrackObjectFull
}
