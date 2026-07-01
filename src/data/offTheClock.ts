// Curated lists. Data in offTheClock.yml (hand-edited). Movies could later be
// enriched with TMDB metadata; blogs are a hand-picked list.

import { loadYaml } from "./_load";

export interface Blog {
  title: string;
  source: string;
  href: string;
}

export interface Movie {
  title: string;
  meta: string;
}

interface OffTheClockFile {
  blogs: Blog[];
  movies: Movie[];
}

const data = loadYaml<OffTheClockFile>("offTheClock.yml", {
  blogs: [],
  movies: [],
});

export const blogs = data.blogs;
export const movies = data.movies;
