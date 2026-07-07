import {useLibrary} from '../hooks/useLibrary';
import {moods} from '../data/vibes';

export function Profile(){
  const {movies,tracks,artists,history}=useLibrary();

  const moodCount=history.reduce<Record<string,number>>(
    (acc,item)=>{
      acc[item.mood]=(acc[item.mood]||0)+1;
      return acc;
    },
    {}
  );

  const top=Object.entries(moodCount).sort(
    (a,b)=>b[1]-a[1]
  )[0];

  const topMood=moods.find(
    mood=>mood.id===top?.[0]
  );

  const visibleMoods=moods
    .filter(mood=>moodCount[mood.id])
    .sort(
      (a,b)=>
        (moodCount[b.id]||0)-
        (moodCount[a.id]||0)
    )
    .slice(0,5);

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 lg:px-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[.25em] text-zinc-500">
            Perfil
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-[-.06em] md:text-7xl">
            Seu espaço.
          </h1>

          <p className="mt-4 max-w-xl text-zinc-500">
            Um retrato do que você descobriu por aqui.
          </p>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl font-black text-black">
          V
        </div>
      </div>

      <div className="mt-12 grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border border-white/10 p-6 transition hover:bg-white/[.025] light:border-black/10 light:hover:bg-black/[.025]">
          <p className="text-xs text-zinc-500">
            Filmes salvos
          </p>

          <p className="mt-3 text-3xl font-black">
            {movies.length}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 p-6 transition hover:bg-white/[.025] light:border-black/10 light:hover:bg-black/[.025]">
          <p className="text-xs text-zinc-500">
            Músicas salvas
          </p>

          <p className="mt-3 text-3xl font-black">
            {tracks.length}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 p-6 transition hover:bg-white/[.025] light:border-black/10 light:hover:bg-black/[.025]">
          <p className="text-xs text-zinc-500">
            Vibes criadas
          </p>

          <p className="mt-3 text-3xl font-black">
            {history.length}
          </p>
        </div>
      </div>

      <section className="mt-12 rounded-3xl border border-white/10 p-7 light:border-black/10">
        <p className="text-xs uppercase tracking-[.2em] text-zinc-500">
          Seu padrão
        </p>

        <h2 className="mt-3 text-2xl font-bold">
          {topMood
            ? `Você costuma voltar para momentos ${topMood.label.toLowerCase()}.`
            : 'Ainda estamos descobrindo você.'}
        </h2>

        {visibleMoods.length>0 ? (
          <div className="mt-8 space-y-4">
            {visibleMoods.map(mood=>{
              const count=moodCount[mood.id];
              const percentage=Math.min(
                100,
                (count/Math.max(1,history.length))*100
              );

              return (
                <div key={mood.id}>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span>{mood.label}</span>

                    <span className="text-zinc-500">
                      {count}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10 light:bg-black/10">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-700 light:bg-black"
                      style={{width:`${percentage}%`}}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-5 text-sm leading-6 text-zinc-500">
            Conforme você explorar diferentes vibes, seu perfil vai começar a mostrar seus padrões.
          </p>
        )}
      </section>
    </div>
  );
}