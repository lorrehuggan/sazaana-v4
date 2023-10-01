"use client"

import { useCurrentTracks } from "@/lib/stores/tracks";
import { TrackWithFeatures } from "@/types/index";
import { useEffect, useState } from "react";
import { standardizeData } from "../audio_features_filter";
import { useFilteredTracks } from "../stores/filtered";


export default function UseFeaturesFilter() {
  const CURRENT_TRACKS = useCurrentTracks((state) => state);
  const FILTERED_TRACKS = useFilteredTracks((state) => state)

  const updateFilterConfig = (feature: string, minValue: number, maxValue: number) => {
    FILTERED_TRACKS.setFilterConfig({
      ...FILTERED_TRACKS.filterConfig,
      [feature]: [minValue, maxValue],
    });
  };

  useEffect(() => {
    const filterConfig = FILTERED_TRACKS.filterConfig;
    // Base case: If there are no more filters to apply, set the filtered tracks to the original tracks
    if (Object.values(filterConfig).every(([min, max]) => min === 0 && max === 1)) {
      FILTERED_TRACKS.set(CURRENT_TRACKS.tracks)
    } else {
      // Apply filters based on the current filter configuration
      const updatedFilteredTracks = CURRENT_TRACKS.tracks.filter((track) => {
        const standardizedTrack = standardizeData(track.audio_features);

        // const passesFilter = Object.entries(filterConfig).every(([feature, [min, max]]) => {
        //   const trackValue = standardizedTrack[feature as SpotifyFeature] as number;
        //   return trackValue >= min && trackValue <= max;
        // })

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
      FILTERED_TRACKS.set(updatedFilteredTracks)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FILTERED_TRACKS.filterConfig]);

  return { updateFilterConfig };
}
