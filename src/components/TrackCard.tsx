import { Heart, ExternalLink } from 'lucide-react';
import type { Track } from '../types';

export function TrackCard({
  track,
  favorite,
  onFavorite,
}: {
  track: Track;
  favorite?: boolean;
  onFavorite?: () => void;
}) {
  const placeholder = '/music-placeholder.svg';

  return (
    <article className="group relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.035] p-3 transition hover:bg-white/[.07] light:border-black/10 light:bg-black/[.025] light:hover:bg-black/[.05]">
      <img
        src={track.image || placeholder}
        className="h-16 w-16 shrink-0 rounded-xl object-cover"
        alt={`Capa de ${track.name}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(event) => {
          const img = event.currentTarget;

          if (img.src !== window.location.origin + placeholder) {
            img.src = placeholder;
          }
        }}
      />

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold">
          {track.name}
        </h3>

        <p className="truncate text-sm text-zinc-500">
          {track.artist}
        </p>

        {track.listeners && (
          <p className="mt-1 text-xs text-zinc-600">
            {Number(track.listeners).toLocaleString('pt-BR')} ouvintes
          </p>
        )}
      </div>

      <div className="flex items-center gap-1">
        <a
          href={track.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Abrir ${track.name}`}
          className="rounded-full p-2 text-zinc-500 hover:bg-white/10 hover:text-white light:hover:bg-black/5 light:hover:text-zinc-900"
        >
          <ExternalLink size={16} />
        </a>

        {onFavorite && (
          <button
            aria-label={favorite ? 'Remover dos favoritos' : 'Favoritar'}
            onClick={onFavorite}
            className={`rounded-full p-2 ${
              favorite ? 'text-white' : 'text-zinc-500'
            } hover:bg-white/10`}
          >
            <Heart
              size={16}
              fill={favorite ? 'currentColor' : 'none'}
            />
          </button>
        )}
      </div>
    </article>
  );
}