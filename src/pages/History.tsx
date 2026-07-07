import {useState} from 'react';
import {ArrowLeft,Clock3,Trash2,Film,Music2} from 'lucide-react';
import {useLibrary} from '../hooks/useLibrary';
import {remove} from '../utils/storage';
import {MovieCard} from '../components/MovieCard';
import {TrackCard} from '../components/TrackCard';

export function History(){
  const {
    history,
    movies:favMovies,
    tracks:favTracks,
    toggle
  }=useLibrary();

  const [selectedId,setSelectedId]=useState<string|null>(null);

  const selected=history.find(item=>item.id===selectedId);

  const clear=()=>{
    remove('vibes-history');
    window.location.reload();
  };

  if(selected){
    const movies=selected.movies||[];
    const tracks=selected.tracks||[];

    return (
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <button
          onClick={()=>setSelectedId(null)}
          className="mb-10 flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
        >
          <ArrowLeft size={16}/>
          Voltar ao histórico
        </button>

        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-zinc-500">
            Histórico
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-[-.06em] md:text-7xl">
            {selected.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <span>
              {new Date(selected.createdAt).toLocaleString(
                'pt-BR',
                {
                  dateStyle:'medium',
                  timeStyle:'short'
                }
              )}
            </span>

            <span className="h-1 w-1 rounded-full bg-zinc-500"/>

            <span>
              {selected.content==='both'
                ?'Filme + Música'
                :selected.content==='movie'
                  ?'Filme'
                  :'Música'}
            </span>
          </div>
        </div>

        {movies.length>0&&(
          <section>
            <div className="mb-5 flex items-center gap-3">
              <Film size={20}/>

              <h2 className="text-2xl font-bold">
                Para assistir
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {movies.map(movie=>(
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  favorite={favMovies.some(
                    item=>item.id===movie.id
                  )}
                  onFavorite={()=>toggle('movies',movie)}
                />
              ))}
            </div>
          </section>
        )}

        {tracks.length>0&&(
          <section className="mt-14">
            <div className="mb-5 flex items-center gap-3">
              <Music2 size={20}/>

              <h2 className="text-2xl font-bold">
                Para ouvir
              </h2>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              {tracks.map((track,index)=>(
                <TrackCard
                  key={`${track.name}-${track.artist}-${index}`}
                  track={track}
                  favorite={favTracks.some(
                    item=>
                      item.name===track.name &&
                      item.artist===track.artist
                  )}
                  onFavorite={()=>toggle('tracks',track)}
                />
              ))}
            </div>
          </section>
        )}

        {movies.length===0&&tracks.length===0&&(
          <div className="border-y border-white/10 py-20 text-center text-zinc-500 light:border-black/10">
            <p className="text-lg font-medium">
              Nenhum resultado foi salvo nesta vibe.
            </p>

            <p className="mt-2 text-sm">
              Essa sessão foi registrada antes do histórico começar a salvar os resultados.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 lg:px-8">
      <div className="flex items-end justify-between gap-5">
        <div>
          <p className="text-xs uppercase tracking-[.25em] text-zinc-500">
            Memória
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-[-.06em] md:text-7xl">
            Histórico.
          </h1>

          <p className="mt-4 max-w-xl text-zinc-500">
            Relembre as vibes que você já descobriu.
          </p>
        </div>

        {history.length>0&&(
          <button
            onClick={clear}
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm text-zinc-500 transition hover:border-red-500/30 hover:text-red-400 light:border-black/10"
          >
            <Trash2 size={15}/>
            Limpar
          </button>
        )}
      </div>

      {!history.length ? (
        <div className="py-28 text-center text-zinc-500">
          <Clock3
            className="mx-auto"
            size={32}
            strokeWidth={1.5}
          />

          <p className="mt-5 text-lg font-medium text-zinc-400 light:text-zinc-600">
            Seu histórico está vazio.
          </p>

          <p className="mt-2 text-sm">
            Suas vibes geradas aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="mt-12 divide-y divide-white/10 border-y border-white/10 light:divide-black/10 light:border-black/10">
          {history.map(item=>{
            const movieCount=item.movies?.length||0;
            const trackCount=item.tracks?.length||0;

            return (
              <button
                key={item.id}
                onClick={()=>setSelectedId(item.id)}
                className="group flex w-full items-center justify-between gap-5 py-6 text-left transition hover:px-2"
              >
                <div className="min-w-0">
                  <h2 className="truncate font-bold transition group-hover:text-zinc-500">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    {new Date(item.createdAt).toLocaleString(
                      'pt-BR',
                      {
                        dateStyle:'medium',
                        timeStyle:'short'
                      }
                    )}
                  </p>

                  {(movieCount>0||trackCount>0)&&(
                    <div className="mt-3 flex gap-3 text-xs text-zinc-500">
                      {movieCount>0&&(
                        <span>
                          {movieCount} {movieCount===1?'filme':'filmes'}
                        </span>
                      )}

                      {trackCount>0&&(
                        <span>
                          {trackCount} {trackCount===1?'música':'músicas'}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <span className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-500 light:border-black/10">
                  {item.content==='both'
                    ?'Filme + Música'
                    :item.content==='movie'
                      ?'Filme'
                      :'Música'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}