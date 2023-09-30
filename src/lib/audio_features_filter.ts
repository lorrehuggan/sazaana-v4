export const standardizeData = (track: Spotify.AudioFeaturesObject) => {
  return {
    acousticness: Number(track.acousticness.toFixed(2)),
    danceability: Number(track.danceability.toFixed(2)),
    duration_ms: track.duration_ms,
    energy: Number(Math.max(0, Math.min(1, track.energy)).toFixed(2)),
    instrumentalness: Number(Math.max(0, Math.min(1, track.instrumentalness)).toFixed(2)),
    key: Math.max(0, Math.min(1, track.key / 11)), // Normalize key to [0, 1]
    liveness: Number(Math.max(0, Math.min(1, track.liveness)).toFixed(2)),
    loudness: Number(Math.max(0, Math.min(1, (track.loudness + 60) / 60)).toFixed(2)), // Normalize loudness to [0, 1]
    mode: Math.max(0, Math.min(1, track.mode)),
    speechiness: Number(Math.max(0, Math.min(1, track.speechiness)).toFixed(2)),
    tempo: Number(Math.max(0, Math.min(1, (track.tempo - 40) / 180)).toFixed(2)), // Normalize tempo to [0, 1]
    time_signature: Math.max(0, Math.min(1, (track.time_signature - 1) / 7)).toFixed(2), // Normalize time_signature to [0, 1]
    valence: Number(Math.max(0, Math.min(1, track.valence)).toFixed(2)),
  };
};
