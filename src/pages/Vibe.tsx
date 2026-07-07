import {useEffect,useState} from 'react';
import {useLocation,useNavigate} from 'react-router-dom';
import {ArrowLeft,RefreshCw,Sparkles} from 'lucide-react';
import {motion} from 'framer-motion';
import {
  energies,
  moods,
  environments,
  contentTypes,
  moodConfig,
  energyConfig,
  environmentConfig,
  getVibeTitle
} from '../data/vibes';
import {tmdb} from '../services/tmdb';
import {lastfm} from '../services/lastfm';
import type {Movie,Track,VibeSelection} from '../types';
import {MovieCard} from '../components/MovieCard';
import {TrackCard} from '../components/TrackCard';
import {Loading} from '../components/States';
import {useLibrary} from '../hooks/useLibrary';

export function Vibe(){
  const loc=useLocation();
  const nav=useNavigate();
  const params=new URLSearchParams(loc.search);
  const initialMood=params.get('mood')||'';

  const [step,setStep]=useState(initialMood?1:0);

  const [selection,setSelection]=useState<VibeSelection>({
    energy:'normal',
    mood:initialMood||'melancholic',
    environment:'rain',
    content:'both'
  });

  const [movies,setMovies]=useState<Movie[]>([]);
  const [tracks,setTracks]=useState<Track[]>([]);
  const [loading,setLoading]=useState(false);

  const {
    movies:favMovies,
    tracks:favTracks,
    toggle,
    addHistory
  }=useLibrary();

  const options=step===0
    ?energies
    :step===1
      ?moods
      :step===2
        ?environments
        :contentTypes;

  const key=step===0
    ?'energy'
    :step===1
      ?'mood'
      :step===2
        ?'environment'
        :'content';

  const title=step===0
    ?'Como está sua energia?'
    :step===1
      ?'O que você está sentindo?'
      :step===2
        ?'Onde sua cabeça está agora?'
        :'O que você quer descobrir?';

  const generate=async(
    currentSelection:VibeSelection=selection
  )=>{
    setLoading(true);

    const mc=moodConfig[currentSelection.mood];
    const ec=energyConfig[currentSelection.energy];
    const env=environmentConfig[currentSelection.environment];

    const genres=[
      ...new Set([
        ...(mc?.movieGenres||[]),
        ...(ec?.movieGenres||[]),
        ...(env?.movieGenres||[])
      ])
    ];

    const tags=[
      ...(mc?.musicTags||[]),
      ...(ec?.musicTags||[]),
      ...(env?.musicTags||[])
    ];

    try{
      let generatedMovies:Movie[]=[];
      let generatedTracks:Track[]=[];

      if(currentSelection.content!=='music'){
        const discoveredMovies=await tmdb.discover(genres);

        generatedMovies=discoveredMovies.filter(
          movie=>(movie.vote_average||0)>=6
        );

        setMovies(generatedMovies);
      }else{
        setMovies([]);
      }

      if(currentSelection.content!=='movie'){
        const tag=
          tags[Math.floor(Math.random()*Math.max(tags.length,1))]||'pop';

        generatedTracks=await lastfm.tagTracks(tag);

        setTracks(generatedTracks);
      }else{
        setTracks([]);
      }

      addHistory({
        id:crypto.randomUUID(),
        createdAt:new Date().toISOString(),
        title:getVibeTitle(currentSelection),
        ...currentSelection,
        movies:generatedMovies.slice(0,6),
        tracks:generatedTracks.slice(0,6)
      });

      setStep(4);
    }catch(e){
      setStep(5);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(initialMood){
      setSelection(s=>({
        ...s,
        mood:initialMood
      }));
    }
  },[initialMood]);

  if(step===4)return(
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <button
        onClick={()=>setStep(3)}
        className="mb-8 flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
      >
        <ArrowLeft size={16}/>
        Refinar vibe
      </button>

      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-[.25em] text-zinc-500">
          Sua vibe
        </p>

        <h1 className="mt-3 text-5xl font-black tracking-[-.06em] md:text-7xl">
          {getVibeTitle(selection)}
        </h1>

        <p className="mt-4 max-w-xl text-zinc-500">
          Uma seleção criada a partir do seu momento. Salve o que fizer sentido.
        </p>
      </div>

      {loading?<Loading/>:<>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            {movies.length>0&&<>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  🎬 Para assistir
                </h2>

                <button
                  onClick={()=>generate(selection)}
                  className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                >
                  Outra seleção
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {movies.slice(0,6).map(m=>
                  <MovieCard
                    key={m.id}
                    movie={m}
                    favorite={favMovies.some(x=>x.id===m.id)}
                    onFavorite={()=>toggle('movies',m)}
                  />
                )}
              </div>
            </>}

            {tracks.length>0&&
              <div className="mt-12">
                <h2 className="mb-4 text-2xl font-bold">
                  🎵 Para ouvir
                </h2>

                <div className="space-y-2">
                  {tracks.slice(0,6).map((t,i)=>
                    <TrackCard
                      key={`${t.name}-${i}`}
                      track={t}
                      favorite={favTracks.some(
                        x=>x.name===t.name&&x.artist===t.artist
                      )}
                      onFavorite={()=>toggle('tracks',t)}
                    />
                  )}
                </div>
              </div>
            }
          </div>

          <aside className="h-fit rounded-3xl border border-white/10 bg-white/[.035] p-7 light:border-black/10 light:bg-black/[.025]">
            <Sparkles size={20}/>

            <h3 className="mt-5 text-xl font-bold">
              Quer mudar a energia?
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Você pode refazer a seleção a qualquer momento e descobrir uma combinação completamente diferente.
            </p>

            <button
              onClick={()=>setStep(0)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black"
            >
              Refazer vibe
              <RefreshCw size={15}/>
            </button>
          </aside>
        </div>
      </>}
    </div>
  );

  if(step===5)return(
    <div className="mx-auto max-w-2xl px-5 py-32 text-center">
      <p className="text-5xl">☁</p>

      <h1 className="mt-5 text-3xl font-black">
        As fontes estão indisponíveis.
      </h1>

      <p className="mt-3 text-zinc-500">
        Confira suas chaves de API no arquivo .env e tente novamente.
      </p>

      <button
        onClick={()=>setStep(0)}
        className="mt-7 rounded-full bg-white px-5 py-3 text-sm font-bold text-black"
      >
        Voltar
      </button>
    </div>
  );

  return(
    <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
      <div className="mb-14 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[.25em] text-zinc-500">
            Vibe · 0{step+1}/04
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-.05em] md:text-6xl">
            {title}
          </h1>
        </div>

        <button
          onClick={()=>nav('/')}
          className="rounded-full border border-white/10 p-3 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        >
          <ArrowLeft size={18}/>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {options.map((o:any)=>
          <motion.button
            whileHover={{y:-3}}
            whileTap={{scale:.98}}
            key={o.id}
            onClick={()=>{
              const nextSelection={
                ...selection,
                [key]:o.id
              } as VibeSelection;

              setSelection(nextSelection);

              if(step<3){
                setStep(step+1);
              }else{
                generate(nextSelection);
              }
            }}
            className={`group min-h-36 rounded-3xl border p-5 text-left transition ${
              selection[key as keyof VibeSelection]===o.id
                ?'border-white bg-white text-black'
                :'border-white/10 bg-white/[.025] hover:bg-white/[.06]'
            }`}
          >
            <span className="text-2xl">
              {o.icon}
            </span>

            <span className="mt-8 block font-semibold">
              {o.label}
            </span>
          </motion.button>
        )}
      </div>

      {step>0&&
        <button
          onClick={()=>setStep(step-1)}
          className="mt-8 flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        >
          <ArrowLeft size={15}/>
          Voltar
        </button>
      }
    </div>
  );
}