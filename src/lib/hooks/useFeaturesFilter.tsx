"use client"

import { useCurrentTracks } from "@/lib/stores/tracks";
import { AlbumWithAudioFeatures, TrackWithFeatures } from "@/types/index";
import { useEffect, useState } from "react";

type SpotifyFeature = "acousticness" | "danceability" | "duration_ms" | "energy" | "instrumentalness" | "key" | "liveness" | "loudness" | "mode" | "speechiness" | "tempo" | "time_signature" | "valence";

export default function UseFeaturesFilter() {
  const audioTracks = useCurrentTracks((state) => state.tracks);
  const set = useCurrentTracks((state) => state.set);
  const [filteredTracks, setFilteredTracks] = useState<TrackWithFeatures[] | []>([]);
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
    console.log(feature, minValue, maxValue);
    setFilterConfig({
      ...filterConfig,
      [feature]: [minValue, maxValue],
    });
  };

  useEffect(() => {
    // Base case: If there are no more filters to apply, set the filtered tracks to the original tracks
    if (Object.values(filterConfig).every(([min, max]) => min === 0 && max === 1)) {
      setFilteredTracks(audioTracks);
    } else {
      // Apply filters based on the current filter configuration
      const updatedFilteredTracks = audioTracks.filter((track) => {
        return Object.entries(filterConfig).every(([feature, [min, max]]) => {
          //TODO: fix this type error
          const featureValue = track[feature];
          return featureValue >= min && featureValue <= max;
        });
      });
      setFilteredTracks(updatedFilteredTracks);
      set(updatedFilteredTracks);
    }
  }, [filterConfig, audioTracks]);

  return { filteredTracks, updateFilterConfig };
}
