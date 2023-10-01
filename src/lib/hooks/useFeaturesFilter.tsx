"use client"

import { useCurrentTracks } from "@/lib/stores/tracks";
import { AlbumWithAudioFeatures, TrackWithFeatures } from "@/types/index";
import { useEffect, useState } from "react";
import { standardizeData } from "../audio_features_filter";
import { useFilteredTracks } from "../stores/filtered";

type SpotifyFeature = "acousticness" | "danceability" | "duration_ms" | "energy" | "instrumentalness" | "key" | "liveness" | "loudness" | "mode" | "speechiness" | "tempo" | "time_signature" | "valence";

export default function UseFeaturesFilter() {
  const CURRENT_TRACKS = useCurrentTracks((state) => state);
  const FILTERED_TRACKS = useFilteredTracks((state) => state)
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
      FILTERED_TRACKS.set(CURRENT_TRACKS.tracks)
    } else {
      // Apply filters based on the current filter configuration
      const updatedFilteredTracks = CURRENT_TRACKS.tracks.filter((track) => {
        const standardizedTrack = standardizeData(track.audio_features);

        const passesFilter = Object.entries(filterConfig).every(([feature, [min, max]]) => {
          const trackValue = standardizedTrack[feature as SpotifyFeature] as number;
          return trackValue >= min && trackValue <= max;
        })

        return passesFilter;

      });
      setFilteredTracks(updatedFilteredTracks);
      FILTERED_TRACKS.set(updatedFilteredTracks)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterConfig, CURRENT_TRACKS]);

  return { filteredTracks, updateFilterConfig };
}
