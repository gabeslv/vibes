import type { Artist, Track } from '../types';

const key = import.meta.env.VITE_LASTFM_API_KEY as string | undefined;
const base = 'https://ws.audioscrobbler.com/2.0/';

async function request<T>(
  method: string,
  extra: Record<string, string | number> = {}
) {
  if (!key) {
    throw new Error('LASTFM_API_KEY_MISSING');
  }

  const qs = new URLSearchParams({
    method,
    api_key: key,
    format: 'json',
    ...Object.fromEntries(
      Object.entries(extra).map(([k, v]) => [k, String(v)])
    ),
  });

  const r = await fetch(`${base}?${qs}`);

  if (!r.ok) {
    throw new Error(`LASTFM_${r.status}`);
  }

  return r.json() as Promise<T>;
}

const image = (images: any[] | undefined) => {
  if (!images || !Array.isArray(images)) {
    return '';
  }

  return (
    images.find((i) => i.size === 'extralarge')?.['#text'] ||
    images.find((i) => i.size === 'large')?.['#text'] ||
    images.find((i) => i.size === 'medium')?.['#text'] ||
    images.find((i) => i.size === 'small')?.['#text'] ||
    ''
  );
};

async function getArtwork(track: string, artist: string) {
  try {
    const params = new URLSearchParams({
      term: `${track} ${artist}`,
      media: 'music',
      entity: 'song',
      limit: '1',
    });

    const response = await fetch(
      `https://itunes.apple.com/search?${params.toString()}`
    );

    if (!response.ok) {
      return '';
    }

    const data = await response.json();

    const result = data.results?.[0];

    if (!result?.artworkUrl100) {
      return '';
    }

    return result.artworkUrl100.replace(
      '100x100bb',
      '600x600bb'
    );
  } catch {
    return '';
  }
}

async function getTrackImage(
  track: string,
  artist: string,
  lastfmImages?: any[]
) {
  const lastfmImage = image(lastfmImages);

  if (
    lastfmImage &&
    !lastfmImage.includes('2a96cbd8b46e442fc41c2b86b821562f')
  ) {
    return lastfmImage;
  }

  return await getArtwork(track, artist);
}

export const lastfm = {
  async searchTracks(query: string) {
    const d: any = await request<any>('track.search', {
      track: query,
      limit: 12,
    });

    const tracks = d.results?.trackmatches?.track || [];

    return await Promise.all(
      tracks.map(async (t: any): Promise<Track> => ({
        name: t.name,
        artist: t.artist,
        album: '',
        image: await getTrackImage(
          t.name,
          t.artist,
          t.image
        ),
        url: t.url,
        listeners: t.listeners,
      }))
    );
  },

  async tagTracks(tag: string) {
    const d: any = await request<any>('tag.gettoptracks', {
      tag,
      limit: 12,
    });

    const tracks = d.tracks?.track || [];

    return await Promise.all(
      tracks.map(async (t: any): Promise<Track> => ({
        name: t.name,
        artist: t.artist?.name || t.artist,
        image: await getTrackImage(
          t.name,
          t.artist?.name || t.artist,
          t.image
        ),
        album: '',
        url: t.url,
        listeners: t.listeners,
      }))
    );
  },

  async searchArtists(query: string) {
    const d: any = await request<any>('artist.search', {
      artist: query,
      limit: 12,
    });

    return (d.results?.artistmatches?.artist || []).map(
      (a: any): Artist => ({
        name: a.name,
        image: image(a.image),
        url: a.url,
        listeners: a.listeners,
      })
    );
  },

  async artist(name: string) {
    const d: any = await request<any>('artist.getinfo', {
      artist: name,
    });

    const a = d.artist;

    return {
      name: a.name,
      image: image(a.image),
      url: a.url,
      listeners: a.stats?.listeners,
      bio: a.bio?.summary,
      tags: a.tags?.tag?.map((t: any) => t.name) || [],
    };
  },
};