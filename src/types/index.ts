export type ThemeMode = 'system' | 'light' | 'dark';

export type ContentType = 'movie' | 'music' | 'both';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  runtime?: number;
  genres?: { id: number; name: string }[];
}

export interface Track {
  name: string;
  artist: string;
  album: string;
  image: string;
  url: string;
  listeners?: string;
}

export interface Artist {
  name: string;
  image: string;
  url: string;
  listeners?: string;
  bio?: string;
  tags?: string[];
}

export interface VibeSelection {
  energy: string;
  mood: string;
  environment: string;
  content: ContentType;
}

export interface VibeHistory extends VibeSelection {
  id: string;
  title: string;
  createdAt: string;
  movies: Movie[];
  tracks: Track[];
}