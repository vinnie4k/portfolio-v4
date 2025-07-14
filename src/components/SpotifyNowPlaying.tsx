import { Loader2, Music, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useSpotify } from "../hooks/useSpotify";
import { formatDuration, pausePlayback, resumePlayback, skipToNext, skipToPrevious } from "../lib/spotify";

export default function SpotifyNowPlaying() {
  const { track, isLoading, isError, refresh } = useSpotify();
  const [liveProgress, setLiveProgress] = useState<number>(0);
  const [controlLoading, setControlLoading] = useState<{
    playPause: boolean;
    next: boolean;
    previous: boolean;
  }>({ playPause: false, next: false, previous: false });

  // Update live progress when track changes
  useEffect(() => {
    if (track?.progress_ms !== undefined) {
      setLiveProgress(track.progress_ms);
    }
  }, [track?.progress_ms]);

  // Live progress timer
  useEffect(() => {
    if (!track || !track.is_playing) {
      return;
    }

    const interval = setInterval(() => {
      setLiveProgress((prev) => {
        const newProgress = prev + 1000; // Add 1 second
        // Don't go beyond the track duration
        return newProgress > track.duration_ms ? track.duration_ms : newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [track?.is_playing, track?.duration_ms]);

  const handlePlayPause = async () => {
    if (!track || !canControl) return;

    setControlLoading((prev) => ({ ...prev, playPause: true }));

    try {
      if (track.is_playing) {
        await pausePlayback();
      } else {
        await resumePlayback();
      }

      // Refresh the track data without showing loading state
      await refresh();
    } finally {
      setControlLoading((prev) => ({ ...prev, playPause: false }));
    }
  };

  const handleSkipNext = async () => {
    if (!canControl) return;

    setControlLoading((prev) => ({ ...prev, next: true }));

    try {
      await skipToNext();
      // Wait a moment for the skip to take effect
      setTimeout(async () => {
        await refresh();
        setControlLoading((prev) => ({ ...prev, next: false }));
      }, 500);
    } catch {
      setControlLoading((prev) => ({ ...prev, next: false }));
    }
  };

  const handleSkipPrevious = async () => {
    if (!canControl) return;

    setControlLoading((prev) => ({ ...prev, previous: true }));

    try {
      await skipToPrevious();
      // Wait a moment for the skip to take effect
      setTimeout(async () => {
        await refresh();
        setControlLoading((prev) => ({ ...prev, previous: false }));
      }, 500);
    } catch {
      setControlLoading((prev) => ({ ...prev, previous: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col justify-center items-center p-4 bg-gradient-to-br from-green-400 to-green-600 text-white">
        <div className="animate-pulse">
          <Music className="w-12 h-12 mb-4" />
          <p className="text-sm opacity-80">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError || !track) {
    return (
      <div className="h-full flex flex-col justify-center items-center p-4 bg-gradient-to-br from-gray-400 to-gray-600 text-white">
        <Music className="w-12 h-12 mb-4 opacity-60" />
        <p className="text-sm opacity-80 text-center">{isError ? "Unable to load" : "Not listening"}</p>
        <p className="text-xs opacity-60 mt-1">Spotify</p>
      </div>
    );
  }

  const isPlaying = track.is_playing ?? false;
  const progress = isPlaying ? liveProgress : track.progress_ms ?? 0;
  const duration = track.duration_ms;
  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  // Get the best quality image
  const albumImage = track.album.images[0]?.url;
  const artistNames = track.artists.map((artist) => artist.name).join(", ");

  // Check if we have valid credentials (not using mock data)
  const hasValidCredentials = track.id !== "mock-1";
  const canControl = hasValidCredentials && track;

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-gradient-to-br from-green-400 to-green-600 text-white">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-green-900 rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.348-1.435-5.304-1.76-8.785-.964-.335.077-.67-.133-.746-.469-.077-.336.132-.67.469-.746 3.809-.871 7.077-.496 9.713 1.115.294.18.386.563.206.857zm1.223-2.723c-.226.367-.706.482-1.073.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.125-.849-.106-.973-.52-.125-.413.106-.849.52-.973 3.632-1.102 8.147-.568 11.234 1.329.366.226.482.706.257 1.073zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.493.15-1.016-.128-1.166-.62-.15-.493.128-1.017.62-1.167 3.539-1.073 9.404-.866 13.115 1.337.445.264.591.838.327 1.284-.264.445-.838.592-1.284.327z" />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          {isPlaying && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
          <span className="text-sm font-medium opacity-90">{isPlaying ? "🎵 Listening" : "Recently Played"}</span>
        </div>
      </div>

      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center mb-4">
        <div className="w-32 h-32 bg-green-800 rounded-lg shadow-lg overflow-hidden relative">
          {albumImage ? (
            <img src={albumImage} alt={`${track.album.name} cover`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-green-900 flex items-center justify-center">
              <Music className="w-12 h-12 opacity-60" />
            </div>
          )}
          {/* Live indicator overlay */}
          {isPlaying && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
          )}
        </div>
      </div>

      {/* Song Info */}
      <div className="text-center mb-4">
        <h3 className="font-bold text-lg mb-1 truncate" title={track.name}>
          {track.name}
        </h3>
        <p className="text-sm opacity-80 truncate" title={artistNames}>
          {artistNames}
        </p>
        <p className="text-xs opacity-60 mt-1 truncate" title={track.album.name}>
          {track.album.name}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={canControl ? handleSkipPrevious : undefined}
          disabled={controlLoading.previous || !canControl}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            canControl
              ? "bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 cursor-pointer"
              : "bg-gray-500 bg-opacity-20 cursor-not-allowed opacity-30 pointer-events-none"
          }`}
          title={canControl ? "Previous track" : "Controls not available"}
        >
          {controlLoading.previous ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          )}
        </button>

        <button
          onClick={canControl ? handlePlayPause : undefined}
          disabled={controlLoading.playPause || !canControl}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
            canControl
              ? "bg-white text-green-600 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50 pointer-events-none"
          }`}
          title={canControl ? (isPlaying ? "Pause" : "Play") : "Controls not available"}
        >
          {controlLoading.playPause ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </button>

        <button
          onClick={canControl ? handleSkipNext : undefined}
          disabled={controlLoading.next || !canControl}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            canControl
              ? "bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 cursor-pointer"
              : "bg-gray-500 bg-opacity-20 cursor-not-allowed opacity-30 pointer-events-none"
          }`}
          title={canControl ? "Next track" : "Controls not available"}
        >
          {controlLoading.next ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          )}
        </button>
      </div>

      {/* Controls Status Message */}
      {!canControl && (
        <div className="text-center mt-2">
          <p className="text-xs opacity-60">
            {track.id === "mock-1" ? "Demo mode - controls disabled" : "Controls not available"}
          </p>
        </div>
      )}

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="mt-4">
          <div className="w-full bg-white bg-opacity-20 rounded-full h-1">
            <div
              className={`h-1 rounded-full transition-all duration-1000 ${
                isPlaying ? "bg-white" : "bg-white bg-opacity-70"
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs opacity-60 mt-1">
            <span>{formatDuration(progress)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
