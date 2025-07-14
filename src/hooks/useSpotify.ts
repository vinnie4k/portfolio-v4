import useSWR from "swr";
import { getNowPlaying } from "../lib/spotify";

export const useSpotify = () => {
  const {
    data: track,
    error,
    isLoading,
    mutate,
  } = useSWR("spotify-now-playing", getNowPlaying, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 10000, // Dedupe requests within 10 seconds
  });

  return {
    track,
    isLoading,
    isError: error,
    refresh: mutate,
  };
};
