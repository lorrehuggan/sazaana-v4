"use client"

import { useCurrentTracks } from "@/lib/stores/tracks";
import { AlbumWithAudioFeatures, TrackWithFeatures } from "@/types/index";
import { useEffect, useState } from "react";
import { standardizeData } from "../audio_features_filter";

type SpotifyFeature = "acousticness" | "danceability" | "duration_ms" | "energy" | "instrumentalness" | "key" | "liveness" | "loudness" | "mode" | "speechiness" | "tempo" | "time_signature" | "valence";

export default function UseFeaturesFilter() {
  const CURRENT_TRACKS = useCurrentTracks((state) => state);
  const [filteredTracks, setFilteredTracks] = useState<TrackWithFeatures[] | []>(CURRENT_TRACKS.tracks);
  const [filterConfig, setFilterConfig] = useState({
    acousticness: [0, 1],
    danceability: [0, 1],
    duration_ms: [0, 1],
    energy: [0, 1],
    instrumentalness: [0, 1],
    key: [0, 1],
    liveness: [0, 1],
    loudness: [0, 1],
    mode: [0, 1],
    popularity: [0, 1],
    speechiness: [0, 1],
    tempo: [0, 1],
    time_signature: [0, 1],
    valence: [0, 1],
  });

  const updateFilterConfig = (feature: string, minValue: number, maxValue: number) => {
    setFilterConfig({
      ...filterConfig,
      [feature]: [minValue, maxValue],
    });
  };

  useEffect(() => {
    // Base case: If there are no more filters to apply, set the filtered tracks to the original tracks
    if (Object.values(filterConfig).every(([min, max]) => min === 0 && max === 1)) {
      setFilteredTracks(CURRENT_TRACKS.tracks);
    } else {
      // Apply filters based on the current filter configuration
      const updatedFilteredTracks = CURRENT_TRACKS.tracks.filter((track) => {
        const standardizedTrack = standardizeData(track.audio_features);

        const passesFilter =
          standardizedTrack.acousticness >= filterConfig.acousticness[0] &&
          standardizedTrack.acousticness <= filterConfig.acousticness[1] &&
          standardizedTrack.danceability >= filterConfig.danceability[0] &&
          standardizedTrack.danceability <= filterConfig.danceability[1] &&
          standardizedTrack.energy >= filterConfig.energy[0] &&
          standardizedTrack.energy <= filterConfig.energy[1] &&
          standardizedTrack.instrumentalness >= filterConfig.instrumentalness[0] &&
          standardizedTrack.instrumentalness <= filterConfig.instrumentalness[1] &&
          standardizedTrack.liveness >= filterConfig.liveness[0] &&
          standardizedTrack.liveness <= filterConfig.liveness[1] &&
          standardizedTrack.loudness >= filterConfig.loudness[0] &&
          standardizedTrack.loudness <= filterConfig.loudness[1] &&
          standardizedTrack.speechiness >= filterConfig.speechiness[0] &&
          standardizedTrack.speechiness <= filterConfig.speechiness[1] &&
          standardizedTrack.tempo >= filterConfig.tempo[0] &&
          standardizedTrack.tempo <= filterConfig.tempo[1] &&
          standardizedTrack.valence >= filterConfig.valence[0] &&
          standardizedTrack.valence <= filterConfig.valence[1];

        return passesFilter;

      });
      setFilteredTracks(updatedFilteredTracks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterConfig, CURRENT_TRACKS]);

  return { filteredTracks, updateFilterConfig };
}
