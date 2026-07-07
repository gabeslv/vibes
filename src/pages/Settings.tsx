import {useTheme} from '../hooks/useTheme';
import {Trash2,Sun,Moon,Monitor} from 'lucide-react';
import {remove} from '../utils/storage';

export function Settings(){
  const {mode,setMode}=useTheme();

  const clear=()=>{
    if(
      confirm(
        'Tem certeza que deseja apagar seus favoritos e histórico?'
      )
    ){
      [
        'vibes-movies',
        'vibes-tracks',
        'vibes-artists',
        'vibes-history'
      ].forEach(remove);

      window.location.reload();
    }
  };

  const themes=[
    ['system','Sistema',Monitor],
    ['light','Claro',Sun],
    ['dark','Escuro',Moon]
  ] as const;

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8">
      <p className="text-xs uppercase tracking-[.25em] text-zinc-500">
        Preferências
      </p>

      <h1 className="mt-3 text-5xl font-black tracking-[-.06em] md:text-7xl">
        Configurações.
      </h1>

      <section className="mt-12 border-y border-white/10 light:border-black/10">
        <div className="py-7">
          <h2 className="font-bold">
            Aparência
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Escolha como o VIBES deve aparecer.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {themes.map(([id,label,Icon])=>(
              <button
                key={id}
                onClick={()=>setMode(id)}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm transition ${
                  mode===id
                    ? 'border-white bg-white text-black light:border-black light:bg-black light:text-white'
                    : 'border-white/10 text-zinc-500 hover:bg-white/[.04] light:border-black/10 light:hover:bg-black/[.04]'
                }`}
              >
                <Icon size={18}/>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 py-7 light:border-black/10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold">
              Apagar dados locais
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Remove favoritos e histórico deste navegador.
            </p>
          </div>

          <button
            onClick={clear}
            className="flex w-fit items-center gap-2 rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
          >
            <Trash2 size={15}/>
            Limpar
          </button>
        </div>
      </section>
    </div>
  );
}