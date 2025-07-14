// For Vite, environment variables are accessed via import.meta.env
const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID || "";
const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || "";
const refresh_token = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN || "";

const basic = btoa(`${client_id}:${client_secret}`);
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  duration_ms: number;
  progress_ms?: number;
  is_playing?: boolean;
}

interface SpotifyNowPlayingResponse {
  is_playing: boolean;
  item: SpotifyTrack;
  progress_ms: number;
}

interface SpotifyRecentlyPlayedResponse {
  items: Array<{
    track: SpotifyTrack;
    played_at: string;
  }>;
}

const getAccessToken = async (): Promise<string> => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  const data = await response.json();
  return data.access_token;
};

export const getNowPlaying = async (): Promise<SpotifyTrack | null> => {
  // Return mock data if no credentials are provided
  if (!client_id || !client_secret || !refresh_token) {
    return getMockTrack();
  }

  try {
    const access_token = await getAccessToken();

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.status === 204 || response.status > 400) {
      // Nothing is currently playing, fall back to recently played
      return getRecentlyPlayed();
    }

    const song: SpotifyNowPlayingResponse = await response.json();

    if (!song.item) {
      return getRecentlyPlayed();
    }

    return {
      ...song.item,
      progress_ms: song.progress_ms,
      is_playing: song.is_playing,
    };
  } catch (error) {
    console.error("Error fetching now playing:", error);
    return getRecentlyPlayed();
  }
};

const getRecentlyPlayed = async (): Promise<SpotifyTrack | null> => {
  try {
    const access_token = await getAccessToken();

    const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.status > 400) {
      return getMockTrack();
    }

    const data: SpotifyRecentlyPlayedResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      return getMockTrack();
    }

    return {
      ...data.items[0].track,
      is_playing: false,
    };
  } catch (error) {
    console.error("Error fetching recently played:", error);
    return getMockTrack();
  }
};

// Mock data for demo purposes when no credentials are provided
const getMockTrack = (): SpotifyTrack => ({
  id: "mock-1",
  name: "Blinding Lights",
  artists: [{ name: "The Weeknd" }],
  album: {
    name: "After Hours",
    images: [
      {
        url: "https://i.scdn.co/image/ab67616d0000b273ef6f1b2d9e9c39fbbaf8e6b5",
        height: 640,
        width: 640,
      },
    ],
  },
  duration_ms: 200040,
  progress_ms: 70000,
  is_playing: true,
});

// Helper function to format duration
export const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Playback control functions
export const pausePlayback = async (): Promise<boolean> => {
  try {
    const access_token = await getAccessToken();

    const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return response.status === 204;
  } catch (error) {
    console.error("Error pausing playback:", error);
    return false;
  }
};

export const resumePlayback = async (): Promise<boolean> => {
  try {
    const access_token = await getAccessToken();

    const response = await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return response.status === 204;
  } catch (error) {
    console.error("Error resuming playback:", error);
    return false;
  }
};

export const skipToNext = async (): Promise<boolean> => {
  try {
    const access_token = await getAccessToken();

    const response = await fetch("https://api.spotify.com/v1/me/player/next", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return response.status === 204;
  } catch (error) {
    console.error("Error skipping to next track:", error);
    return false;
  }
};

export const skipToPrevious = async (): Promise<boolean> => {
  try {
    const access_token = await getAccessToken();

    const response = await fetch("https://api.spotify.com/v1/me/player/previous", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return response.status === 204;
  } catch (error) {
    console.error("Error skipping to previous track:", error);
    return false;
  }
};
