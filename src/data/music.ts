// YouTube Music. Data in music.yml (hand-edited for now — no official YT Music
// API). To automate later: scrobble to Last.fm and generate music.yml like
// github.yml/health.yml. Shape stays identical, so nothing else changes.

import { loadYaml } from "./_load";

export interface Track {
  track: string;
  artist: string;
  plays?: number;
}

export interface Music {
  nowPlaying: Track;
  topTracks: Track[];
}

const FALLBACK: Music = {
  nowPlaying: { track: "—", artist: "" },
  topTracks: [],
};

export const music = loadYaml<Music>("music.yml", FALLBACK);
