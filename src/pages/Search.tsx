import {useEffect,useState} from 'react';
import {Search as SearchIcon} from 'lucide-react';
import {tmdb} from '../services/tmdb';
import {lastfm} from '../services/lastfm';
import type {Movie,Track} from '../types';
import {MovieCard} from '../components/MovieCard';
import {TrackCard} from '../components/TrackCard';
import {Loading} from '../components/States';
import {useLibrary} from '../hooks/useLibrary';

export function Search(){
  const [q,setQ]=useState('');
  const [movies,setMovies]=useState<Movie[]>([]);
  const [tracks,setTracks]=useState<Track[]>([]);
  const [loading,setLoading]=useState(false);

  const {movies:favs,tracks:tf,toggle}=useLibrary();

  useEffect(()=>{
    if(q.trim().length<2){
      setMovies([]);
      setTracks([]);
      setLoading(false);
      return;
    }

    const timer=setTimeout(async()=>{
      setLoading(true);

      const [movieResult,trackResult]=await Promise.allSettled([
        tmdb.search(q),
        lastfm.searchTracks(q)
      ]);

      if(movieResult.status==='fulfilled'){
        const filteredMovies=movieResult.value.filter(
          movie=>(movie.vote_average||0)>=6
        );

        setMovies(filteredMovies);
      }else{
        setMovies([]);
      }

      if(trackResult.status==='fulfilled'){
        const uniqueTracks=trackResult.value.filter(
          (track,index,self)=>
            index===self.findIndex(
              item=>
                item.name===track.name &&
                item.artist===track.artist
            )
        );

        setTracks(uniqueTracks);
      }else{
        setTracks([]);
      }

      setLoading(false);
    },450);

    return()=>{
      clearTimeout(timer);
    };
  },[q]);

  const hasResults=movies.length>0||tracks.length>0;

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <label className="mb-4 block text-xs uppercase tracking-[.25em] text-zinc-500">
          Busca global
        </label>

        <div className="flex items-center gap-3 border-b border-white/15 pb-4 light:border-black/15">
          <SearchIcon
            size={25}
            className="shrink-0 text-zinc-500"
          />

          <input
            autoFocus
            value={q}
            onChange={e=>setQ(e.target.value)}
            placeholder="Filmes, músicas ou artistas..."
            className="w-full bg-transparent text-2xl outline-none placeholder:text-zinc-700 md:text-4xl"
          />
        </div>
      </div>

      {loading ? (
        <Loading/>
      ) : (
        <div className="mt-14">
          {movies.length>0&&(
            <section>
              <h2 className="mb-5 text-xl font-bold">
                Filmes
              </h2>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                {movies.slice(0,6).map(movie=>(
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    favorite={favs.some(
                      favorite=>favorite.id===movie.id
                    )}
                    onFavorite={()=>toggle('movies',movie)}
                  />
                ))}
              </div>
            </section>
          )}

          {tracks.length>0&&(
            <section className="mt-12">
              <h2 className="mb-5 text-xl font-bold">
                Músicas
              </h2>

              <div className="grid gap-2 md:grid-cols-2">
                {tracks.slice(0,10).map((track,index)=>(
                  <TrackCard
                    key={`${track.name}-${track.artist}-${index}`}
                    track={track}
                    favorite={tf.some(
                      favorite=>
                        favorite.name===track.name&&
                        favorite.artist===track.artist
                    )}
                    onFavorite={()=>toggle('tracks',track)}
                  />
                ))}
              </div>
            </section>
          )}

          {q.trim().length>=2&&!hasResults&&(
            <div className="py-20 text-center">
              <p className="text-lg font-semibold">
                Nenhum resultado encontrado.
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Tente buscar por outro filme, música ou artista.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}