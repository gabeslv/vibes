import {useEffect,useState} from 'react';
import {tmdb} from '../services/tmdb';
import type {Movie} from '../types';
import {MovieCard} from '../components/MovieCard';
import {Loading,ErrorState} from '../components/States';
import {useLibrary} from '../hooks/useLibrary';

export function Movies(){
  const [movies,setMovies]=useState<Movie[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(false);

  const {movies:favs,toggle}=useLibrary();

  const load=()=>{
    setLoading(true);
    setError(false);

    tmdb
      .popular()
      .then(data=>{
        const filteredMovies=data.filter(
          movie=>(movie.vote_average||0)>=6
        );

        setMovies(filteredMovies);
      })
      .catch(()=>setError(true))
      .finally(()=>setLoading(false));
  };

  useEffect(()=>{
    load();
  },[]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[.25em] text-zinc-500">
          Cinema
        </p>

        <h1 className="mt-3 text-5xl font-black tracking-[-.06em] md:text-7xl">
          Filmes.
        </h1>

        <p className="mt-4 max-w-xl text-zinc-500">
          Descubra histórias para cada humor, momento e noite.
        </p>
      </div>

      {loading ? (
        <Loading/>
      ) : error ? (
        <ErrorState onRetry={load}/>
      ) : movies.length===0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-semibold">
            Nenhum filme encontrado.
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Tente novamente para buscar novos filmes.
          </p>

          <button
            onClick={load}
            className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:opacity-80"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-4 lg:grid-cols-6">
          {movies.map(movie=>(
            <MovieCard
              key={movie.id}
              movie={movie}
              favorite={favs.some(x=>x.id===movie.id)}
              onFavorite={()=>toggle('movies',movie)}
            />
          ))}
        </div>
      )}
    </div>
  );
}