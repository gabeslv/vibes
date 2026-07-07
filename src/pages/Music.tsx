import {useEffect,useState} from 'react';
import {lastfm} from '../services/lastfm';
import type {Track} from '../types';
import {TrackCard} from '../components/TrackCard';
import {Loading,ErrorState} from '../components/States';
import {useLibrary} from '../hooks/useLibrary';

export function Music(){
  const [tracks,setTracks]=useState<Track[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(false);

  const {tracks:favs,toggle}=useLibrary();

  const load=()=>{
    setLoading(true);
    setError(false);

    lastfm
      .tagTracks('alternative')
      .then(data=>{
        const uniqueTracks=data.filter(
          (track,index,self)=>
            index===self.findIndex(
              item=>
                item.name===track.name &&
                item.artist===track.artist
            )
        );

        setTracks(uniqueTracks);
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
          Som
        </p>

        <h1 className="mt-3 text-5xl font-black tracking-[-.06em] md:text-7xl">
          Música.
        </h1>

        <p className="mt-4 max-w-xl text-zinc-500">
          Faixas e artistas para acompanhar o seu momento.
        </p>
      </div>

      {loading ? (
        <Loading/>
      ) : error ? (
        <ErrorState onRetry={load}/>
      ) : tracks.length===0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-semibold">
            Nenhuma música encontrada.
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Tente novamente para buscar novas faixas.
          </p>

          <button
            onClick={load}
            className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:opacity-80"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="grid gap-2 md:grid-cols-2">
          {tracks.map((track,index)=>(
            <TrackCard
              key={`${track.name}-${track.artist}-${index}`}
              track={track}
              favorite={favs.some(
                favorite=>
                  favorite.name===track.name &&
                  favorite.artist===track.artist
              )}
              onFavorite={()=>toggle('tracks',track)}
            />
          ))}
        </div>
      )}
    </div>
  );
}