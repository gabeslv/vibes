import {MovieCard} from '../components/MovieCard';
import {TrackCard} from '../components/TrackCard';
import {useLibrary} from '../hooks/useLibrary';
import {Link} from 'react-router-dom';

export function Favorites(){
  const {movies,tracks,toggle}=useLibrary();

  const empty=!movies.length&&!tracks.length;

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div>
        <p className="text-xs uppercase tracking-[.25em] text-zinc-500">
          Sua biblioteca
        </p>

        <h1 className="mt-3 text-5xl font-black tracking-[-.06em] md:text-7xl">
          Favoritos.
        </h1>

        <p className="mt-4 max-w-xl text-zinc-500">
          Tudo o que você decidiu guardar pelo caminho.
        </p>
      </div>

      {empty ? (
        <div className="py-28 text-center">
          <p className="text-3xl font-bold">
            Ainda está vazio.
          </p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
            Salve filmes e músicas que combinarem com você e eles ficam aqui.
          </p>

          <Link
            to="/vibe"
            className="mt-7 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:opacity-80"
          >
            Encontrar minha vibe
          </Link>
        </div>
      ) : (
        <section className="mt-12">
          {movies.length>0&&(
            <>
              <h2 className="mb-5 text-xl font-bold">
                Filmes
              </h2>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                {movies.map(movie=>(
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    favorite
                    onFavorite={()=>toggle('movies',movie)}
                  />
                ))}
              </div>
            </>
          )}

          {tracks.length>0&&(
            <>
              <h2 className="mb-5 mt-14 text-xl font-bold">
                Músicas
              </h2>

              <div className="grid gap-2 md:grid-cols-2">
                {tracks.map((track,index)=>(
                  <TrackCard
                    key={`${track.name}-${track.artist}-${index}`}
                    track={track}
                    favorite
                    onFavorite={()=>toggle('tracks',track)}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}