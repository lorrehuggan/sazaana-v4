export const standardizeData = (track: Spotify.AudioFeaturesObject) => {
  return {
    acousticness: track.acousticness,
    danceability: track.danceability,
    duration_ms: track.duration_ms,
    energy: Math.max(0, Math.min(1, track.energy)),
    instrumentalness: Math.max(0, Math.min(1, track.instrumentalness)),
    key: Math.max(0, Math.min(1, track.key / 11)), // Normalize key to [0, 1]
    liveness: Math.max(0, Math.min(1, track.liveness)),
    loudness: Math.max(0, Math.min(1, (track.loudness + 60) / 60)), // Normalize loudness to [0, 1]
    mode: Math.max(0, Math.min(1, track.mode)),
    speechiness: Math.max(0, Math.min(1, track.speechiness)),
    tempo: Math.max(0, Math.min(1, (track.tempo - 40) / 180)), // Normalize tempo to [0, 1]
    time_signature: Math.max(0, Math.min(1, (track.time_signature - 1) / 7)), // Normalize time_signature to [0, 1]
    valence: Math.max(0, Math.min(1, track.valence)),
  };
};
